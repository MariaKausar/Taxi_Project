import type { Metadata } from "next";

import { ContactPage } from "@/components/pages/ContactPage";

export const metadata: Metadata = {
  title: "Kontakt & Taxizentrale Esslingen – 24/7",
  description:
    "Kontakt Taxi Team Esslingen: 24/7 Taxizentrale unter +49 1785 183559, WhatsApp, E-Mail und Kontaktformular. Esslingen am Neckar & Ostfildern.",
  keywords: [
    "Taxi Kontakt Esslingen",
    "Taxizentrale Esslingen Telefon",
    "Taxi anrufen Esslingen",
    "Taxi WhatsApp Esslingen",
  ],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Kontakt Taxi Team Esslingen – 24/7 Taxizentrale",
    description:
      "24/7 erreichbar: Telefon, WhatsApp, E-Mail und Kontaktformular für Taxi Esslingen am Neckar.",
    url: "/contact",
  },
};

export default function Page() {
  return <ContactPage />;
}
