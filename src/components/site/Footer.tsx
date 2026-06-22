"use client";

import Link from "next/link";
import { MessageCircle, Phone, Mail, MapPin, Clock, Globe } from "lucide-react";

import { useT } from "@/i18n/LanguageContext";

export function Footer() {
  const { t } = useT();
  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-brand">
              <span className="text-base font-black text-brand-foreground">E</span>
            </div>
            <span className="font-display text-lg font-bold">Taxi Team Esslingen</span>
          </div>
          <p className="max-w-xs text-sm text-primary-foreground/70">{t("footer_desc")}</p>
          <div className="flex gap-2">
            <a
              href="https://wa.me/491785183559"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-brand hover:text-brand-foreground"
            >
              <MessageCircle className="h-4 w-4" />
            </a>
            <a
              href="https://www.infobel.com/de/germany/taxi_team_esslingen/esslingen_am_neckar/DE111824219-01785183559/businessdetails.aspx"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Infobel"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-brand hover:text-brand-foreground"
            >
              <Globe className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand">{t("footer_nav")}</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              ["/", t("nav_home")],
              ["/booking", t("nav_book")],
              ["/about", t("nav_about")],
              ["/contact", t("nav_contact")],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="text-primary-foreground/70 transition hover:text-brand">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand">{t("footer_legal")}</h4>
          <ul className="space-y-2.5 text-sm text-primary-foreground/70">
            <li>
              <a href="#" className="hover:text-brand">
                {t("footer_impressum")}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-brand">
                {t("footer_privacy")}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-brand">
                {t("footer_terms")}
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-brand">
                {t("footer_cookies")}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand">{t("footer_contact")}</h4>
          <ul className="space-y-3 text-sm text-primary-foreground/80">
            <li className="flex items-start gap-2.5">
              <Phone className="mt-0.5 h-4 w-4 text-brand" />
              <span>+49 1785 183559</span>
            </li>
            <li className="flex items-start gap-2.5">
              <Mail className="mt-0.5 h-4 w-4 text-brand" />
              <span>taxiteamesslingen@yahoo.com</span>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 text-brand" />
              <span>
                Vogelsangstraße 9
                <br />
                73760 Ostfildern
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 text-brand" />
              <span>
                Plochinger Str. 95
                <br />
                73730 Esslingen am Neckar
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Clock className="mt-0.5 h-4 w-4 text-brand" />
              <span>{t("footer_hours")}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-primary-foreground/60 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} Taxi Team Esslingen. {t("footer_rights")}
          </p>
          <p>{t("footer_madein")}</p>
        </div>
      </div>
    </footer>
  );
}
