"use client";

import { Phone, Mail, MapPin, Clock, Send } from "lucide-react";
import { useState } from "react";

import { createContactMessage } from "@/lib/actions/contacts";
import { Layout } from "@/components/site/Layout";
import { Section, SectionHeader } from "@/components/site/Section";
import { useT } from "@/i18n/LanguageContext";

const initialFormState = {
  name: "",
  phone: "",
  email: "",
  message: "",
};

function sanitizePhoneInput(value: string) {
  const cleaned = value.replace(/[^\d+\s()-]/g, "");
  let digits = 0;
  let result = "";

  for (const char of cleaned) {
    if (/\d/.test(char)) {
      if (digits >= 15) continue;
      digits += 1;
    }
    result += char;
  }

  return result;
}

export function ContactPage() {
  const { t } = useT();
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState(initialFormState.name);
  const [phone, setPhone] = useState(initialFormState.phone);
  const [email, setEmail] = useState(initialFormState.email);
  const [message, setMessage] = useState(initialFormState.message);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting || sent) return;

    setSubmitting(true);
    setError(null);

    try {
      await createContactMessage({
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        customer_email: email.trim(),
        message: message.trim(),
      });
    } catch {
      setSubmitting(false);
      setError(t("contact_error"));
      return;
    }

    setSubmitting(false);
    setSent(true);
  }

  return (
    <Layout>
      <Section className="bg-secondary/40 pt-14 sm:pt-20">
        <SectionHeader eyebrow={t("contact_eyebrow")} title={t("contact_title")} description={t("contact_desc")} />
      </Section>

      <Section className="pt-0">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="space-y-4">
            <InfoRow icon={Phone} title={t("contact_phone_t")} value="+49 1785 183559" href="tel:+491785183559" />
            <InfoRow icon={Mail} title={t("contact_email_t")} value="taxiteamesslingen@yahoo.com" href="mailto:taxiteamesslingen@yahoo.com" />
            <InfoRow icon={MapPin} title={t("contact_addr1_t")} value="Vogelsangstraße 9, 73760 Ostfildern" />
            <InfoRow icon={MapPin} title={t("contact_addr2_t")} value="Plochinger Str. 95, 73730 Esslingen am Neckar" />
            <InfoRow icon={Clock} title={t("contact_hours_t")} value={t("contact_hours_v")} />

            <div className="overflow-hidden rounded-2xl border border-border shadow-soft">
              <iframe
                title="Esslingen am Neckar"
                src="https://www.openstreetmap.org/export/embed.html?bbox=9.27%2C48.71%2C9.36%2C48.77&layer=mapnik&marker=48.7426%2C9.3201"
                className="h-72 w-full"
                loading="lazy"
              />
            </div>
          </div>

          <form onSubmit={onSubmit} className="rounded-3xl border border-border bg-card p-7 shadow-soft">
            <h3 className="font-display text-xl font-bold text-foreground">{t("contact_form_title")}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t("contact_form_desc")}</p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Input
                label={t("contact_name")}
                placeholder="Max Mustermann"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={submitting || sent}
              />
              <Input
                label={t("contact_phone")}
                type="tel"
                placeholder="+49…"
                value={phone}
                onChange={(e) => setPhone(sanitizePhoneInput(e.target.value))}
                required
                disabled={submitting || sent}
                inputMode="tel"
                autoComplete="tel"
                maxLength={24}
              />
            </div>
            <Input
              className="mt-4"
              label={t("contact_email")}
              type="email"
              placeholder="ihre@email.de"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={submitting || sent}
              autoComplete="email"
            />
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("contact_message")}
              </label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={submitting || sent}
                placeholder={t("contact_message_ph")}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:opacity-60"
              />
            </div>
            <button
              type="submit"
              disabled={submitting || sent}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              <Send className="h-4 w-4" /> {submitting ? t("bf_sending") : t("contact_send")}
            </button>
            {sent && (
              <p className="mt-3 rounded-lg bg-brand/15 px-4 py-2 text-sm font-medium text-brand-foreground">{t("contact_sent")}</p>
            )}
            {error && (
              <p className="mt-3 rounded-lg bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive">{error}</p>
            )}
          </form>
        </div>
      </Section>
    </Layout>
  );
}

function InfoRow({
  icon: Icon,
  title,
  value,
  href,
}: {
  icon: typeof Phone;
  title: string;
  value: string;
  href?: string;
}) {
  const Wrapper = href ? "a" : "div";
  return (
    <Wrapper href={href} className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:border-brand">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-brand text-brand-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</div>
        <div className="font-semibold text-foreground">{value}</div>
      </div>
    </Wrapper>
  );
}

function Input({
  label,
  className = "",
  ...props
}: { label: string; className?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <input
        {...props}
        className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
      />
    </div>
  );
}
