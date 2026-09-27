import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publicKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const serverUrl = process.env.SUPABASE_URL || publicUrl;
const adminKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

export const hasSupabaseConfig = Boolean(publicUrl && publicKey);
export const hasSupabaseAdminConfig = Boolean(serverUrl && adminKey);

export function publicSupabase(): SupabaseClient | null {
  if (!publicUrl || !publicKey) return null;
  return createClient(publicUrl, publicKey, {
    auth: { persistSession: false },
  });
}

export function adminSupabase(): SupabaseClient | null {
  if (!serverUrl || !adminKey) return null;
  return createClient(serverUrl, adminKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
