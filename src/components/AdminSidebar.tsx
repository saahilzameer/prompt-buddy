import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Zap, 
  UserCheck, 
  Calendar, 
  BarChart3, 
  Mail, 
  FileText, 
  Settings, 
  History,
  LogOut
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export type AdminView = 'dashboard' | 'users' | 'matches' | 'mentors' | 'events' | 'analytics' | 'emails' | 'reports' | 'settings' | 'logs';

interface AdminSidebarProps {
  currentView: AdminView;
  onViewChange: (view: AdminView) => void;
}

export default function AdminSidebar({ currentView, onViewChange }: AdminSidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'matches', label: 'Matches', icon: Zap },
    { id: 'mentors', label: 'Mentors', icon: UserCheck },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'emails', label: 'Emails', icon: Mail },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'logs', label: 'Logs', icon: History },
  ];

  return (
    <div className="flex flex-col h-full bg-black/40 border-r border-white/5 p-6 min-h-screen">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="p-2 bg-blue-600 rounded-lg">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-sm font-black uppercase tracking-tighter text-white block">Prompt</span>
          <span className="text-[10px] font-bold tracking-[0.2em] text-blue-400 uppercase -mt-1 block">Admin OS</span>
        </div>
      </div>

      <div className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as AdminView)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-xs font-bold uppercase tracking-widest",
                isActive 
                  ? "bg-blue-600/10 text-blue-400 border border-blue-500/20" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-blue-400" : "text-white/40")} />
              {item.label}
              {isActive && (
                <motion.div 
                  layoutId="admin-active-pill"
                  className="ml-auto w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-8">
        <button 
          onClick={() => window.location.href = "/"}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all text-xs font-bold uppercase tracking-widest"
        >
          <LogOut className="w-4 h-4" />
          Exit Admin
        </button>
      </div>
    </div>
  );
}
