
export type Profile = {
  id: string;
  name: string;
  gender: string;
  birthdate: string;
  location: string;
  bio: string;
  prompt1?: string;
  prompt2?: string;
  is_profile_complete: boolean;
  created_at: string;
  updated_at: string;
};

export type Photo = {
  id: string;
  profile_id: string;
  url: string;
  is_primary: boolean;
  created_at: string;
};

export type Interest = {
  id: string;
  name: string;
};

export type ProfileInterest = {
  id: string;
  profile_id: string;
  interest_id: string;
};

export type Preference = {
  id: string;
  profile_id: string;
  looking_for: string[];
  min_age: number;
  max_age: number;
  distance: number;
};

export type Match = {
  id: string;
  profile1_id: string;
  profile2_id: string;
  status: 'pending' | 'matched' | 'rejected';
  created_at: string;
};

export type Message = {
  id: string;
  match_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read: boolean;
};
