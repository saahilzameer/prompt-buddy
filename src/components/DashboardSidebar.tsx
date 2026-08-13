import React from 'react';
import { 
  LayoutDashboard, 
  User, 
  Users, 
  Bookmark, 
  Sparkles, 
  Calendar, 
  MessageSquare, 
  Settings,
  LogOut
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export type DashboardView = 'overview' | 'profile' | 'matches' | 'saved' | 'ai' | 'events' | 'messages' | 'settings';

interface SidebarProps {
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
}

export default function DashboardSidebar({ currentView, onViewChange }: SidebarProps) {
  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'matches', label: 'My Matches', icon: Users },
    { id: 'saved', label: 'Saved Connections', icon: Bookmark },
    { id: 'ai', label: 'AI Recommendations', icon: Sparkles },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'messages', label: 'Messages', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id as DashboardView)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium",
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-white/40")} />
              {item.label}
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="ml-auto w-1 h-4 bg-white rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-8">
        <button 
          onClick={() => {
            localStorage.removeItem("pb_user_id");
            window.location.href = "/";
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/40 hover:text-red-400 hover:bg-red-400/5 transition-all text-sm font-medium group"
        >
          <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          Logout
        </button>
      </div>
    </div>
  );
}
