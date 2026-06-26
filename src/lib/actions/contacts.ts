"use server";

import { z } from "zod";

import {
  getOwnerNotificationEmails,
  sendContactOwnerEmail,
} from "@/lib/email.server";
import { getSupabaseServerForWrites } from "@/lib/supabase.server";

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

export async function createContactMessage(data: ContactInput) {
  const parsed = contactInput.parse(data);
  const supabase = getSupabaseServerForWrites();
  const ownerEmails = getOwnerNotificationEmails().join(", ");

  const emailResult = await sendContactOwnerEmail(parsed);

  const { error } = await supabase.from("contact_messages").insert({
    customer_name: parsed.customer_name,
    customer_phone: parsed.customer_phone,
    customer_email: parsed.customer_email,
    message: parsed.message,
    owner_notification_emails: ownerEmails,
    owner_email_sent_at: emailResult.sent ? new Date().toISOString() : null,
    owner_email_status: emailResult.sent ? "sent" : "failed",
    owner_email_provider: emailResult.sent ? emailResult.provider : null,
  });

  if (error) {
    console.error("[createContactMessage]", error);
    const detail = [error.message, error.code, error.hint]
      .filter(Boolean)
      .join(" — ");
    throw new Error(
      process.env.NODE_ENV === "production"
        ? "Failed to save message"
        : `Failed to save message: ${detail}`,
    );
  }

  if (!emailResult.sent) {
    console.warn(
      "[createContactMessage] Message saved but owner email was not sent.",
      emailResult.detail ?? emailResult.reason,
    );
  }

  return { success: true as const };
}
