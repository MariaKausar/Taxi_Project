import { Link } from "@tanstack/react-router";
import { Phone, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useT } from "@/i18n/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

type NavLink = {
  key: string;
  label: string;
  to: "/" | "/booking" | "/about" | "/contact";
  hash?: string;
  exact?: boolean;
};

export function Header() {
  const [open, setOpen] = useState(false);
  const { t } = useT();

  const navLinks: NavLink[] = [
    { key: "home", to: "/", label: t("nav_home"), exact: true },
    { key: "book", to: "/booking", label: t("nav_book") },
    { key: "areas", to: "/", hash: "service-areas", label: t("nav_areas") },
    { key: "about", to: "/about", label: t("nav_about") },
    { key: "contact", to: "/contact", label: t("nav_contact") },
  ];

  const linkClass =
    "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-brand shadow-glow">
            <span className="text-base font-black text-brand-foreground">E</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-base font-bold text-foreground">Taxi Team Esslingen</span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{t("header_tagline")}</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((l) => (
            <Link
              key={l.key}
              to={l.to}
              hash={l.hash}
              className={linkClass}
              activeProps={{ className: "text-foreground bg-secondary" }}
              activeOptions={{ exact: l.exact }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <a
            href="tel:+491785183559"
            className="hidden items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-soft transition-transform hover:scale-105 sm:flex"
          >
            <Phone className="h-4 w-4 text-brand" />
            <span>+49 1785 183559</span>
          </a>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-md text-foreground lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "overflow-hidden border-t border-border/60 bg-background lg:hidden",
          open ? "max-h-96" : "max-h-0",
          "transition-[max-height] duration-300"
        )}
      >
        <nav className="flex flex-col gap-1 p-4">
          {navLinks.map((l) => (
            <Link
              key={l.key}
              to={l.to}
              hash={l.hash}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary" }}
              activeOptions={{ exact: l.exact }}
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-2 flex justify-center">
            <LanguageSwitcher />
          </div>
          <a
            href="tel:+491785183559"
            className="mt-2 flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
          >
            <Phone className="h-4 w-4 text-brand" /> {t("header_call")} +49 1785 183559
          </a>
        </nav>
      </div>
    </header>
  );
}
