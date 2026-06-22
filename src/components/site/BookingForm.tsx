"use client";

import { useEffect, useState } from "react";
import { MapPin, Calendar, Users, Briefcase, ArrowRight, Check, User, Phone } from "lucide-react";
import { createBooking } from "@/lib/actions/bookings";
import { useT } from "@/i18n/LanguageContext";

interface Props { compact?: boolean }

const MIN_PHONE_DIGITS = 6;
const MAX_PHONE_DIGITS = 15;

const initialFormState = {
  pickup: "",
  dest: "",
  date: "",
  time: "",
  passengers: "1",
  luggage: "0",
  name: "",
  phone: "",
};

function getLocalDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function countPhoneDigits(value: string) {
  return value.replace(/\D/g, "").length;
}

function sanitizePhoneInput(value: string) {
  const cleaned = value.replace(/[^\d+\s()-]/g, "");
  let digits = 0;
  let result = "";

  for (const char of cleaned) {
    if (/\d/.test(char)) {
      if (digits >= MAX_PHONE_DIGITS) continue;
      digits += 1;
    }
    result += char;
  }

  return result;
}

function isPickupInPast(date: string, time: string) {
  const pickupAt = new Date(`${date}T${time || "00:00"}`);
  return pickupAt < new Date();
}

export function BookingForm({ compact = false }: Props) {
  const { t } = useT();
  const [minPickupDate, setMinPickupDate] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickup, setPickup] = useState(initialFormState.pickup);
  const [dest, setDest] = useState(initialFormState.dest);
  const [date, setDate] = useState(initialFormState.date);
  const [time, setTime] = useState(initialFormState.time);
  const [passengers, setPassengers] = useState(initialFormState.passengers);
  const [luggage, setLuggage] = useState(initialFormState.luggage);
  const [name, setName] = useState(initialFormState.name);
  const [phone, setPhone] = useState(initialFormState.phone);

  useEffect(() => {
    setMinPickupDate(getLocalDateString());
  }, []);

  function resetForm() {
    setSubmitted(false);
    setSubmitting(false);
    setError(null);
    setPickup(initialFormState.pickup);
    setDest(initialFormState.dest);
    setDate(initialFormState.date);
    setTime(initialFormState.time);
    setPassengers(initialFormState.passengers);
    setLuggage(initialFormState.luggage);
    setName(initialFormState.name);
    setPhone(initialFormState.phone);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting || submitted) return;

    const phoneDigits = countPhoneDigits(phone);
    if (phoneDigits < MIN_PHONE_DIGITS || phoneDigits > MAX_PHONE_DIGITS) {
      setError(t("bf_phone_invalid"));
      return;
    }

    if (minPickupDate && date < minPickupDate) {
      setError(t("bf_date_past"));
      return;
    }

    if (minPickupDate && isPickupInPast(date, time)) {
      setError(t("bf_time_past"));
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      await createBooking({
        pickup,
        destination: dest,
        pickup_date: date || null,
        pickup_time: time || null,
        passengers: passengers ? Number(passengers) : null,
        luggage: luggage ? Number(luggage) : null,
        customer_name: name || null,
        customer_phone: phone || null,
      });
    } catch {
      setSubmitting(false);
      setError(t("bf_error"));
      return;
    }
    setSubmitting(false);
    setSubmitted(true);
  }

  return (
    <div className={`rounded-3xl bg-card p-5 shadow-elevated ring-1 ring-border sm:p-7 ${compact ? "" : ""}`}>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-foreground">{t("bf_title")}</h3>
        <span className="rounded-full bg-brand/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-foreground">
          24/7
        </span>
      </div>

      {submitted ? (
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-2xl bg-secondary p-4 text-sm">
            <Check className="h-5 w-5 shrink-0 text-brand-foreground" />
            <span className="font-medium text-foreground">{t("bf_success")}</span>
          </div>
          <button
            type="button"
            onClick={resetForm}
            className="w-full rounded-xl border border-input bg-background px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
          >
            {t("bf_another")}
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3">
          <Field icon={<MapPin className="h-4 w-4 text-brand" />} label={t("bf_pickup")}>
            <input value={pickup} onChange={(e) => setPickup(e.target.value)} required disabled={submitting} placeholder={t("bf_pickup_ph")} className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-60" />
          </Field>
          <Field icon={<MapPin className="h-4 w-4" />} label={t("bf_dest")}>
            <input value={dest} onChange={(e) => setDest(e.target.value)} required disabled={submitting} placeholder={t("bf_dest_ph")} className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-60" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field icon={<Calendar className="h-4 w-4" />} label={t("bf_date")}>
              <input
                type="date"
                value={date}
                min={minPickupDate || undefined}
                onChange={(e) => {
                  const next = e.target.value;
                  if (minPickupDate && next && next < minPickupDate) return;
                  setDate(next);
                }}
                required
                disabled={submitting}
                className="w-full bg-transparent text-sm font-medium text-foreground focus:outline-none disabled:opacity-60"
              />
            </Field>
            <Field icon={<Calendar className="h-4 w-4" />} label={t("bf_time")}>
              <input type="time" value={time} onChange={(e) => setTime(e.target.value)} required disabled={submitting} className="w-full bg-transparent text-sm font-medium text-foreground focus:outline-none disabled:opacity-60" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field icon={<Users className="h-4 w-4" />} label={t("bf_passengers")}>
              <select value={passengers} onChange={(e) => setPassengers(e.target.value)} disabled={submitting} className="w-full bg-transparent text-sm font-medium text-foreground focus:outline-none disabled:opacity-60">
                {[1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </Field>
            <Field icon={<Briefcase className="h-4 w-4" />} label={t("bf_luggage")}>
              <select value={luggage} onChange={(e) => setLuggage(e.target.value)} disabled={submitting} className="w-full bg-transparent text-sm font-medium text-foreground focus:outline-none disabled:opacity-60">
                {[0, 1, 2, 3, 4].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </Field>
          </div>
          <Field icon={<User className="h-4 w-4" />} label={t("bf_name")}>
            <input value={name} onChange={(e) => setName(e.target.value)} required disabled={submitting} placeholder={t("bf_name_ph")} className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-60" />
          </Field>
          <Field icon={<Phone className="h-4 w-4" />} label={t("bf_phone")}>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(sanitizePhoneInput(e.target.value))}
              required
              disabled={submitting}
              inputMode="tel"
              autoComplete="tel"
              maxLength={24}
              placeholder="+49…"
              className="w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-60"
            />
          </Field>

          <button
            type="submit"
            disabled={submitting}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition-all hover:shadow-elevated disabled:opacity-60 disabled:pointer-events-none"
          >
            {submitting ? t("bf_sending") : t("bf_submit")}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </form>
      )}

      {error && (
        <div className="mt-5 rounded-2xl bg-destructive/10 p-4 text-sm font-medium text-destructive">{error}</div>
      )}
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-3 rounded-xl border border-input bg-background px-4 py-2.5 transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/30">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
        {children}
      </div>
    </label>
  );
}
