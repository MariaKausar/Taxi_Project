import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { config as loadDotenv } from "dotenv";

let loaded = false;

export function ensureServerEnv() {
  if (loaded) return;
  loaded = true;

  // Next.js loads .env automatically at build/runtime.
  if (process.env.NEXT_RUNTIME) return;
  if (!process.versions?.node) return;

  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;

  loadDotenv({ path: envPath, override: true });
}
