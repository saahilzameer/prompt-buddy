import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";
import { UserProfile } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { 
  Loader2, 
  Lock, 
  ShieldCheck,
  LayoutDashboard,
  Users,
  Zap,
  Calendar,
  BarChart3,
  Mail,
  FileText,
  Settings,
  History
} from "lucide-react";
import AdminSidebar, { AdminView } from "../components/AdminSidebar";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminUsers from "../components/admin/AdminUsers";
import AdminMatches from "../components/admin/AdminMatches";
import AdminEvents from "../components/admin/AdminEvents";
import AdminAnalytics from "../components/admin/AdminAnalytics";
import AdminEmails from "../components/admin/AdminEmails";

export default function Admin() {
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [adminStats, setAdminStats] = useState<any>(null);

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const userId = localStorage.getItem("pb_user_id");
    if (!userId) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    try {
      const docSnap = await getDoc(doc(db, "users", userId));
      if (docSnap.exists() && docSnap.data().is_admin === true) {
        if (docSnap.data().email === "prompttechies@gmail.com") {
          const pwd = prompt("Enter admin password:");
          if (pwd !== "123456") {
             setIsAdmin(false);
             setLoading(false);
             return;
          }
        }
        setIsAdmin(true);
        fetchUsers();
        fetchAdminStats(userId);
      } else {
        setIsAdmin(false);
        setLoading(false);
      }
    } catch (error) {
      console.error("Admin check failed:", error);
      setIsAdmin(false);
      setLoading(false);
    }
  };

  const fetchAdminStats = async (adminId: string) => {
    try {
      const res = await fetch("/api/admin/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId })
      });
      if (res.ok) {
        const data = await res.json();
        setAdminStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const q = query(collection(db, "users"), orderBy("created_at", "desc"));
      const snapshot = await getDocs(q);
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserProfile)));
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#050505] text-center px-4">
        <div className="p-6 bg-red-500/10 rounded-3xl mb-8 border border-red-500/20">
          <Lock className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold mb-4 tracking-tight">Restricted Access</h1>
        <p className="text-white/40 max-w-sm mb-12 text-lg leading-relaxed">
          The Admin OS is restricted to Prompt Buddy founders and engineers.
        </p>
        <button onClick={() => window.location.href = "/"} className="px-10 py-4 bg-white/5 border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all">
          Return to Hub
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#050505] text-white">
      {/* Admin Sidebar Navigation */}
      <div className="w-72 shrink-0">
        <div className="fixed inset-y-0 w-72">
          <AdminSidebar currentView={activeView} onViewChange={setActiveView} />
        </div>
      </div>

      {/* Main Command View */}
      <div className="flex-1 min-w-0 p-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeView === 'dashboard' && <AdminDashboard stats={adminStats} />}
            {activeView === 'users' && <AdminUsers users={users} searchTerm={searchTerm} onSearchChange={setSearchTerm} onUserUpdated={fetchUsers} />}
            {activeView === 'matches' && <AdminMatches />}
            {activeView === 'events' && <AdminEvents />}
            {activeView === 'analytics' && <AdminAnalytics />}
            {activeView === 'emails' && <AdminEmails />}
            
            {/* Placeholder for other views */}
            {!['dashboard', 'users', 'matches', 'events', 'analytics', 'emails'].includes(activeView) && (
              <div className="p-20 text-center border border-dashed border-white/10 rounded-[48px]">
                <ShieldCheck className="w-16 h-16 text-blue-400 mx-auto mb-6 drop-shadow-lg opacity-20" />
                <h2 className="text-3xl font-bold mb-4 uppercase tracking-widest opacity-20">{activeView}</h2>
                <p className="text-white/40 max-w-sm mx-auto">Section under development for Phase 2 Deployment.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

