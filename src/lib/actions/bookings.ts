"use server";

import { z } from "zod";

import {
  getOwnerNotificationEmails,
  sendBookingOwnerEmail,
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

function bookingSaveError(error: {
  message?: string;
  code?: string;
  hint?: string;
}) {
  const detail = [error.message, error.code, error.hint]
    .filter(Boolean)
    .join(" — ");
  throw new Error(
    process.env.NODE_ENV === "production"
      ? "Failed to save booking"
      : `Failed to save booking: ${detail}`,
  );
}

export async function createBooking(data: BookingInput) {
  const parsed = bookingInput.parse(data);
  const supabase = getSupabaseServerForWrites();
  const ownerEmails = getOwnerNotificationEmails().join(", ");
  const useServiceRole = hasSupabaseServiceRole();

  const row = {
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
    owner_email_status: "pending",
  };

  let bookingId: string | undefined;

  if (useServiceRole) {
    const { data: saved, error } = await supabase
      .from("bookings")
      .insert(row)
      .select("id")
      .single();

    const id = saved?.id;
    if (error || !id) {
      console.error("[createBooking]", error ?? "Missing booking id after insert");
      bookingSaveError(error ?? { message: "Missing booking id after insert" });
    }

    bookingId = id;
  } else {
    let { error } = await supabase.from("bookings").insert(row);

    if (error && isMissingOwnerTrackingColumns(error)) {
      console.warn(
        "[createBooking] Owner tracking columns missing — saving core booking fields only.",
      );
      ({ error } = await supabase
        .from("bookings")
        .insert(stripOwnerTrackingFields(row)));
    }

    if (error) {
      console.error("[createBooking]", error);
      bookingSaveError(error);
    }
  }

  const emailResult = await sendOwnerEmailSafely(
    sendBookingOwnerEmail,
    parsed,
    "createBooking",
  );

  if (bookingId && useServiceRole) {
    const { error } = await supabase
      .from("bookings")
      .update(ownerEmailPatchFromResult(emailResult))
      .eq("id", bookingId);

    if (error) {
      console.warn("[createBooking] Could not update owner email status:", error);
    }
  }

  if (!emailResult.sent) {
    console.warn(
      "[createBooking] Booking saved but owner email was not sent.",
      emailResult.detail ?? emailResult.reason,
    );
  }

  return { success: true as const };
}
