"use client";

import React, { useState } from "react";
import { calculateWeight } from "@/lib/calculations";
import { CalculationInput } from "@/types";
import { useRFQBasket } from "@/hooks/useRFQBasket";
import { Calculator, Plus, Check, ArrowRight, Shield, Layers, Scale } from "lucide-react";

export default function WeightCalculator() {
  const { addItem, openRFQModal } = useRFQBasket();
  const [addedNotice, setAddedNotice] = useState(false);

  const [calcType, setCalcType] = useState<CalculationInput["calculatorType"]>("pipe-ss-cs");
  const [outerDiameter, setOuterDiameter] = useState<number>(60.3); // 2" NB default
  const [wallThickness, setWallThickness] = useState<number>(3.91); // Sch 40 default
  const [lengthMeters, setLengthMeters] = useState<number>(6); // Standard 6m pipe
  const [widthMeters, setWidthMeters] = useState<number>(1.5);
  const [thicknessMm, setThicknessMm] = useState<number>(10);
  const [diameterMm, setDiameterMm] = useState<number>(25);
  const [side1Mm, setSide1Mm] = useState<number>(50);
  const [side2Mm, setSide2Mm] = useState<number>(50);
  const [materialMetal, setMaterialMetal] = useState<CalculationInput["materialMetal"]>("stainless-steel");
  const [quantity, setQuantity] = useState<number>(10);

  // Perform calculation
  const result = calculateWeight({
    calculatorType: calcType,
    outerDiameterMm: outerDiameter,
    wallThicknessMm: wallThickness,
    lengthMeters: lengthMeters,
    widthMeters: widthMeters,
    thicknessMm: thicknessMm,
    diameterMm: diameterMm,
    side1Mm: side1Mm,
    side2Mm: side2Mm,
    materialMetal: materialMetal,
    quantity: quantity,
  });

  const handleAddToRFQ = () => {
    let productName = "Custom Metal Specification";
    let dimensions = "";
    let grade = "SS 304 / 316L";

    if (calcType === "pipe-ss-cs") {
      productName = "Seamless / Welded Steel Pipe";
      dimensions = `OD: ${outerDiameter}mm, WT: ${wallThickness}mm, L: ${lengthMeters}m`;
      grade = materialMetal === "carbon-steel" ? "ASTM A106 Gr. B / API 5L" : "ASTM A312 TP 316L / 304L";
    } else if (calcType === "pipe-copper") {
      productName = "Copper Tubing / Pipe";
      dimensions = `OD: ${outerDiameter}mm, WT: ${wallThickness}mm, L: ${lengthMeters}m`;
      grade = "Electrolytic Copper 99.9% / ASTM B88";
    } else if (calcType === "pipe-aluminum") {
      productName = "Aluminium Pipe";
      dimensions = `OD: ${outerDiameter}mm, WT: ${wallThickness}mm, L: ${lengthMeters}m`;
      grade = "Aluminium 6061-T6 / 6082";
    } else if (calcType === "sheet-plate") {
      productName = "Metal Plate / Sheet";
      dimensions = `${lengthMeters}m × ${widthMeters}m × ${thicknessMm}mm`;
      grade = materialMetal === "carbon-steel" ? "ASTM A516 Gr. 70 Boiler Plate" : "ASTM A240 TP 316L";
    } else if (calcType === "round-bar") {
      productName = "Precision Round Bar (Bright / Ground)";
      dimensions = `Dia: ${diameterMm}mm, L: ${lengthMeters}m`;
      grade = "SS 316L / 304L / Inconel 625";
    } else if (calcType === "hex-bar") {
      productName = "Hexagonal Bar (Bright A/F)";
      dimensions = `A/F: ${diameterMm}mm, L: ${lengthMeters}m`;
      grade = "SS 304 / 316L Machining Quality";
    } else if (calcType === "square-bar") {
      productName = "Square Bar";
      dimensions = `Side: ${diameterMm}mm, L: ${lengthMeters}m`;
      grade = "SS 316L / IS 2062";
    } else if (calcType === "circle-blank") {
      productName = "Circle Blank / Flange Disc";
      dimensions = `OD: ${outerDiameter}mm, Thk: ${thicknessMm}mm`;
      grade = "SS 316L / ASTM A240";
    } else if (calcType === "square-rect-pipe") {
      productName = "Hollow Section (Square / Rectangular)";
      dimensions = `${side1Mm}mm × ${side2Mm}mm × ${wallThickness}mm, L: ${lengthMeters}m`;
      grade = "ASTM A554 SS 304 / S355J2H";
    } else if (calcType === "pipe-welded-sheet-width") {
      productName = "Welded Pipe Plate Blank Sheet";
      dimensions = `OD: ${outerDiameter}mm, WT: ${wallThickness}mm -> Width: ${result.unitWeight}mm`;
      grade = "ASTM A240 / IS 2062";
    }

    addItem({
      category: "pipes-and-tubes",
      productName: productName,
      materialGrade: grade,
      typeOrForm: "Engineered Size",
      dimensions: dimensions,
      quantity: quantity,
      unit: "Pieces",
      estimatedWeightKg: result.totalWeight,
      notes: `Calculated formula: ${result.formulaDisplay} (${result.unitWeight} ${result.unitLabel})`,
    });

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  // Quick Presets
  const applyPipePreset = (od: number, wt: number) => {
    setOuterDiameter(od);
    setWallThickness(wt);
  };

  return (
    <div className="w-full glass-panel rounded-2xl p-6 sm:p-8 border border-[#2A3241] relative overflow-hidden">
      {/* Background industrial circuit glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-[#2A3241]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#F97316] uppercase tracking-wider mb-1 font-bold">
            <Calculator className="h-4 w-4" />
            <span>Official Steels Vision Engineering Module</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            Metallurgical Weight & Specification Calculator
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Precision weight estimation algorithms derived directly from ASTM, ASME, and DIN formulas as published in
            the Steels Vision engineering standard.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0F131C] border border-[#2A3241] text-xs font-mono text-slate-300">
          <Scale className="h-4 w-4 text-cyan-400" />
          <span>ISO 9001:2015 Verified Formulae</span>
        </div>
      </div>

      {/* Calculator Type Tabs */}
      <div className="relative z-10 flex flex-wrap gap-2 mb-8">
        {[
          { id: "pipe-ss-cs", label: "Pipes & Tubes (SS / CS)" },
          { id: "pipe-copper", label: "Copper Pipes" },
          { id: "pipe-aluminum", label: "Aluminium Pipes" },
          { id: "sheet-plate", label: "Sheets & Plates" },
          { id: "round-bar", label: "Round Bars" },
          { id: "hex-bar", label: "Hexagonal Rods" },
          { id: "square-bar", label: "Square Rods" },
          { id: "square-rect-pipe", label: "Square/Rect Pipe" },
          { id: "circle-blank", label: "Circle & Blanks" },
          { id: "pipe-welded-sheet-width", label: "Welded Pipe Sheet Width" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCalcType(tab.id as CalculationInput["calculatorType"])}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all active:scale-95 ${
              calcType === tab.id
                ? "bg-[#F97316] text-white shadow-lg shadow-orange-500/20 font-bold"
                : "bg-[#0F131C] text-slate-300 hover:bg-[#12161F] hover:text-white border border-[#2A3241]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Parameters on Left, Real-time Result on Right */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Fields */}
        <div className="lg:col-span-7 space-y-5">
          {/* Preset Buttons for Pipes */}
          {(calcType === "pipe-ss-cs" || calcType === "pipe-copper" || calcType === "pipe-aluminum") && (
            <div>
              <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-2">
                Standard Schedule Presets (ANSI B36.10M / B36.19M)
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: '1/2" Sch 40 (21.3 × 2.77mm)', od: 21.34, wt: 2.77 },
                  { label: '1" Sch 40 (33.4 × 3.38mm)', od: 33.4, wt: 3.38 },
                  { label: '2" Sch 40 (60.3 × 3.91mm)', od: 60.33, wt: 3.91 },
                  { label: '2" Sch 80 (60.3 × 5.54mm)', od: 60.33, wt: 5.54 },
                  { label: '4" Sch 40 (114.3 × 6.02mm)', od: 114.3, wt: 6.02 },
                  { label: '6" Sch 80 (168.3 × 10.97mm)', od: 168.28, wt: 10.97 },
                  { label: '8" Sch XXS (219.1 × 22.23mm)', od: 219.08, wt: 22.23 },
                ].map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => applyPipePreset(p.od, p.wt)}
                    className="px-2.5 py-1 text-xs font-mono bg-slate-900 border border-white/10 rounded-lg text-slate-300 hover:border-cyan-400 hover:text-white transition-all"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Pipe / Circle Inputs */}
          {(calcType === "pipe-ss-cs" ||
            calcType === "pipe-copper" ||
            calcType === "pipe-aluminum" ||
            calcType === "pipe-lead" ||
            calcType === "pipe-welded-sheet-width" ||
            calcType === "circle-blank") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  Outer Diameter OD (mm)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={outerDiameter}
                  onChange={(e) => setOuterDiameter(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 bg-slate-900/90 border border-white/10 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-red-500 transition-all"
                />
              </div>

              {calcType !== "circle-blank" && (
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Wall Thickness WT (mm)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={wallThickness}
                    onChange={(e) => setWallThickness(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 bg-slate-900/90 border border-white/10 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-red-500 transition-all"
                  />
                </div>
              )}
            </div>
          )}

          {/* Hollow Section Square / Rect */}
          {calcType === "square-rect-pipe" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Side 1 / Width (mm)</label>
                <input
                  type="number"
                  value={side1Mm}
                  onChange={(e) => setSide1Mm(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 bg-slate-900/90 border border-white/10 rounded-xl text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Side 2 / Height (mm)</label>
                <input
                  type="number"
                  value={side2Mm}
                  onChange={(e) => setSide2Mm(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 bg-slate-900/90 border border-white/10 rounded-xl text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Wall Thickness (mm)</label>
                <input
                  type="number"
                  step="0.1"
                  value={wallThickness}
                  onChange={(e) => setWallThickness(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 bg-slate-900/90 border border-white/10 rounded-xl text-white font-mono text-sm"
                />
              </div>
            </div>
          )}

          {/* Sheets and Plates Dimensions */}
          {calcType === "sheet-plate" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Alloy / Material Matrix</label>
                <select
                  value={materialMetal}
                  onChange={(e) => setMaterialMetal(e.target.value as CalculationInput["materialMetal"])}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-red-500"
                >
                  <option value="stainless-steel">Stainless Steel (Factor: 8.00 / Density: ~8.00 g/cm³)</option>
                  <option value="carbon-steel">Carbon Steel / Boiler Quality (Factor: 7.85 / Density: ~7.85 g/cm³)</option>
                  <option value="aluminum">Aluminium (Factor: 2.66 / Density: ~2.66 g/cm³)</option>
                  <option value="lead">Lead Chemical Sheet (Factor: 11.20 / Density: ~11.20 g/cm³)</option>
                  <option value="high-nickel">High Nickel Inconel / Monel (Factor: 8.44)</option>
                  <option value="titanium">Titanium Grade 2 / 5 (Factor: 4.51)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Length (Meters)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={lengthMeters}
                    onChange={(e) => setLengthMeters(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Width (Meters)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={widthMeters}
                    onChange={(e) => setWidthMeters(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Thickness (mm)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={thicknessMm}
                    onChange={(e) => setThicknessMm(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Solid Bars (Round, Hex, Square) */}
          {(calcType === "round-bar" || calcType === "hex-bar" || calcType === "square-bar") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  {calcType === "round-bar"
                    ? "Diameter (mm)"
                    : calcType === "hex-bar"
                    ? "Across Flats A/F (mm)"
                    : "Side Width (mm)"}
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={diameterMm}
                  onChange={(e) => setDiameterMm(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Bar Length (Meters)</label>
                <input
                  type="number"
                  step="0.5"
                  value={lengthMeters}
                  onChange={(e) => setLengthMeters(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono text-sm"
                />
              </div>
            </div>
          )}

          {/* Length & Quantity row for pipes/bars */}
          {calcType !== "sheet-plate" && calcType !== "circle-blank" && calcType !== "pipe-welded-sheet-width" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Unit Length (Meters)</label>
                <input
                  type="number"
                  step="0.5"
                  value={lengthMeters}
                  onChange={(e) => setLengthMeters(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Quantity Required</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right: Real-Time Engineering Output Card */}
        <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-2xl bg-[#0F131C]/95 border border-[#2A3241] relative shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                Engineering Calculation
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                LIVE METRICS
              </span>
            </div>

            {/* Main Calculated Weight */}
            <div className="p-4 rounded-xl bg-[#080A0F]/85 border border-[#2A3241]/70 space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-400 font-mono">Unit Weight Metric</span>
                <div className="text-right">
                  <span className="text-2xl font-bold font-mono text-white">{result.unitWeight}</span>
                  <span className="text-xs text-slate-400 ml-1.5">{result.unitLabel}</span>
                </div>
              </div>

              {calcType !== "pipe-welded-sheet-width" && (
                <div className="flex items-baseline justify-between pt-2 border-t border-[#2A3241]/50">
                  <span className="text-xs text-slate-400 font-mono">Total Est. Weight ({quantity} pcs)</span>
                  <div className="text-right">
                    <span className="text-3xl font-extrabold font-mono text-amber-400">{result.totalWeight}</span>
                    <span className="text-xs text-amber-300 ml-1.5">KG</span>
                    <div className="text-[11px] font-mono text-slate-500">
                      ≈ {(result.totalWeight / 1000).toFixed(3)} Metric Tons
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Formula Breakdown */}
            <div className="p-3.5 rounded-xl bg-[#080A0F]/85 border border-[#2A3241]/70 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                Applied Formula:
              </span>
              <p className="text-xs font-mono text-[#F97316] font-semibold bg-black/40 px-2.5 py-1.5 rounded-lg border border-orange-500/20">
                {result.formulaDisplay}
              </p>
              <p className="text-[11px] text-slate-400">
                Ref Standard: <span className="text-slate-300">{result.standardReference}</span>
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-6 border-t border-[#2A3241] mt-6">
            <button
              onClick={handleAddToRFQ}
              className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${
                addedNotice
                  ? "bg-emerald-600 text-white shadow-emerald-500/25"
                  : "bg-[#F97316] hover:bg-orange-600 text-white shadow-orange-500/25 hover:shadow-orange-500/40"
              }`}
            >
              {addedNotice ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Item Added to RFQ Basket!</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  <span>Add Calculated Item to RFQ Basket</span>
                </>
              )}
            </button>

            <button
              onClick={openRFQModal}
              className="w-full py-2.5 px-4 rounded-xl font-medium text-xs text-slate-300 bg-[#080A0F] hover:bg-[#12161F] hover:text-white border border-[#2A3241] flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>View RFQ Basket & Request Final Commercial Quote</span>
              <ArrowRight className="h-3.5 w-3.5 text-cyan-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
