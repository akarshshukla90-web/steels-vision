"use client";

import React from "react";
import Link from "next/link";
import MetalHeroScene from "@/components/canvas/MetalHeroScene";
import WeightCalculator from "@/components/calculator/WeightCalculator";
import ProductCatalog from "@/components/catalog/ProductCatalog";
import TrustMatrix from "@/components/trust/TrustMatrix";
import DirectLeadCapture from "@/components/rfq/DirectLeadCapture";
import { COMPANY_INFO } from "@/content/company";
import { useRFQBasket } from "@/hooks/useRFQBasket";
import {
  ShieldCheck,
  Award,
  ChevronRight,
  Calculator,
  Layers,
  FileText,
  Flame,
  ArrowRight,
  PhoneCall,
  Mail,
  CheckCircle,
  Building2,
  Factory,
  Globe2,
  Cpu,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const { openRFQModal } = useRFQBasket();

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. HERO SECTION WITH 3D WEBGL INTERACTION */}
      <section
        id="hero-3d"
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 lg:py-20 flex flex-col lg:flex-row items-center justify-between gap-12"
      >
        {/* Left Column: Industrial Luxury Proposition */}
        <div className="w-full lg:w-1/2 space-y-6 text-left">
          {/* ISO Compliance Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-white/10 text-xs font-mono text-slate-300 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white font-semibold">ISO 9001 / 14001 / 45001</span>
            <span className="text-slate-500">•</span>
            <span className="text-cyan-400">25+ Yrs Metallurgy</span>
          </div>

          {/* Headline & Slogans from Official Brochure */}
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
              STRONG MATERIALS. <br />
              <span className="metallic-text">STRONGER PROJECTS.</span>
            </h1>
            <p className="text-sm font-mono text-[#E63946] font-semibold tracking-wider uppercase">
              Built For Performance, Delivered With Trust.
            </p>
          </div>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl">
            Global manufacturer, supplier, and stockist of premier Ferrous and Non-Ferrous metals from India.
            Engineered for international EPC contractors, oil &amp; gas refineries, and heavy power generation projects.
          </p>

          {/* 4 Pillars of Excellence from Brochure Page 1 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {[
              { title: "Reliable Supply", subtitle: "Bulk Stock Ready" },
              { title: "Consistent Quality", subtitle: "100% PMI Tested" },
              { title: "Global Standards", subtitle: "ASTM / ASME / DIN" },
              { title: "Cost Efficiency", subtitle: "Direct Mill Tier-1" },
            ].map((p, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-0.5">
                <div className="text-xs font-bold text-white">{p.title}</div>
                <div className="text-[10px] font-mono text-slate-400">{p.subtitle}</div>
              </div>
            ))}
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={openRFQModal}
              className="px-6 py-3.5 rounded-xl bg-[#E63946] hover:bg-[#D62839] text-white font-bold text-sm shadow-xl shadow-red-500/25 hover:shadow-red-500/40 transition-all flex items-center gap-2 group"
            >
              <FileText className="h-4 w-4" />
              <span>Launch International RFQ Basket</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#calculator-section"
              className="px-5 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-white/10 text-xs sm:text-sm font-mono flex items-center gap-2 transition-all"
            >
              <Calculator className="h-4 w-4 text-cyan-400" />
              <span>Engineering Calculator</span>
            </a>
          </div>

          {/* Direct WhatsApp / Phone Contact Link */}
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400 pt-2">
            <span>Direct Desk:</span>
            <a
              href={`tel:${COMPANY_INFO.phoneRaw}`}
              className="text-white hover:text-emerald-400 transition-colors font-bold flex items-center gap-1.5"
            >
              <PhoneCall className="h-3.5 w-3.5 text-emerald-400" />
              {COMPANY_INFO.phone}
            </a>
            <span>•</span>
            <span className="text-slate-500">Managing Director: Vishal Mehta</span>
          </div>
        </div>

        {/* Right Column: 3D Interactive WebGL Metal Component Showcase */}
        <div className="w-full lg:w-1/2 relative">
          <div className="relative w-full rounded-2xl p-1 bg-gradient-to-b from-white/10 via-transparent to-red-500/20 shadow-2xl">
            <MetalHeroScene />
          </div>
        </div>
      </section>

      {/* 2. INDUSTRIAL TELEMETRY STATS STRIP */}
      <section className="w-full border-y border-white/10 bg-slate-950/70 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black font-mono text-white">25+</div>
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400">
              Years Metallurgy Leadership
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black font-mono text-cyan-400">100%</div>
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400">
              PMI Spectrometer Verified
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black font-mono text-[#E63946]">15,000 PSI</div>
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400">
              Hydrostatic Pressure Tested
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black font-mono text-white">16+</div>
            <div className="text-xs uppercase font-mono tracking-wider text-slate-400">
              Global Inspection Bodies (TPI)
            </div>
          </div>
        </div>
      </section>

      {/* 3. METALLURGICAL ENGINEERING WEIGHT CALCULATOR */}
      <section id="calculator-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <WeightCalculator />
      </section>

      {/* 4. COMPREHENSIVE B2B PRODUCT CATALOG */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductCatalog />
      </section>

      {/* 5. TRUST SIGNALS, ISO COMPLIANCE & TPI AGENCIES */}
      <section id="compliance-section" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TrustMatrix />
      </section>

      {/* 6. APPLICATION INDUSTRIES ACCORDION / GRID */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-white/10 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 uppercase tracking-wider">
              <Factory className="h-4 w-4" />
              <span>Mission-Critical Deployments</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Application Industries Served Globally
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Approved vendor supplies across high-pressure hydrocarbon processing, nuclear cooling, cryogenic gas,
              and naval defence structures.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {COMPANY_INFO.industriesServed.map((ind, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-red-500/30 text-center transition-all group flex flex-col items-center justify-center min-h-[100px]"
              >
                <div className="text-xs font-semibold text-slate-300 group-hover:text-white transition-colors">
                  {ind}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. DIRECT LEAD CAPTURE & COMMERCIAL QUOTE FORM */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <DirectLeadCapture />
      </section>

      {/* 8. HIGH-CONVERSION BOTTOM CALL TO ACTION */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative rounded-3xl p-8 sm:p-12 overflow-hidden border border-red-500/30 bg-gradient-to-r from-red-950/40 via-slate-950 to-slate-900 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-3 text-left max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#E63946] font-bold">
              Fast-Track Export Procurement Desk
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              Ready to Secure Prime Metallurgy For Your Next Project?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Connect directly with Managing Director Vishal Mehta and our technical engineering export desk. We quote
              firm international CIF/FOB pricing with verified mill test certificates within 4 hours.
            </p>
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-cyan-400" />
                <span>steelsvision@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-emerald-400" />
                <span>(+91) 96380-66691</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={openRFQModal}
              className="px-8 py-4 rounded-xl bg-[#E63946] hover:bg-[#D62839] text-white font-bold text-sm shadow-xl shadow-red-500/30 transition-all text-center"
            >
              Open B2B RFQ Basket
            </button>
            <a
              href={`mailto:${COMPANY_INFO.email}?subject=Project Enquiry for Steels Vision Export Desk`}
              className="px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 font-mono text-xs text-center transition-all"
            >
              Direct Email Inquiry
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
