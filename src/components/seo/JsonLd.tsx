import React from "react";
import { COMPANY_INFO } from "@/content/company";
import { PRODUCTS } from "@/content/products";

export default function JsonLd() {
  const schemaOrganization = {
    "@context": "https://schema.org",
    "@type": ["Organization", "B2BManufacturer"],
    "@id": "https://www.steelsvision.com/#organization",
    name: COMPANY_INFO.name,
    legalName: COMPANY_INFO.legalName,
    alternateName: "Steels Vision India",
    url: "https://www.steelsvision.com",
    logo: "https://www.steelsvision.com/logo.png",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: COMPANY_INFO.phone,
        contactType: "sales",
        email: COMPANY_INFO.email,
        areaServed: "Global",
        availableLanguage: ["English", "Hindi"],
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: COMPANY_INFO.headquarters.address,
      addressLocality: COMPANY_INFO.headquarters.city,
      addressRegion: COMPANY_INFO.headquarters.state,
      addressCountry: COMPANY_INFO.headquarters.country,
    },
    founder: {
      "@type": "Person",
      name: COMPANY_INFO.managingDirector,
      jobTitle: COMPANY_INFO.leadershipTitle,
    },
    hasCredential: COMPANY_INFO.certifications.map((c) => ({
      "@type": "EducationalOccupationalCredential",
      name: c.code,
      credentialCategory: "QualityCertification",
      recognizedBy: {
        "@type": "Organization",
        name: c.authority,
      },
    })),
    knowsAbout: [
      "Stainless Steel Pipes & Tubes (ASTM A312)",
      "High Nickel Alloys (Inconel 625, Hastelloy C276, Monel 400)",
      "Forged Flanges (ASME B16.5 Classes 150# to 2500#)",
      "Double Ferrule Compression Tube Fittings",
      "Pressure Vessel Boiler Quality Plates (ASTM A516 Gr 70)",
      "Non-Ferrous Copper Earthing Jumpers",
      "Third Party Inspection (Lloyds, DNV, TUV, BV, IBR)",
    ],
  };

  const schemaProducts = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: PRODUCTS.map((prod, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: prod.name,
        description: prod.description,
        category: prod.category,
        brand: {
          "@type": "Brand",
          name: COMPANY_INFO.name,
        },
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          seller: {
            "@id": "https://www.steelsvision.com/#organization",
          },
        },
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrganization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaProducts) }}
      />
    </>
  );
}
