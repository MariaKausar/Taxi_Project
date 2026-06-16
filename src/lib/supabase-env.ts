type EnvRecord = Record<string, string | undefined>;

function firstDefined(...values: (string | undefined)[]): string | undefined {
  return values.find((value) => value != null && value !== "");
}

export function getSupabaseUrlFromEnv(env: EnvRecord): string | undefined {
  return firstDefined(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.VITE_SUPABASE_URL,
    env.SUPABASE_URL,
  );
}

export function getSupabasePublishableKeyFromEnv(
  env: EnvRecord,
): string | undefined {
  return firstDefined(
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    env.VITE_SUPABASE_PUBLISHABLE_KEY,
    env.SUPABASE_PUBLISHABLE_KEY,
  );
}

export function getClientSupabaseEnv(): {
  url: string | undefined;
  publishableKey: string | undefined;
} {
  const env = import.meta.env as EnvRecord;

  return {
    url: getSupabaseUrlFromEnv(env),
    publishableKey: getSupabasePublishableKeyFromEnv(env),
  };
}

export function getServerSupabaseEnv(): { url: string; publishableKey: string } {
  const url = getSupabaseUrlFromEnv(process.env);
  const publishableKey = getSupabasePublishableKeyFromEnv(process.env);

  if (!url || !publishableKey) {
    const missing = [
      ...(!url
        ? [
            "NEXT_PUBLIC_SUPABASE_URL",
            "VITE_SUPABASE_URL",
            "SUPABASE_URL",
          ]
        : []),
      ...(!publishableKey
        ? [
            "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
            "VITE_SUPABASE_PUBLISHABLE_KEY",
            "SUPABASE_PUBLISHABLE_KEY",
          ]
        : []),
    ];
    throw new Error(
      `Missing Supabase environment variable(s). Set one of: ${missing.join(", ")}.`,
    );
  }

  return { url, publishableKey };
}
