"use client";

import React, { useState } from "react";
import { ProductItem } from "@/types";
import { Table, Sparkles, Check, FileCheck2, ArrowUpRight, Scale, ShieldCheck, ChevronRight } from "lucide-react";

interface Props {
  product: ProductItem;
  onSelectDimension?: (dim: string) => void;
}

// Authentic ASME B36.10M / B36.19M Dimensional Data for Tubulars
const PIPE_DIMENSIONAL_DATA = [
  { nb: '1/2" (15 NB)', od: 21.34, sch10s: 2.11, sch40s: 2.77, sch80s: 3.73, sch160: 4.78, wtKgM: 1.27 },
  { nb: '3/4" (20 NB)', od: 26.67, sch10s: 2.11, sch40s: 2.87, sch80s: 3.91, sch160: 5.56, wtKgM: 1.69 },
  { nb: '1" (25 NB)', od: 33.40, sch10s: 2.77, sch40s: 3.38, sch80s: 4.55, sch160: 6.35, wtKgM: 2.50 },
  { nb: '1-1/2" (40 NB)', od: 48.26, sch10s: 2.77, sch40s: 3.68, sch80s: 5.08, sch160: 7.14, wtKgM: 4.05 },
  { nb: '2" (50 NB)', od: 60.33, sch10s: 2.77, sch40s: 3.91, sch80s: 5.54, sch160: 8.74, wtKgM: 5.44 },
  { nb: '3" (80 NB)', od: 88.90, sch10s: 3.05, sch40s: 5.49, sch80s: 7.62, sch160: 11.13, wtKgM: 11.29 },
  { nb: '4" (100 NB)', od: 114.30, sch10s: 3.05, sch40s: 6.02, sch80s: 8.56, sch160: 13.49, wtKgM: 16.07 },
  { nb: '6" (150 NB)', od: 168.28, sch10s: 3.40, sch40s: 7.11, sch80s: 10.97, sch160: 18.26, wtKgM: 28.26 },
  { nb: '8" (200 NB)', od: 219.08, sch10s: 3.76, sch40s: 8.18, sch80s: 12.70, sch160: 23.01, wtKgM: 42.55 },
  { nb: '10" (250 NB)', od: 273.05, sch10s: 4.19, sch40s: 9.27, sch80s: 15.09, sch160: 28.58, wtKgM: 60.31 },
  { nb: '12" (300 NB)', od: 323.85, sch10s: 4.57, sch40s: 10.31, sch80s: 17.48, sch160: 33.32, wtKgM: 79.73 },
];

// Authentic ASME B16.5 Flange Dimensional Data
const FLANGE_DIMENSIONAL_DATA = [
  { size: '1/2"', cl150Od: 88.9, cl300Od: 95.2, cl600Od: 95.2, boltHoles: 4, pcdMm: 60.3, wtKg: 0.95 },
  { size: '3/4"', cl150Od: 98.4, cl300Od: 117.5, cl600Od: 117.5, boltHoles: 4, pcdMm: 69.8, wtKg: 1.25 },
  { size: '1"', cl150Od: 107.9, cl300Od: 123.8, cl600Od: 123.8, boltHoles: 4, pcdMm: 79.4, wtKg: 1.55 },
  { size: '1-1/2"', cl150Od: 127.0, cl300Od: 155.6, cl600Od: 155.6, boltHoles: 4, pcdMm: 98.4, wtKg: 2.80 },
  { size: '2"', cl150Od: 152.4, cl300Od: 165.1, cl600Od: 165.1, boltHoles: 4, pcdMm: 120.6, wtKg: 3.90 },
  { size: '3"', cl150Od: 190.5, cl300Od: 209.5, cl600Od: 209.5, boltHoles: 4, pcdMm: 152.4, wtKg: 6.80 },
  { size: '4"', cl150Od: 228.6, cl300Od: 254.0, cl600Od: 273.0, boltHoles: 8, pcdMm: 190.5, wtKg: 9.80 },
  { size: '6"', cl150Od: 279.4, cl300Od: 317.5, cl600Od: 355.6, boltHoles: 8, pcdMm: 241.3, wtKg: 14.5 },
  { size: '8"', cl150Od: 342.9, cl300Od: 381.0, cl600Od: 419.1, boltHoles: 8, pcdMm: 298.4, wtKg: 22.0 },
  { size: '10"', cl150Od: 406.4, cl300Od: 444.5, cl600Od: 508.0, boltHoles: 12, pcdMm: 362.0, wtKg: 32.5 },
  { size: '12"', cl150Od: 482.6, cl300Od: 520.7, cl600Od: 558.8, boltHoles: 12, pcdMm: 431.8, wtKg: 49.0 },
];

