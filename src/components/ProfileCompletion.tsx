import { UserProfile } from "../types";
import { CheckCircle2, Circle } from "lucide-react";
import { motion } from "motion/react";

interface ProfileCompletionProps {
  user: UserProfile;
}

export default function ProfileCompletion({ user }: ProfileCompletionProps) {
  const fields = [
    { name: "Basic Info", key: "full_name" },
    { name: "Professional details", key: "designation" },
    { name: "Experience", key: "experience_level" },
    { name: "Social Presence", key: "linkedin" },
    { name: "Skills & Interests", key: "skills" },
    { name: "Biography", key: "bio" }
  ];

  const completedFields = fields.filter(f => {
    const val = user[f.key as keyof UserProfile];
    if (Array.isArray(val)) return val.length > 0;
    return !!val;
  });

  const percentage = Math.round((completedFields.length / fields.length) * 100);

  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Profile Completion</h3>
        <span className="text-sm font-bold text-blue-400">{percentage}%</span>
      </div>

      <div className="w-full h-2 bg-white/5 rounded-full mb-6 overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className="h-full bg-blue-600 rounded-full"
        />
      </div>

      <div className="space-y-3">
        {fields.map((f, i) => {
          const isDone = completedFields.some(cf => cf.key === f.key);
          return (
            <div key={i} className="flex items-center justify-between group">
              <span className={`text-xs ${isDone ? 'text-white/60' : 'text-white/30'}`}>{f.name}</span>
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <Circle className="w-4 h-4 text-white/10 group-hover:text-white/20 transition-colors" />
              )}
            </div>
          );
        })}
      </div>

      {percentage < 100 && (
        <button className="w-full mt-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all">
          Complete Profile
        </button>
      )}
    </div>
  );
}
