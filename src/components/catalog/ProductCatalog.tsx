"use client";

import React, { useState } from "react";
import { PRODUCTS } from "@/content/products";
import { ProductItem, MetalCategory } from "@/types";
import { useRFQBasket } from "@/hooks/useRFQBasket";
import {
  Layers,
  Search,
  Plus,
  Check,
  ChevronRight,
  ShieldAlert,
  Flame,
  FileSpreadsheet,
  ArrowUpRight,
} from "lucide-react";

export default function ProductCatalog() {
  const { addItem, openRFQModal } = useRFQBasket();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const categories = [
    { id: "all", label: "All Export Ranges" },
    { id: "pipes-and-tubes", label: "Pipes & Tubes" },
    { id: "flanges", label: "Forged Flanges" },
    { id: "buttweld-fittings", label: "Buttweld Fittings" },
    { id: "screwed-forged-fittings", label: "Screwed / Forged Fittings" },
    { id: "double-ferrule-fittings", label: "Double Ferrule Fittings" },
    { id: "plates-sheets-coils", label: "Plates, Sheets & Coils" },
    { id: "fasteners", label: "Industrial Fasteners" },
    { id: "rods-bars-wires", label: "Rods, Bars & Wires" },
    { id: "structural-steel", label: "Structural Steel (IS 2062)" },
    { id: "copper-jumpers-non-ferrous", label: "Copper Jumpers & Non-Ferrous" },
  ];

  const filteredProducts = PRODUCTS.filter((p) => {
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(q) ||
      p.tagline.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      Object.values(p.grades).some((arr) => arr?.some((g) => g.toLowerCase().includes(q))) ||
      p.standards.some((s) => s.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  const handleAddProduct = (product: ProductItem, preferredGrade?: string) => {
    const grade =
      preferredGrade ||
      product.grades.stainlessSteel?.[0] ||
      product.grades.highNickel?.[0] ||
      product.grades.carbonSteel?.[0] ||
      "Standard Mill Grade";

    addItem({
      category: product.category,
      productName: product.name,
      materialGrade: grade,
      typeOrForm: product.types[0] || "Standard",
      dimensions: product.sizeRange.split("|")[0].trim(),
      quantity: 1,
      unit: "Pieces",
      notes: `Standard specification: ${product.standards[0] || "ASTM/ASME"}`,
    });

    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <section className="w-full py-12 space-y-8" id="catalog-section">
      {/* Catalog Header & Search */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[#E63946] uppercase tracking-wider">
            <Layers className="h-4 w-4" />
            <span>Industrial Metallurgical Inventory</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Comprehensive Export Catalog
          </h2>
          <p className="text-sm text-slate-400 max-w-xl">
            Certified inventory available in prime mill test conditions with complete mill test certificates (EN 10204 3.1 & 3.2).
          </p>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search grade (e.g. Inconel, 316L, X70)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-red-500 transition-all placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? "bg-[#E63946] text-white shadow-lg shadow-red-500/20"
                : "bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-white/5"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProducts.map((product) => {
          const isAdded = !!addedIds[product.id];

          return (
            <div
              key={product.id}
              className="glass-panel p-6 sm:p-7 rounded-2xl border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Subtle metallic card highlight */}
              <div className="absolute -top-16 -right-16 w-32 h-32 bg-slate-700/10 rounded-full blur-2xl group-hover:bg-red-500/10 transition-all" />

              <div className="space-y-4">
                {/* Title & Tagline */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                      {product.category.replace(/-/g, " ")}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-white/5">
                      ISO 9001:2015
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2">{product.tagline}</p>
                </div>

                {/* Technical Specifications Highlights */}
                <div className="p-3.5 rounded-xl bg-slate-900/70 border border-white/5 space-y-2 text-xs font-mono">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-400 shrink-0">Size Range:</span>
                    <span className="text-slate-200 text-right">{product.sizeRange}</span>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-400 shrink-0">Class / WT:</span>
                    <span className="text-cyan-300 text-right">{product.wallThicknessOrClass}</span>
                  </div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-slate-400 shrink-0">Standards:</span>
                    <span className="text-slate-200 text-right text-[11px]">{product.standards[0]}</span>
                  </div>
                </div>

                {/* Available Alloy Grades Breakdown */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                    Representative Material Grades:
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

                {/* Product QA highlight */}
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2">
                  <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  <span>{product.highlight}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-5 border-t border-white/5 mt-5">
                <button
                  type="button"
                  onClick={() => handleAddProduct(product)}
                  className={`flex-1 py-2.5 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
                    isAdded
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/30"
                      : "bg-[#E63946] hover:bg-[#D62839] text-white shadow-md shadow-red-500/20"
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Added to RFQ Basket!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add to RFQ Basket</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={openRFQModal}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 text-xs font-mono flex items-center gap-1 transition-all"
                  title="Direct Commercial Quote"
                >
                  <span>Quote</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-cyan-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
