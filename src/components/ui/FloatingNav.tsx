"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { COMPANY_INFO } from "@/content/company";
import { useRFQBasket } from "@/hooks/useRFQBasket";
import { useAmbience } from "@/hooks/useAmbience";
import {
  FileText,
  PhoneCall,
  Menu,
  X,
  ShieldCheck,
  ChevronRight,
  Layers,
  Calculator,
  Play,
  Sparkles,
} from "lucide-react";

export default function FloatingNav() {
  const { totalItemsCount, openRFQModal } = useRFQBasket();
  const { mode, setMode, setIsCinemaOpen } = useAmbience();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cycleAmbience = () => {
    if (mode === "molten") setMode("blueprint");
    else if (mode === "blueprint") setMode("cryo");
    else setMode("molten");
  };

  return (
    <header className="fixed top-3 sm:top-5 left-0 right-0 z-50 flex justify-center px-3 pointer-events-none">
      {/* Floating Dynamic Island Container */}
      <div
        className={`pointer-events-auto transition-all duration-300 ease-out flex items-center justify-between border border-white/15 backdrop-blur-2xl bg-slate-950/85 shadow-2xl shadow-black/60 ${
          isScrolled
            ? "w-full max-w-4xl py-2 px-4 rounded-full"
            : "w-full max-w-6xl py-2.5 px-5 rounded-2xl sm:rounded-full"
        }`}
      >
        {/* Brand Pill */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#FF3B30] to-red-800 flex items-center justify-center text-white font-black font-mono text-sm shadow-lg shadow-red-500/25 group-hover:scale-105 transition-transform">
            SV
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                STEELS VISION
              </span>
              <span className="hidden sm:inline text-[9px] font-mono px-1 py-0.2 rounded bg-white/10 text-slate-300">
                GLOBAL
              </span>
            </div>
            {!isScrolled && (
              <p className="hidden md:block text-[9px] font-mono text-slate-400 tracking-wider uppercase">
                ISO 9001 / 14001 / 45001 &bull; 25+ Yrs
              </p>
            )}
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 text-[11px] font-mono uppercase tracking-wider text-slate-300">
          <Link href="#hero-3d" className="hover:text-cyan-400 transition-colors">
            3D Visualizer
          </Link>
          <Link href="#catalog-section" className="hover:text-cyan-400 transition-colors">
            Products
          </Link>
          <Link href="#calculator-section" className="hover:text-cyan-400 transition-colors">
            Calculator
          </Link>
          <Link href="#compliance-section" className="hover:text-cyan-400 transition-colors">
            Compliance
          </Link>
          <Link href="#lead-capture-section" className="hover:text-cyan-400 transition-colors">
            Lead Capture
          </Link>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Remotion Brand Reel Cinema Button */}
          <button
            type="button"
            onClick={() => setIsCinemaOpen(true)}
            className="min-h-[38px] px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-red-500/30 text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md hover:shadow-red-500/20 active:scale-95 group"
            title="Watch Steels Vision 4K Industrial Film (Remotion Engine)"
          >
            <Play className="h-3.5 w-3.5 text-red-500 fill-red-500 group-hover:scale-110 transition-transform" />
            <span className="hidden lg:inline text-[11px] uppercase tracking-wider">Brand Reel</span>
          </button>

          {/* Ambience Background Switcher */}
          <button
            type="button"
            onClick={cycleAmbience}
            className="hidden sm:flex min-h-[38px] px-2.5 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white font-mono text-[10px] uppercase items-center gap-1.5 transition-all"
            title="Cycle Remotion Dynamic Background Style"
          >
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>{mode}</span>
          </button>

          {/* High-Conversion RFQ Dynamic Island Button */}
          <button
            onClick={openRFQModal}
            className="min-h-[38px] px-3.5 py-1.5 rounded-full bg-[#FF3B30] hover:bg-red-600 text-white font-bold text-xs font-mono uppercase tracking-wider shadow-lg shadow-red-500/25 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <FileText className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">RFQ</span>
            {totalItemsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-white text-slate-950 font-black text-[10px] animate-bounce">
                {totalItemsCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden min-h-[38px] min-w-[38px] p-2 rounded-xl text-slate-300 hover:text-white bg-slate-900 border border-white/10 flex items-center justify-center"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="pointer-events-auto md:hidden fixed top-18 left-4 right-4 rounded-2xl border border-white/15 bg-slate-950/95 backdrop-blur-2xl p-4 space-y-2 font-mono text-xs uppercase shadow-2xl animate-fade-in">
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              setIsCinemaOpen(true);
            }}
            className="w-full min-h-[44px] flex items-center justify-between px-3 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30"
          >
            <span className="flex items-center gap-2">
              <Play className="h-4 w-4 fill-red-400" />
              Watch 4K Brand Reel (Remotion)
            </span>
            <span className="text-[10px] font-mono">60 FPS</span>
          </button>
          <button
            type="button"
            onClick={() => {
              cycleAmbience();
            }}
            className="w-full min-h-[44px] flex items-center justify-between px-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900 border border-white/5"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              Ambience VFX Mode
            </span>
            <span className="text-amber-400 font-bold">{mode}</span>
          </button>
          <Link
            href="#hero-3d"
            onClick={() => setMobileMenuOpen(false)}
            className="min-h-[44px] flex items-center px-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900"
          >
            3D Visualizer &bull; 8 Products
          </Link>
          <Link
            href="#catalog-section"
            onClick={() => setMobileMenuOpen(false)}
            className="min-h-[44px] flex items-center px-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900"
          >
            Product Catalog &bull; A-Z Grades
          </Link>
          <Link
            href="#calculator-section"
            onClick={() => setMobileMenuOpen(false)}
            className="min-h-[44px] flex items-center px-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900"
          >
            Metallurgical Calculator
          </Link>
          <Link
            href="#compliance-section"
            onClick={() => setMobileMenuOpen(false)}
            className="min-h-[44px] flex items-center px-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900"
          >
            ISO &bull; TPI Inspection Matrix
          </Link>
          <Link
            href="#lead-capture-section"
            onClick={() => setMobileMenuOpen(false)}
            className="min-h-[44px] flex items-center px-3 rounded-xl text-slate-300 hover:text-white hover:bg-slate-900"
          >
            Direct Lead Capture
          </Link>
        </div>
      )}
    </header>
  );
}
