import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Users, 
  Filter, 
  Eye, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  ChevronRight
} from 'lucide-react';

export default function AdminEmails() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [targetSegment, setTargetSegment] = useState("all");

  const recentCampaigns = [
    { id: '1', name: 'Weekly Match Roundup', sentTo: 'Founders', reach: '1,240', status: 'Delivered', date: 'Aug 12' },
    { id: '2', name: 'New Feature Announcement', sentTo: 'All Users', reach: '5,240', status: 'Delivered', date: 'Aug 10' },
    { id: '3', name: 'Mentor Program Update', sentTo: 'Mentors', reach: '450', status: 'In Queue', date: 'Scheduled' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
      {/* Campaign Composer */}
      <div className="lg:col-span-7 space-y-8">
        <div className="p-10 bg-white/5 border border-white/10 rounded-[48px]">
          <div className="flex items-center gap-3 mb-8">
            <Mail className="w-6 h-6 text-blue-400" />
            <h3 className="text-2xl font-bold tracking-tight">Campaign Composer</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Target Segment</label>
              <div className="flex flex-wrap gap-2">
                {['All Users', 'Founders', 'Developers', 'Mentors', 'Recruiters'].map(segment => (
                  <button 
                    key={segment}
                    onClick={() => setTargetSegment(segment)}
                    className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                      targetSegment === segment 
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' 
                        : 'bg-white/5 border-white/10 text-white/40 hover:text-white'
                    }`}
                  >
                    {segment}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Subject Line</label>
              <input 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Ex: Your weekly networking recommendations are here"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Email Body (Markdown Supported)</label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Compose your message..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-blue-500 transition-all min-h-[300px] resize-none"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-600/20">
                <Send className="w-5 h-5" /> Dispatch Campaign
              </button>
              <button className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold transition-all">
                <Eye className="w-5 h-5 text-white/40" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* History & Reach */}
      <div className="lg:col-span-5 space-y-8">
        <div className="p-8 bg-white/5 border border-white/10 rounded-[32px]">
          <h3 className="text-xl font-bold mb-8">Reach Metrics</h3>
          <div className="space-y-6">
            <div className="p-6 bg-blue-600/10 border border-blue-500/20 rounded-3xl relative overflow-hidden">
              <Users className="absolute -right-4 -bottom-4 w-24 h-24 text-blue-500/10 -rotate-12" />
              <div className="relative z-10">
                <div className="text-3xl font-black mb-1">5,240</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Total Email Reach</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                <div className="text-2xl font-bold mb-1 tracking-tight">98.4%</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/20">Delivery Rate</div>
              </div>
              <div className="p-6 bg-white/5 border border-white/10 rounded-3xl">
                <div className="text-2xl font-bold mb-1 tracking-tight">42.8%</div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-white/20">Open Rate</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 bg-white/5 border border-white/10 rounded-[32px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold">Recent Campaigns</h3>
            <button className="text-[10px] font-bold uppercase tracking-widest text-blue-400 hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {recentCampaigns.map(campaign => (
              <div key={campaign.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-white/10 transition-all cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm truncate pr-4">{campaign.name}</h4>
                  <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-white group-hover:translate-x-1 transition-all" />
                </div>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-white/30">
                  <div className="flex items-center gap-2">
                    <span className={campaign.status === 'Delivered' ? 'text-green-400' : 'text-yellow-400'}>{campaign.status}</span>
                    <span>•</span>
                    <span>{campaign.reach} users</span>
                  </div>
                  <span>{campaign.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
