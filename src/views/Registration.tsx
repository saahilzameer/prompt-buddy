import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { db, handleFirestoreError, OperationType } from "../lib/firebase";
import { cn } from "../lib/utils";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "../context/ToastContext";

const registrationSchema = z.object({
  full_name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Invalid phone number"),
  college: z.string().min(2, "Required"),
  company: z.string().optional(),
  designation: z.string().min(2, "Required"),
  experience_level: z.enum(['Student', 'Fresher', 'Professional', 'Founder', 'Senior Professional']),
  linkedin: z.string().url("Must be a valid URL").or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  portfolio: z.string().url().optional().or(z.literal('')),
  bio: z.string().min(10, "Please tell us a bit more about yourself"),
  skills: z.array(z.string()).min(1, "Select at least one skill"),
  interests: z.array(z.string()).min(1, "Select at least one interest"),
  looking_for: z.array(z.string()).min(1, "Select at least one goal"),
});

const SKILLS = ["AI", "Web Development", "Mobile Development", "UI/UX", "Product Management", "Cloud", "Cyber Security", "Blockchain", "Marketing", "Data Science"];
const INTERESTS = ["Startups", "Networking", "Hiring", "Mentorship", "Hackathons", "Freelancing", "Product Building", "Investments"];
const LOOKING_FOR = ["Mentor", "Co-Founder", "Internship", "Job", "Recruiter", "Team Member", "Startup Partner", "Investor"];

