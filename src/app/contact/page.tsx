import type { Metadata } from "next";

import { ContactPage } from "@/components/pages/ContactPage";

export const metadata: Metadata = {
  title: "Kontakt — 24/7",
  description:
    "Kontaktieren Sie Taxi Team Esslingen. 24/7 Telefonzentrale, E-Mail, WhatsApp und Kontaktformular.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Kontakt Taxi Team Esslingen",
    description: "24/7 Telefonzentrale, E-Mail, WhatsApp und Kontaktformular.",
    url: "/contact",
  },
};

export default function Page() {
  return <ContactPage />;
}
