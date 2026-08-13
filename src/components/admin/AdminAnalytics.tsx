import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Download, Filter, TrendingUp, Users, Zap } from 'lucide-react';

export default function AdminAnalytics() {
  const skillData = [
    { subject: 'Generative AI', A: 120, fullMark: 150 },
    { subject: 'React', A: 98, fullMark: 150 },
    { subject: 'UI/UX', A: 86, fullMark: 150 },
    { subject: 'Product', A: 99, fullMark: 150 },
    { subject: 'Python', A: 85, fullMark: 150 },
    { subject: 'Web3', A: 65, fullMark: 150 },
  ];

  const cityData = [
    { name: 'Hyderabad', value: 450 },
    { name: 'Bangalore', value: 380 },
    { name: 'Mumbai', value: 320 },
    { name: 'Delhi', value: 290 },
    { name: 'Pune', value: 210 },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Intelligence Dashboard</h2>
          <p className="text-white/40 mt-1 uppercase text-[10px] font-bold tracking-widest italic">Deep-dive into platform behavioral patterns</p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest flex items-center gap-2">
            <Filter className="w-4 h-4" /> Date Range
          </button>
          <button className="px-6 py-3 bg-blue-600 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
            <Download className="w-4 h-4" /> Full Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Skill Density Chart */}
        <div className="p-10 bg-white/5 border border-white/10 rounded-[48px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold tracking-tight">Skill Density</h3>
              <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Trending professional competencies</p>
            </div>
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis dataKey="subject" tick={{fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 'bold'}} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar
                  name="Skill Level"
                  dataKey="A"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="p-10 bg-white/5 border border-white/10 rounded-[48px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold tracking-tight">Geographic Hubs</h3>
              <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Concentration of high-value professionals</p>
            </div>
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cityData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: 'white', fontSize: 12, fontWeight: 'bold'}} 
                />
                <Tooltip 
                  cursor={{fill: 'rgba(255,255,255,0.02)'}}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                />
                <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={24}>
                  {cityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Engagement Comparison */}
      <div className="p-10 bg-white/5 border border-white/10 rounded-[48px]">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h3 className="text-xl font-bold tracking-tight">User Engagement Segments</h3>
            <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Activity breakdown by professional intent</p>
          </div>
          <Zap className="w-5 h-5 text-yellow-400" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { label: 'Founders', count: '1,240', activity: 'High', color: 'bg-blue-500' },
            { label: 'Developers', count: '2,850', activity: 'High', color: 'bg-indigo-500' },
            { label: 'Mentors', count: '450', activity: 'Medium', color: 'bg-green-500' },
            { label: 'Investors', count: '120', activity: 'Low', color: 'bg-yellow-500' },
          ].map((item, i) => (
            <div key={i} className="p-6 bg-white/5 rounded-3xl border border-white/5 relative group overflow-hidden">
              <div className={`absolute inset-x-0 bottom-0 h-1 ${item.color} opacity-20 group-hover:opacity-100 transition-opacity`} />
              <div className="text-3xl font-black mb-1">{item.count}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-4">{item.label}</div>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                <span className="text-[10px] font-bold uppercase tracking-tighter text-white/60">{item.activity} Engagement</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
