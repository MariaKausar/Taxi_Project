import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import heroImg from "@/assets/hero-taxi.jpg";
import { Layout } from "@/components/site/Layout";
import { BookingForm } from "@/components/site/BookingForm";
import { Section, SectionHeader } from "@/components/site/Section";
import { ServiceAreas } from "@/components/site/ServiceAreas";
import {
  Plane, Briefcase, MapPin, Hotel, Ticket, Package,
  Clock, ShieldCheck, Sparkles, BadgeEuro, Smartphone, Plane as PlaneIcon,
  Zap, Lock, Star, ChevronDown, Phone, ArrowRight, Check
} from "lucide-react";
import { useT } from "@/i18n/LanguageContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Taxi Team Esslingen — 24/7 Taxi in Esslingen am Neckar" },
      { name: "description", content: "Taxi in Esslingen am Neckar online buchen. 24/7 Flughafentransfer zum Stuttgart Airport, Geschäftsreisen und lokale Fahrten." },
      { property: "og:title", content: "Taxi Team Esslingen — 24/7 Taxi in Esslingen am Neckar" },
      { property: "og:description", content: "Taxi in Esslingen am Neckar online buchen. 24/7 Flughafentransfer, Geschäftsreisen und lokale Fahrten." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  return (
    <Layout>
      <Hero />
      <TrustBar />
      <Services />
      <ServiceAreas />
      <WhyUs />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <ContactCTA />
    </Layout>
  );
}

function Hero() {
  const { t } = useT();
  return (
    <section className="relative overflow-hidden bg-primary">
      <div className="absolute inset-0">
        <img src={heroImg} alt="Taxi in Esslingen am Neckar" className="h-full w-full object-cover opacity-50" width={1920} height={1280} />
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/85 to-primary/40" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_minmax(360px,440px)] lg:gap-12 lg:py-28 lg:px-8">
        <div className="text-primary-foreground">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider">{t("hero_badge")}</span>
          </div>

          <h1 className="font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl text-balance-tight">
            {t("hero_title_pre")}<span className="text-brand">{t("hero_title_city")}</span>{t("hero_title_post")}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-primary-foreground/80">{t("hero_subtitle")}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/booking" className="group inline-flex items-center gap-2 rounded-full gradient-brand px-6 py-3.5 text-sm font-bold text-brand-foreground shadow-glow transition hover:scale-[1.03]">
              {t("hero_cta_book")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <a href="tel:+491785183559" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-bold text-primary-foreground backdrop-blur transition hover:bg-white/20">
              <Phone className="h-4 w-4 text-brand" /> {t("hero_cta_call")}: +49 1785 183559
            </a>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/10 pt-8 max-w-md">
            <HeroStat value="24/7" label={t("hero_stat_available")} />
            <HeroStat value="5 min" label={t("hero_stat_arrival")} />
            <HeroStat value="4.9★" label={t("hero_stat_reviews")} />
          </div>
        </div>

        <div className="lg:pl-4">
          <BookingForm />
        </div>
      </div>
    </section>
  );
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-2xl font-bold text-brand">{value}</div>
      <div className="text-xs font-medium text-primary-foreground/70">{label}</div>
    </div>
  );
}

function TrustBar() {
  const { t } = useT();
  const items = [t("trust_licensed"), t("trust_gdpr"), t("trust_payment"), t("trust_airport"), t("trust_local")];
  return (
    <div className="border-y border-border bg-secondary/60">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 py-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:px-6 lg:px-8">
        {items.map(i => (
          <span key={i} className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-brand-foreground" />{i}</span>
        ))}
      </div>
    </div>
  );
}

function Services() {
  const { t } = useT();
  const services = [
    { icon: MapPin, title: t("svc_local_t"), desc: t("svc_local_d") },
    { icon: Ticket, title: t("svc_voucher_t"), desc: t("svc_voucher_d") },
    { icon: Package, title: t("svc_delivery_t"), desc: t("svc_delivery_d") },
    { icon: Plane, title: t("svc_airport_t"), desc: t("svc_airport_d") },
    { icon: Briefcase, title: t("svc_business_t"), desc: t("svc_business_d") },
    { icon: Hotel, title: t("svc_hotel_t"), desc: t("svc_hotel_d") },
  ];
  return (
    <Section>
      <SectionHeader eyebrow={t("services_eyebrow")} title={t("services_title")} description={t("services_desc")} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <div key={s.title} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-elevated">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl gradient-brand text-brand-foreground shadow-glow">
              <s.icon className="h-6 w-6" />
            </div>
            <h3 className="mb-1.5 font-display text-lg font-bold text-foreground">{s.title}</h3>
            <p className="text-sm text-muted-foreground">{s.desc}</p>
            <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-brand/10 opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        ))}
      </div>
    </Section>
  );
}