// Authentic Chemical Composition Matrix (%)
const CHEMICAL_COMPOSITION_DATA = [
  { grade: "SS 316L (UNS S31603)", c: "≤ 0.030", cr: "16.0 - 18.0", ni: "10.0 - 14.0", mo: "2.00 - 3.00", mn: "≤ 2.00", si: "≤ 0.75", p: "≤ 0.045", s: "≤ 0.030" },
  { grade: "SS 304L (UNS S30403)", c: "≤ 0.030", cr: "18.0 - 20.0", ni: "8.0 - 12.0", mo: "-", mn: "≤ 2.00", si: "≤ 0.75", p: "≤ 0.045", s: "≤ 0.030" },
  { grade: "Duplex 2205 (UNS S31803)", c: "≤ 0.030", cr: "21.0 - 23.0", ni: "4.5 - 6.5", mo: "2.50 - 3.50", mn: "≤ 2.00", si: "≤ 1.00", p: "≤ 0.030", s: "≤ 0.020" },
  { grade: "Super Duplex 2507", c: "≤ 0.030", cr: "24.0 - 26.0", ni: "6.0 - 8.0", mo: "3.00 - 5.00", mn: "≤ 1.20", si: "≤ 0.80", p: "≤ 0.035", s: "≤ 0.020" },
  { grade: "Inconel 625 (UNS N06625)", c: "≤ 0.10", cr: "20.0 - 23.0", ni: "≥ 58.0", mo: "8.00 - 10.0", mn: "≤ 0.50", si: "≤ 0.50", p: "≤ 0.015", s: "≤ 0.015" },
  { grade: "Carbon A106 Gr. B", c: "≤ 0.30", cr: "≤ 0.40", ni: "≤ 0.40", mo: "≤ 0.15", mn: "0.29 - 1.06", si: "≥ 0.10", p: "≤ 0.035", s: "≤ 0.035" },
];

// Mechanical & Tensile Properties
const MECHANICAL_PROPERTIES_DATA = [
  { grade: "SS 316L", tensileMpa: "≥ 485", yieldMpa: "≥ 170", elongationPct: "≥ 40%", hardnessMax: "217 HBW / 95 HRB", impactTemp: "-196°C Cryo Charpy V" },
  { grade: "SS 304L", tensileMpa: "≥ 485", yieldMpa: "≥ 170", elongationPct: "≥ 40%", hardnessMax: "201 HBW / 92 HRB", impactTemp: "Room Temp Charpy V" },
  { grade: "Duplex 2205", tensileMpa: "≥ 620", yieldMpa: "≥ 450", elongationPct: "≥ 25%", hardnessMax: "293 HBW / 31 HRC", impactTemp: "-46°C (≥ 80 Joules)" },
  { grade: "Super Duplex 2507", tensileMpa: "≥ 750", yieldMpa: "≥ 550", elongationPct: "≥ 15%", hardnessMax: "310 HBW / 32 HRC", impactTemp: "-46°C (≥ 80 Joules)" },
  { grade: "Inconel 625", tensileMpa: "≥ 827", yieldMpa: "≥ 414", elongationPct: "≥ 30%", hardnessMax: "≤ 220 HBW", impactTemp: "-196°C to 980°C Service" },
  { grade: "Carbon A106 Gr. B", tensileMpa: "≥ 415", yieldMpa: "≥ 240", elongationPct: "≥ 30%", hardnessMax: "≤ 187 HBW", impactTemp: "0°C (Optional Impact)" },
];

