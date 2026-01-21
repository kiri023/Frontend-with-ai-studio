
export type Category = 'loan' | 'yugwan' | 'sojingong';

export interface Announcement {
  policy_id: string;
  title: string;
  category: Category;
  region: string; // "전국", "서울", etc.
  target: string;
  content: string;
  apply_link: string | null;
  deadline: string | null; // YYYY-MM-DD or string
  score?: number;
  reason?: string;
  checklist?: string[];
  risk_note?: string;
}

export interface UserProfile {
  region: string;
  industry: string;
  employees: number;
  opening_date: string;
  revenue: string;
}

export interface Message {
  message_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: number;
  recommendations?: Announcement[];
}

export interface ChatSession {
  session_id: string;
  title: string;
  created_at: number;
  updated_at: number;
  profile_snapshot: UserProfile;
  messages: Message[];
}

export interface GeminiRecommendation {
  id: string;
  score: number;
  reason: string;
  checklist: string[];
  risk_note: string;
}
