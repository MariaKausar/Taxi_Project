import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { resolve } from "node:path";

config({ path: resolve(process.cwd(), ".env") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error("FAIL: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key);

const testRow = {
  pickup: "Test pickup (delete me)",
  destination: "Test destination",
  customer_email: "test@example.com",
  customer_phone: "1234567890",
  owner_notification_emails: "taxiteamesslingen@yahoo.com",
  owner_email_status: "pending",
};

const { error: fullError } = await supabase.from("bookings").insert(testRow);

if (!fullError) {
  console.log("OK: Full booking insert succeeded (anon key)");
  process.exit(0);
}

console.warn("Full insert failed:", fullError.message);

const { owner_notification_emails: _a, owner_email_status: _b, ...basic } =
  testRow;
const { error: basicError } = await supabase.from("bookings").insert(basic);

if (!basicError) {
  console.log("OK: Basic booking insert succeeded (owner columns may be missing)");
  process.exit(0);
}

console.error("FAIL: Basic insert also failed:", basicError.message);
process.exit(1);
