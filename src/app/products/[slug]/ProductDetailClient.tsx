"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ProductItem } from "@/types";
import { COMPANY_INFO } from "@/content/company";
import { useRFQBasket } from "@/hooks/useRFQBasket";
import MetalHeroScene, { Product3DModel } from "@/components/canvas/MetalHeroScene";
import MTCModal from "@/components/catalog/MTCModal";
import {
  ShieldCheck,
  Award,
  Layers,
  FileCheck2,
  Plus,
  Check,
  Ship,
  Anchor,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  Sparkles,
  SearchCheck,
  Clock,
  PhoneCall,
  Mail,
  Scale,
} from "lucide-react";

interface ProductDetailClientProps {
  product: ProductItem;
  relatedProducts: ProductItem[];
  currentSlug: string;
}

export default function ProductDetailClient({
  product,
  relatedProducts,
  currentSlug,
}: ProductDetailClientProps) {
  const { addItem, openRFQModal } = useRFQBasket();
  const [isMtcOpen, setIsMtcOpen] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  // Quick RFQ line configurator state
  const defaultGrade =
    product.grades.stainlessSteel?.[0] ||
    product.grades.highNickel?.[0] ||
    product.grades.carbonSteel?.[0] ||
    "TP 316L / Inconel 625";

  const [selectedGrade, setSelectedGrade] = useState(defaultGrade);
  const [customDimension, setCustomDimension] = useState(
    product.sizeRange.split("|")[0].trim()
  );
  const [quantity, setQuantity] = useState(10);
  const [unit, setUnit] = useState<"Pieces" | "Meters" | "Metric Tons">("Pieces");

  // Determine matching 3D model
  let modelType: Product3DModel = "pipes";
  if (product.category === "flanges") modelType = "flanges";
  else if (
    product.category === "buttweld-fittings" ||
    product.category === "screwed-forged-fittings" ||
    product.category === "double-ferrule-fittings"
  ) {
    modelType = "fittings";
  } else if (product.category === "plates-sheets-coils") {
    if (currentSlug.includes("coil")) modelType = "coils";
    else if (currentSlug.includes("sheet")) modelType = "sheets";
    else modelType = "plates";
  } else if (product.category === "rods-bars-wires") {
    modelType = "bars";
  }

  const handleAddToCart = () => {
    addItem({
      category: product.category,
      productName: product.name,
      materialGrade: selectedGrade,
      typeOrForm: product.types[0] || "Standard",
      dimensions: customDimension || "Standard Dimensions",
      quantity: quantity,
      unit: unit,
      notes: `Configured via dedicated product page (${product.standards[0] || "ASTM/ASME"})`,
    });

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* 1. BREADCRUMBS & NAVIGATION */}
      <nav className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-600" />
        <Link href="/#catalog-section" className="hover:text-white transition-colors">
          Products Catalog
        </Link>
        <ChevronRight className="h-3 w-3 text-slate-600" />
        <span className="text-white font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* 2. DEDICATED HERO: TITLE, BADGES & INTERACTIVE 3D VIEWER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Product Info & Configurator */}
        <div className="lg:col-span-6 space-y-6">
          {/* Stock & Port Dispatch Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono font-semibold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Ready Stock: Immediate Dispatch from Vadodara / Mumbai Port</span>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
              {product.category.replace(/-/g, " ")}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {product.name}
            </h1>
            <p className="text-sm font-mono text-[#FF3B30] font-semibold">
              {product.tagline}
            </p>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed">
            {product.description}
          </p>

          {/* Quick Specifications Pill Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-0.5">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Primary Standard</span>
              <div className="text-xs font-bold text-white font-mono truncate">{product.standards[0]}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-0.5">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Size Availability</span>
              <div className="text-xs font-bold text-cyan-300 font-mono truncate">{product.sizeRange.split("|")[0]}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-0.5 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Quality Grade</span>
              <div className="text-xs font-bold text-emerald-400 font-mono">100% PMI Cleared</div>
            </div>
          </div>

          {/* EMBEDDED INSTANT RFQ CONFIGURATOR DRAWER */}
          <div className="p-5 sm:p-6 rounded-2xl bg-slate-950/90 border border-white/15 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                Configure Custom RFQ Line Item
              </span>
              <span className="text-[10px] font-mono text-slate-400">Direct Export Desk</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Material Grade
                </label>
                <input
                  type="text"
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs font-mono text-white focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Dimensions / Schedule / Class
                </label>
                <input
                  type="text"
                  value={customDimension}
                  onChange={(e) => setCustomDimension(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs font-mono text-white focus:border-red-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Quantity Required
                </label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs font-mono text-white focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Unit of Measure
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as "Pieces" | "Meters" | "Metric Tons")}
                  className="w-full px-3 py-2 bg-slate-900 border border-white/10 rounded-lg text-xs font-mono text-white focus:border-red-500"
                >
                  <option value="Pieces">Pieces (Pcs)</option>
                  <option value="Meters">Meters (MTR)</option>
                  <option value="Metric Tons">Metric Tons (MT)</option>
                </select>
              </div>
            </div>

            {/* Actions: Add to RFQ + Preview MTC Certificate */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className={`flex-1 w-full min-h-[46px] py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  addedNotice
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/30"
                    : "bg-[#FF3B30] hover:bg-red-600 text-white shadow-lg shadow-red-500/25 active:scale-95"
                }`}
              >
                {addedNotice ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Added to Global RFQ Basket!</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    <span>Add Configured Item to RFQ Basket</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsMtcOpen(true)}
                className="w-full sm:w-auto min-h-[46px] px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-200 hover:text-white border border-white/10 text-xs font-mono flex items-center justify-center gap-1.5 transition-colors"
              >
                <FileCheck2 className="h-4 w-4 text-emerald-400" />
                <span>Sample MTC 3.1</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Interactive Model Viewer with Exploded View */}
        <div className="lg:col-span-6 w-full">
          <div className="w-full h-[540px] sm:h-[620px] rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-slate-950 relative">
            <MetalHeroScene initialModel={modelType} compactControls={false} />
          </div>
        </div>
      </div>

      {/* 3. DEEP TECHNICAL SPECIFICATION & COMPLIANCE BENTO GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        {/* Bento 1: Standards & Dimensions */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase font-bold">
            <Layers className="h-4 w-4" />
            <span>Dimensional Standards</span>
          </div>
          <h3 className="text-lg font-bold text-white">Engineering Specifications</h3>

          <div className="space-y-2 text-xs font-mono text-slate-300">
            <div className="p-2.5 rounded-lg bg-slate-900/60 flex justify-between">
              <span className="text-slate-500">Sizes:</span>
              <span className="text-white text-right">{product.sizeRange}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/60 flex justify-between">
              <span className="text-slate-500">Thickness/Class:</span>
              <span className="text-cyan-300 text-right">{product.wallThicknessOrClass}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/60 flex justify-between">
              <span className="text-slate-500">Primary Standard:</span>
              <span className="text-white text-right">{product.standards[0]}</span>
            </div>
          </div>
        </div>

        {/* Bento 2: Metallurgical Grades Available */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase font-bold">
            <Award className="h-4 w-4" />
            <span>Certified Material Grades</span>
          </div>
          <h3 className="text-lg font-bold text-white">Available Alloys</h3>

          <div className="flex flex-wrap gap-1.5">
            {product.grades.stainlessSteel?.map((g) => (
              <span key={g} className="px-2 py-1 rounded bg-slate-900 border border-white/5 text-[11px] font-mono text-slate-200">
                {g}
              </span>
            ))}
            {product.grades.highNickel?.map((g) => (
              <span key={g} className="px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-[11px] font-mono text-amber-300">
                {g}
              </span>
            ))}
            {product.grades.duplexSuperDuplex?.map((g) => (
              <span key={g} className="px-2 py-1 rounded bg-cyan-500/10 border border-cyan-500/20 text-[11px] font-mono text-cyan-300">
                {g}
              </span>
            ))}
            {product.grades.carbonSteel?.map((g) => (
              <span key={g} className="px-2 py-1 rounded bg-slate-900 border border-white/5 text-[11px] font-mono text-slate-300">
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Bento 3: Third Party Inspection & Seaworthy Logistics */}
        <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase font-bold">
            <ShieldCheck className="h-4 w-4" />
            <span>International Compliance</span>
          </div>
          <h3 className="text-lg font-bold text-white">Inspection &amp; Logistics</h3>

          <p className="text-xs text-slate-400 leading-relaxed">
            Witnessed testing arranged routinely with Lloyd's Register (LRIS), DNV, TUV, Bureau Veritas, and IBR.
          </p>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1 text-xs font-mono">
            <div className="text-white font-bold flex items-center gap-1.5">
              <Anchor className="h-3.5 w-3.5 text-cyan-400" />
              <span>Direct Port Loading</span>
            </div>
            <div className="text-slate-400 text-[11px]">
              Nhava Sheva (JNPT) / Mumbai &amp; Mundra Port. Export crating in ISPM-15 wooden boxes.
            </div>
          </div>
        </div>
      </div>

      {/* 4. RELATED PRODUCTS BENTO ROW */}
      <div className="space-y-4 pt-6">
        <h3 className="text-xl font-bold text-white">Related Export Lines</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {relatedProducts.map((rel) => (
            <Link
              key={rel.id}
              href={`/products/${rel.id}`}
              className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-red-500/40 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono uppercase text-cyan-400">
                  {rel.category.replace(/-/g, " ")}
                </span>
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {rel.name}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2">{rel.tagline}</p>
              </div>

              <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono text-slate-400 group-hover:text-white transition-colors">
                <span>View Technical Specs &amp; 3D</span>
                <ArrowRight className="h-3.5 w-3.5 text-red-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* MTC Sample Modal */}
      <MTCModal
        product={product}
        isOpen={isMtcOpen}
        onClose={() => setIsMtcOpen(false)}
      />
    </div>
  );
}
