import { createClient } from "@supabase/supabase-js";

// Safe to expose client-side (same model as a publishable API key) — actual
// permissions are enforced by Postgres Row Level Security, not by hiding this.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
