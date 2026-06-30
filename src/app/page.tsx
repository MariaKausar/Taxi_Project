import type { Metadata } from "next";

import { HomePage } from "@/components/pages/HomePage";
import { defaultKeywords } from "@/lib/seo";

export const metadata: Metadata = {
  title:
    "Taxi Esslingen | 24/7 Taxizentrale Esslingen am Neckar – online buchen",
  description:
    "Taxi Esslingen am Neckar rund um die Uhr: Taxizentrale, Flughafentransfer Stuttgart (STR), Geschäftsfahrten, Krankenfahrten & Botenfahrten. Jetzt Taxi online buchen oder +49 1785 183559 anrufen.",
  keywords: [
    ...defaultKeywords,
    "Taxi online buchen Esslingen",
    "Taxidienst Esslingen",
    "Taxi Flughafen Stuttgart Esslingen",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title:
      "Taxi Esslingen | 24/7 Taxizentrale Esslingen am Neckar – online buchen",
    description:
      "Taxi Esslingen am Neckar: 24/7 Taxidienst, Flughafentransfer Stuttgart, Geschäftsfahrten & Krankenfahrten. Jetzt online buchen.",
    url: "/",
  },
};

export default function Page() {
  return <HomePage />;
}
