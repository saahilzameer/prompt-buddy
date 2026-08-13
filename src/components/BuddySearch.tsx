import { useState } from "react";
import { db } from "../lib/firebase";
import { collection, query, where, getDocs, limit, addDoc, serverTimestamp } from "firebase/firestore";
import { UserProfile } from "../types";
import { Search, Filter, Loader2, Star, UserPlus, MapPin, Briefcase, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../lib/utils";
import { useToast } from "../context/ToastContext";

export default function BuddySearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [experience, setExperience] = useState<string>("all");
  const [results, setResults] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAiSearch, setIsAiSearch] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [sendingRequest, setSendingRequest] = useState<string | null>(null);
  const { showToast } = useToast();

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    setHasSearched(true);
    try {
      if (isAiSearch) {
        const userId = localStorage.getItem("pb_user_id");
        const response = await fetch("/api/ai/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: searchTerm, userId })
        });
        if (!response.ok) throw new Error("AI search failed");
        const data = await response.json();
        setResults(data);
      } else {
        let q = query(collection(db, "users"), limit(20));
        const constraints = [where("is_discoverable", "==", true)];
        if (experience !== "all") constraints.push(where("experience_level", "==", experience));
        const skill = searchTerm.trim();
        constraints.push(where("skills", "array-contains", skill));
        const finalQuery = query(collection(db, "users"), ...constraints, limit(10));
        const snapshot = await getDocs(finalQuery);
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as UserProfile));
        const currentUserId = localStorage.getItem("pb_user_id");
        setResults(docs.filter(u => u.id !== currentUserId));
      }
    } catch (error) {
      console.error("Search failed:", error);
      showToast("Search failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (receiverId: string) => {
    const senderId = localStorage.getItem("pb_user_id");
    if (!senderId) {
      showToast("Please register to connect with buddies.", "error");
      return;
    }

    setSendingRequest(receiverId);
    try {
      await addDoc(collection(db, "connection_requests"), {
        sender_id: senderId,
        receiver_id: receiverId,
        status: "pending",
        created_at: serverTimestamp()
      });
      showToast("Connection request sent!", "success");
    } catch (error) {
      console.error("Failed to send request:", error);
      showToast("Failed to send request. Please try again.", "error");
    } finally {
      setSendingRequest(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-lg transition-all",
              isAiSearch ? "bg-blue-600 text-white" : "bg-white/5 text-white/40"
            )}>
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold tracking-tight">AI Semantic Search</h3>
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">Search by intent or project context</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAiSearch(!isAiSearch)}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none",
              isAiSearch ? "bg-blue-600" : "bg-white/10"
            )}
          >
            <span className={cn(
              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
              isAiSearch ? "translate-x-6" : "translate-x-1"
            )} />
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input 
              type="text"
              placeholder={isAiSearch ? "Try 'Founders building in AI' or 'Rust mentors'..." : "Search by exact skill (e.g. React)..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            />
          </div>
          
          <div className="flex gap-2">
            {!isAiSearch && (
              <select 
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 appearance-none"
              >
                <option value="all" className="bg-slate-900">All Experience</option>
                <option value="Entry Level" className="bg-slate-900">Entry Level</option>
                <option value="Intermediate" className="bg-slate-900">Intermediate</option>
                <option value="Senior" className="bg-slate-900">Senior</option>
                <option value="Expert" className="bg-slate-900">Expert</option>
              </select>
            )}

            <button 
              onClick={handleSearch}
              disabled={loading}
              className={cn(
                "rounded-2xl px-8 py-3 text-sm font-bold transition-all flex items-center gap-2 disabled:opacity-50",
                isAiSearch ? "bg-white text-black hover:bg-white/90" : "bg-blue-600 hover:bg-blue-500 text-white"
              )}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isAiSearch ? "Ask AI" : "Search")}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">
            {hasSearched ? `Search Results (${results.length})` : "Start searching for buddies"}
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <AnimatePresence mode="popLayout">
            {results.map((buddy, i) => (
              <motion.div 
                key={buddy.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-5 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-lg font-bold text-white shrink-0 shadow-lg">
                    {buddy.full_name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-bold truncate pr-4">{buddy.full_name}</h4>
                      <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-2 py-0.5 rounded-full text-[10px] font-bold">
                        <Star className="w-3 h-3 fill-current" />
                        {buddy.profile_score}
                      </div>
                    </div>
                    <p className="text-xs text-white/40 flex items-center gap-1 mb-3">
                      <Briefcase className="w-3 h-3" /> {buddy.designation} • {buddy.experience_level}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {buddy.skills.slice(0, 3).map(skill => (
                        <span key={skill} className="px-2 py-1 bg-white/5 border border-white/5 rounded-lg text-[10px] text-white/60">
                          {skill}
                        </span>
                      ))}
                      {buddy.skills.length > 3 && (
                        <span className="text-[10px] text-white/30 self-center">+{buddy.skills.length - 3} more</span>
                      )}
                    </div>

                    <button 
                      onClick={() => handleConnect(buddy.id)}
                      disabled={sendingRequest === buddy.id}
                      className="w-full py-2 bg-blue-600/10 text-blue-400 text-xs font-bold rounded-xl hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {sendingRequest === buddy.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <UserPlus className="w-3 h-3" />
                      )}
                      {sendingRequest === buddy.id ? "Sending..." : "Connect with Buddy"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {hasSearched && results.length === 0 && !loading && (
            <div className="text-center py-12 px-6 border border-dashed border-white/10 rounded-3xl">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-white/20" />
              </div>
              <p className="text-sm text-white/40">No buddies found matching your criteria.</p>
              <button 
                onClick={() => {setSearchTerm(""); setExperience("all"); handleSearch();}}
                className="mt-4 text-xs text-blue-400 hover:underline"
              >
                Clear filters and try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
