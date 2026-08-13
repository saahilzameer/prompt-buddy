import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, Lightbulb, Users, Briefcase, Zap, Globe, MessageSquare } from 'lucide-react';
import { UserProfile, Match } from '../types';

interface MatchModalProps {
  match: (Match & { matchedUser?: UserProfile }) | null;
  onClose: () => void;
}

export default function MatchModal({ match, onClose }: MatchModalProps) {
  if (!match || !match.matchedUser) return null;

  const target = match.matchedUser;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0a0a0a] border border-white/10 rounded-[32px] shadow-2xl z-10"
        >
          <div className="p-8 space-y-8">
            <button
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header / Profile Summary */}
            <div className="flex flex-col md:flex-row items-center gap-6 pt-4">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center text-3xl font-bold shrink-0">
                {target.full_name?.charAt(0) || '#'}
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className="text-3xl font-bold mb-2">{target.full_name}</h2>
                <p className="text-white/60 mb-2">{target.designation} at {target.company || 'Tech'}</p>
                <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-white/40">
                  <Globe className="w-4 h-4" />
                  {target.city}, {target.country}
                </div>
              </div>
              <div className="flex flex-col items-center bg-blue-500/10 border border-blue-500/20 p-4 rounded-3xl min-w-[120px]">
                <span className="text-3xl font-bold text-blue-400">{match.compatibility_score}%</span>
                <span className="text-[10px] uppercase tracking-widest text-blue-400/60 font-bold mt-1">Match</span>
              </div>
            </div>

            {/* Bio */}
            {target.bio && (
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                <p className="text-white/80 italic leading-relaxed">"{target.bio}"</p>
              </div>
            )}

            {/* Compatibility Breakdown */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                Compatibility Breakdown
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                  <div className="flex items-center gap-2 text-white/60 mb-2">
                    <Briefcase className="w-4 h-4" />
                    <h4 className="font-medium">Shared Skills</h4>
                  </div>
                  {match.common_skills && match.common_skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {match.common_skills.map(s => (
                        <span key={s} className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium">{s}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/40 text-sm">No common skills found.</p>
                  )}
                </div>

                <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                  <div className="flex items-center gap-2 text-white/60 mb-2">
                    <Lightbulb className="w-4 h-4" />
                    <h4 className="font-medium">Shared Interests</h4>
                  </div>
                  {match.common_interests && match.common_interests.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {match.common_interests.map(i => (
                        <span key={i} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-medium">{i}</span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white/40 text-sm">No common interests found.</p>
                  )}
                </div>
              </div>
            </div>

            {/* AI Icebreaker */}
            <div className="p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/10 rounded-3xl border border-blue-500/20">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-5 h-5 text-blue-400" />
                <h4 className="font-bold">AI Icebreaker Suggestion</h4>
              </div>
              <p className="text-white/80 leading-relaxed text-sm">
                "{match.icebreaker}"
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button className="flex-1 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold transition-all">
                Save for Later
              </button>
              <button className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all">
                <CheckCircle className="w-5 h-5" />
                Send Connection Request
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
