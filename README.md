# STEELS VISION - Global 3D WebGL Digital Flagship & B2B RFQ Engine

> **"STRONG MATERIALS. STRONGER PROJECTS."**  
> **"Built for Performance, Delivered with Trust."**  
> *Steel Solutions | High-Trusted Partnerships*

[![ISO 9001:2015](https://img.shields.io/badge/ISO-9001%3A2015-red.svg)](https://www.steelsvision.com)
[![ISO 14001:2015](https://img.shields.io/badge/ISO-14001%3A2015-green.svg)](https://www.steelsvision.com)
[![ISO 45001:2018](https://img.shields.io/badge/ISO-45001%3A2018-blue.svg)](https://www.steelsvision.com)
[![TPI Inspection Ready](https://img.shields.io/badge/TPI-Lloyd's%20%7C%20DNV%20%7C%20TUV%20%7C%20BV%20%7C%20IBR-orange.svg)](https://www.steelsvision.com)

---

## Executive Overview
**Steels Vision** is an ISO 9001:2015, ISO 14001:2015, and ISO 45001:2018 certified manufacturer, supplier, and stockist of Ferrous and Non-Ferrous metals based in Mumbai, India, with over 25 years of global export leadership.

Under the leadership of **Vishal Mehta** (Managing Director / Director Business Development), Steels Vision supplies high-integrity metal solutions to global EPC contractors, refineries, offshore oil & gas rigs, power generation stations, defence projects, and pharmaceutical plants across the Middle East, Europe, the Americas, and Southeast Asia.

- **Primary Global Export Desk:** `steelsvision@gmail.com`
- **Direct Hotline:** `(+91) 96380-66691`
- **Official Domains:** `www.steelsvision.com` / `www.steelvision.in`
- **Origin Export Ports:** Nhava Sheva (JNPT) / Mumbai Port, Mundra Port (India)
- **Key Global Destination Ports:** Jebel Ali (UAE), Dammam (Saudi Arabia), Port of Houston (USA), Port of Rotterdam (Netherlands), Port of Singapore, Port of Antwerp (Belgium), Hamad Port (Qatar), Shuwaikh (Kuwait), Sohar (Oman).

---

## Architecture & Technology Stack

Built using modern **Clean Architecture** and **Domain-Driven Design (DDD)**:

```
steels-vision/
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout with fonts, JSON-LD Schema.org, global RFQ provider
│   │   ├── page.tsx               # Master flagship experience (Hero, 3D Canvas, Calculator, Catalog, Trust)
│   │   ├── globals.css            # Industrial Dark Mode (#0B0F19), glassmorphism, metallic gradients
│   │   └── api/
│   │       └── rfq/route.ts       # Secure B2B RFQ intake & automated dispatch router to steelsvision@gmail.com
│   ├── components/
│   │   ├── canvas/
│   │   │   └── MetalHeroScene.tsx # Procedural 3D WebGL PBR engine with mouse parallax & alloy switcher
│   │   ├── calculator/
│   │   │   └── WeightCalculator.tsx # Live metallurgical weight engine (Brochure page 16 formulas)
│   │   ├── catalog/
│   │   │   └── ProductCatalog.tsx # Filterable catalog with search, ASME/ASTM specs & RFQ addition
│   │   ├── rfq/
│   │   │   └── RFQModal.tsx       # 4-stage international procurement RFQ wizard with Incoterms & ports
│   │   ├── trust/
│   │   │   └── TrustMatrix.tsx    # ISO accreditations, 16 TPI agencies, 5-stage QA, ISPM-15 packaging
│   │   ├── seo/
│   │   │   └── JsonLd.tsx         # Deep Schema.org Organization, B2BManufacturer & Product models for AEO
│   │   └── ui/
│   │       ├── Header.tsx         # Telemetry header with phone/email hotlines and RFQ counter
│   │       └── Footer.tsx         # Export hubs, credentials, executive contact, and legal markers
│   ├── content/
│   │   ├── company.ts             # Official company info, ISO certs, ports, TPI agencies from brochure
│   │   └── products.ts            # Detailed metallurgical product database across all export ranges
│   ├── hooks/
│   │   └── useRFQBasket.tsx       # Persistent local storage RFQ basket provider
│   ├── lib/
│   │   ├── calculations.ts        # Pure metallurgical calculation algorithms
│   │   └── utils.ts               # Class mergers and numerical formatters
│   └── types/
│       └── index.ts               # Strict TypeScript domain interfaces
└── tests/
    ├── verify_formulas.ts         # Unit test suite verifying all 11 weight formulas (100% Pass)
    └── test_api_rfq.ts            # Automated RFQ data transformation and email package test
```

---

## Core Capabilities

### 1. Procedural 3D WebGL PBR Engine
- **Asset-Free Zero Lag (< 1.2s FCP):** Generates procedural PBR brushed metal normal maps and reflection cubemaps in-memory, eliminating multi-megabyte GLTF download delays.
- **Strict 60 FPS Target:** Smooth cursor-driven camera parallax with lerped motion damping and low-overhead requestAnimationFrame loop.
- **Interactive Component Selector:**
  - *Seamless Heavy-Wall Pipe (ASTM A312)*
  - *Weld Neck Flange with 8-Hole Bolt Pattern (ASME B16.5)*
  - *Double Ferrule Compression Tube Fitting Body*
- **Live Alloy Metallurgy Switcher:**
  - *Stainless Steel 316L* (cold silver sheen, high reflectivity)
  - *Inconel 625* (warm high-nickel gold-bronze sheen)
  - *Titanium Gr. 5* (cool satin-anodized blue-gray)
  - *Forged Induction Glow* (heat-treated thermal emissive radiation)

### 2. Metallurgical Weight Calculation Engine
Derived directly from the official **Steels Vision Brochure (Page 16)**:
- **SS & Carbon Steel Pipes:** $(OD - WT) \times WT \times 0.02466 = \text{KG/MTR}$
- **Copper Pipes & Tubes:** $(OD - WT) \times WT \times 0.0285 = \text{KG/MTR}$
- **Aluminium Pipes & Tubes:** $(OD - WT) \times WT \times 0.0082 = \text{KG/MTR}$
- **Lead Pipes & Tubes:** $(OD - WT) \times WT \times 0.0345 = \text{KG/MTR}$
- **Stainless Steel Sheets & Plates:** $L(m) \times W(m) \times Thk(mm) \times 8.0 = \text{KG/SHEET}$
- **Carbon Steel / Boiler Plates:** $L(m) \times W(m) \times Thk(mm) \times 7.85 = \text{KG/SHEET}$
- **Aluminium Plates:** $L(m) \times W(m) \times Thk(mm) \times 2.66 = \text{KG/SHEET}$
- **Lead Chemical Plates:** $L(m) \times W(m) \times Thk(mm) \times 11.2 = \text{KG/SHEET}$
- **Round Bars:** $Dia(mm)^2 \times 0.00623 = \text{KG/MTR}$
- **Hexagonal Rods:** $AF(mm)^2 \times 0.00679 = \text{KG/MTR}$
- **Square Rods:** $Side(mm)^2 \times 0.00787 = \text{KG/MTR}$
- **Square / Rectangular Hollow Sections:** $((Perimeter / 3.14) - Thk) \times Thk \times 0.00756 = \text{KG/FT}$
- **SS Circle & Blanks:** $(OD \times OD \times Thk) / 160 / 1000 = \text{KG/PCS}$
- **Welded Pipe Blank Sheet Width:** $(OD - Thk) \times 3.14 = \text{Sheet Width (mm)}$

### 3. International B2B RFQ Engine
- **Persistent RFQ Basket:** Stores items across sessions in `localStorage`.
- **4-Stage Procurement Funnel:**
  1. *Materials Basket:* Dynamic line items, quantities, and weights.
  2. *Incoterms & Logistics:* CIF, FOB, CFR, DDP, EXW terms with international destination ports.
  3. *Third-Party Inspection:* Lloyd's Register (LRIS), TUV, Bureau Veritas (BVIS), DNV, SGS, IBR.
  4. *Official Dispatch:* Automatic reference generation (`SV-RFQ-YYYY-XXXXX`) and structured dispatch to `steelsvision@gmail.com`.

### 4. AEO & SEO Structured Data
- Complete JSON-LD schema graphs for Google and AI Answer Engines:
  - `Organization` & `B2BManufacturer`
  - `ItemList` of certified industrial products with ASTM/ASME specifications.
  - Accredited credentials: ISO 9001, ISO 14001, ISO 45001, PED 2014/68/EU, IBR.

---

## Verification & Testing

### 1. Run Unit Tests for Metallurgical Formulas
```bash
npx tsx tests/verify_formulas.ts
```
**Output:**
```
=================================================
🧪 RUNNING METALLURGICAL FORMULA VERIFICATION SUITE
=================================================
✅ [PASS] Stainless Steel Pipe 2" Sch 40 Weight per meter
✅ [PASS] SS Pipe 2" Sch 40 (6m standard length) Total Weight
✅ [PASS] Copper Pipe Weight Formula ((OD-WT)*WT*0.0285)
✅ [PASS] Aluminium Pipe Weight Formula ((OD-WT)*WT*0.0082)
✅ [PASS] SS Sheet Weight Formula (L * W * Thk * 8)
✅ [PASS] Carbon Steel Plate Weight (L * W * Thk * 7.85)
✅ [PASS] SS Round Bar Formula (Dia^2 * 0.00623)
✅ [PASS] SS Hex Bar Formula (Dia^2 * 0.00679)
✅ [PASS] SS Square Bar Formula (Dia^2 * 0.00787)
✅ [PASS] Sheet Width for Welded Pipe ((OD - Thk) * 3.14)
✅ [PASS] SS Circle & Blank Formula ((OD * OD * Thk) / 160 / 1000)

TEST RESULTS: 11/11 TESTS PASSED
```

### 2. Run RFQ API Logic Tests
```bash
npx tsx tests/test_api_rfq.ts
```

### 3. Production Build
```bash
npm run build
```

---

## Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Start Development Server:**
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.
