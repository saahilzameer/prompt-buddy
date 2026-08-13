import { useState } from "react";
import { db } from "../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { UserProfile } from "../types";
import { Eye, EyeOff, Shield, Users, Loader2 } from "lucide-react";
import { useToast } from "../context/ToastContext";

interface PrivacySettingsProps {
  user: UserProfile;
  onUpdate: (updatedUser: UserProfile) => void;
}

export default function PrivacySettings({ user, onUpdate }: PrivacySettingsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const { showToast } = useToast();

  const toggleSetting = async (field: 'is_discoverable' | 'show_in_feed') => {
    if (!user.id) return;
    
    setLoading(field);
    const newValue = !user[field];
    
    try {
      await updateDoc(doc(db, "users", user.id), {
        [field]: newValue,
        updated_at: new Date()
      });
      
      onUpdate({ ...user, [field]: newValue });
      showToast(`${field === 'is_discoverable' ? 'Discoverability' : 'Feed visibility'} updated!`, "success");
    } catch (error) {
      console.error("Failed to update privacy:", error);
      showToast("Failed to update settings.", "error");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-white/40">Privacy & Visibility</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
              {user.is_discoverable ? <Eye className="w-4 h-4 text-green-400" /> : <EyeOff className="w-4 h-4 text-white/40" />}
            </div>
            <div>
              <p className="text-sm font-medium">Discoverable in Search</p>
              <p className="text-[10px] text-white/40 uppercase tracking-wider font-bold">Appear in Buddy Discovery</p>
            </div>
          </div>
          <button 
            onClick={() => toggleSetting('is_discoverable')}
            disabled={!!loading}
            className={`w-10 h-6 rounded-full relative transition-all ${user.is_discoverable ? 'bg-blue-600' : 'bg-white/10'}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${user.is_discoverable ? 'left-5' : 'left-1'}`}>
              {loading === 'is_discoverable' && <Loader2 className="w-full h-full animate-spin text-blue-600 p-0.5" />}
            </div>
          </button>
        </div>

        <div className="flex items-center justify-between group pt-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
              <Users className={`w-4 h-4 ${user.show_in_feed ? 'text-sky-400' : 'text-white/40'}`} />
            </div>
            <div>
              <p className="text-sm font-medium">Show in Community Feed</p>
              <p className="text-[10px] text-white/40 uppercase tracking-wider font-bold">Share activity with community</p>
            </div>
          </div>
          <button 
            onClick={() => toggleSetting('show_in_feed')}
            disabled={!!loading}
            className={`w-10 h-6 rounded-full relative transition-all ${user.show_in_feed ? 'bg-sky-600' : 'bg-white/10'}`}
          >
            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${user.show_in_feed ? 'left-5' : 'left-1'}`}>
              {loading === 'show_in_feed' && <Loader2 className="w-full h-full animate-spin text-sky-600 p-0.5" />}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
