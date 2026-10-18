export type MetalCategory = 
  | "pipes-and-tubes"
  | "buttweld-fittings"
  | "screwed-forged-fittings"
  | "double-ferrule-fittings"
  | "flanges"
  | "plates-sheets-coils"
  | "fasteners"
  | "rods-bars-wires"
  | "structural-steel"
  | "copper-jumpers-non-ferrous";

export interface ProductItem {
  id: string;
  name: string;
  category: MetalCategory;
  tagline: string;
  description: string;
  grades: {
    stainlessSteel?: string[];
    carbonSteel?: string[];
    alloySteel?: string[];
    highNickel?: string[];
    duplexSuperDuplex?: string[];
    others?: string[];
  };
  types: string[];
  sizeRange: string;
  wallThicknessOrClass: string;
  standards: string[];
  applications: string[];
  highlight: string;
  technicalSpecs?: Record<string, string>;
}

export type Incoterm = "FOB" | "CIF" | "CFR" | "DDP" | "EXW" | "FCA";

export interface RFQLineItem {
  id: string;
  category: MetalCategory | string;
  productName: string;
  materialGrade: string;
  typeOrForm: string;
  dimensions: string; // e.g. '2" NB Sch 40' or '25x25x5mm'
  quantity: number;
  unit: "Meters" | "Pieces" | "Metric Tons" | "Feet" | "Kg";
  estimatedWeightKg?: number;
  notes?: string;
}

export interface RFQSubmissionPayload {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;
  destinationPort: string;
  incoterm: Incoterm;
  targetDeliveryDate?: string;
  inspectionRequired: string[]; // e.g., ["TUV", "Lloyd's", "IBR"]
  millTestCertRequired: boolean; // EN 10204 3.1 or 3.2
  items: RFQLineItem[];
  additionalNotes?: string;
  rfqReference?: string;
}

export interface CalculationInput {
  calculatorType: 
    | "pipe-ss-cs" 
    | "pipe-copper" 
    | "pipe-aluminum" 
    | "pipe-lead" 
    | "sheet-plate" 
    | "round-bar" 
    | "hex-bar" 
    | "square-bar"
    | "pipe-welded-sheet-width"
    | "square-rect-pipe"
    | "circle-blank";
  outerDiameterMm?: number;
  wallThicknessMm?: number;
  lengthMeters?: number;
  widthMeters?: number;
  thicknessMm?: number;
  diameterMm?: number;
  materialMetal?: "stainless-steel" | "carbon-steel" | "aluminum" | "lead" | "copper" | "high-nickel" | "titanium";
  side1Mm?: number;
  side2Mm?: number;
  quantity?: number;
}

export interface CalculationOutput {
  unitWeight: number; // kg per unit (kg/m, kg/sheet, kg/pc, etc.)
  totalWeight: number; // total calculated weight for given length/qty
  unitLabel: string;
  formulaDisplay: string;
  standardReference: string;
}
