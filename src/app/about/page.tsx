import type { Metadata } from "next";

import { AboutPage } from "@/components/pages/AboutPage";

export const metadata: Metadata = {
  title: "Über uns",
  description:
    "Familienbetrieb für Taxi in Esslingen am Neckar seit 1998 — für Anwohner, Unternehmen und Reisende.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Über Taxi Team Esslingen",
    description: "Familienbetrieb für Taxi in Esslingen am Neckar seit 1998.",
    url: "/about",
  },
};

export default function Page() {
  return <AboutPage />;
}
