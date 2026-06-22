"use client";

import { Heart, Award, Users, Leaf } from "lucide-react";

import { Layout } from "@/components/site/Layout";
import { Section, SectionHeader } from "@/components/site/Section";
import { useT } from "@/i18n/LanguageContext";

export function AboutPage() {
  const { t } = useT();
  return (
    <Layout>
      <Section className="bg-secondary/40 pt-14 sm:pt-20">
        <SectionHeader eyebrow={t("about_eyebrow")} title={t("about_title")} description={t("about_desc")} />
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4 text-base text-muted-foreground">
            <p>{t("about_p1")}</p>
            <p>
              {t("about_p2_pre")}
              <strong className="text-foreground">{t("about_p2_strong")}</strong>
              {t("about_p2_post")}
            </p>
            <p>{t("about_p3")}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { v: "27+", l: t("about_stat_years") },
              { v: "20+", l: t("about_stat_vehicles") },
              { v: "180k+", l: t("about_stat_rides") },
              { v: "4.9★", l: t("about_stat_rating") },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
                <div className="font-display text-3xl font-bold text-brand-foreground">{s.v}</div>
                <div className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-secondary/40">
        <SectionHeader eyebrow={t("about_values_eyebrow")} title={t("about_values_title")} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Heart, title: t("about_val_care_t"), text: t("about_val_care_d") },
            { icon: Award, title: t("about_val_exc_t"), text: t("about_val_exc_d") },
            { icon: Users, title: t("about_val_local_t"), text: t("about_val_local_d") },
            { icon: Leaf, title: t("about_val_sus_t"), text: t("about_val_sus_d") },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl gradient-brand text-brand-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-lg font-bold">{title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>
      </Section>
    </Layout>
  );
}
