"use client";

import React from "react";
import { COMPANY_INFO } from "@/content/company";
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  PackageCheck,
  SearchCheck,
  Flame,
  FileText,
  BadgeCheck,
  Anchor,
  Globe2,
} from "lucide-react";

export default function TrustMatrix() {
  return (
    <section className="w-full py-16 space-y-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-[#E63946] text-xs font-mono uppercase tracking-wider">
          <Award className="h-3.5 w-3.5" />
          <span>Global Compliance & Trust Assurance</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Built For Performance. Delivered With Trust.
        </h2>
        <p className="text-sm sm:text-base text-slate-400">
          Over 25 years of metallurgical export leadership backed by multi-standard ISO accreditations and
          unconditional acceptance by global engineering inspection bodies.
        </p>
      </div>

      {/* ISO Accreditations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COMPANY_INFO.certifications.slice(0, 3).map((cert) => (
          <div
            key={cert.code}
            className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-red-500/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl group-hover:bg-red-500/15 transition-all" />
            <div className="flex items-center justify-between mb-4">
              <span className="px-3 py-1 rounded-md text-xs font-bold font-mono bg-red-500/15 text-[#E63946] border border-red-500/30">
                {cert.code}
              </span>
              <BadgeCheck className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-white mb-2">{cert.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{cert.description}</p>
          </div>
        ))}
      </div>

      {/* Third Party Inspection Agencies Carousel / Grid */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <SearchCheck className="h-5 w-5 text-cyan-400" />
              Third-Party Inspection (TPI) Agency Acceptance
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Approved vendor list & regular 100% witness inspection arrangement for international projects
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            EN 10204 3.2 WITNESS READY
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {COMPANY_INFO.inspectionAgencies.map((agency) => (
            <div
              key={agency.name}
              className="p-3 rounded-xl bg-slate-900/70 border border-white/5 hover:border-cyan-400/40 text-center transition-all group"
            >
              <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 transition-colors">
                {agency.name}
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-1">{agency.country}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quality Assurance 5-Step Process System */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#00D2FF] uppercase tracking-wider">
          <ShieldCheck className="h-4 w-4" />
          <span>Steels Vision 5-Stage Zero-Defect Protocol</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {COMPANY_INFO.qualityAssuranceSteps.map((step, idx) => (
            <div
              key={step.title}
              className="p-5 rounded-2xl bg-slate-950/80 border border-white/10 relative flex flex-col justify-between"
            >
              <div className="space-y-2">
                <span className="text-2xl font-black font-mono text-slate-600">0{idx + 1}</span>
                <h4 className="text-sm font-bold text-white">{step.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                <span>Verified Traceability</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Export-Ready Packaging Standards */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 uppercase tracking-wider">
            <PackageCheck className="h-4 w-4" />
            <span>Heavy Export Sea Logistics</span>
          </div>
          <h3 className="text-2xl font-bold text-white">Seaworthy Industrial Packaging Standards</h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            Every export shipment dispatched through Nhava Sheva (JNPT) or Mundra Port is packed to withstand long-haul
            transoceanic shipping, high humidity, and crane handling without surface scoring or bevel damage.
          </p>
        </div>

        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {COMPANY_INFO.exportPackaging.map((spec, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex items-start gap-3"
            >
              <div className="h-5 w-5 rounded-full bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                ✓
              </div>
              <span className="text-xs text-slate-300 font-medium leading-snug">{spec}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