export default function EngineeringSpecsTable({ product, onSelectDimension }: Props) {
  const [activeTab, setActiveTab] = useState<"dimensions" | "chemistry" | "mechanical">("dimensions");
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  const isFlange = product.category.includes("flange");

  const handlePickRow = (dimText: string) => {
    setSelectedRow(dimText);
    if (onSelectDimension) {
      onSelectDimension(dimText);
    }
  };

  return (
    <div className="w-full volumetric-rim-card rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2A3241]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#F97316] uppercase tracking-wider font-bold mb-1">
            <Table className="h-4 w-4" />
            <span>Procurement Engineering Data Sheet</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Dimensional &amp; Metallurgical Engineering Standards
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Verified tolerances conforming strictly to ASME B36.10M, B16.5, ASTM A312, and DIN standards. Certified EN 10204 3.1 MTC included with all dispatched heats.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#080A0F] border border-[#2A3241] self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("dimensions")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all active:scale-95 ${
              activeTab === "dimensions"
                ? "bg-[#F97316] text-white font-bold shadow-md shadow-orange-500/25"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Dimensions (ASME)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("chemistry")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all active:scale-95 ${
              activeTab === "chemistry"
                ? "bg-[#F97316] text-white font-bold shadow-md shadow-orange-500/25"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Chemical Matrix
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("mechanical")}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all active:scale-95 ${
              activeTab === "mechanical"
                ? "bg-[#F97316] text-white font-bold shadow-md shadow-orange-500/25"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Mechanical Values
          </button>
        </div>
      </div>

      {/* Tab 1: Dimensional Specification Grid */}
      {activeTab === "dimensions" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span>
              Standard: <strong className="text-white">{isFlange ? "ASME B16.5 Forged Flanges" : "ASME B36.10M / B36.19M Stainless & Alloy Tubulars"}</strong>
            </span>
            <span className="text-cyan-400 hidden sm:inline">Click any row to configure RFQ</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#2A3241] bg-[#080A0F]/90">
            {isFlange ? (
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#2A3241] bg-[#0F131C] text-slate-300">
                    <th className="py-3 px-4 font-bold">Nominal Size</th>
                    <th className="py-3 px-4 font-bold">Class 150# OD</th>
                    <th className="py-3 px-4 font-bold">Class 300# OD</th>
                    <th className="py-3 px-4 font-bold">Class 600# OD</th>
                    <th className="py-3 px-4 font-bold">Bolt Holes</th>
                    <th className="py-3 px-4 font-bold">PCD (mm)</th>
                    <th className="py-3 px-4 font-bold">Est. Wt (kg)</th>
                    <th className="py-3 px-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A3241]/60 text-slate-300">
                  {FLANGE_DIMENSIONAL_DATA.map((row) => (
                    <tr
                      key={row.size}
                      className={`hover:bg-[#12161F] transition-colors cursor-pointer ${
                        selectedRow === `${row.size} Class 150# Flange` ? "bg-orange-500/10" : ""
                      }`}
                      onClick={() => handlePickRow(`${row.size} Class 150# Flange (OD ${row.cl150Od}mm)`)}
                    >
                      <td className="py-2.5 px-4 font-bold text-white">{row.size}</td>
                      <td className="py-2.5 px-4 text-cyan-300">{row.cl150Od} mm</td>
                      <td className="py-2.5 px-4">{row.cl300Od} mm</td>
                      <td className="py-2.5 px-4">{row.cl600Od} mm</td>
                      <td className="py-2.5 px-4">{row.boltHoles}</td>
                      <td className="py-2.5 px-4">{row.pcdMm} mm</td>
                      <td className="py-2.5 px-4 text-amber-300">{row.wtKg} kg</td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded bg-[#0F131C] hover:bg-[#F97316] text-slate-300 hover:text-white border border-[#2A3241] text-[10px] transition-all"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#2A3241] bg-[#0F131C] text-slate-300">
                    <th className="py-3 px-4 font-bold">Nominal Bore (NB)</th>
                    <th className="py-3 px-4 font-bold">OD (mm)</th>
                    <th className="py-3 px-4 font-bold">Sch 10S WT</th>
                    <th className="py-3 px-4 font-bold">Sch 40S WT</th>
                    <th className="py-3 px-4 font-bold">Sch 80S WT</th>
                    <th className="py-3 px-4 font-bold">Sch 160 WT</th>
                    <th className="py-3 px-4 font-bold">Unit Wt (kg/m)</th>
                    <th className="py-3 px-4 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2A3241]/60 text-slate-300">
                  {PIPE_DIMENSIONAL_DATA.map((row) => (
                    <tr
                      key={row.nb}
                      className={`hover:bg-[#12161F] transition-colors cursor-pointer ${
                        selectedRow === `${row.nb} Sch 40S Pipe` ? "bg-orange-500/10" : ""
                      }`}
                      onClick={() => handlePickRow(`${row.nb} Pipe (OD ${row.od}mm x WT ${row.sch40s}mm Sch 40S)`)}
                    >
                      <td className="py-2.5 px-4 font-bold text-white">{row.nb}</td>
                      <td className="py-2.5 px-4 text-cyan-300">{row.od} mm</td>
                      <td className="py-2.5 px-4">{row.sch10s} mm</td>
                      <td className="py-2.5 px-4 text-amber-300 font-semibold">{row.sch40s} mm</td>
                      <td className="py-2.5 px-4">{row.sch80s} mm</td>
                      <td className="py-2.5 px-4">{row.sch160} mm</td>
                      <td className="py-2.5 px-4 text-slate-200">{row.wtKgM} kg/m</td>
                      <td className="py-2.5 px-4 text-right">
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded bg-[#0F131C] hover:bg-[#F97316] text-slate-300 hover:text-white border border-[#2A3241] text-[10px] transition-all"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Chemical Composition Matrix */}
      {activeTab === "chemistry" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span>ASTM / ASME Specified Maximum &amp; Nominal Percentages (%)</span>
            <span className="text-emerald-400">100% Optical Emission Spectrometer Verified</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#2A3241] bg-[#080A0F]/90">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-[#2A3241] bg-[#0F131C] text-slate-300">
                  <th className="py-3 px-4 font-bold">Grade Specification</th>
                  <th className="py-3 px-4 font-bold">C (%)</th>
                  <th className="py-3 px-4 font-bold">Cr (%)</th>
                  <th className="py-3 px-4 font-bold">Ni (%)</th>
                  <th className="py-3 px-4 font-bold">Mo (%)</th>
                  <th className="py-3 px-4 font-bold">Mn (%)</th>
                  <th className="py-3 px-4 font-bold">Si (%)</th>
                  <th className="py-3 px-4 font-bold">P / S max</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A3241]/60 text-slate-300">
                {CHEMICAL_COMPOSITION_DATA.map((row) => (
                  <tr key={row.grade} className="hover:bg-[#12161F] transition-colors">
                    <td className="py-2.5 px-4 font-bold text-white">{row.grade}</td>
                    <td className="py-2.5 px-4">{row.c}</td>
                    <td className="py-2.5 px-4 text-cyan-300 font-semibold">{row.cr}</td>
                    <td className="py-2.5 px-4 text-amber-300 font-semibold">{row.ni}</td>
                    <td className="py-2.5 px-4">{row.mo}</td>
                    <td className="py-2.5 px-4">{row.mn}</td>
                    <td className="py-2.5 px-4">{row.si}</td>
                    <td className="py-2.5 px-4 text-slate-400">{row.p} / {row.s}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Mechanical & Tensile Values */}
      {activeTab === "mechanical" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
            <span>Minimum Mechanical Strengths per ASME Boiler &amp; Pressure Vessel Code (Section II Part D)</span>
            <span className="text-amber-400">Tested to ASTM A370</span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#2A3241] bg-[#080A0F]/90">
            <table className="w-full text-left border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-[#2A3241] bg-[#0F131C] text-slate-300">
                  <th className="py-3 px-4 font-bold">Alloy Grade</th>
                  <th className="py-3 px-4 font-bold">Tensile Strength (min)</th>
                  <th className="py-3 px-4 font-bold">Yield Strength (0.2% min)</th>
                  <th className="py-3 px-4 font-bold">Elongation (%)</th>
                  <th className="py-3 px-4 font-bold">Hardness Max</th>
                  <th className="py-3 px-4 font-bold">Charpy V-Notch Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A3241]/60 text-slate-300">
                {MECHANICAL_PROPERTIES_DATA.map((row) => (
                  <tr key={row.grade} className="hover:bg-[#12161F] transition-colors">
                    <td className="py-2.5 px-4 font-bold text-white">{row.grade}</td>
                    <td className="py-2.5 px-4 text-cyan-300 font-bold">{row.tensileMpa} MPa</td>
                    <td className="py-2.5 px-4 text-amber-300 font-bold">{row.yieldMpa} MPa</td>
                    <td className="py-2.5 px-4">{row.elongationPct}</td>
                    <td className="py-2.5 px-4">{row.hardnessMax}</td>
                    <td className="py-2.5 px-4 text-slate-300">{row.impactTemp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Compliance Signal Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#2A3241] text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Full Material Traceability (Heat Number Stamping &amp; Stenciling)</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-cyan-400">Lloyd's Register</span>
          <span>&bull;</span>
          <span className="text-cyan-400">DNV</span>
          <span>&bull;</span>
          <span className="text-cyan-400">TUV Rheinland</span>
          <span>&bull;</span>
          <span className="text-cyan-400">IBR Approved</span>
        </div>
      </div>
    </div>
  );
}
