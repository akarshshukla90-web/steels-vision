import { CalculationInput, CalculationOutput } from "@/types";

/**
 * Official Metallurgical Weight Formula Calculation Engine
 * Source: Steels Vision Engineering Reference & Standards (Brochure Page 16)
 */
export function calculateWeight(input: CalculationInput): CalculationOutput {
  const qty = input.quantity && input.quantity > 0 ? input.quantity : 1;

  switch (input.calculatorType) {
    case "pipe-ss-cs": {
      const od = input.outerDiameterMm || 0;
      const wt = input.wallThicknessMm || 0;
      const length = input.lengthMeters || 1;
      // Formula: (OD - WT) * WT * 0.02466 = KG/MTR
      const kgPerMtr = Math.max(0, (od - wt) * wt * 0.02466);
      const total = kgPerMtr * length * qty;
      return {
        unitWeight: Number(kgPerMtr.toFixed(4)),
        totalWeight: Number(total.toFixed(2)),
        unitLabel: "KG / MTR",
        formulaDisplay: "(OD - WT) × WT × 0.02466",
        standardReference: "ASTM A312 / ASTM A106 / ASME B36.10M / B36.19M",
      };
    }

    case "pipe-copper": {
      const od = input.outerDiameterMm || 0;
      const wt = input.wallThicknessMm || 0;
      const length = input.lengthMeters || 1;
      // Formula: (OD - WT) * WT * 0.0285 = KG/MTR
      const kgPerMtr = Math.max(0, (od - wt) * wt * 0.0285);
      const total = kgPerMtr * length * qty;
      return {
        unitWeight: Number(kgPerMtr.toFixed(4)),
        totalWeight: Number(total.toFixed(2)),
        unitLabel: "KG / MTR",
        formulaDisplay: "(OD - WT) × WT × 0.0285",
        standardReference: "ASTM B88 / ASTM B280 / BS 2871",
      };
    }

    case "pipe-aluminum": {
      const od = input.outerDiameterMm || 0;
      const wt = input.wallThicknessMm || 0;
      const length = input.lengthMeters || 1;
      // Formula: (OD - WT) * WT * 0.0082 = KG/MTR
      const kgPerMtr = Math.max(0, (od - wt) * wt * 0.0082);
      const total = kgPerMtr * length * qty;
      return {
        unitWeight: Number(kgPerMtr.toFixed(4)),
        totalWeight: Number(total.toFixed(2)),
        unitLabel: "KG / MTR",
        formulaDisplay: "(OD - WT) × WT × 0.0082",
        standardReference: "ASTM B241 / ASTM B210",
      };
    }

    case "pipe-lead": {
      const od = input.outerDiameterMm || 0;
      const wt = input.wallThicknessMm || 0;
      const length = input.lengthMeters || 1;
      // Formula: (OD - WT) * WT * 0.0345 = KG/MTR
      const kgPerMtr = Math.max(0, (od - wt) * wt * 0.0345);
      const total = kgPerMtr * length * qty;
      return {
        unitWeight: Number(kgPerMtr.toFixed(4)),
        totalWeight: Number(total.toFixed(2)),
        unitLabel: "KG / MTR",
        formulaDisplay: "(OD - WT) × WT × 0.0345",
        standardReference: "ASTM B749 Chemical Lead Standards",
      };
    }

    case "sheet-plate": {
      const lengthMtr = input.lengthMeters || 1;
      const widthMtr = input.widthMeters || 1;
      const thkMm = input.thicknessMm || 0;
      const metal = input.materialMetal || "stainless-steel";

      // Factors per brochure:
      // SS: 8
      // Carbon Steel: 7.85
      // Aluminium: 2.66
      // Lead: 11.2
      let factor = 8.0;
      if (metal === "carbon-steel") factor = 7.85;
      else if (metal === "aluminum") factor = 2.66;
      else if (metal === "lead") factor = 11.2;
      else if (metal === "copper") factor = 8.96;
      else if (metal === "titanium") factor = 4.51;
      else if (metal === "high-nickel") factor = 8.44;

      const kgPerSheet = lengthMtr * widthMtr * thkMm * factor;
      const total = kgPerSheet * qty;
      return {
        unitWeight: Number(kgPerSheet.toFixed(3)),
        totalWeight: Number(total.toFixed(2)),
        unitLabel: "KG / SHEET",
        formulaDisplay: `Length(m) × Width(m) × Thk(mm) × ${factor}`,
        standardReference: "ASTM A240 / ASTM A516 / ASME SA240",
      };
    }

    case "round-bar": {
      const dia = input.diameterMm || 0;
      const length = input.lengthMeters || 1;
      // Formula: Dia * Dia * 0.00623 = KG/MTR (SS)
      const kgPerMtr = dia * dia * 0.00623;
      const total = kgPerMtr * length * qty;
      return {
        unitWeight: Number(kgPerMtr.toFixed(4)),
        totalWeight: Number(total.toFixed(2)),
        unitLabel: "KG / MTR",
        formulaDisplay: "Dia(mm) × Dia(mm) × 0.00623",
        standardReference: "ASTM A276 / ASTM A479 / DIN 1013",
      };
    }

    case "hex-bar": {
      const dia = input.diameterMm || 0; // Across Flats
      const length = input.lengthMeters || 1;
      // Formula: Dia * Dia * 0.00679 = KG/MTR (SS)
      const kgPerMtr = dia * dia * 0.00679;
      const total = kgPerMtr * length * qty;
      return {
        unitWeight: Number(kgPerMtr.toFixed(4)),
        totalWeight: Number(total.toFixed(2)),
        unitLabel: "KG / MTR",
        formulaDisplay: "A/F(mm) × A/F(mm) × 0.00679",
        standardReference: "ASTM A276 / DIN 1015",
      };
    }

    case "square-bar": {
      const dia = input.diameterMm || 0; // Side
      const length = input.lengthMeters || 1;
      // Formula: Dia * Dia * 0.00787 = KG/MTR (SS)
      const kgPerMtr = dia * dia * 0.00787;
      const total = kgPerMtr * length * qty;
      return {
        unitWeight: Number(kgPerMtr.toFixed(4)),
        totalWeight: Number(total.toFixed(2)),
        unitLabel: "KG / MTR",
        formulaDisplay: "Side(mm) × Side(mm) × 0.00787",
        standardReference: "ASTM A276 / DIN 1014",
      };
    }

    case "pipe-welded-sheet-width": {
      const od = input.outerDiameterMm || 0;
      const thk = input.wallThicknessMm || 0;
      // Formula: (OD - Thk) * 3.14 = Sheet Width (mm)
      const sheetWidthMm = Math.max(0, (od - thk) * 3.14);
      return {
        unitWeight: Number(sheetWidthMm.toFixed(2)),
        totalWeight: Number(sheetWidthMm.toFixed(2)),
        unitLabel: "MM WIDTH",
        formulaDisplay: "(OD - Thk) × 3.14",
        standardReference: "Welded & Rolled Pipe Fabrication Standard",
      };
    }

    case "square-rect-pipe": {
      // Weight for Square / Rectangle Pipes:
      // (Perimeter / 3.14 - Thk) * Thk * 0.00756 = KG/PER FEET
      const side1 = input.side1Mm || 50;
      const side2 = input.side2Mm || 50;
      const thk = input.wallThicknessMm || 2;
      const perimeter = 2 * (side1 + side2);
      const kgPerFoot = Math.max(0, (perimeter / 3.14 - thk) * thk * 0.00756);
      const kgPerMtr = kgPerFoot * 3.28084;
      const total = kgPerMtr * (input.lengthMeters || 1) * qty;
      return {
        unitWeight: Number(kgPerMtr.toFixed(4)),
        totalWeight: Number(total.toFixed(2)),
        unitLabel: "KG / MTR",
        formulaDisplay: "((Perimeter / 3.14) - Thk) × Thk × 0.00756 = KG/FT",
        standardReference: "ASTM A554 / ASTM A500 Rectangular Hollow Section",
      };
    }

    case "circle-blank": {
      const od = input.outerDiameterMm || 0;
      const thk = input.thicknessMm || 0;
      // Formula: OD * OD * Thk / 160 / 1000 = KG/PCS
      const kgPerPc = (od * od * thk) / (160 * 1000);
      const total = kgPerPc * qty;
      return {
        unitWeight: Number(kgPerPc.toFixed(4)),
        totalWeight: Number(total.toFixed(2)),
        unitLabel: "KG / PCS",
        formulaDisplay: "(OD × OD × Thk) / 160 / 1000",
        standardReference: "SS Flange & Blind Blank Circle Formula",
      };
    }

    default:
      return {
        unitWeight: 0,
        totalWeight: 0,
        unitLabel: "KG",
        formulaDisplay: "Standard engineering calculation",
        standardReference: "ISO / ASTM",
      };
  }
}
