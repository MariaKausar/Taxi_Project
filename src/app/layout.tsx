import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";

import { LocalBusinessJsonLd } from "@/components/seo/LocalBusinessJsonLd";
import { defaultKeywords, getSiteUrl, siteConfig } from "@/lib/seo";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans-family",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display-family",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default:
      "Taxi Esslingen | 24/7 Taxizentrale Esslingen am Neckar – Taxi Team Esslingen",
    template: "%s | Taxi Team Esslingen",
  },
  description:
    "Taxi Esslingen am Neckar: 24/7 Taxidienst, Flughafentransfer Stuttgart (STR), Geschäftsfahrten & Krankenfahrten. Jetzt online buchen oder anrufen.",
  keywords: defaultKeywords,
  authors: [{ name: siteConfig.name, url: getSiteUrl() }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  category: "transportation",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
    languages: {
      "de-DE": "/",
      "en-DE": "/",
    },
  },
  verification: {
    google: siteConfig.googleVerification,
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    alternateLocale: ["en_DE"],
    siteName: siteConfig.name,
    title:
      "Taxi Esslingen | 24/7 Taxizentrale Esslingen am Neckar – Taxi Team Esslingen",
    description:
      "Taxi Esslingen am Neckar: 24/7 Taxidienst, Flughafentransfer Stuttgart (STR), Geschäftsfahrten & Krankenfahrten. Jetzt online buchen.",
    url: getSiteUrl(),
  },
  twitter: {
    card: "summary_large_image",
    title: "Taxi Esslingen | Taxi Team Esslingen",
    description:
      "24/7 Taxi in Esslingen am Neckar. Flughafentransfer, Geschäftsfahrten, Krankenfahrten. Online buchen.",
  },
  other: {
    "geo.region": "DE-BW",
    "geo.placename": "Esslingen am Neckar",
    "geo.position": `${siteConfig.geo.latitude};${siteConfig.geo.longitude}`,
    ICBM: `${siteConfig.geo.latitude}, ${siteConfig.geo.longitude}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      translate="no"
      suppressHydrationWarning
      className={`${inter.variable} ${plusJakarta.variable}`}
    >
      <body suppressHydrationWarning>
        <LocalBusinessJsonLd />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
