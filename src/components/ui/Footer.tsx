"use client";

import React from "react";
import Link from "next/link";
import { COMPANY_INFO } from "@/content/company";
import {
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Globe,
  Award,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#2A3241] bg-[#080A0F] text-slate-400 text-xs font-mono relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {/* Top Corporate Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-[#2A3241]/60">
          {/* Col 1: Identity & Motto */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-[#F97316] flex items-center justify-center text-white font-black text-sm shadow-md shadow-orange-500/20">
                SV
              </div>
              <span className="text-lg font-black text-white tracking-tight font-sans">
                STEELS VISION
              </span>
            </div>
            <p className="text-slate-400 font-sans text-xs leading-relaxed">
              Leading ISO-certified manufacturer, supplier, and stockist of Ferrous and Non-Ferrous metals with over 25
              years of global export excellence.
            </p>
            <div className="p-3 rounded-xl bg-[#0F131C] border border-[#2A3241]/60 space-y-1">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider">Executive Leadership</div>
              <div className="text-white font-bold">{COMPANY_INFO.managingDirector}</div>
              <div className="text-slate-400 text-[11px]">{COMPANY_INFO.leadershipTitle}</div>
            </div>
          </div>

          {/* Col 2: Core Export Ranges */}
          <div className="space-y-3">
            <div className="text-white font-bold uppercase tracking-wider text-xs">
              Export Ranges
            </div>
            <ul className="space-y-2 text-slate-400 font-sans text-xs">
              <li>Pipes & Tubes (Seamless, Welded, ERW)</li>
              <li>Forged Flanges (150# to 2500# & API)</li>
              <li>Buttweld & Socketweld Fittings</li>
              <li>Double Ferrule Instrumentation Fittings</li>
              <li>Plates, Sheets, Coils & Boiler Plates</li>
              <li>Industrial High-Tensile Fasteners</li>
              <li>Structural Steel (IS 2062 MS Angles & Beams)</li>
              <li>Copper Earthing Jumpers & Non-Ferrous</li>
            </ul>
          </div>

          {/* Col 3: Direct Inquiries & Contact */}
          <div className="space-y-3">
            <div className="text-white font-bold uppercase tracking-wider text-xs">
              Global Export Desk
            </div>
            <div className="space-y-2.5">
              <a
                href={`mailto:${COMPANY_INFO.email}`}
                className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors"
              >
                <Mail className="h-4 w-4 text-cyan-400 shrink-0" />
                <span className="break-all">{COMPANY_INFO.email}</span>
              </a>
              <a
                href={`tel:${COMPANY_INFO.phoneRaw}`}
                className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors"
              >
                <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>{COMPANY_INFO.phone}</span>
              </a>
              <div className="flex items-start gap-2 text-slate-400">
                <MapPin className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <span>{COMPANY_INFO.headquarters.address}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400">
                <Globe className="h-4 w-4 text-blue-400 shrink-0" />
                <span>{COMPANY_INFO.domains.join(" | ")}</span>
              </div>
            </div>
          </div>

          {/* Col 4: Corporate Accreditations */}
          <div className="space-y-3">
            <div className="text-white font-bold uppercase tracking-wider text-xs">
              Certifications & Inspections
            </div>
            <div className="flex flex-wrap gap-1.5">
              {COMPANY_INFO.certifications.map((c) => (
                <span
                  key={c.code}
                  className="px-2 py-1 rounded bg-[#0F131C] border border-[#2A3241] text-[11px] text-slate-300"
                >
                  {c.code}
                </span>
              ))}
              <span className="px-2 py-1 rounded bg-red-500/15 border border-red-500/30 text-[11px] text-red-300">
                PED 2014/68/EU
              </span>
              <span className="px-2 py-1 rounded bg-amber-500/15 border border-amber-500/30 text-[11px] text-amber-300">
                IBR Approved
              </span>
            </div>
            <p className="text-[11px] text-slate-500 pt-2 leading-relaxed">
              Routine inspection witness arranged with Lloyd's Register, DNV, TUV, BV, SGS, MECON, MDL, PDIL.
            </p>
          </div>
        </div>

        {/* Global Ports Ticker */}
        <div id="logistics-section" className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white font-semibold uppercase tracking-wider">
              Prime Export Corridors & Discharge Hubs:
            </span>
            <span className="text-cyan-400">INCOTERMS 2020: CIF / FOB / CFR / DDP</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {COMPANY_INFO.exportPorts.map((port) => (
              <span
                key={port.name}
                className="px-3 py-1 rounded-lg bg-[#0F131C] border border-[#2A3241]/60 text-[11px] text-slate-300 flex items-center gap-1.5"
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    port.type === "Origin" ? "bg-emerald-400" : "bg-cyan-400"
                  }`}
                />
                <span>
                  {port.name} ({port.country})
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Rights & Motto */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            © 2026 Steels Vision. All rights reserved. Registered Indian Export Company.
          </div>
          <div className="italic text-slate-400">
            &ldquo;Built for Performance, Delivered with Trust. Your Partner in Progress.&rdquo;
          </div>
        </div>
      </div>
    </footer>
  );
}
