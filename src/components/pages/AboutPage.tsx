"use client";

import { Heart, Award, Users, Leaf } from "lucide-react";

import { Layout } from "@/components/site/Layout";
import { Section, SectionHeader } from "@/components/site/Section";
import { useT } from "@/i18n/LanguageContext";

export function AboutPage() {
  const { t } = useT();
  return (
    <Layout>
      <Section className="bg-secondary/40 pt-14 pb-16 sm:pt-20 sm:pb-20">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6">
            <div className="mb-3">
              <span className="inline-flex items-center rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-foreground">
                {t("about_eyebrow")}
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance-tight">
              {t("about_title")}
            </h1>
          </div>

          <div className="space-y-5 text-base text-muted-foreground">
            <p>{t("about_p1")}</p>
            <p>{t("about_p2")}</p>

            <h2 className="pt-2 font-display text-2xl font-bold text-foreground sm:text-3xl">
              {t("about_story_title")}
            </h2>
            <p>{t("about_story_p1")}</p>
            <p>{t("about_story_p2")}</p>
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
