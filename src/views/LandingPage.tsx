import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Users, Rocket, Brain, MessageCircle, ArrowRight, Shield, Globe, Award, Sparkles } from "lucide-react";
import Logo from "../components/Logo";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.1),transparent)]" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-500/20 blur-2xl rounded-full scale-150 group-hover:bg-blue-500/40 transition-all duration-500" />
                <Logo className="w-20 h-20 relative z-10 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
              </div>
            </div>
            
            <span className="px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8 inline-block shadow-[0_0_15px_rgba(59,130,246,0.1)]">
              Networking OS for the Next Generation
            </span>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-[0.9] uppercase italic italic">
              Meet Your Next <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-400 to-indigo-500">
                Big Opportunity
              </span>
            </h1>
            <p className="text-lg md:text-xl text-white/40 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
              Join 5,000+ ambitious professionals using AI to build meaningful connections, discover mentors, and launch startups.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link to="/register" className="w-full sm:w-auto px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-[24px] font-bold text-xl transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] flex items-center justify-center gap-3 active:scale-95 group">
                Find My Buddy 
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="w-full sm:w-auto px-10 py-5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[24px] font-bold text-xl transition-all">
                The Roadmap
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {[
            { label: "Members", value: "5,000+" },
            { label: "Connections", value: "12,000+" },
            { label: "Founders", value: "500+" },
            { label: "Projects", value: "1,000+" }
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-white/40 font-medium uppercase tracking-wider">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 px-4 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-white/40">Simple steps to unlock your networking potential.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "Step 1", title: "Create Profile", desc: "Fill in your professional details and goals." },
              { step: "Step 2", title: "AI Matching", desc: "Our system analyzes your interests and matches you." },
              { step: "Step 3", title: "Connect", desc: "Receive a professionally matched buddy to connect with." },
              { step: "Step 4", title: "Grow Together", desc: "Collaborate and unlock new opportunities." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative p-8 bg-white/5 border border-white/10 rounded-3xl"
              >
                <div className="text-blue-500 font-bold mb-4 uppercase tracking-widest text-xs">{item.step}</div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Networking Categories</h2>
            <p className="text-white/40">Discover like-minded professionals in every niche.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { icon: Globe, label: "Students" },
              { icon: Rocket, label: "Founders" },
              { icon: Brain, label: "Mentors" },
              { icon: Shield, label: "Recruiters" },
              { icon: Award, label: "Designers" },
              { icon: MessageCircle, label: "Marketers" },
              { icon: Users, label: "Investors" },
              { icon: Rocket, label: "Developers" },
              { icon: Users, label: "Professionals" },
            ].map((cat, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-6 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center gap-4 text-center hover:bg-white/[0.08] transition-colors"
              >
                <div className="p-3 bg-blue-600/20 rounded-xl">
                  <cat.icon className="w-6 h-6 text-blue-400" />
                </div>
                <span className="font-semibold">{cat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-4 bg-white/[0.02] border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-20">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Alex Chen", role: "Frontend Developer", text: "Found my co-founder on Prompt Buddy within 48 hours. The matching is scarily accurate." },
              { name: "Sarah Miller", role: "Product Designer", text: "Connected with an amazing mentor who helped me land my senior role at a top tech company." },
              { name: "David K.", role: "Founder @ Stealth", text: "As a founder, finding the right talent is hard. Prompt Buddy made it effortless." }
            ].map((t, i) => (
              <motion.div key={i} className="p-8 bg-white/5 border border-white/10 rounded-3xl text-left">
                <p className="text-white/60 italic mb-6">"{t.text}"</p>
                <div className="font-bold">{t.name}</div>
                <div className="text-xs text-blue-400 font-bold uppercase tracking-widest">{t.role}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
             <div className="flex items-center gap-2 mb-6">
                <div className="p-1.5 bg-blue-600 rounded-lg"><Rocket className="w-5 h-5 text-white" /></div>
                <span className="text-xl font-bold tracking-tight">Prompt Buddy</span>
             </div>
             <p className="text-white/40 max-w-sm mb-8">Connecting the world's most ambitious professionals through AI-powered networking.</p>
          </div>
          <div>
            <h4 className="font-bold mb-6">Platform</h4>
            <ul className="space-y-4 text-white/40 text-sm">
              <li><Link to="/">About</Link></li>
              <li><Link to="/">Community</Link></li>
              <li><Link to="/">Contact</Link></li>
              <li><Link to="/admin" className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"><Shield className="w-3 h-3" /> Admin Panel</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-white/40 text-sm">
              <li><Link to="/">Privacy Policy</Link></li>
              <li><Link to="/">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-white/20 text-xs">
          &copy; 2026 Prompt Buddy. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
