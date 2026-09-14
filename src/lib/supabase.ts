import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";

/**
 * A real Supabase client when env vars are configured, or `null` when they are
 * absent (e.g. CI, local dev without .env.local, or an offline-first deployment).
 *
 * Callers must guard: `if (!supabase) { /* treat as unauthenticated *\/ }`.
 */
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;
