"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/content/products";
import { ProductItem, MetalCategory } from "@/types";
import { useRFQBasket } from "@/hooks/useRFQBasket";
import MTCModal from "@/components/catalog/MTCModal";
import {
  Layers,
  Search,
  Plus,
  Check,
  FileCheck2,
  Anchor,
  Sparkles,
  ArrowUpDown,
  ShieldCheck,
  ArrowUpRight,
  ArrowRight,
  Filter,
} from "lucide-react";

type MaterialClassFilter = "all" | "stainless" | "high-nickel" | "carbon-alloy" | "duplex" | "non-ferrous";
type SortOrder = "default" | "a-z" | "z-a";

export default function ProductCatalog() {
  const { addItem, openRFQModal } = useRFQBasket();

  // Filters state
  const [selectedShape, setSelectedShape] = useState<string>("all");
  const [selectedMaterialClass, setSelectedMaterialClass] = useState<MaterialClassFilter>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("default");
  const [searchQuery, setSearchQuery] = useState("");
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  // MTC preview modal state
  const [selectedMtcProduct, setSelectedMtcProduct] = useState<ProductItem | null>(null);

  const shapes = [
    { id: "all", label: "All Product Shapes" },
    { id: "pipes-and-tubes", label: "Pipes & Tubes" },
    { id: "flanges", label: "Forged Flanges" },
    { id: "buttweld-fittings", label: "Buttweld Fittings" },
    { id: "screwed-forged-fittings", label: "Screwed / Forged Fittings" },
    { id: "double-ferrule-fittings", label: "Double Ferrule Fittings" },
    { id: "plates-sheets-coils", label: "Plates, Sheets & Coils" },
    { id: "fasteners", label: "Fasteners & Bolting" },
    { id: "rods-bars-wires", label: "Bars, Rods & Wires" },
    { id: "structural-steel", label: "Structural Steel (IS 2062)" },
    { id: "copper-jumpers-non-ferrous", label: "Copper Jumpers & Non-Ferrous" },
  ];

  const materialClasses: { id: MaterialClassFilter; label: string }[] = [
    { id: "all", label: "All Material Classes" },
    { id: "stainless", label: "Stainless Steel (304 / 316 / 321 / 904L)" },
    { id: "high-nickel", label: "High Nickel Alloys (Inconel / Monel / Hastelloy)" },
    { id: "carbon-alloy", label: "Carbon & Alloy Steel (A106 / P11 / P22 / P91)" },
    { id: "duplex", label: "Duplex & Super Duplex (2205 / 2507)" },
    { id: "non-ferrous", label: "Non-Ferrous & Copper / Brass" },
  ];

  // Dynamic aggregation filter logic
  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter((p) => {
      // 1. Shape Filter
      const matchesShape = selectedShape === "all" || p.category === selectedShape;

      // 2. Material Class Filter
      let matchesMaterial = true;
      if (selectedMaterialClass === "stainless") {
        matchesMaterial = (p.grades.stainlessSteel?.length || 0) > 0;
      } else if (selectedMaterialClass === "high-nickel") {
        matchesMaterial = (p.grades.highNickel?.length || 0) > 0;
      } else if (selectedMaterialClass === "carbon-alloy") {
        matchesMaterial =
          (p.grades.carbonSteel?.length || 0) > 0 || (p.grades.alloySteel?.length || 0) > 0;
      } else if (selectedMaterialClass === "duplex") {
        matchesMaterial = (p.grades.duplexSuperDuplex?.length || 0) > 0;
      } else if (selectedMaterialClass === "non-ferrous") {
        matchesMaterial =
          (p.grades.others?.length || 0) > 0 ||
          p.category === "copper-jumpers-non-ferrous";
      }

      // 3. Search Query
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.standards.some((s) => s.toLowerCase().includes(q)) ||
        Object.values(p.grades).some((arr) => arr?.some((g) => g.toLowerCase().includes(q)));

      return matchesShape && matchesMaterial && matchesSearch;
    });

    // 4. A-Z Sorting
    if (sortOrder === "a-z") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === "z-a") {
      result = [...result].sort((a, b) => b.name.localeCompare(a.name));
    }

    return result;
  }, [selectedShape, selectedMaterialClass, sortOrder, searchQuery]);

  const handleAddProduct = (product: ProductItem) => {
    const grade =
      product.grades.stainlessSteel?.[0] ||
      product.grades.highNickel?.[0] ||
      product.grades.carbonSteel?.[0] ||
      "Standard ASTM/ASME Grade";

    addItem({
      category: product.category,
      productName: product.name,
      materialGrade: grade,
      typeOrForm: product.types[0] || "Standard",
      dimensions: product.sizeRange.split("|")[0].trim(),
      quantity: 1,
      unit: "Pieces",
      notes: `Standard specification: ${product.standards[0] || "ASTM/ASME"} - Stock Ready`,
    });

    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <section className="w-full py-14 space-y-8" id="catalog-section">
      {/* Catalog Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#E63946] uppercase tracking-wider">
            <Layers className="h-4 w-4" />
            <span>International Procurement Database</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Granular Product Catalog &amp; Grade Matrix
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl">
            Filter dynamically across metal shapes, material classes, and certified ASTM/ASME specifications.
            All items include authentic sample EN 10204 3.1 MTC documentation.
          </p>
        </div>

        {/* Live Search & Sort Bar */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-72">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search grade (e.g. Inconel 625, 316L, X70)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-red-500 transition-all placeholder:text-slate-500 min-h-[46px]"
            />
          </div>

          {/* A-Z Sort Dropdown */}
          <div className="relative min-w-[130px]">
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className="w-full px-3 py-3 bg-slate-900 border border-white/10 rounded-xl text-white font-mono text-xs focus:border-red-500 min-h-[46px] cursor-pointer"
            >
              <option value="default">Sort: Priority</option>
              <option value="a-z">Sort: A to Z</option>
              <option value="z-a">Sort: Z to A</option>
            </select>
          </div>
        </div>
      </div>

      {/* 1. SHAPE FILTER PILLS (A-Z SHAPES) */}
      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-cyan-400" />
          Filter by Product Shape:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {shapes.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedShape(s.id)}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                selectedShape === s.id
                  ? "bg-[#E63946] text-white shadow-lg shadow-red-500/25 font-bold"
                  : "bg-slate-900/70 text-slate-300 hover:bg-slate-800 hover:text-white border border-white/5"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. MATERIAL CLASS FILTER PILLS */}
      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          Filter by Material Metallurgy Class:
        </span>
        <div className="flex flex-wrap gap-2">
          {materialClasses.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMaterialClass(m.id)}
              className={`min-h-[40px] px-3.5 py-2 rounded-xl text-xs font-mono transition-all ${
                selectedMaterialClass === m.id
                  ? "bg-slate-200 text-slate-950 font-bold border border-white shadow-md"
                  : "bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-800 border border-white/5"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Count & Feedback */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
        <span>
          Showing <strong className="text-white">{filteredProducts.length}</strong> matching industrial export lines
        </span>
        {(selectedShape !== "all" || selectedMaterialClass !== "all" || searchQuery) && (
          <button
            onClick={() => {
              setSelectedShape("all");
              setSelectedMaterialClass("all");
              setSearchQuery("");
              setSortOrder("default");
            }}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            Reset All Filters
          </button>
        )}
      </div>

      {/* 3. PRODUCT CARDS GRID */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-white/10 bg-slate-950/40">
          <p className="text-slate-300 text-sm">No products found matching your exact filter criteria.</p>
          <p className="text-xs text-slate-500 mt-1">Try selecting &ldquo;All Shapes&rdquo; or clearing the search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProducts.map((product) => {
            const isAdded = !!addedIds[product.id];

            return (
              <div
                key={product.id}
                className="glass-panel p-6 sm:p-7 rounded-2xl border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Metallic glow background */}
                <div className="absolute -top-16 -right-16 w-36 h-36 bg-slate-700/10 rounded-full blur-2xl group-hover:bg-red-500/10 transition-all" />

                <div className="space-y-4">
                  {/* Category Header & LIVE STOCK DISPATCH BADGE */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                      {product.category.replace(/-/g, " ")}
                    </span>

                    {/* LIVE DISPATCH BADGE (COMPETITIVE INDUSTRIAL BENCHMARK) */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-mono font-semibold">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>Ready Stock: Immediate Dispatch from Vadodara / Mumbai Port</span>
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {product.tagline}
                    </p>
                  </div>

                  {/* Technical Specifications Highlights */}
                  <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/5 space-y-2 text-xs font-mono">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-400 shrink-0">Size Range:</span>
                      <span className="text-slate-200 text-right">{product.sizeRange}</span>
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-400 shrink-0">Class / WT:</span>
                      <span className="text-cyan-300 text-right">{product.wallThicknessOrClass}</span>
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-slate-400 shrink-0">Standard:</span>
                      <span className="text-slate-200 text-right text-[11px]">{product.standards[0]}</span>
                    </div>
                  </div>

                  {/* Available Material Grades Pills */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                      Standard Material Grades Available:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {product.grades.stainlessSteel?.slice(0, 3).map((g) => (
                        <span
                          key={g}
                          className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-800 text-slate-200 border border-white/5"
                        >
                          {g}
                        </span>
                      ))}
                      {product.grades.highNickel?.slice(0, 3).map((g) => (
                        <span
                          key={g}
                          className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20"
                        >
                          {g}
                        </span>
                      ))}
                      {product.grades.duplexSuperDuplex?.slice(0, 2).map((g) => (
                        <span
                          key={g}
                          className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                        >
                          {g}
                        </span>
                      ))}
                      {product.grades.carbonSteel?.slice(0, 2).map((g) => (
                        <span
                          key={g}
                          className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-800 text-slate-300 border border-white/5"
                        >
                          {g}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Seaworthy Port Dispatch Anchor Signal */}
                  <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 pt-1">
                    <Anchor className="h-3.5 w-3.5 text-cyan-400" />
                    <span>Direct Vessel Loading: JNPT (Nhava Sheva) &amp; Mundra Port</span>
                  </div>
                </div>

                {/* Action Buttons: Add to RFQ + MTC Certificate Preview Toggle + View Dedicated 3D Page */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-5 border-t border-white/10 mt-5">
                  <button
                    type="button"
                    onClick={() => handleAddProduct(product)}
                    className={`min-h-[46px] flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      isAdded
                        ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/30"
                        : "bg-[#FF3B30] hover:bg-red-600 text-white shadow-md shadow-red-500/20 active:scale-95"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Added to RFQ Basket!</span>
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4" />
                        <span>Add to RFQ</span>
                      </>
                    )}
                  </button>

                  {/* INTERACTIVE MTC PREVIEW TOGGLE */}
                  <button
                    type="button"
                    onClick={() => setSelectedMtcProduct(product)}
                    className="min-h-[46px] px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 text-xs font-mono flex items-center justify-center gap-1.5 transition-all"
                    title="Inspect certified EN 10204 3.1 & 3.2 Mill Test Certificate"
                  >
                    <FileCheck2 className="h-4 w-4 text-emerald-400" />
                    <span>MTC 3.1</span>
                  </button>

                  {/* DEDICATED INDIVIDUAL PRODUCT & 3D PAGE LINK */}
                  <Link
                    href={`/products/${product.id}`}
                    className="min-h-[46px] px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-300 hover:text-white border border-white/10 text-xs font-mono flex items-center justify-center gap-1.5 transition-all group"
                    title="View dedicated product specifications & 3D model"
                  >
                    <span>3D Specs</span>
                    <ArrowRight className="h-3.5 w-3.5 text-cyan-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Render MTC Sample Modal */}
      <MTCModal
        product={selectedMtcProduct}
        isOpen={!!selectedMtcProduct}
        onClose={() => setSelectedMtcProduct(null)}
      />
    </section>
  );
}
