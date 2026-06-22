import nodemailer from "nodemailer";

import { ensureServerEnv } from "./load-env.server";

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
  | { sent: true; provider: "smtp" | "mailchannels" | "resend" }
  | {
      sent: false;
      reason: "missing_config" | "provider_error";
      detail?: string;
    };

const DEFAULT_OWNER_EMAIL = "taxiteamesslingen@yahoo.com";
const DEFAULT_FROM_EMAIL = "booking@taxiteamesslingen.cab";

function getOwnerEmails(): string[] {
  const configured =
    process.env.BOOKING_OWNER_EMAIL?.trim() || DEFAULT_OWNER_EMAIL;

  const emails = configured
    .split(/[,;]/)
    .map((email) => email.trim())
    .filter(Boolean);

  return emails.length > 0 ? emails : [DEFAULT_OWNER_EMAIL];
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST?.trim() || "mail.privateemail.com";
  const port = Number(process.env.SMTP_PORT || "465");
  const user =
    process.env.SMTP_USER?.trim() ||
    process.env.SMTP_FROM_EMAIL?.trim() ||
    DEFAULT_FROM_EMAIL;
  const password = process.env.SMTP_PASSWORD?.trim();
  const fromEmail = process.env.SMTP_FROM_EMAIL?.trim() || user;

  return { host, port, user, password, fromEmail };
}

function isEdgeRuntime() {
  if (process.versions?.node) {
    return false;
  }

  return (
    process.env.CF_PAGES === "1" ||
    process.env.CLOUDFLARE_PAGES === "1" ||
    process.env.NITRO_PRESET === "cloudflare" ||
    process.env.NITRO_PRESET === "cloudflare_pages" ||
    process.env.NITRO_PRESET === "cloudflare_module"
  );
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

function createSmtpTransport(
  host: string,
  port: number,
  user: string,
  password: string,
) {
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: { user, pass: password },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
}

async function sendViaSmtp(
  data: BookingEmailPayload,
  ownerEmails: string[],
  fromEmail: string,
  host: string,
  port: number,
  user: string,
  password: string,
): Promise<EmailResult> {
  const subject = buildBookingSubject(data);
  const html = buildBookingEmailHtml(data);
  const portsToTry = port === 465 ? [465, 587] : [port];

  let lastError = "Unknown SMTP error";

  for (const attemptPort of portsToTry) {
    const transporter = createSmtpTransport(host, attemptPort, user, password);

    try {
      await transporter.verify();
      await transporter.sendMail({
        from: `Taxi Team Esslingen <${fromEmail}>`,
        to: ownerEmails,
        replyTo: fromEmail,
        subject,
        html,
      });
      return { sent: true, provider: "smtp" };
    } catch (error) {
      lastError = error instanceof Error ? error.message : lastError;
      console.error(
        `[email] SMTP error on port ${attemptPort}:`,
        lastError,
      );
    }
  }

  return { sent: false, reason: "provider_error", detail: lastError };
}

function getResendFromEmail(fallbackFromEmail: string) {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() ||
    process.env.SMTP_FROM_EMAIL?.trim() ||
    fallbackFromEmail
  );
}

async function sendViaResend(
  data: BookingEmailPayload,
  ownerEmails: string[],
  fromEmail: string,
): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return {
      sent: false,
      reason: "missing_config",
      detail: "RESEND_API_KEY is not set",
    };
  }

  const subject = buildBookingSubject(data);
  const html = buildBookingEmailHtml(data);
  const sender = getResendFromEmail(fromEmail);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Taxi Team Esslingen <${sender}>`,
      to: ownerEmails,
      reply_to: sender,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("[email] Resend error:", response.status, body);
    return {
      sent: false,
      reason: "provider_error",
      detail: body || `Resend HTTP ${response.status}`,
    };
  }

  return { sent: true, provider: "resend" };
}

async function sendViaMailchannels(
  data: BookingEmailPayload,
  ownerEmails: string[],
  fromEmail: string,
): Promise<EmailResult> {
  const subject = buildBookingSubject(data);
  const html = buildBookingEmailHtml(data);

  const response = await fetch("https://api.mailchannels.net/tx/v1/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      personalizations: [
        { to: ownerEmails.map((email) => ({ email })) },
      ],
      from: { email: fromEmail, name: "Taxi Team Esslingen" },
      reply_to: { email: fromEmail, name: "Taxi Team Esslingen" },
      subject,
      content: [{ type: "text/html", value: html }],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("[email] Mailchannels error:", response.status, body);
    return {
      sent: false,
      reason: "provider_error",
      detail: body || `Mailchannels HTTP ${response.status}`,
    };
  }

  return { sent: true, provider: "mailchannels" };
}

async function sendViaHttpProviders(
  data: BookingEmailPayload,
  ownerEmails: string[],
  fromEmail: string,
): Promise<EmailResult> {
  const resendResult = await sendViaResend(data, ownerEmails, fromEmail);
  if (resendResult.sent) {
    return resendResult;
  }

  if (resendResult.reason !== "missing_config") {
    console.warn(
      "[email] Resend failed — trying Mailchannels.",
      resendResult.detail,
    );
  }

  return sendViaMailchannels(data, ownerEmails, fromEmail);
}

export async function sendBookingOwnerEmail(
  data: BookingEmailPayload,
): Promise<EmailResult> {
  ensureServerEnv();

  const ownerEmails = getOwnerEmails();
  const { host, port, user, password, fromEmail } = getSmtpConfig();
  const onEdge = isEdgeRuntime();

  console.info(
    `[email] Sending booking notification from ${fromEmail} to ${ownerEmails.join(", ")}`,
  );

  if (onEdge || !password) {
    if (!password) {
      console.warn(
        "[email] SMTP_PASSWORD is not set — using HTTP email provider.",
      );
    } else {
      console.info("[email] Edge runtime detected — using HTTP email provider.");
    }

    return sendViaHttpProviders(data, ownerEmails, fromEmail);
  }

  const smtpResult = await sendViaSmtp(
    data,
    ownerEmails,
    fromEmail,
    host,
    port,
    user,
    password,
  );

  if (smtpResult.sent) {
    return smtpResult;
  }

  console.warn("[email] SMTP failed — trying HTTP email providers.");
  return sendViaHttpProviders(data, ownerEmails, fromEmail);
}
