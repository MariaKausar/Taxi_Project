import type { Metadata } from "next";

import { BookingPage } from "@/components/pages/BookingPage";

export const metadata: Metadata = {
  title: "Taxi online buchen",
  description:
    "Buchen Sie Ihr Taxi in Esslingen am Neckar online. 24/7 Zentrale, professionelle Fahrer, einfache Buchung.",
  alternates: { canonical: "/booking" },
  openGraph: {
    title: "Taxi online buchen — Taxi Team Esslingen",
    description: "Buchen Sie Ihr Taxi in Esslingen am Neckar online in unter einer Minute.",
    url: "/booking",
  },
};

export default function Page() {
  return <BookingPage />;
}
