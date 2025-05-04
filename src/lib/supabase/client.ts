import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "src/config";

export function createClient(): SupabaseClient {
  return createBrowserClient(supabase.url!, supabase.anonKey!);
}
