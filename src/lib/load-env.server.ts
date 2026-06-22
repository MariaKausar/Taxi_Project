import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { config as loadDotenv } from "dotenv";

let loaded = false;

function getProjectRoot() {
  const fromCwd = resolve(process.cwd(), ".env");
  if (existsSync(fromCwd)) {
    return resolve(process.cwd());
  }

  const moduleDir = fileURLToPath(new URL(".", import.meta.url));
  return resolve(moduleDir, "../..");
}

export function ensureServerEnv() {
  if (loaded) return;
  loaded = true;

  if (!process.versions?.node) return;

  const envPath = resolve(getProjectRoot(), ".env");
  if (!existsSync(envPath)) return;

  loadDotenv({ path: envPath, override: true });
}
