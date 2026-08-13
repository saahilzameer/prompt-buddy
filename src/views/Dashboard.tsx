import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from "firebase/firestore";
import { UserProfile, Match } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, 
  Zap, 
  Star, 
  Bookmark, 
  Loader2, 
  Sparkles, 
  MessageSquare, 
  Globe, 
  ArrowRight, 
  TrendingUp,
  Award,
  Link as LinkIcon
} from "lucide-react";
import ProfileCompletion from "../components/ProfileCompletion";
import SkillDistributionChart from "../components/SkillDistributionChart";
import BuddySearch from "../components/BuddySearch";
import PrivacySettings from "../components/PrivacySettings";
import DashboardSidebar, { DashboardView } from "../components/DashboardSidebar";
import MatchModal from "../components/MatchModal";

export default function Dashboard() {
  const [activeView, setActiveView] = useState<DashboardView>('overview');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [matches, setMatches] = useState<(Match & { matchedUser?: UserProfile })[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<(Match & { matchedUser?: UserProfile }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [stats, setStats] = useState({
    totalMatches: 0,
    connectionRequests: 0,
    profileScore: 0,
    networkingScore: 0
  });

  useEffect(() => {
    const userId = localStorage.getItem("pb_user_id");
    if (userId) {
      fetchUserData(userId);
      fetchMatches(userId);
      fetchStats(userId);
    }
  }, []);

  const fetchUserData = async (userId: string) => {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setUser({ id: docSnap.id, ...docSnap.data() } as UserProfile);
    }
    setLoading(false);
  };

  const fetchMatches = async (userId: string) => {
    const q = query(
      collection(db, "matches"),
      where("user_ids", "array-contains", userId),
      orderBy("created_at", "desc"),
      limit(5)
    );
    const querySnapshot = await getDocs(q);
    const matchesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Match);
    
    const matchesWithUsers = await Promise.all(matchesData.map(async (m) => {
      const otherUserId = m.user_ids.find(id => id !== userId);
      if (otherUserId) {
        const uDoc = await getDoc(doc(db, "users", otherUserId));
        if (uDoc.exists()) {
           return { ...m, matchedUser: { id: uDoc.id, ...uDoc.data() } as UserProfile };
        }
      }
      return m;
    }));
    
    setMatches(matchesWithUsers);
  };

  const fetchStats = async (userId: string) => {
    // Simulated stats for now, real implementation would count docs
    setStats({
      totalMatches: 15,
      connectionRequests: 8,
      profileScore: 92,
      networkingScore: 87
    });
  };

  const generateNewMatch = async () => {
    if (!user?.id) return;
    setMatching(true);
    try {
      const { findCompatibleMatches } = await import('../lib/matching-engine');
      const newMatches = await findCompatibleMatches(user);
      
      if (newMatches.length > 0) {
        setMatches(newMatches);
      }
      setActiveView('matches');
    } catch (error) {
      console.error("Match generation failed:", error);
    } finally {
      setMatching(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Matches', value: stats.totalMatches, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Conn. Requests', value: stats.connectionRequests, icon: MessageSquare, color: 'text-purple-400', bg: 'bg-purple-400/10' },
          { label: 'Profile Score', value: `${stats.profileScore}%`, icon: Award, color: 'text-green-400', bg: 'bg-green-400/10' },
          { label: 'Networking', value: `${stats.networkingScore}%`, icon: TrendingUp, color: 'text-sky-400', bg: 'bg-sky-400/10' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-white/5 border border-white/10 rounded-3xl group hover:border-white/20 transition-all"
          >
            <div className={stat.bg + " p-3 w-fit rounded-2xl mb-4 group-hover:scale-110 transition-transform"}>
              <stat.icon className={stat.color + " w-5 h-5"} />
            </div>
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SkillDistributionChart />
        
        <div className="p-8 bg-gradient-to-br from-blue-600/20 to-sky-600/10 border border-blue-500/20 rounded-3xl relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-blue-500/20 blur-[100px]" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <h3 className="text-xl font-bold">AI Networking Insights</h3>
            </div>
            <p className="text-white/60 mb-6 leading-relaxed">
              You have high compatibility with <b>Startup Founders</b> and <b>AI Developers</b> in Hyderabad this week.
            </p>
            <div className="space-y-3">
              {['Rahul Sharma', 'Priya Patel'].map(name => (
                <div key={name} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-sm font-medium">{name}</span>
                  <button className="text-[10px] font-bold text-blue-400 hover:text-blue-300 uppercase tracking-widest">Connect</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold">Community Activity</h3>
          <button className="text-xs font-bold text-blue-400 hover:underline uppercase tracking-widest">View Feed</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Latest Connections</h4>
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-blue-600 flex items-center justify-center text-xs font-bold">
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Trending Skills</h4>
            <div className="flex flex-wrap gap-2">
              {['Generative AI', 'React', 'Rust'].map(s => (
                <span key={s} className="px-2 py-1 bg-white/5 rounded-lg text-[10px] font-medium text-white/60">{s}</span>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Popular Interests</h4>
            <div className="flex flex-wrap gap-2">
              {['Web3', 'SaaS', 'EdTech'].map(i => (
                <span key={i} className="px-2 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-[10px] font-medium">{i}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 bg-white/5 border border-white/10 rounded-3xl text-center"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl mx-auto mb-4 flex items-center justify-center text-3xl font-bold shadow-xl shadow-blue-500/20">
            {user?.full_name?.charAt(0)}
          </div>
          <h2 className="text-2xl font-bold mb-1">{user?.full_name}</h2>
          <p className="text-sm text-white/40 mb-6">{user?.designation}</p>
          
          <div className="flex justify-center gap-3 mb-8">
            <a href={user?.linkedin} target="_blank" className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"><LinkIcon className="w-5 h-5" /></a>
            <a href={user?.github} target="_blank" className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"><Globe className="w-5 h-5" /></a>
          </div>

          <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm transition-all">Edit Basic Info</button>
        </motion.div>
        
        {user && <PrivacySettings user={user} onUpdate={setUser} />}
      </div>

      <div className="lg:col-span-8 space-y-8">
        <div className="p-8 bg-white/5 border border-white/10 rounded-3xl space-y-8">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">Professional Bio</h3>
            <p className="text-white/80 leading-relaxed italic">"{user?.bio || 'No bio provided yet.'}"</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user?.skills?.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs font-medium">{skill}</span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/40 mb-4">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {user?.interests?.map(interest => (
                  <span key={interest} className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-medium">{interest}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {user && <ProfileCompletion user={user} />}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 flex flex-col lg:flex-row gap-12">
        
        {/* Persistent Sidebar */}
        <div className="lg:w-64 shrink-0">
          <div className="sticky top-28">
            <DashboardSidebar currentView={activeView} onViewChange={setActiveView} />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {activeView === 'overview' && renderOverview()}
              {activeView === 'profile' && renderProfile()}
              {activeView === 'matches' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-bold">Buddy Matches</h2>
                      <p className="text-white/40 mt-1">AI-powered connections curated for your goals.</p>
                    </div>
                    <button 
                      onClick={generateNewMatch}
                      disabled={matching}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                    >
                      {matching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4 fill-current" />}
                      Generate New Matches
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    {matches.map(match => (
                      <div 
                        key={match.id} 
                        onClick={() => setSelectedMatch(match)}
                        className="p-6 bg-white/5 border border-white/10 rounded-3xl flex flex-col md:flex-row justify-between gap-6 hover:bg-white/[0.07] transition-all cursor-pointer"
                      >
                        <div className="flex gap-4">
                          <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center font-bold text-xl text-blue-400">
                            {match.matchedUser?.full_name?.charAt(0) || '#'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-lg">{match.matchedUser?.full_name || 'Potential Buddy'}</span>
                              <span className="px-2 py-0.5 bg-green-500/10 text-green-400 text-[10px] font-bold rounded-full">{match.compatibility_score}% Compatibility</span>
                            </div>
                            <p className="text-white/60 text-sm mb-2">{match.matchedUser?.designation || 'Member'}</p>
                            <p className="text-white/40 text-xs mb-4 italic">"{match.icebreaker}"</p>
                            <div className="flex flex-wrap gap-2">
                              {match.common_skills.map(s => <span key={s} className="px-2 py-0.5 bg-white/5 rounded text-[10px]">{s}</span>)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-end gap-3 shrink-0">
                           <button onClick={(e) => e.stopPropagation()} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"><Bookmark className="w-5 h-5" /></button>
                           <button onClick={(e) => e.stopPropagation()} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm">Connect</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeView === 'saved' && <BuddySearch />}
              {activeView === 'ai' && <div className="p-12 text-center border border-dashed border-white/10 rounded-3xl"><Sparkles className="w-12 h-12 mx-auto mb-4 text-blue-400" /><h3 className="text-xl font-bold mb-2">AI Insights Coming Soon</h3><p className="text-white/40">We are calibrating your personalized networking graph.</p></div>}
              {activeView === 'events' && <div className="p-12 text-center border border-dashed border-white/10 rounded-3xl"><Users className="w-12 h-12 mx-auto mb-4 text-blue-400" /><h3 className="text-xl font-bold mb-2">Upcoming Events</h3><p className="text-white/40">No upcoming networking events found for your region.</p></div>}
              {activeView === 'settings' && <div className="max-w-2xl"><PrivacySettings user={user!} onUpdate={setUser} /></div>}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Match Modal Overlay */}
      {selectedMatch && (
        <MatchModal 
          match={selectedMatch} 
          onClose={() => setSelectedMatch(null)} 
        />
      )}
    </div>
  );
}
