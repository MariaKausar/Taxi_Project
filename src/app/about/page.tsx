import type { Metadata } from "next";

import { AboutPage } from "@/components/pages/AboutPage";

export const metadata: Metadata = {
  title: "Über uns – Taxi Team Esslingen am Neckar",
  description:
    "Taxi Team Esslingen: Ihr zuverlässiger Taxibetrieb in Esslingen am Neckar und der Region. Professionelle Fahrer, 24/7 Service, Flughafentransfer & Geschäftsfahrten.",
  keywords: [
    "Taxi Team Esslingen",
    "Taxibetrieb Esslingen",
    "Taxi Unternehmen Esslingen am Neckar",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Über Taxi Team Esslingen – Taxibetrieb Esslingen am Neckar",
    description:
      "Lernen Sie Taxi Team Esslingen kennen — Ihr lokaler 24/7 Taxidienst in Esslingen und Umgebung.",
    url: "/about",
  },
};

export default function Page() {
  return <AboutPage />;
}