export default function Registration() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { register, handleSubmit, setValue, watch, trigger, formState: { errors } } = useForm<z.infer<typeof registrationSchema>>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      skills: [],
      interests: [],
      looking_for: [],
      experience_level: 'Student'
    }
  });

  const onSubmit = async (data: any) => {
    setSubmitError(null);
    setIsSubmitting(true);
    const path = "users";
    try {
      // Analyze profile via AI
      let profile_score = 0;
      try {
        const analysisRes = await fetch("/api/ai/analyze-profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profileData: data })
        });
        
        if (analysisRes.ok) {
          const analysis = await analysisRes.json();
          profile_score = analysis.score || 0;
        }
      } catch (aiError) {
        console.warn("AI analysis failed, proceeding with default score", aiError);
      }

      const docRef = await addDoc(collection(db, path), {
        ...data,
        profile_score,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
        is_admin: false,
        is_discoverable: true,
        show_in_feed: true
      });

      showToast("Profile created successfully!", "success");
      
      // Redirect to dashboard with user info
      localStorage.setItem("pb_user_id", docRef.id);
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Registration error:", error);
      setSubmitError(error.message || "Failed to create profile. Please try again.");
      showToast("Failed to create profile", "error");
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedSkills = watch("skills");
  const toggleSkill = (skill: string) => {
    const current = selectedSkills || [];
    const next = current.includes(skill) ? current.filter(s => s !== skill) : [...current, skill];
    setValue("skills", next);
  };

  const selectedInterests = watch("interests");
  const toggleInterest = (interest: string) => {
    const current = selectedInterests || [];
    const next = current.includes(interest) ? current.filter(s => s !== interest) : [...current, interest];
    setValue("interests", next);
  };

  const selectedLookingFor = watch("looking_for");
  const toggleLookingFor = (item: string) => {
    const current = selectedLookingFor || [];
    const next = current.includes(item) ? current.filter(s => s !== item) : [...current, item];
    setValue("looking_for", next);
  };

  const handleNextStep = async (currentStep: number) => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ['full_name', 'email', 'phone', 'college', 'designation', 'experience_level'];
    } else if (currentStep === 2) {
      fieldsToValidate = ['skills', 'interests', 'looking_for'];
    }
    
    const isStepValid = await trigger(fieldsToValidate);
    if (isStepValid) {
      setStep(currentStep + 1);
    } else {
      showToast("Please fix the errors before continuing", "error");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-20">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Create Your Profile</h1>
        <p className="text-white/40">Join the elite network of creators and innovators.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Full Name</label>
                  <input {...register("full_name")} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="John Doe" />
                  {errors.full_name && <p className="text-red-400 text-xs mt-1">{errors.full_name.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Email Address</label>
                  <input {...register("email")} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="john@example.com" />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Phone Number</label>
                <input {...register("phone")} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="+1 234 567 890" />
                {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">College / University</label>
                  <input {...register("college")} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" />
                  {errors.college && <p className="text-red-400 text-xs mt-1">{errors.college.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Experience Level</label>
                  <select {...register("experience_level")} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors appearance-none">
                    <option value="Student">Student</option>
                    <option value="Fresher">Fresher</option>
                    <option value="Professional">Professional</option>
                    <option value="Founder">Founder</option>
                    <option value="Senior Professional">Senior Professional</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Current Designation</label>
                  <input {...register("designation")} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="e.g. Software Engineer, Student" />
                  {errors.designation && <p className="text-red-400 text-xs mt-1">{errors.designation.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Company (Optional)</label>
                  <input {...register("company")} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Acme Corp" />
                </div>
              </div>

              <button type="button" onClick={() => handleNextStep(1)} className="w-full py-4 bg-blue-600 rounded-xl font-bold text-lg hover:bg-blue-500 transition-colors">
                Continue
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-4">Skills</label>
                <div className="flex flex-wrap gap-2">
                  {SKILLS.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={cn(
                        "px-4 py-2 rounded-full border text-sm font-medium transition-all",
                        selectedSkills?.includes(skill) ? "bg-blue-600 border-blue-600 text-white" : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
                      )}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
                {errors.skills && <p className="text-red-400 text-xs mt-2">{errors.skills.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-4">Interests</label>
                <div className="flex flex-wrap gap-2">
                  {INTERESTS.map(interest => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggleInterest(interest)}
                      className={cn(
                        "px-4 py-2 rounded-full border text-sm font-medium transition-all",
                        selectedInterests?.includes(interest) ? "bg-sky-600 border-sky-600 text-white" : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
                      )}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
                {errors.interests && <p className="text-red-400 text-xs mt-2">{errors.interests.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-white/60 mb-4">Looking For</label>
                <div className="flex flex-wrap gap-2">
                  {LOOKING_FOR.map(item => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleLookingFor(item)}
                      className={cn(
                        "px-4 py-2 rounded-full border text-sm font-medium transition-all",
                        selectedLookingFor?.includes(item) ? "bg-white text-black border-white" : "border-white/10 bg-white/5 text-white/60 hover:border-white/20"
                      )}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                {errors.looking_for && <p className="text-red-400 text-xs mt-2">{errors.looking_for.message}</p>}
              </div>

              <div className="flex gap-4">
                <button type="button" onClick={() => setStep(1)} className="flex-1 py-4 bg-white/5 rounded-xl font-bold text-lg border border-white/10">Back</button>
                <button type="button" onClick={() => handleNextStep(2)} className="flex-1 py-4 bg-blue-600 rounded-xl font-bold text-lg">Continue</button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
               <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Short Bio</label>
                  <textarea {...register("bio")} rows={4} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="Tell your story..." />
                  {errors.bio && <p className="text-red-400 text-xs mt-1">{errors.bio.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">LinkedIn URL</label>
                  <input {...register("linkedin")} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors" placeholder="https://linkedin.com/in/..." />
                  {errors.linkedin && <p className="text-red-400 text-xs mt-1">{errors.linkedin.message}</p>}
                </div>

                {submitError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-200">{submitError}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <button type="button" onClick={() => setStep(2)} className="flex-1 py-4 bg-white/5 rounded-xl font-bold text-lg border border-white/10">Back</button>
                  <button type="submit" disabled={isSubmitting} className="flex-[2] py-4 bg-blue-600 rounded-xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 transition-colors">
                    {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                    {isSubmitting ? "Processing Profile..." : "Find My Buddy"}
                  </button>
                </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
