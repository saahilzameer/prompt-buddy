import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Mail, 
  Trash2, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { UserProfile } from '../../types';

interface AdminUsersProps {
  users: UserProfile[];
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onUserUpdated?: () => void;
}

export default function AdminUsers({ users, searchTerm, onSearchChange, onUserUpdated }: AdminUsersProps) {
  const [processingId, setProcessingId] = useState<string | null>(null);

  const filteredUsers = users.filter(u => 
    u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const suspendUser = async (userId: string) => {
    if (!confirm("Are you sure you want to suspend this user?")) return;
    setProcessingId(userId);
    try {
      const adminId = localStorage.getItem("pb_user_id");
      const res = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId })
      });
      if (res.ok && onUserUpdated) {
        onUserUpdated();
      }
    } catch (error) {
      console.error("Failed to suspend user:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to PERMANENTLY delete this user?")) return;
    setProcessingId(userId);
    try {
      const adminId = localStorage.getItem("pb_user_id");
      const res = await fetch(`/api/admin/users/${userId}?adminId=${adminId}`, {
        method: "DELETE"
      });
      if (res.ok && onUserUpdated) {
        onUserUpdated();
      }
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Directory</h2>
          <p className="text-white/40 mt-1 uppercase text-[10px] font-bold tracking-widest">Managing {users.length} active professionals</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input 
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, email..."
              className="bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-sm focus:outline-none focus:border-blue-500 transition-all w-full md:w-80"
            />
          </div>
          <button className="p-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
            <Filter className="w-5 h-5 text-white/40" />
          </button>
          <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all font-bold text-xs uppercase tracking-widest flex items-center gap-2">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 border-b border-white/5">
                <th className="px-8 py-5">Professional</th>
                <th className="px-8 py-5">Role & Level</th>
                <th className="px-8 py-5">Contact</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-white/[0.01] transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center font-bold text-blue-400 group-hover:scale-105 transition-transform">
                        {u.full_name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-base">{u.full_name}</div>
                        <div className="text-xs text-white/30">{u.city}, {u.country}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm font-medium">{u.designation}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-blue-400/60 mt-1">{u.experience_level}</div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-sm">{u.email}</div>
                    <div className="text-xs text-white/30">{u.phone}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-tighter ${
                      u.account_status === 'suspended' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
                    }`}>
                      {u.account_status || 'Active'}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {processingId === u.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-white/40" />
                      ) : (
                        <>
                          <button className="p-2 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-all"><Eye className="w-4 h-4" /></button>
                          <button onClick={() => suspendUser(u.id)} className="p-2 hover:bg-yellow-500/10 rounded-xl text-white/40 hover:text-yellow-400 transition-all" title="Suspend"><MoreVertical className="w-4 h-4" /></button>
                          <button onClick={() => deleteUser(u.id)} className="p-2 hover:bg-red-500/10 rounded-xl text-white/40 hover:text-red-400 transition-all" title="Delete"><Trash2 className="w-4 h-4" /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Placeholder */}
        <div className="px-8 py-4 flex items-center justify-between border-t border-white/5 bg-white/[0.01]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/20">Showing 1 to {filteredUsers.length} of {users.length} entries</p>
          <div className="flex gap-2">
            <button className="p-2 bg-white/5 border border-white/10 rounded-lg disabled:opacity-20" disabled><ChevronLeft className="w-4 h-4" /></button>
            <button className="p-2 bg-white/5 border border-white/10 rounded-lg disabled:opacity-20" disabled><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
