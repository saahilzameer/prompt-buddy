import React, { useState } from 'react';
import { 
  Users, 
  Zap, 
  TrendingUp, 
  BarChart3, 
  ShieldCheck,
  ChevronUp
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminDashboardProps {
  stats: any;
}

export default function AdminDashboard({ stats }: AdminDashboardProps) {
  const [timeRange, setTimeRange] = useState<'weekly' | 'monthly'>('monthly');

  const displayStats = [
    { label: 'Total Users', value: stats?.totalUsers || '...', change: '+15%', icon: Users, color: 'text-blue-400' },
    { label: 'Total Matches', value: stats?.totalMatches || '...', change: '+22%', icon: Zap, color: 'text-yellow-400' },
    { label: 'Active Users', value: stats?.activeUsers || '...', change: '+8%', icon: TrendingUp, color: 'text-green-400' },
    { label: 'Weekly Growth', value: '15.4%', change: '+2%', icon: BarChart3, color: 'text-sky-400' },
    { label: 'Registrations', value: '458', change: 'Monthly', icon: ShieldCheck, color: 'text-purple-400' }
  ];

  const fullChartData = stats?.analyticsData || [];
  const chartData = timeRange === 'weekly' 
    ? fullChartData.slice(-7) 
    : fullChartData;

  return (
    <div className="space-y-10">
      {/* Platform Health Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {displayStats.map((stat, i) => (
          <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-3xl group hover:border-blue-500/30 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-1">
                <ChevronUp className="w-3 h-3 text-green-400" />
                <span className="text-[10px] font-black text-green-400 uppercase tracking-tighter">{stat.change}</span>
              </div>
            </div>
            <div className="text-2xl font-bold mb-1 tracking-tight">{stat.value}</div>
            <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 p-8 bg-white/5 border border-white/10 rounded-3xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold tracking-tight">Growth Analytics</h3>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mt-1">Daily user & match velocity</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setTimeRange('weekly')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${timeRange === 'weekly' ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/40'}`}>
                Weekly
              </button>
              <button 
                onClick={() => setTimeRange('monthly')}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${timeRange === 'monthly' ? 'bg-blue-600 text-white' : 'bg-white/5 text-white/40'}`}>
                Monthly
              </button>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 10}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'rgba(255,255,255,0.3)', fontSize: 10}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={3} />
                <Area type="monotone" dataKey="matches" stroke="#10b981" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 p-8 bg-white/5 border border-white/10 rounded-3xl">
          <h3 className="text-xl font-bold tracking-tight mb-8">Match Control Center</h3>
          <div className="space-y-6">
            <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20">
              <Zap className="w-5 h-5 fill-current" />
              Run Global Matching
            </button>
            
            <div className="space-y-4 pt-6 border-t border-white/10">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40">Engine Weights</h4>
              {[
                { label: 'Skills Weight', value: 30 },
                { label: 'Interests Weight', value: 25 },
                { label: 'Goals Weight', value: 20 },
                { label: 'Experience Weight', value: 15 },
              ].map(w => (
                <div key={w.label} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span>{w.label}</span>
                    <span className="text-blue-400">{w.value}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${w.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
