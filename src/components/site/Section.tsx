import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={cn("py-20 sm:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow, title, description, center = true,
}: { eyebrow?: string; title: string; description?: string; center?: boolean }) {
  return (
    <div className={cn("mb-12 max-w-2xl", center && "mx-auto text-center")}>
      {eyebrow && (
        <div className={cn("mb-3", center && "flex justify-center")}>
          <span className="inline-flex items-center rounded-full bg-brand/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-foreground">
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance-tight">{title}</h2>
      {description && <p className="mt-4 text-base text-muted-foreground sm:text-lg">{description}</p>}
    </div>
  );
}
