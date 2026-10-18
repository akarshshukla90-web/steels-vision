"use client";

import React from "react";
import { ProductItem } from "@/types";
import { COMPANY_INFO } from "@/content/company";
import {
  FileCheck2,
  X,
  ShieldCheck,
  CheckCircle2,
  Printer,
  Download,
  Building,
  Stamp,
  Award,
} from "lucide-react";

interface MTCModalProps {
  product: ProductItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function MTCModal({ product, isOpen, onClose }: MTCModalProps) {
  if (!isOpen || !product) return null;

  const certNumber = `MTC-SV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
  const heatNumber = `HT-SV${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-slate-950 border border-white/20 rounded-2xl shadow-2xl flex flex-col overflow-hidden my-auto text-slate-100 font-mono">
        {/* Certificate Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Certified Mill Test Certificate (MTC) Sample
              </h3>
              <p className="text-xs text-slate-400">
                Conforming to <strong>EN 10204 3.1 &amp; 3.2</strong> Inspection Standards
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title="Print Certificate"
            >
              <Printer className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Certificate Document Canvas (Simulated Paper / Technical Report) */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs bg-slate-950">
          {/* Header of Certificate */}
          <div className="border border-white/15 p-5 rounded-xl bg-slate-900/50 space-y-3 relative overflow-hidden">
            <div className="absolute top-2 right-3 text-right">
              <span className="text-[10px] text-slate-500">Certificate No:</span>
              <div className="font-bold text-cyan-400">{certNumber}</div>
              <span className="text-[10px] text-slate-500">Heat No: {heatNumber}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#F97316] flex items-center justify-center text-white font-black text-sm shadow-md shadow-orange-500/20">
                SV
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white">STEELS VISION QUALITY ASSURANCE DIVISION</h2>
                <p className="text-[11px] text-slate-400">
                  Works: Vadodara Plant &amp; Mumbai Port Logistics Hub, India | ISO 9001:2015 / 14001:2015
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-white/10 text-[11px]">
              <div>
                <span className="text-slate-500">Product:</span>
                <div className="text-white font-semibold">{product.name}</div>
              </div>
              <div>
                <span className="text-slate-500">Standard Spec:</span>
                <div className="text-cyan-300 font-semibold">{product.standards[0] || "ASTM / ASME"}</div>
              </div>
              <div>
                <span className="text-slate-500">Material Grade:</span>
                <div className="text-amber-300 font-semibold">
                  {product.grades.stainlessSteel?.[0] || product.grades.highNickel?.[0] || "TP 316L / Inconel 625"}
                </div>
              </div>
              <div>
                <span className="text-slate-500">Inspection Body:</span>
                <div className="text-emerald-400 font-semibold">Lloyd's Register / TUV (Witnessed)</div>
              </div>
            </div>
          </div>

          {/* Chemical Analysis Matrix */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold uppercase tracking-wider text-slate-300">
                1. Chemical Composition Analysis (% by Weight - 100% PMI Verified)
              </span>
              <span className="text-[10px] text-emerald-400">PASSED SPEC BOUNDS</span>
            </div>

            <div className="overflow-x-auto border border-white/10 rounded-xl">
              <table className="w-full text-center border-collapse">
                <thead>
                  <tr className="bg-slate-900 border-b border-white/10 text-slate-400">
                    <th className="p-2">Element</th>
                    <th className="p-2">C</th>
                    <th className="p-2">Si</th>
                    <th className="p-2">Mn</th>
                    <th className="p-2">P</th>
                    <th className="p-2">S</th>
                    <th className="p-2">Cr</th>
                    <th className="p-2">Ni</th>
                    <th className="p-2">Mo</th>
                    <th className="p-2">N</th>
                  </tr>
                </thead>
                <tbody className="text-slate-200 divide-y divide-white/5 bg-slate-900/30">
                  <tr>
                    <td className="p-2 font-semibold text-slate-400">Heat Sample</td>
                    <td className="p-2 text-cyan-300 font-bold">0.021</td>
                    <td className="p-2">0.45</td>
                    <td className="p-2">1.35</td>
                    <td className="p-2">0.028</td>
                    <td className="p-2">0.006</td>
                    <td className="p-2 text-cyan-300 font-bold">17.20</td>
                    <td className="p-2 text-cyan-300 font-bold">12.10</td>
                    <td className="p-2 text-cyan-300 font-bold">2.45</td>
                    <td className="p-2">0.04</td>
                  </tr>
                  <tr className="text-slate-500 text-[10px]">
                    <td className="p-2">ASTM Limits</td>
                    <td className="p-2">&le;0.030</td>
                    <td className="p-2">&le;0.75</td>
                    <td className="p-2">&le;2.00</td>
                    <td className="p-2">&le;0.045</td>
                    <td className="p-2">&le;0.030</td>
                    <td className="p-2">16.0-18.0</td>
                    <td className="p-2">10.0-14.0</td>
                    <td className="p-2">2.00-3.00</td>
                    <td className="p-2">&le;0.10</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Mechanical Properties Matrix */}
          <div className="space-y-2">
            <span className="font-bold uppercase tracking-wider text-slate-300">
              2. Mechanical Test Results (Room Temperature Testing)
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-500">Tensile Strength (Rm)</span>
                <div className="text-base font-bold text-white">585 MPa</div>
                <div className="text-[10px] text-slate-500">Min Spec: 485 MPa</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-500">Yield Strength (0.2%)</span>
                <div className="text-base font-bold text-cyan-300">265 MPa</div>
                <div className="text-[10px] text-slate-500">Min Spec: 205 MPa</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-500">Elongation (A5)</span>
                <div className="text-base font-bold text-white">52 %</div>
                <div className="text-[10px] text-slate-500">Min Spec: 35 %</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10 space-y-1">
                <span className="text-[10px] text-slate-500">Hardness (HRB)</span>
                <div className="text-base font-bold text-emerald-400">78 HRB</div>
                <div className="text-[10px] text-slate-500">Max Spec: 90 HRB</div>
              </div>
            </div>
          </div>

          {/* Supplementary & Non-Destructive Tests (NDT) */}
          <div className="space-y-2">
            <span className="font-bold uppercase tracking-wider text-slate-300">
              3. Supplementary Non-Destructive Testing (NDT) Log
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5 flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-white font-semibold">Hydrostatic Tested</div>
                  <div className="text-[10px] text-slate-400">Tested to 15,000 PSI without drop</div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5 flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-white font-semibold">100% Ultrasonic (UT)</div>
                  <div className="text-[10px] text-slate-400">ASTM A388 Level 1 Cleared</div>
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5 flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <div>
                  <div className="text-white font-semibold">IGC Corrosion Test</div>
                  <div className="text-[10px] text-slate-400">ASTM A262 Practice E Satisfactory</div>
                </div>
              </div>
            </div>
          </div>

          {/* Legal Certification Footer */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <span>We hereby certify that the material conforms to specified requirements of EN 10204 3.1 &amp; 3.2.</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-white">Chief Metallurgical Officer</div>
              <div className="text-slate-500">Steels Vision Testing Division</div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Close */}
        <div className="px-6 py-3.5 bg-slate-900/80 border-t border-white/10 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            For live mill witness inspection, contact <span className="text-cyan-400">steelsvision@gmail.com</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
}