function WhyUs() {
  const { t } = useT();
  const whyItems = [
    { icon: Clock, title: t("why_24") },
    { icon: ShieldCheck, title: t("why_pro") },
    { icon: Sparkles, title: t("why_clean") },
    { icon: BadgeEuro, title: t("why_pay") },
    { icon: Smartphone, title: t("why_online") },
    { icon: PlaneIcon, title: t("why_airport") },
    { icon: Zap, title: t("why_fast") },
    { icon: Lock, title: t("why_secure") },
  ];
  return (
    <Section className="bg-secondary/40">
      <SectionHeader eyebrow={t("why_eyebrow")} title={t("why_title")} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {whyItems.map((w) => (
          <div key={w.title} className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 shadow-soft">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/15 text-brand-foreground">
              <w.icon className="h-5 w-5" />
            </div>
            <span className="text-sm font-semibold text-foreground">{w.title}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

function HowItWorks() {
  const { t } = useT();
  const steps = [t("how_step1"), t("how_step2"), t("how_step3"), t("how_step4")];
  return (
    <Section className="bg-primary text-primary-foreground">
      <SectionHeader eyebrow={t("how_eyebrow")} title={t("how_title")} />
      <ol className="relative grid gap-6 md:grid-cols-4">
        <div className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-brand/0 via-brand to-brand/0 md:block" />
        {steps.map((s, i) => (
          <li key={s} className="relative flex flex-col items-center text-center">
            <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full gradient-brand font-display text-lg font-bold text-brand-foreground shadow-glow">
              {i + 1}
            </div>
            <div className="mt-4 text-sm font-semibold">{s}</div>
          </li>
        ))}
      </ol>
    </Section>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function Testimonials() {
  const { t } = useT();
  const testimonials = [
    { name: "Suffiyan Hussain", role: t("role_local"), text: t("test_1") },
    { name: "Markus Hoffmann", role: t("role_business"), text: t("test_2") },
    { name: "Sophie Klein", role: t("role_tourist"), text: t("test_3") },
    { name: "Daniel Wagner", role: t("role_corporate"), text: t("test_4") },
    { name: "Laura Schmidt", role: t("role_wedding"), text: t("test_5") },
    { name: "Tobias Richter", role: t("role_flyer"), text: t("test_6") },
  ];
  return (
    <Section className="bg-secondary/40">
      <SectionHeader eyebrow={t("testimonials_eyebrow")} title={t("testimonials_title")} description={t("testimonials_desc")} />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((tst) => (
          <figure key={tst.name} className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-soft">
            <div className="mb-3 flex gap-0.5 text-brand">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </div>
            <blockquote className="flex-1 text-sm text-foreground">“{tst.text}”</blockquote>
            <figcaption className="mt-5 flex items-center gap-3 border-t border-border pt-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-brand font-bold text-brand-foreground">
                {getInitials(tst.name)}
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">{tst.name}</div>
                <div className="text-xs text-muted-foreground">{tst.role}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}

function FAQ() {
  const { t } = useT();
  const [open, setOpen] = useState<number | null>(0);
  const faqs = [
    { q: t("faq_q1"), a: t("faq_a1") },
    { q: t("faq_q2"), a: t("faq_a2") },
    { q: t("faq_q3"), a: t("faq_a3") },
    { q: t("faq_q4"), a: t("faq_a4") },
    { q: t("faq_q5"), a: t("faq_a5") },
    { q: t("faq_q6"), a: t("faq_a6") },
  ];
  return (
    <Section className="bg-secondary/40">
      <SectionHeader eyebrow={t("faq_eyebrow")} title={t("faq_title")} />
      <div className="mx-auto max-w-3xl space-y-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={f.q} className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
              <button onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center justify-between gap-4 p-5 text-left">
                <span className="font-semibold text-foreground">{f.q}</span>
                <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm text-muted-foreground">{f.a}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function ContactCTA() {
  const { t } = useT();
  return (
    <Section>
      <div className="overflow-hidden rounded-3xl bg-primary p-10 text-primary-foreground sm:p-14">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold sm:text-4xl text-balance-tight">{t("cta_title")}</h2>
            <p className="mt-3 max-w-md text-primary-foreground/75">{t("cta_desc")}</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <a href="tel:+491785183559" className="inline-flex items-center gap-2 rounded-full gradient-brand px-6 py-3.5 text-sm font-bold text-brand-foreground shadow-glow">
              <Phone className="h-4 w-4" /> +49 1785 183559
            </a>
            <Link to="/booking" className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-bold backdrop-blur hover:bg-white/20">
              {t("cta_book_online")} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </Section>
  );
}
