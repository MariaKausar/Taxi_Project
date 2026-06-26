import type { PostgrestError } from "@supabase/supabase-js";

import type { EmailResult } from "@/lib/email.server";

export function isMissingOwnerTrackingColumns(error: PostgrestError) {
  const text = [error.message, error.details, error.hint].filter(Boolean).join(" ");
  return (
    error.code === "PGRST204" ||
    /owner_(email|notification)/i.test(text) ||
    /column.*does not exist/i.test(text)
  );
}

export function stripOwnerTrackingFields<
  T extends Record<string, unknown>,
>(row: T) {
  const {
    owner_notification_emails: _a,
    owner_email_sent_at: _b,
    owner_email_status: _c,
    owner_email_provider: _d,
    ...rest
  } = row;
  return rest;
}

export function ownerEmailPatchFromResult(emailResult: EmailResult) {
  if (emailResult.sent) {
    return {
      owner_email_sent_at: new Date().toISOString(),
      owner_email_status: "sent" as const,
      owner_email_provider: emailResult.provider,
    };
  }

  return {
    owner_email_sent_at: null,
    owner_email_status: "failed" as const,
    owner_email_provider: null,
  };
}

export async function sendOwnerEmailSafely<T>(
  send: (data: T) => Promise<EmailResult>,
  data: T,
  logLabel: string,
): Promise<EmailResult> {
  try {
    return await send(data);
  } catch (error) {
    const detail = error instanceof Error ? error.message : String(error);
    console.error(`[${logLabel}] Unexpected email error:`, detail);
    return { sent: false, reason: "provider_error", detail };
  }
}
