import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { PRODUCTS } from "@/content/products";
import { ProductItem } from "@/types";
import { COMPANY_INFO } from "@/content/company";
import ProductDetailClient from "./ProductDetailClient";

// Alias mapping for friendly SEO slugs
const SLUG_MAP: Record<string, string> = {
  "pipes-tubes": "pipes-tubes",
  "pipes": "pipes-tubes",
  "tubes": "pipes-tubes",
  "seamless-pipes-astm-a312-316l": "pipes-tubes",
  "flanges": "flanges",
  "forged-flanges-super-duplex-2507": "flanges",
  "weld-neck-flanges-asme-b16-5": "flanges",
  "buttweld-fittings": "buttweld-fittings",
  "screwed-forged-fittings": "screwed-forged-fittings",
  "double-ferrule-fittings": "double-ferrule-fittings",
  "inconel-625-fittings": "double-ferrule-fittings",
  "plates-sheets-coils": "plates-sheets-coils",
  "sheets": "plates-sheets-coils",
  "coils": "plates-sheets-coils",
  "plates": "plates-sheets-coils",
  "boiler-quality-plates-astm-a516-gr70": "plates-sheets-coils",
  "fasteners": "fasteners",
  "rods-bars-wires": "rods-bars-wires",
  "bars": "rods-bars-wires",
  "round-bars": "rods-bars-wires",
  "structural-steel": "structural-steel",
  "copper-jumpers-non-ferrous": "copper-jumpers-non-ferrous",
};

export async function generateStaticParams() {
  return Object.keys(SLUG_MAP).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const productId = SLUG_MAP[slug];
  const product = PRODUCTS.find((p) => p.id === productId);

  if (!product) {
    return { title: "Product Not Found | Steels Vision" };
  }

  return {
    title: `${product.name} | Steels Vision Global Exports`,
    description: `${product.description} Certified under ISO 9001:2015 with EN 10204 3.1 & 3.2 MTC documentation.`,
    openGraph: {
      title: `${product.name} - Steels Vision Global Exporters`,
      description: product.tagline,
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const productId = SLUG_MAP[slug];
  const product = PRODUCTS.find((p) => p.id === productId);

  if (!product) {
    notFound();
  }

  // Find related products
  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
      currentSlug={slug}
    />
  );
}
