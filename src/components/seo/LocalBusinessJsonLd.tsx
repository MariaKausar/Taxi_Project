import { getSiteUrl, siteConfig } from "@/lib/seo";

export function LocalBusinessJsonLd() {
  const primary = siteConfig.primaryAddress;

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TaxiService",
        "@id": `${getSiteUrl()}/#taxi-service`,
        name: siteConfig.name,
        url: getSiteUrl(),
        telephone: siteConfig.phoneE164,
        email: siteConfig.email,
        image: getSiteUrl("/favicon.ico"),
        priceRange: siteConfig.priceRange,
        currenciesAccepted: "EUR",
        paymentAccepted: "Cash, Credit Card",
        openingHours: siteConfig.openingHours,
        areaServed: siteConfig.areaServed.map((name) => ({
          "@type": "City",
          name,
        })),
        address: {
          "@type": "PostalAddress",
          streetAddress: primary.streetAddress,
          addressLocality: primary.addressLocality,
          postalCode: primary.postalCode,
          addressRegion: primary.addressRegion,
          addressCountry: primary.addressCountry,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: siteConfig.geo.latitude,
          longitude: siteConfig.geo.longitude,
        },
        sameAs: siteConfig.sameAs,
        availableLanguage: ["German", "English"],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Taxi services",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Local taxi rides in Esslingen",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Stuttgart Airport transfer (STR)",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Medical transport",
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: "Business travel",
              },
            },
          ],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${getSiteUrl()}/#website`,
        url: getSiteUrl(),
        name: siteConfig.name,
        inLanguage: ["de-DE", "en-DE"],
        publisher: { "@id": `${getSiteUrl()}/#taxi-service` },
        potentialAction: {
          "@type": "ReserveAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: getSiteUrl("/booking"),
            actionPlatform: [
              "http://schema.org/DesktopWebPlatform",
              "http://schema.org/MobileWebPlatform",
            ],
          },
          result: {
            "@type": "Reservation",
            name: "Taxi booking",
          },
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
