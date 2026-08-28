import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Singleton — never instantiate twice
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export interface Profile {
  id: string; name: string; provider: string;
  created_at: string; updated_at: string;
}
export interface ReadingProgress {
  id: string; user_id: string; current_day: number;
  streak: number; xp: number; last_read_at: string | null;
  created_at: string; updated_at: string;
}

export async function getProgress(userId: string): Promise<ReadingProgress | null> {
  const { data, error } = await supabase
    .from('reading_progress').select('*').eq('user_id', userId).single();
  if (error) { console.error('[db] getProgress:', error.message); return null; }
  return data;
}

export async function upsertProgress(
  userId: string,
  updates: Partial<Omit<ReadingProgress, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<ReadingProgress | null> {
  const { data, error } = await supabase
    .from('reading_progress')
    .upsert({ user_id: userId, ...updates, updated_at: new Date().toISOString() })
    .select().single();
  if (error) { console.error('[db] upsertProgress:', error.message); return null; }
  return data;
}

export async function getCompletedDays(userId: string): Promise<number[]> {
  const { data, error } = await supabase
    .from('completed_days').select('day_number').eq('user_id', userId);
  if (error) { console.error('[db] getCompletedDays:', error.message); return []; }
  return data.map((r) => r.day_number);
}

export async function markDayComplete(userId: string, dayNumber: number): Promise<boolean> {
  const { error } = await supabase
    .from('completed_days')
    .upsert({ user_id: userId, day_number: dayNumber, completed_at: new Date().toISOString() });
  if (error) { console.error('[db] markDayComplete:', error.message); return false; }
  return true;
}
