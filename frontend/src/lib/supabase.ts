import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface News {
  id: number;
  title: string;
  summary: string;
  content: string;
  imageUrl?: string;
  category: string;
  author: string;
  created_at: string;
  updated_at: string;
}

export interface NewsInput {
  title: string;
  summary: string;
  content: string;
  imageUrl?: string;
  category: string;
  author: string;
}