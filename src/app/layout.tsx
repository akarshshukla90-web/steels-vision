import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/Header";
import Footer from "@/components/ui/Footer";
import RFQModal from "@/components/rfq/RFQModal";
import JsonLd from "@/components/seo/JsonLd";
import { RFQProvider } from "@/hooks/useRFQBasket";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Steels Vision | Global Metal Solutions & High-Trusted Partnerships",
  description:
    "Steels Vision is an ISO 9001:2015, 14001:2015, 45001:2018 certified manufacturer and global exporter of Ferrous and Non-Ferrous metals (Pipes, Tubes, Flanges, Fittings, Plates, Fasteners, Rods & Copper Jumpers). Approved for Lloyd's, DNV, TUV, BV, and IBR inspection.",
  keywords: [
    "Steels Vision",
    "Vishal Mehta",
    "ASTM A312 Stainless Steel Pipes",
    "ASME B16.5 Forged Flanges",
    "High Nickel Alloys Inconel Monel Hastelloy",
    "Duplex 2205 Super Duplex 2507",
    "Boiler Quality Plates ASTM A516 Gr 70",
    "Double Ferrule Tube Fittings",
    "Copper Earthing Jumpers",
    "ISO 9001 Metal Exporters India",
  ],
  authors: [{ name: "Steels Vision" }],
  openGraph: {
    title: "Steels Vision - Global Metal Solutions | ISO Certified",
    description:
      "Strong Materials. Stronger Projects. Built for performance, delivered with trust. Global supply of Pipes, Tubes, Flanges, Fittings & Plates.",
    url: "https://www.steelsvision.com",
    siteName: "Steels Vision",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <JsonLd />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} antialiased bg-[#0B0F19] text-slate-100 flex flex-col min-h-screen selection:bg-red-500/30 selection:text-white`}>
        <RFQProvider>
          <Header />
          <main className="flex-1 industrial-grid">{children}</main>
          <Footer />
          <RFQModal />
        </RFQProvider>
      </body>
    </html>
  );
}
