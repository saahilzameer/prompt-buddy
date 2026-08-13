export interface UserProfile {
  id?: string;
  full_name: string;
  email: string;
  phone: string;
  profile_photo?: string;
  college: string;
  company: string;
  designation: string;
  city: string;
  state?: string;
  country: string;
  linkedin: string;
  github: string;
  portfolio: string;
  bio: string;
  skills: string[];
  interests: string[];
  looking_for: string[];
  experience_level: 'Student' | 'Fresher' | 'Professional' | 'Founder' | 'Senior Professional';
  networking_score?: number;
  profile_completion?: number;
  profile_score?: number;
  account_status?: 'active' | 'suspended' | 'pending';
  created_at?: any;
  is_admin?: boolean;
  is_discoverable?: boolean;
  show_in_feed?: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: any;
  location: string;
  registration_count: number;
  image?: string;
}

export interface Match {
  id: string;
  user_ids: string[];
  compatibility_score: number;
  common_skills: string[];
  common_interests: string[];
  status: 'pending' | 'accepted' | 'declined';
  icebreaker: string;
  created_at: any;
}

export interface ProfileAnalysis {
  score: number;
  strength: string;
  potential: string;
}
