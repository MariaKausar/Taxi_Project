import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { sendBookingOwnerEmail } from "../email.server";
import { getSupabaseServerForWrites } from "../supabase.server";

const bookingInput = z.object({
  pickup: z.string().min(1),
  destination: z.string().min(1),
  pickup_date: z.string().nullable().optional(),
  pickup_time: z.string().nullable().optional(),
  passengers: z.number().int().min(1).max(4).nullable().optional(),
  luggage: z.number().int().min(0).max(4).nullable().optional(),
  customer_name: z.string().nullable().optional(),
  customer_phone: z.string().nullable().optional(),
  customer_email: z.string().email().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export const createBooking = createServerFn({ method: "POST" })
  .inputValidator(bookingInput)
  .handler(async ({ data }) => {
    const supabase = getSupabaseServerForWrites();

    const { error } = await supabase.from("bookings").insert({
      pickup: data.pickup,
      destination: data.destination,
      pickup_date: data.pickup_date ?? null,
      pickup_time: data.pickup_time ?? null,
      passengers: data.passengers ?? null,
      luggage: data.luggage ?? null,
      customer_name: data.customer_name ?? null,
      customer_phone: data.customer_phone ?? null,
      customer_email: data.customer_email ?? null,
      notes: data.notes ?? null,
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

    const emailResult = await sendBookingOwnerEmail(data);
    if (!emailResult.sent) {
      console.warn(
        "[createBooking] Booking saved but owner email was not sent.",
        emailResult.detail ?? emailResult.reason,
      );
    }

    return { success: true as const };
  });
