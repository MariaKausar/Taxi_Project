import nodemailer from "nodemailer";

type BookingEmailPayload = {
  pickup: string;
  destination: string;
  pickup_date?: string | null;
  pickup_time?: string | null;
  passengers?: number | null;
  luggage?: number | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  customer_email?: string | null;
  notes?: string | null;
};

type EmailResult =
  | { sent: true }
  | { sent: false; reason: "missing_config" | "provider_error"; detail?: string };

const DEFAULT_OWNER_EMAIL = "taxiteamesslingen@yahoo.com";

function getOwnerEmail() {
  return process.env.BOOKING_OWNER_EMAIL?.trim() || DEFAULT_OWNER_EMAIL;
}

function getEmailProvider() {
  const configured = process.env.EMAIL_PROVIDER?.trim().toLowerCase();
  if (configured === "yahoo" || configured === "resend") return configured;
  if (process.env.YAHOO_SMTP_APP_PASSWORD) return "yahoo";
  if (process.env.RESEND_API_KEY) return "resend";
  return null;
}

function formatValue(value: string | number | null | undefined) {
  if (value == null || value === "") return "—";
  return String(value);
}

function buildBookingEmailHtml(data: BookingEmailPayload) {
  const rows = [
    ["Pickup", data.pickup],
    ["Destination", data.destination],
    ["Date", data.pickup_date],
    ["Time", data.pickup_time],
    ["Passengers", data.passengers],
    ["Luggage", data.luggage],
    ["Name", data.customer_name],
    ["Phone", data.customer_phone],
    ["Email", data.customer_email],
    ["Notes", data.notes],
  ];

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:8px 12px;border:1px solid #e5e7eb;font-weight:600;">${label}</td><td style="padding:8px 12px;border:1px solid #e5e7eb;">${formatValue(value)}</td></tr>`,
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;color:#111827;max-width:640px;">
      <h2 style="margin:0 0 12px;">New taxi booking</h2>
      <p style="margin:0 0 16px;color:#4b5563;">A new booking was submitted on Taxi Team Esslingen.</p>
      <table style="border-collapse:collapse;width:100%;font-size:14px;">${tableRows}</table>
    </div>
  `;
}

function buildBookingSubject(data: BookingEmailPayload) {
  return `New booking: ${data.pickup} → ${data.destination}`;
}

async function sendViaResend(
  data: BookingEmailPayload,
  ownerEmail: string,
): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL?.trim() || "onboarding@resend.dev";

  if (!apiKey) {
    return {
      sent: false,
      reason: "missing_config",
      detail: "RESEND_API_KEY is not set.",
    };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [ownerEmail],
      reply_to: ownerEmail,
      subject: buildBookingSubject(data),
      html: buildBookingEmailHtml(data),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("[email] Resend error:", response.status, body);
    return { sent: false, reason: "provider_error", detail: body };
  }

  return { sent: true };
}

async function sendViaYahoo(
  data: BookingEmailPayload,
  ownerEmail: string,
): Promise<EmailResult> {
  const user =
    process.env.YAHOO_SMTP_USER?.trim() || DEFAULT_OWNER_EMAIL;
  const appPassword = process.env.YAHOO_SMTP_APP_PASSWORD?.trim();

  if (!appPassword) {
    return {
      sent: false,
      reason: "missing_config",
      detail:
        "YAHOO_SMTP_APP_PASSWORD is not set. Create a Yahoo app password and add it to .env.",
    };
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.mail.yahoo.com",
    port: 587,
    secure: false,
    auth: {
      user,
      pass: appPassword,
    },
  });

  try {
    await transporter.sendMail({
      from: `Taxi Team Esslingen <${user}>`,
      to: ownerEmail,
      replyTo: user,
      subject: buildBookingSubject(data),
      html: buildBookingEmailHtml(data),
    });
    return { sent: true };
  } catch (error) {
    const detail =
      error instanceof Error ? error.message : "Unknown Yahoo SMTP error";
    console.error("[email] Yahoo SMTP error:", detail);
    return { sent: false, reason: "provider_error", detail };
  }
}

export async function sendBookingOwnerEmail(
  data: BookingEmailPayload,
): Promise<EmailResult> {
  const ownerEmail = getOwnerEmail();
  const provider = getEmailProvider();

  if (!provider) {
    console.warn(
      "[email] Skipping owner notification — configure Yahoo SMTP or Resend in .env.",
    );
    return {
      sent: false,
      reason: "missing_config",
      detail: "No email provider configured.",
    };
  }

  if (provider === "yahoo") {
    return sendViaYahoo(data, ownerEmail);
  }

  return sendViaResend(data, ownerEmail);
}
