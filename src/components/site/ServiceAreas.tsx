import { MapPin, Navigation } from "lucide-react";
import { Section, SectionHeader } from "@/components/site/Section";
import { useT } from "@/i18n/LanguageContext";
import type { TranslationKey } from "@/i18n/translations";

const SERVICE_AREA_KEYS = [
  "areas_name_esslingen",
  "areas_name_sirnau",
  "areas_name_zell",
  "areas_name_altbach",
  "areas_name_ostfildern",
  "areas_name_aichwald",
  "areas_name_denkendorf",
  "areas_name_neuhausen",
] as const satisfies readonly TranslationKey[];

export function ServiceAreas() {
  const { t } = useT();

  return (
    <Section id="service-areas" className="bg-secondary/40">
      <SectionHeader
        eyebrow={t("areas_eyebrow")}
        title={t("areas_title")}
        description={t("areas_desc")}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICE_AREA_KEYS.map((key, index) => (
          <div
            key={key}
            className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elevated"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-brand-foreground transition-colors group-hover:gradient-brand group-hover:text-brand-foreground">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div
                className="font-display text-base font-bold text-foreground"
                spellCheck={false}
              >
                {t(key)}
              </div>
              {index === 0 && (
                <div className="mt-0.5 text-xs font-medium text-brand-foreground">
                  {t("areas_hub")}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col items-center gap-3 rounded-2xl border border-border bg-card px-6 py-5 text-center shadow-soft sm:flex-row sm:justify-center sm:gap-4 sm:text-left">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full gradient-brand text-brand-foreground shadow-glow">
          <Navigation className="h-5 w-5" />
        </div>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{t("areas_note")}</p>
      </div>
    </Section>
  );
}
