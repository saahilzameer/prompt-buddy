import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "motion/react";
import { ShieldAlert, Server, Key, Database, History, Loader2, Lock, ChevronRight } from "lucide-react";

export default function SuperAdmin() {
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSuperAdmin();
  }, []);

  const checkSuperAdmin = async () => {
    const userId = localStorage.getItem("pb_user_id");
    if (!userId) {
      setIsSuperAdmin(false);
      setLoading(false);
      return;
    }

    const docSnap = await getDoc(doc(db, "users", userId));
    // Super admin could be defined by a specific flag or hardcoded founder email
    if (docSnap.exists() && docSnap.data().is_super_admin === true) {
      setIsSuperAdmin(true);
    } else {
      setIsSuperAdmin(false);
    }
    setLoading(false);
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-10 h-10 animate-spin text-blue-500" /></div>;

  if (isSuperAdmin === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <div className="p-6 bg-red-500/10 rounded-[32px] border border-red-500/20 mb-8">
          <ShieldAlert className="w-16 h-16 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold mb-4 tracking-tighter">Founder Access Only</h1>
        <p className="text-white/40 max-w-sm mb-12 text-lg">This terminal requires Level 5 security clearance.</p>
        <button onClick={() => window.location.href = "/"} className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold">Return to Base</button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-20">
      <div className="flex items-center gap-4 mb-16">
        <div className="p-4 bg-blue-600 rounded-3xl shadow-xl shadow-blue-600/20">
          <Server className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic">Super Admin</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-blue-400 mt-1">Networking OS Core Terminal</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          { title: 'System Settings', desc: 'Global platform variables & feature flags', icon: Server },
          { title: 'Database Controls', desc: 'Direct Firestore access & index management', icon: Database },
          { title: 'API Key Vault', desc: 'Manage Google & Supabase credentials', icon: Key },
          { title: 'Global Audit Logs', desc: 'Complete history of all admin actions', icon: History },
        ].map((item, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-10 bg-white/5 border border-white/10 rounded-[48px] hover:border-blue-500/30 transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-blue-600 transition-colors">
                <item.icon className="w-6 h-6 group-hover:text-white" />
              </div>
              <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </div>
            <h3 className="text-2xl font-bold mb-2 tracking-tight">{item.title}</h3>
            <p className="text-white/40 leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
