import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if variables exist, are non-empty, and look like real Supabase credentials
export const isSupabaseConfigured = (() => {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  const urlTrim = supabaseUrl.trim();
  const keyTrim = supabaseAnonKey.trim();
  // Simple heuristics: URL should contain 'supabase.co' and key length is typically > 20
  return urlTrim !== "" && keyTrim !== "" && urlTrim.includes("supabase.co") && keyTrim.length > 20;
})();

if (!isSupabaseConfigured) {
  console.warn(
    'Supabase is not configured yet. The application will fall back to using MOCK_PRODUCTS.\n' +
    'To connect to your database, please populate the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
// When not configured, supabase will be null and AuthContext will fall back to mock auth.
