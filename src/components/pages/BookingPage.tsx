"use client";

import { Check, CreditCard, Shield, Clock } from "lucide-react";

import { Layout } from "@/components/site/Layout";
import { Section, SectionHeader } from "@/components/site/Section";
import { BookingForm } from "@/components/site/BookingForm";
import { useT } from "@/i18n/LanguageContext";

export function BookingPage() {
  const { t } = useT();
  return (
    <Layout>
      <Section className="bg-secondary/40 pt-14 pb-10 sm:pt-20">
        <SectionHeader eyebrow={t("booking_eyebrow")} title={t("booking_title")} description={t("booking_desc")} />
      </Section>

      <Section className="pt-0">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <BookingForm />
          <aside className="space-y-4">
            <InfoCard icon={Clock} title={t("booking_fast_t")} text={t("booking_fast_d")} />
            <InfoCard icon={CreditCard} title={t("booking_pay_t")} text={t("booking_pay_d")} />
            <InfoCard icon={Shield} title={t("booking_sec_t")} text={t("booking_sec_d")} />
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h4 className="font-display text-lg font-bold">{t("booking_incl")}</h4>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                {[t("booking_incl_1"), t("booking_incl_2"), t("booking_incl_3"), t("booking_incl_4"), t("booking_incl_5")].map((i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 text-brand-foreground" /> {i}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </Section>
    </Layout>
  );
}

function InfoCard({ icon: Icon, title, text }: { icon: typeof Clock; title: string; text: string }) {
  return (
    <div className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl gradient-brand text-brand-foreground">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <div className="font-display text-base font-bold text-foreground">{title}</div>
        <div className="text-sm text-muted-foreground">{text}</div>
      </div>
    </div>
  );
}
