import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/** Supabaseが設定済みかチェック */
export const isSupabaseConfigured = () => Boolean(supabaseUrl && supabaseAnonKey);

/* ---------- DB types ---------- */
export interface NewsRow {
  id: number;
  title: string;
  date: string;
  category: string;
  thumbnail: string;
  excerpt: string;
  content: string;
  published: boolean;
  created_at: string;
}

export interface ColumnRow {
  id: number;
  title: string;
  date: string;
  category: string;
  thumbnail: string;
  excerpt: string;
  content: string;
  published: boolean;
  created_at: string;
}

export interface InterviewRow {
  id: number;
  name: string;
  position: string;
  department: string;
  title: string;
  subtitle: string;
  quote: string;
  photo: string;
  tags: string[];
  sort_order: number;
  published: boolean;
  created_at: string;
}

export interface InterviewSectionRow {
  id: number;
  interview_id: number;
  question: string;
  answer: string;
  sort_order: number;
}

export interface InterviewMessageRow {
  id: number;
  interview_id: number;
  heading: string;
  body: string;
}
