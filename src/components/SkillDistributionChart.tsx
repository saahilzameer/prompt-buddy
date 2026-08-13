import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Loader2, BarChart3 } from "lucide-react";
import { motion } from "motion/react";

interface SkillData {
  name: string;
  count: number;
}

export default function SkillDistributionChart() {
  const [data, setData] = useState<SkillData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkillDistribution();
  }, []);

  const fetchSkillDistribution = async () => {
    try {
      const q = query(collection(db, "users"), where("is_discoverable", "==", true));
      const snapshot = await getDocs(q);
      const skillCounts: Record<string, number> = {};

      snapshot.docs.forEach((doc) => {
        const skills = doc.data().skills as string[] || [];
        skills.forEach((skill) => {
          skillCounts[skill] = (skillCounts[skill] || 0) + 1;
        });
      });

      const processedData = Object.entries(skillCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8); // Top 8 skills

      setData(processedData);
    } catch (error) {
      console.error("Error fetching skill distribution:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center bg-white/5 border border-white/10 rounded-3xl">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 bg-white/5 border border-white/10 rounded-3xl"
    >
      <div className="flex items-center gap-2 mb-8">
        <div className="p-2 bg-blue-500/10 rounded-lg">
          <BarChart3 className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Community Skillset</h3>
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Global Distribution</p>
        </div>
      </div>

      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 600 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 600 }}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ 
                backgroundColor: '#0f172a', 
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '12px',
                fontSize: '12px'
              }}
              itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={32}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === 0 ? '#3b82f6' : `rgba(59, 130, 246, ${0.8 - index * 0.1})`} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
