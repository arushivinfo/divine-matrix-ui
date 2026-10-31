import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Public project settings. The publishable key is designed to ship in the
 * browser; row level security in the database protects each user's data.
 * Environment variables override these for other projects.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://knvrcijahviqsjhywhzm.supabase.co";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "sb_publishable_KYBuImVzLKeqyUOxUayK2w_VNE3iYWv";

let client: SupabaseClient | null = null;

/** Browser-only Supabase client (sessions live in localStorage). */
export function supabase() {
  client ??= createClient(SUPABASE_URL, SUPABASE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  return client;
}
