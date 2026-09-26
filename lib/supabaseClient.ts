import { createClient } from "@supabase/supabase-js";

// These read from env vars — see .env.example. Until you add real Supabase
// keys, auth/project-save calls will no-op in demo mode (see lib/demoMode.ts).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Falls back to harmless placeholder values when unconfigured so the app can
// still build/run in demo mode. Every call site should check
// isSupabaseConfigured before relying on real data.
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "placeholder-anon-key"
);
