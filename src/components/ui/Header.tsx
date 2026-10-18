"use client";

import React, { useState } from "react";
import Link from "next/link";
import { COMPANY_INFO } from "@/content/company";
import { useRFQBasket } from "@/hooks/useRFQBasket";
import {
  FileText,
  PhoneCall,
  Mail,
  ShieldCheck,
  Menu,
  X,
  Layers,
  Calculator,
  Award,
  Globe,
} from "lucide-react";

export default function Header() {
  const { totalItemsCount, openRFQModal } = useRFQBasket();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#2A3241] bg-[#0F131C]/92 backdrop-blur-xl">
      {/* Top Industrial Notification Bar */}
      <div className="w-full bg-[#080A0F]/90 border-b border-[#2A3241]/60 py-1.5 px-4 sm:px-8 text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            ISO 9001:2015 / 14001:2015 / 45001:2018
          </span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline text-slate-300">
            Third-Party Inspection Witness: Lloyd's, DNV, TUV, BV, IBR
          </span>
        </div>

        <div className="flex items-center gap-4 text-slate-300">
          <a
            href={`mailto:${COMPANY_INFO.email}`}
            className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors"
          >
            <Mail className="h-3 w-3 text-cyan-400" />
            <span>{COMPANY_INFO.email}</span>
          </a>
          <span className="text-slate-600">|</span>
          <a
            href={`tel:${COMPANY_INFO.phoneRaw}`}
            className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
          >
            <PhoneCall className="h-3 w-3 text-emerald-400" />
            <span>{COMPANY_INFO.phone}</span>
          </a>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Identity */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#F97316] to-[#C2410C] flex items-center justify-center text-white font-black font-mono text-lg shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
            SV
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                STEELS VISION
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-slate-300">
                GLOBAL
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 tracking-wider uppercase">
              Steel Solutions | High-Trusted Partnerships
            </p>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold uppercase tracking-wider text-slate-300">
          <Link href="#hero-3d" className="hover:text-cyan-400 transition-colors">
            3D Visualizer
          </Link>
          <Link href="#calculator-section" className="hover:text-cyan-400 transition-colors">
            Weight Calculator
          </Link>
          <Link href="#catalog-section" className="hover:text-cyan-400 transition-colors">
            Product Catalog
          </Link>
          <Link href="#compliance-section" className="hover:text-cyan-400 transition-colors">
            Compliance & TPI
          </Link>
          <Link href="#logistics-section" className="hover:text-cyan-400 transition-colors">
            Global Ports
          </Link>
        </nav>

        {/* Primary Action & RFQ Basket Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={openRFQModal}
            className="relative min-h-[44px] px-4 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-white font-bold text-xs font-mono uppercase tracking-wider shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all flex items-center gap-2 active:scale-95"
          >
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">RFQ Basket</span>
            <span className="sm:hidden">RFQ</span>
            {totalItemsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-white text-slate-950 font-black text-[11px] animate-bounce">
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle (Min 44x44 touch target) */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle Navigation Menu"
            className="lg:hidden min-h-[44px] min-w-[44px] p-2.5 rounded-xl text-slate-300 hover:text-white bg-[#0F131C] border border-[#2A3241] flex items-center justify-center transition-colors"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#2A3241] bg-[#0F131C]/98 backdrop-blur-xl p-4 space-y-2 font-mono text-xs uppercase animate-fade-in">
          <Link
            href="#hero-3d"
            onClick={() => setMobileMenuOpen(false)}
            className="min-h-[44px] flex items-center px-3 rounded-lg text-slate-300 hover:text-white hover:bg-[#12161F] transition-colors"
          >
            3D Visualizer
          </Link>
          <Link
            href="#calculator-section"
            onClick={() => setMobileMenuOpen(false)}
            className="min-h-[44px] flex items-center px-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
          >
            Weight Calculator
          </Link>
          <Link
            href="#catalog-section"
            onClick={() => setMobileMenuOpen(false)}
            className="min-h-[44px] flex items-center px-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
          >
            Product Catalog &amp; Grades
          </Link>
          <Link
            href="#compliance-section"
            onClick={() => setMobileMenuOpen(false)}
            className="min-h-[44px] flex items-center px-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
          >
            Compliance &amp; TPI
          </Link>
          <Link
            href="#logistics-section"
            onClick={() => setMobileMenuOpen(false)}
            className="min-h-[44px] flex items-center px-3 rounded-lg text-slate-300 hover:text-white hover:bg-slate-900 transition-colors"
          >
            Global Ports
          </Link>
        </div>
      )}
    </header>
  );
}
