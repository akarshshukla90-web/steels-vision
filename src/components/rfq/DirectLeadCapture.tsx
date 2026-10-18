"use client";

import React, { useState } from "react";
import { COMPANY_INFO } from "@/content/company";
import confetti from "canvas-confetti";
import {
  Send,
  Building2,
  Mail,
  Phone,
  Layers,
  FileText,
  Ship,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Clock,
} from "lucide-react";

export default function DirectLeadCapture() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [productInterest, setProductInterest] = useState("Pipes & Tubes (Seamless / Welded)");
  const [destinationPort, setDestinationPort] = useState("Jebel Ali (UAE)");
  const [requirements, setRequirements] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    reference: string;
    email: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!fullName.trim() || !email.trim()) {
      setErrorMsg("Please provide your Name and Corporate Email.");
      return;
    }

    if (!requirements.trim()) {
      setErrorMsg("Please specify your project requirements, quantities, or material grades.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        fullName,
        contactPerson: fullName,
        email,
        phone,
        companyName: companyName || "International EPC Procurement",
        productInterest,
        destinationPort,
        detailedRequirements: requirements,
        additionalNotes: requirements,
        incoterm: "CIF",
      };

      const res = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to route inquiry");
      }

      setSuccessData({
        reference: data.rfqReference || `SV-RFQ-${Date.now().toString().slice(-6)}`,
        email: data.destinationEmail || "steelsvision@gmail.com",
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#F97316", "#38BDF8", "#FFFFFF"],
        });
      } catch (err) {
        // non-critical
      }
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Could not route form. You can also send directly via email below."
      );
    } finally {
      setLoading(false);
    }
  };

  // Generate direct pre-filled mailto URI for instant fallback
  const mailtoSubject = encodeURIComponent(
    `[PROJECT INQUIRY] ${productInterest} - ${companyName || fullName}`
  );
  const mailtoBody = encodeURIComponent(
    `Dear Vishal Mehta & Steels Vision Export Team,\n\nI would like to request an official CIF/FOB quotation for:\n\nContact Name: ${fullName}\nCompany: ${companyName}\nPhone: ${phone}\nEmail: ${email}\nProduct Interest: ${productInterest}\nDestination Port: ${destinationPort}\n\nTechnical Requirements / BOQ:\n${requirements}\n\nPlease confirm availability and dispatch timeline from Mumbai/Vadodara yard.\n\nBest Regards,\n${fullName}`
  );
  const directMailtoUri = `mailto:${COMPANY_INFO.email}?subject=${mailtoSubject}&body=${mailtoBody}`;

  return (
    <div className="w-full glass-panel rounded-3xl p-6 sm:p-10 border border-white/15 bg-slate-950/90 relative overflow-hidden shadow-2xl">
      {/* Background glow highlights */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 max-w-3xl mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/15 border border-orange-500/30 text-[#F97316] text-xs font-mono uppercase tracking-wider font-bold">
          <Mail className="h-3.5 w-3.5" />
          <span>Direct Lead Routing to steelsvision@gmail.com</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Fast-Track Commercial Quotation &amp; Direct Export Desk
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          Need immediate pricing for EPC tenders, refinery shutdowns, or bulk mill orders? Submit your requirements
          below. Inquiries are parsed and routed directly to Managing Director{" "}
          <strong className="text-white">Vishal Mehta</strong> with a firm commercial response guarantee within 4 hours.
        </p>
      </div>

      {/* Success Notification View */}
      {successData ? (
        <div className="relative z-10 p-8 rounded-2xl bg-[#0F131C] border border-emerald-500/30 text-center space-y-4">
          <div className="inline-flex p-3 rounded-full bg-emerald-500/15 text-emerald-400">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h3 className="text-2xl font-bold text-white">Inquiry Dispatched Successfully!</h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Your technical request has been routed directly to{" "}
            <span className="text-cyan-400 font-mono font-bold">{successData.email}</span>. A copy is logged under reference{" "}
            <span className="text-white font-mono font-bold">{successData.reference}</span>.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href={directMailtoUri}
              className="px-5 py-3 rounded-xl bg-[#080A0F] hover:bg-[#12161F] text-white font-mono text-xs flex items-center gap-2 border border-[#2A3241] transition-colors active:scale-95"
            >
              <span>Open in Corporate Email Client (Outlook / Mail)</span>
              <ExternalLink className="h-3.5 w-3.5 text-cyan-400" />
            </a>
            <button
              onClick={() => setSuccessData(null)}
              className="px-5 py-3 rounded-xl bg-[#F97316] text-white font-mono text-xs font-semibold hover:bg-orange-600 transition-colors active:scale-95"
            >
              Send Another Request
            </button>
          </div>
        </div>
      ) : (
        /* Direct Form Submission */
        <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold">
                Contact Person Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Tariq Al-Mansoor"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full min-h-[46px] px-4 py-2.5 bg-[#080A0F] border border-[#2A3241] rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#F97316] transition-all placeholder:text-slate-500"
              />
            </div>

            {/* Corporate Email */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-cyan-400" />
                Corporate Email *
              </label>
              <input
                type="email"
                required
                placeholder="buyer@petro-epc.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full min-h-[46px] px-4 py-2.5 bg-[#080A0F] border border-[#2A3241] rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#F97316] transition-all placeholder:text-slate-500"
              />
            </div>

            {/* Phone / WhatsApp */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-emerald-400" />
                Phone / WhatsApp
              </label>
              <input
                type="tel"
                placeholder="+971 50 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full min-h-[46px] px-4 py-2.5 bg-[#080A0F] border border-[#2A3241] rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#F97316] transition-all placeholder:text-slate-500"
              />
            </div>

            {/* Company Name */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-cyan-400" />
                Company / Organization
              </label>
              <input
                type="text"
                placeholder="e.g. Petrofac / McDermott"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full min-h-[46px] px-4 py-2.5 bg-[#080A0F] border border-[#2A3241] rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#F97316] transition-all placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Product Interest Selector */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-amber-400" />
                Primary Product Interest
              </label>
              <select
                value={productInterest}
                onChange={(e) => setProductInterest(e.target.value)}
                className="w-full min-h-[46px] px-4 py-2.5 bg-[#080A0F] border border-[#2A3241] rounded-xl text-white font-mono text-xs focus:border-[#F97316] cursor-pointer"
              >
                <option value="Pipes & Tubes (Seamless / Welded)">Pipes &amp; Tubes (ASTM A312 / A106 / A335)</option>
                <option value="Forged Flanges (150# to 2500# & API)">Forged Flanges (ASME B16.5 / B16.47)</option>
                <option value="Buttweld & Socketweld Fittings">Buttweld &amp; Socketweld Fittings</option>
                <option value="Double Ferrule Instrumentation Fittings">Double Ferrule Tube Fittings</option>
                <option value="Plates, Sheets, Coils & Boiler Plates">Plates, Sheets &amp; Boiler Steel (ASTM A516 Gr 70)</option>
                <option value="Industrial High-Tensile Fasteners">High-Tensile Fasteners &amp; Bolting (ASTM A193 B7/B8M)</option>
                <option value="Rods, Bars & Wires (Bright & Hex)">Rods, Bars &amp; Machining Billets</option>
                <option value="Structural Steel (Angles, Beams - IS 2062)">Structural Steel (IS 2062 / ASTM A36)</option>
                <option value="Copper Earthing Jumpers & Non-Ferrous">Copper Earthing Jumpers &amp; Non-Ferrous Alloys</option>
              </select>
            </div>

            {/* Destination Port */}
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold flex items-center gap-1.5">
                <Ship className="h-3.5 w-3.5 text-cyan-400" />
                Target Destination Discharge Port
              </label>
              <select
                value={destinationPort}
                onChange={(e) => setDestinationPort(e.target.value)}
                className="w-full min-h-[46px] px-4 py-2.5 bg-[#080A0F] border border-[#2A3241] rounded-xl text-white font-mono text-xs focus:border-[#F97316] cursor-pointer"
              >
                {COMPANY_INFO.exportPorts
                  .filter((p) => p.type === "Destination")
                  .map((port) => (
                    <option key={port.name} value={`${port.name} (${port.country})`}>
                      {port.name} ({port.country})
                    </option>
                  ))}
                <option value="Other / Site Delivery">Other Global Port / Jobsite</option>
              </select>
            </div>
          </div>

          {/* Detailed Requirements Textarea */}
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5 font-semibold flex items-center justify-between">
              <span>Detailed Project Requirements &amp; Technical BOQ *</span>
              <span className="text-[10px] text-slate-400 font-normal">
                Include sizes, wall thickness/schedules, quantities, or paste drawing link
              </span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="e.g. 500 Meters Seamless Pipe ASTM A312 TP 316L, 4-inch Sch 40 with 3.1 MTC witnessed by Lloyd's. Required for delivery at Jebel Ali Port within 30 days."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
              className="w-full px-4 py-3 bg-[#080A0F] border border-[#2A3241] rounded-xl text-white font-mono text-xs focus:outline-none focus:border-[#F97316] transition-all placeholder:text-slate-500 leading-relaxed"
            />
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-3 border-t border-[#2A3241]">
            <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <ShieldCheck className="h-4 w-4" />
                Direct Desk Route
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Clock className="h-3.5 w-3.5 text-cyan-400" />
                Response SLA: &lt; 4 Hours
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={directMailtoUri}
                className="min-h-[48px] px-4 py-2.5 rounded-xl bg-[#080A0F] hover:bg-[#12161F] text-slate-300 hover:text-white border border-[#2A3241] font-mono text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-95"
                title="Send via your local Outlook or Email App"
              >
                <span>Direct Mailto</span>
                <ExternalLink className="h-3.5 w-3.5 text-cyan-400" />
              </a>

              <button
                type="submit"
                disabled={loading}
                className="min-h-[48px] px-7 py-3 rounded-xl bg-[#F97316] hover:bg-orange-600 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-orange-500/25 transition-all disabled:opacity-50 active:scale-95"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Routing to steelsvision@gmail.com...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit Direct RFQ to Export Desk</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
