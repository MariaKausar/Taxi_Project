import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";
import {
  getServerSupabaseEnv,
  getSupabaseUrlFromEnv,
} from "@/lib/supabase-env";

function createServerClient(url: string, key: string) {
  return createClient<Database>(url, key, {
    auth: {
      storage: undefined,
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function getSupabaseServer() {
  const { url, publishableKey } = getServerSupabaseEnv();
  return createServerClient(url, publishableKey);
}

export function hasSupabaseServiceRole() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const url = getSupabaseUrlFromEnv(process.env);
  return Boolean(url && serviceRoleKey);
}

/** Prefer service role for trusted server writes; falls back to publishable key. */
export function getSupabaseServerForWrites() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const url = getSupabaseUrlFromEnv(process.env);

  if (url && serviceRoleKey) {
    return createServerClient(url, serviceRoleKey);
  }

  return getSupabaseServer();
}
