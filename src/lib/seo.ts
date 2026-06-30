const DEFAULT_SITE_URL = "https://taxiteamesslingen.cab";

export const siteConfig = {
  name: "Taxi Team Esslingen",
  legalName: "Taxi Team Esslingen",
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || DEFAULT_SITE_URL,
  locale: "de_DE",
  phone: "+49 1785 183559",
  phoneE164: "+491785183559",
  email: "taxiteamesslingen@yahoo.com",
  googleVerification: "google1e5437357d2e0c24",
  addresses: [
    {
      streetAddress: "Plochinger Str. 95",
      addressLocality: "Esslingen am Neckar",
      postalCode: "73730",
      addressCountry: "DE",
    },
    {
      streetAddress: "Vogelsangstraße 9",
      addressLocality: "Ostfildern",
      postalCode: "73760",
      addressCountry: "DE",
    },
  ],
  primaryAddress: {
    streetAddress: "Plochinger Str. 95",
    addressLocality: "Esslingen am Neckar",
    postalCode: "73730",
    addressRegion: "Baden-Württemberg",
    addressCountry: "DE",
  },
  geo: {
    latitude: 48.7426,
    longitude: 9.3201,
  },
  areaServed: [
    "Esslingen am Neckar",
    "Ostfildern",
    "Sirnau",
    "Zell unter Aichelberg",
    "Altbach",
    "Denkendorf",
    "Neuhausen auf den Fildern",
    "Stuttgart Region",
    "Baden-Württemberg",
  ],
  openingHours: "Mo-Su 00:00-24:00",
  priceRange: "€€",
  sameAs: [
    "https://wa.me/491785183559",
    "https://www.infobel.com/de/germany/taxi_team_esslingen/esslingen_am_neckar/DE111824219-01785183559/businessdetails.aspx",
  ],
} as const;

export function getSiteUrl(path = "") {
  const base = siteConfig.url;
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export const defaultKeywords = [
  "Taxi Esslingen",
  "Taxi Esslingen am Neckar",
  "Taxizentrale Esslingen",
  "Taxi buchen Esslingen",
  "Flughafentransfer Stuttgart",
  "Taxi Ostfildern",
  "Krankenfahrt Esslingen",
  "24/7 Taxi Esslingen",
  "Taxi Team Esslingen",
];
