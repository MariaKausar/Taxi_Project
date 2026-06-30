import type { Metadata } from "next";

import { BookingPage } from "@/components/pages/BookingPage";

export const metadata: Metadata = {
  title: "Taxi online buchen Esslingen – 24/7 Buchung",
  description:
    "Taxi in Esslingen am Neckar online buchen in unter einer Minute. 24/7 Taxizentrale, schnelle Abholung, professionelle Fahrer. Flughafentransfer & Krankenfahrten.",
  keywords: [
    "Taxi online buchen Esslingen",
    "Taxi buchen Esslingen am Neckar",
    "Taxibestellung Esslingen",
    "24/7 Taxi Esslingen",
  ],
  alternates: { canonical: "/booking" },
  openGraph: {
    title: "Taxi online buchen Esslingen – Taxi Team Esslingen",
    description:
      "Buchen Sie Ihr Taxi in Esslingen am Neckar online — schnell, einfach, 24/7.",
    url: "/booking",
  },
};

export default function Page() {
  return <BookingPage />;
}
