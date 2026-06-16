import { useT } from "@/i18n/LanguageContext";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { lang, setLang } = useT();
  const base = "px-2 py-1 text-xs font-bold uppercase tracking-wider transition-colors";
  return (
    <div className={`inline-flex items-center rounded-full border border-border bg-secondary/70 p-0.5 ${className}`} role="group" aria-label="Language">
      <button
        type="button"
        onClick={() => setLang("de")}
        aria-pressed={lang === "de"}
        className={`${base} rounded-full ${lang === "de" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
      >
        DE
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`${base} rounded-full ${lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
      >
        EN
      </button>
    </div>
  );
}
