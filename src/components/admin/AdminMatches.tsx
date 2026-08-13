import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Search, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  Settings,
  SlidersHorizontal,
  Loader2
} from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';

export default function AdminMatches() {
  const [weights, setWeights] = useState({
    skills: 30,
    interests: 25,
    goals: 20,
    experience: 15,
    location: 10
  });

  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [matchingStatus, setMatchingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const q = query(collection(db, "matches"), orderBy("created_at", "desc"), limit(10));
      const snapshot = await getDocs(q);
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMatches(fetched);
    } catch (error) {
      console.error("Failed to fetch matches:", error);
    }
  };

  const runGlobalMatch = async () => {
    setLoading(true);
    setMatchingStatus("Initializing global pairing algorithm...");
    try {
      const adminId = localStorage.getItem("pb_user_id");
      const res = await fetch("/api/admin/global-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          adminId,
          skillsWeight: weights.skills,
          interestsWeight: weights.interests,
          goalsWeight: weights.goals,
          experienceWeight: weights.experience
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setMatchingStatus(`Success: Created ${data.matchesCreated} new matches!`);
        fetchMatches();
      } else {
        setMatchingStatus(`Error: ${data.error || 'Failed'}`);
      }
    } catch (error) {
      console.error("Failed to run global match:", error);
      setMatchingStatus("Critical engine failure.");
    } finally {
      setLoading(false);
      setTimeout(() => setMatchingStatus(null), 5000);
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: AI Matching Control Center */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-8 bg-gradient-to-br from-blue-600/10 to-indigo-600/5 border border-blue-500/20 rounded-[32px]">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-5 h-5 text-blue-400 fill-blue-400" />
              <h3 className="text-xl font-bold tracking-tight">AI Match Engine</h3>
            </div>
            <p className="text-sm text-white/40 mb-8 leading-relaxed">
              Calibrate the algorithmic priority for the global networking recommendation engine.
            </p>

            <div className="space-y-6">
              {Object.entries(weights).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-white/60">{key} Priority</span>
                    <span className="text-blue-400">{value}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={value}
                    onChange={(e) => setWeights({...weights, [key]: parseInt(e.target.value)})}
                    className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
              ))}

              <button 
                onClick={runGlobalMatch}
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all mt-4 shadow-xl shadow-blue-600/20 group"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                )}
                {loading ? 'Processing...' : 'Run Global Matching'}
              </button>
              {matchingStatus && (
                <div className="text-xs text-center font-bold text-blue-400 mt-2">
                  {matchingStatus}
                </div>
              )}
            </div>
          </div>

          <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-4 h-4 text-white/20" />
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Engine Logs</h4>
            </div>
            <div className="space-y-3">
              {[
                { time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), msg: 'Engine active and ready.' },
              ].map((log, i) => (
                <div key={i} className="text-[10px] font-mono text-white/30 flex gap-2">
                  <span className="text-blue-500/50">[{log.time}]</span>
                  <span>{log.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Match Directory */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Recent Matches</h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">Reviewing high-compatibility links</p>
            </div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input 
                placeholder="Find a specific match..."
                className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-blue-500 transition-all w-64"
              />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.02] text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 border-b border-white/5">
                  <th className="px-8 py-5">Connection</th>
                  <th className="px-8 py-5 text-center">Score</th>
                  <th className="px-8 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {matches.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-8 py-10 text-center text-white/40 text-sm">
                      No matches found in the database. Run the engine to generate some!
                    </td>
                  </tr>
                )}
                {matches.map(match => (
                  <tr key={match.id} className="hover:bg-white/[0.01] transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="flex -space-x-3">
                          <div className="w-10 h-10 bg-blue-600 rounded-xl border-2 border-black flex items-center justify-center text-xs font-bold">A</div>
                          <div className="w-10 h-10 bg-indigo-600 rounded-xl border-2 border-black flex items-center justify-center text-xs font-bold">B</div>
                        </div>
                        <div className="ml-2">
                          <div className="text-sm font-bold truncate max-w-[150px]">{match.user_ids[0]}</div>
                          <div className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{new Date(match.created_at?.toDate?.() || Date.now()).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="text-lg font-black text-blue-400">{match.compatibility_score || '--'}%</div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-tighter ${
                        match.status === 'approved' ? 'text-green-400' : 'text-yellow-400'
                      }`}>
                        {match.status === 'approved' ? <CheckCircle2 className="w-3 h-3" /> : <RefreshCw className="w-3 h-3" />}
                        {match.status || 'pending'}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="px-3 py-1.5 bg-blue-600/10 text-blue-400 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">Approve</button>
                        <button className="p-2 hover:bg-red-500/10 rounded-xl text-white/40 hover:text-red-400 transition-all"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
