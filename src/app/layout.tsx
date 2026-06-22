import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";

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
  title: {
    default: "Taxi Team Esslingen — 24/7 Taxi in Esslingen am Neckar",
    template: "%s — Taxi Team Esslingen",
  },
  description:
    "Reliable 24/7 taxi service in Esslingen am Neckar. Airport transfers, business travel, local rides. Book online or call now.",
  authors: [{ name: "Taxi Team Esslingen" }],
  openGraph: {
    siteName: "Taxi Team Esslingen",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
