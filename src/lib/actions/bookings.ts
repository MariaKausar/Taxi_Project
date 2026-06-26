"use server";

import { z } from "zod";

import {
  getOwnerNotificationEmails,
  sendBookingOwnerEmail,
} from "@/lib/email.server";
import { getSupabaseServerForWrites } from "@/lib/supabase.server";

const bookingInput = z.object({
  pickup: z.string().min(1),
  destination: z.string().min(1),
  pickup_date: z
    .string()
    .nullable()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");
        return value >= `${year}-${month}-${day}`;
      },
      { message: "Pickup date cannot be in the past" },
    ),
  pickup_time: z.string().nullable().optional(),
  passengers: z.number().int().min(1).max(4).nullable().optional(),
  luggage: z.number().int().min(0).max(4).nullable().optional(),
  customer_name: z.string().nullable().optional(),
  customer_phone: z
    .string()
    .nullable()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        const digits = value.replace(/\D/g, "").length;
        return digits >= 6 && digits <= 15;
      },
      { message: "Phone number must contain 6–15 digits" },
    ),
  customer_email: z.string().email(),
  notes: z.string().nullable().optional(),
});

export type BookingInput = z.infer<typeof bookingInput>;

function ownerEmailsValue() {
  return getOwnerNotificationEmails().join(", ");
}

export async function createBooking(data: BookingInput) {
  const parsed = bookingInput.parse(data);
  const supabase = getSupabaseServerForWrites();
  const ownerEmails = ownerEmailsValue();

  const emailResult = await sendBookingOwnerEmail(parsed);

  const { error } = await supabase.from("bookings").insert({
    pickup: parsed.pickup,
    destination: parsed.destination,
    pickup_date: parsed.pickup_date ?? null,
    pickup_time: parsed.pickup_time ?? null,
    passengers: parsed.passengers ?? null,
    luggage: parsed.luggage ?? null,
    customer_name: parsed.customer_name ?? null,
    customer_phone: parsed.customer_phone ?? null,
    customer_email: parsed.customer_email,
    notes: parsed.notes ?? null,
    owner_notification_emails: ownerEmails,
    owner_email_sent_at: emailResult.sent ? new Date().toISOString() : null,
    owner_email_status: emailResult.sent ? "sent" : "failed",
    owner_email_provider: emailResult.sent ? emailResult.provider : null,
  });

  if (error) {
    console.error("[createBooking]", error);
    const detail = [error.message, error.code, error.hint]
      .filter(Boolean)
      .join(" — ");
    throw new Error(
      process.env.NODE_ENV === "production"
        ? "Failed to save booking"
        : `Failed to save booking: ${detail}`,
    );
  }

  if (!emailResult.sent) {
    console.warn(
      "[createBooking] Booking saved but owner email was not sent.",
      emailResult.detail ?? emailResult.reason,
    );
  }

  return { success: true as const };
}
