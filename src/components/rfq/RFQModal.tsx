"use client";

import React, { useState } from "react";
import { useRFQBasket } from "@/hooks/useRFQBasket";
import { COMPANY_INFO } from "@/content/company";
import { Incoterm, RFQLineItem } from "@/types";
import confetti from "canvas-confetti";
import {
  X,
  Trash2,
  Plus,
  Send,
  Building,
  Mail,
  Phone,
  Globe,
  Ship,
  FileCheck,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

export default function RFQModal() {
  const { items, removeItem, updateQuantity, clearBasket, isModalOpen, closeRFQModal } = useRFQBasket();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [quoteReference, setQuoteReference] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Fields
  const [companyName, setCompanyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [destinationPort, setDestinationPort] = useState("Jebel Ali (UAE)");
  const [incoterm, setIncoterm] = useState<Incoterm>("CIF");
  const [targetDeliveryDate, setTargetDeliveryDate] = useState("");
  const [selectedInspections, setSelectedInspections] = useState<string[]>(["TUV", "Lloyd's Register (LRIS)"]);
  const [millTestCertRequired, setMillTestCertRequired] = useState(true);
  const [additionalNotes, setAdditionalNotes] = useState("");

  // New quick item addition inside basket
  const [quickProduct, setQuickProduct] = useState("");
  const [quickGrade, setQuickGrade] = useState("");
  const [quickSize, setQuickSize] = useState("");
  const [quickQty, setQuickQty] = useState(1);

  if (!isModalOpen) return null;

  const toggleInspection = (agency: string) => {
    setSelectedInspections((prev) =>
      prev.includes(agency) ? prev.filter((a) => a !== agency) : [...prev, agency]
    );
  };

  const handleAddQuickItem = () => {
    if (!quickProduct || !quickGrade) return;
    items.push({
      id: "quick_" + Date.now(),
      category: "pipes-and-tubes",
      productName: quickProduct,
      materialGrade: quickGrade,
      typeOrForm: "Custom Size",
      dimensions: quickSize || 'Standard',
      quantity: quickQty,
      unit: "Pieces",
    });
    setQuickProduct("");
    setQuickGrade("");
    setQuickSize("");
    setQuickQty(1);
  };

  const handleSubmitQuote = async () => {
    setErrorMsg(null);
    if (!companyName || !contactPerson || !email) {
      setErrorMsg("Please provide your Company Name, Contact Person, and Email.");
      return;
    }

    if (items.length === 0) {
      setErrorMsg("Please add at least one line item to your RFQ.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        companyName,
        contactPerson,
        email,
        phone,
        country,
        destinationPort,
        incoterm,
        targetDeliveryDate,
        inspectionRequired: selectedInspections,
        millTestCertRequired,
        items,
        additionalNotes,
      };

      const res = await fetch("/api/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to process RFQ submission");
      }

      setQuoteReference(data.rfqReference || `SV-RFQ-${Date.now().toString().slice(-6)}`);
      setSubmissionSuccess(true);
      setStep(4);

      // Trigger Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#E63946", "#00D2FF", "#F1FAEE"],
        });
      } catch (e) {
        // non-blocking
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Error submitting RFQ. Please retry or contact directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[92vh] glass-panel bg-slate-950/95 border border-white/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-[#E63946] flex items-center justify-center text-white font-bold font-mono text-sm">
              SV
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                International B2B Request For Quotation (RFQ)
              </h3>
              <p className="text-xs text-slate-400">
                Direct procurement dispatch to <span className="text-cyan-400">steelsvision@gmail.com</span>
              </p>
            </div>
          </div>

          <button
            onClick={closeRFQModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="px-6 py-3 bg-slate-900/30 border-b border-white/5 flex items-center justify-between">
          {[
            { num: 1, label: "Materials Basket" },
            { num: 2, label: "Incoterms & Logistics" },
            { num: 3, label: "Corporate Credentials" },
            { num: 4, label: "Official Dispatch" },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2 text-xs font-mono">
              <span
                className={`h-5 w-5 rounded-full flex items-center justify-center font-bold text-[11px] ${
                  step === s.num
                    ? "bg-[#E63946] text-white"
                    : step > s.num
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                {step > s.num ? "✓" : s.num}
              </span>
              <span className={`hidden sm:inline ${step === s.num ? "text-white font-semibold" : "text-slate-400"}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Line Items Review */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                  Configured Line Items ({items.length})
                </span>
                {items.length > 0 && (
                  <button
                    onClick={clearBasket}
                    className="text-xs font-mono text-red-400 hover:text-red-300 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {items.length === 0 ? (
                <div className="text-center py-10 px-4 rounded-xl border border-dashed border-white/10 bg-slate-900/30">
                  <p className="text-slate-400 text-sm">Your RFQ basket is currently empty.</p>
                  <p className="text-xs text-slate-500 mt-1">
                    Select products from the catalog or calculate custom dimensions with the weight calculator.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4"
                    >
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-semibold text-white">{item.productName}</h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-400">
                          <span className="text-cyan-400">{item.materialGrade}</span>
                          <span>•</span>
                          <span>{item.dimensions}</span>
                          {item.estimatedWeightKg && (
                            <>
                              <span>•</span>
                              <span className="text-slate-300">
                                ~{item.estimatedWeightKg.toFixed(1)} KG Est.
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-lg border border-white/10 text-xs font-mono">
                          <span className="text-slate-500">Qty:</span>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                            className="w-12 bg-transparent text-white font-bold text-center focus:outline-none"
                          />
                          <span className="text-slate-400">{item.unit || "Pcs"}</span>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Add Custom Specification Bar */}
              <div className="p-4 rounded-xl bg-slate-900/30 border border-white/10 space-y-3">
                <span className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1.5">
                  <Plus className="h-3.5 w-3.5 text-cyan-400" />
                  Quick Add Custom Specification / Grade
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    placeholder="Product (e.g. Inconel 625 Flange)"
                    value={quickProduct}
                    onChange={(e) => setQuickProduct(e.target.value)}
                    className="px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Grade (e.g. UNS N06625)"
                    value={quickGrade}
                    onChange={(e) => setQuickGrade(e.target.value)}
                    className="px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder={'Dimensions / Class (e.g. 4" 600# WNRF)'}
                    value={quickSize}
                    onChange={(e) => setQuickSize(e.target.value)}
                    className="px-3 py-2 bg-slate-950 border border-white/10 rounded-lg text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddQuickItem}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium transition-colors"
                  >
                    Add Row
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Shipping, Port & Incoterms */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Commercial Trade Term (INCOTERMS 2020)
                  </label>
                  <select
                    value={incoterm}
                    onChange={(e) => setIncoterm(e.target.value as Incoterm)}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono text-sm focus:border-red-500"
                  >
                    <option value="CIF">CIF - Cost, Insurance & Freight (Recommended)</option>
                    <option value="FOB">FOB - Free on Board (JNPT / Mundra Port)</option>
                    <option value="CFR">CFR - Cost & Freight</option>
                    <option value="DDP">DDP - Delivered Duty Paid</option>
                    <option value="EXW">EXW - Ex Works (Mumbai Warehouse)</option>
                    <option value="FCA">FCA - Free Carrier</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Destination Discharge Port
                  </label>
                  <select
                    value={destinationPort}
                    onChange={(e) => setDestinationPort(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono text-sm focus:border-red-500"
                  >
                    {COMPANY_INFO.exportPorts
                      .filter((p) => p.type === "Destination")
                      .map((port) => (
                        <option key={port.name} value={`${port.name} (${port.country})`}>
                          {port.name} ({port.country})
                        </option>
                      ))}
                    <option value="Other / Inland EPC Jobsite">Other International Port (Specify in notes)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-2">
                  Third-Party Inspection Agency (TPI) Required
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {["Lloyd's Register (LRIS)", "TUV Rheinland / SUD", "Bureau Veritas (BVIS)", "DNV", "SGS", "IBR Certified", "MECON", "Jacobs / Toyo"].map(
                    (agency) => {
                      const isSelected = selectedInspections.includes(agency);
                      return (
                        <button
                          key={agency}
                          type="button"
                          onClick={() => toggleInspection(agency)}
                          className={`p-2 rounded-xl text-xs font-medium text-left border transition-all ${
                            isSelected
                              ? "bg-red-500/15 border-red-500 text-white"
                              : "bg-slate-900/60 border-white/5 text-slate-400 hover:text-white"
                          }`}
                        >
                          <span className="font-mono">{isSelected ? "✓ " : "+ "}</span>
                          {agency}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-white/10">
                <input
                  type="checkbox"
                  id="mtcCert"
                  checked={millTestCertRequired}
                  onChange={(e) => setMillTestCertRequired(e.target.checked)}
                  className="h-4 w-4 rounded bg-slate-950 border-white/20 text-[#E63946] focus:ring-0"
                />
                <label htmlFor="mtcCert" className="text-xs text-slate-300 cursor-pointer">
                  Require official <strong>EN 10204 3.1 / 3.2 Mill Test Certificate</strong> with 100% PMI chemical and mechanical test values.
                </label>
              </div>
            </div>
          )}

          {/* STEP 3: Company & Contact Credentials */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Building className="h-3.5 w-3.5 text-cyan-400" />
                    Company / Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Petrofac, Saudi Aramco Contractor, Technip"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono text-sm focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">
                    Procurement Officer / Contact Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Eng. Alexander Smith"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono text-sm focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-cyan-400" />
                    Corporate Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="buyer@petro-epc.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono text-sm focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-cyan-400" />
                    WhatsApp / Direct Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+971 50 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono text-sm focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5 flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-cyan-400" />
                    Country of Operation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UAE, Saudi Arabia, USA, Germany"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono text-sm focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  Technical Drawing / BOQ Notes or Special Requirements
                </label>
                <textarea
                  rows={3}
                  placeholder="Specify heat-treatment condition, bevelling details, tolerance limits, or paste drawing link..."
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-white font-mono text-sm focus:border-red-500"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Success & Confirmation View */}
          {step === 4 && (
            <div className="py-8 text-center space-y-4">
              <div className="inline-flex p-4 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle className="h-12 w-12" />
              </div>
              <h4 className="text-2xl font-bold text-white">Commercial RFQ Successfully Dispatched!</h4>
              <p className="text-sm text-slate-300 max-w-lg mx-auto">
                Your quotation request has been securely parsed and routed directly to the Steels Vision export desk at{" "}
                <span className="text-[#00D2FF] font-mono">steelsvision@gmail.com</span> and Managing Director Vishal Mehta.
              </p>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-white/10 inline-block font-mono text-xs text-left space-y-1">
                <div>
                  <span className="text-slate-500">RFQ Reference: </span>
                  <span className="text-cyan-400 font-bold">{quoteReference}</span>
                </div>
                <div>
                  <span className="text-slate-500">Company: </span>
                  <span className="text-white">{companyName}</span>
                </div>
                <div>
                  <span className="text-slate-500">Incoterm: </span>
                  <span className="text-white">
                    {incoterm} ({destinationPort})
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Response SLA: </span>
                  <span className="text-emerald-400 font-semibold">&lt; 4 Hours for International Quotes</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={closeRFQModal}
                  className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl text-xs transition-colors"
                >
                  Close & Return to Flagship
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {step < 4 && (
          <div className="px-6 py-4 border-t border-white/10 bg-slate-900/60 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-300 hover:text-white bg-slate-800 flex items-center gap-1.5 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev + 1) as 2 | 3)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#E63946] hover:bg-[#D62839] flex items-center gap-1.5 shadow-lg shadow-red-500/20 transition-all"
              >
                Next Step
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitQuote}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#E63946] hover:bg-[#D62839] disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-red-500/25 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Routing to Export Desk...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit B2B RFQ for Official Quote</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
