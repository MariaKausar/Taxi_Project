import type { Metadata } from "next";

import { HomePage } from "@/components/pages/HomePage";

export const metadata: Metadata = {
  title: "Taxi Team Esslingen — 24/7 Taxi in Esslingen am Neckar",
  description:
    "Taxi in Esslingen am Neckar online buchen. 24/7 Flughafentransfer zum Stuttgart Airport, Geschäftsreisen und lokale Fahrten.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "Taxi Team Esslingen — 24/7 Taxi in Esslingen am Neckar",
    description:
      "Taxi in Esslingen am Neckar online buchen. 24/7 Flughafentransfer, Geschäftsreisen und lokale Fahrten.",
    url: "/",
  },
};

export default function Page() {
  return <HomePage />;
}
