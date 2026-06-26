"use server";

import { z } from "zod";

import {
  getOwnerNotificationEmails,
  sendContactOwnerEmail,
} from "@/lib/email.server";
import {
  isMissingOwnerTrackingColumns,
  ownerEmailPatchFromResult,
  sendOwnerEmailSafely,
  stripOwnerTrackingFields,
} from "@/lib/form-db.server";
import {
  getSupabaseServerForWrites,
  hasSupabaseServiceRole,
} from "@/lib/supabase.server";

const contactInput = z.object({
  customer_name: z.string().min(1),
  customer_phone: z
    .string()
    .min(1)
    .refine((value) => {
      const digits = value.replace(/\D/g, "").length;
      return digits >= 6 && digits <= 15;
    }, "Phone number must contain 6–15 digits"),
  customer_email: z.string().email(),
  message: z.string().min(1),
});

export type ContactInput = z.infer<typeof contactInput>;

function contactSaveError(error: {
  message?: string;
  code?: string;
  hint?: string;
}) {
  const detail = [error.message, error.code, error.hint]
    .filter(Boolean)
    .join(" — ");
  throw new Error(
    process.env.NODE_ENV === "production"
      ? "Failed to save message"
      : `Failed to save message: ${detail}`,
  );
}

export async function createContactMessage(data: ContactInput) {
  const parsed = contactInput.parse(data);
  const supabase = getSupabaseServerForWrites();
  const ownerEmails = getOwnerNotificationEmails().join(", ");
  const useServiceRole = hasSupabaseServiceRole();

  const row = {
    customer_name: parsed.customer_name,
    customer_phone: parsed.customer_phone,
    customer_email: parsed.customer_email,
    message: parsed.message,
    owner_notification_emails: ownerEmails,
    owner_email_status: "pending",
  };

  let messageId: string | undefined;

  if (useServiceRole) {
    const { data: saved, error } = await supabase
      .from("contact_messages")
      .insert(row)
      .select("id")
      .single();

    const id = saved?.id;
    if (error || !id) {
      console.error(
        "[createContactMessage]",
        error ?? "Missing message id after insert",
      );
      contactSaveError(
        error ?? { message: "Missing message id after insert" },
      );
    }

    messageId = id;
  } else {
    let { error } = await supabase.from("contact_messages").insert(row);

    if (error && isMissingOwnerTrackingColumns(error)) {
      console.warn(
        "[createContactMessage] Owner tracking columns missing — saving core message fields only.",
      );
      ({ error } = await supabase
        .from("contact_messages")
        .insert(stripOwnerTrackingFields(row)));
    }

    if (error) {
      console.error("[createContactMessage]", error);
      contactSaveError(error);
    }
  }

  const emailResult = await sendOwnerEmailSafely(
    sendContactOwnerEmail,
    parsed,
    "createContactMessage",
  );

  if (messageId && useServiceRole) {
    const { error } = await supabase
      .from("contact_messages")
      .update(ownerEmailPatchFromResult(emailResult))
      .eq("id", messageId);

    if (error) {
      console.warn(
        "[createContactMessage] Could not update owner email status:",
        error,
      );
    }
  }

  if (!emailResult.sent) {
    console.warn(
      "[createContactMessage] Message saved but owner email was not sent.",
      emailResult.detail ?? emailResult.reason,
    );
  }

  return { success: true as const };
}
