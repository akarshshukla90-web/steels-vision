/**
 * Verification test suite for official Steels Vision Metallurgical Weight Formulas
 * Run with node/tsx to verify numerical accuracy against brochure page 16
 */

import { calculateWeight } from "../src/lib/calculations";

function runTests() {
  console.log("=================================================");
  console.log("🧪 RUNNING METALLURGICAL FORMULA VERIFICATION SUITE");
  console.log("=================================================\n");

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    total++;
    if (condition) {
      console.log(`✅ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${testName} - ${detail || "Assertion failed"}`);
    }
  }

  // Test 1: SS Pipe (2" NB Sch 40 -> OD 60.33mm, WT 3.91mm)
  // Expected: (60.33 - 3.91) * 3.91 * 0.02466 = 5.438 kg/m
  const pipe1 = calculateWeight({
    calculatorType: "pipe-ss-cs",
    outerDiameterMm: 60.33,
    wallThicknessMm: 3.91,
    lengthMeters: 6,
    quantity: 1,
  });
  assert(
    Math.abs(pipe1.unitWeight - 5.4386) < 0.01,
    "Stainless Steel Pipe 2\" Sch 40 Weight per meter",
    `Expected ~5.44 kg/m, got ${pipe1.unitWeight}`
  );
  assert(
    Math.abs(pipe1.totalWeight - 32.63) < 0.1,
    "SS Pipe 2\" Sch 40 (6m standard length) Total Weight",
    `Expected ~32.63 kg, got ${pipe1.totalWeight}`
  );

  // Test 2: Copper Pipe (OD 54mm, WT 2mm)
  // Expected: (54 - 2) * 2 * 0.0285 = 2.964 kg/m
  const copperPipe = calculateWeight({
    calculatorType: "pipe-copper",
    outerDiameterMm: 54,
    wallThicknessMm: 2,
    lengthMeters: 1,
    quantity: 1,
  });
  assert(
    Math.abs(copperPipe.unitWeight - 2.964) < 0.001,
    "Copper Pipe Weight Formula ((OD-WT)*WT*0.0285)",
    `Expected 2.964 kg/m, got ${copperPipe.unitWeight}`
  );

  // Test 3: Aluminium Pipe (OD 50mm, WT 3mm)
  // Expected: (50 - 3) * 3 * 0.0082 = 1.1562 kg/m
  const aluPipe = calculateWeight({
    calculatorType: "pipe-aluminum",
    outerDiameterMm: 50,
    wallThicknessMm: 3,
    lengthMeters: 1,
    quantity: 1,
  });
  assert(
    Math.abs(aluPipe.unitWeight - 1.1562) < 0.001,
    "Aluminium Pipe Weight Formula ((OD-WT)*WT*0.0082)",
    `Expected 1.1562 kg/m, got ${aluPipe.unitWeight}`
  );

  // Test 4: SS Sheet (Length 2m, Width 1m, Thickness 5mm, SS factor 8)
  // Expected: 2 * 1 * 5 * 8 = 80 kg
  const ssSheet = calculateWeight({
    calculatorType: "sheet-plate",
    lengthMeters: 2,
    widthMeters: 1,
    thicknessMm: 5,
    materialMetal: "stainless-steel",
    quantity: 1,
  });
  assert(
    ssSheet.unitWeight === 80,
    "SS Sheet Weight Formula (L * W * Thk * 8)",
    `Expected 80 kg, got ${ssSheet.unitWeight}`
  );

  // Test 5: Carbon Steel Plate (Length 2m, Width 1m, Thickness 10mm, CS factor 7.85)
  // Expected: 2 * 1 * 10 * 7.85 = 157 kg
  const csPlate = calculateWeight({
    calculatorType: "sheet-plate",
    lengthMeters: 2,
    widthMeters: 1,
    thicknessMm: 10,
    materialMetal: "carbon-steel",
    quantity: 1,
  });
  assert(
    csPlate.unitWeight === 157,
    "Carbon Steel Plate Weight (L * W * Thk * 7.85)",
    `Expected 157 kg, got ${csPlate.unitWeight}`
  );

  // Test 6: SS Round Bar (Dia 50mm)
  // Expected: 50 * 50 * 0.00623 = 15.575 kg/m
  const roundBar = calculateWeight({
    calculatorType: "round-bar",
    diameterMm: 50,
    lengthMeters: 1,
    quantity: 1,
  });
  assert(
    Math.abs(roundBar.unitWeight - 15.575) < 0.001,
    "SS Round Bar Formula (Dia^2 * 0.00623)",
    `Expected 15.575 kg/m, got ${roundBar.unitWeight}`
  );

  // Test 7: SS Hex Bar (A/F 30mm)
  // Expected: 30 * 30 * 0.00679 = 6.111 kg/m
  const hexBar = calculateWeight({
    calculatorType: "hex-bar",
    diameterMm: 30,
    lengthMeters: 1,
    quantity: 1,
  });
  assert(
    Math.abs(hexBar.unitWeight - 6.111) < 0.001,
    "SS Hex Bar Formula (Dia^2 * 0.00679)",
    `Expected 6.111 kg/m, got ${hexBar.unitWeight}`
  );

  // Test 8: SS Square Bar (Side 25mm)
  // Expected: 25 * 25 * 0.00787 = 4.91875 kg/m
  const sqBar = calculateWeight({
    calculatorType: "square-bar",
    diameterMm: 25,
    lengthMeters: 1,
    quantity: 1,
  });
  assert(
    Math.abs(sqBar.unitWeight - 4.9188) < 0.001,
    "SS Square Bar Formula (Dia^2 * 0.00787)",
    `Expected ~4.9188 kg/m, got ${sqBar.unitWeight}`
  );

  // Test 9: Welded Pipe Sheet Width ((OD - Thk) * 3.14)
  // OD 200mm, Thk 10mm -> (200 - 10) * 3.14 = 596.6 mm
  const sheetWidth = calculateWeight({
    calculatorType: "pipe-welded-sheet-width",
    outerDiameterMm: 200,
    wallThicknessMm: 10,
  });
  assert(
    Math.abs(sheetWidth.unitWeight - 596.6) < 0.01,
    "Sheet Width for Welded Pipe ((OD - Thk) * 3.14)",
    `Expected 596.6 mm, got ${sheetWidth.unitWeight}`
  );

  // Test 10: Circle & Blank (OD 200mm, Thk 20mm)
  // Formula: (200 * 200 * 20) / 160 / 1000 = 5 kg/pc
  const blank = calculateWeight({
    calculatorType: "circle-blank",
    outerDiameterMm: 200,
    thicknessMm: 20,
    quantity: 1,
  });
  assert(
    blank.unitWeight === 5,
    "SS Circle & Blank Formula ((OD * OD * Thk) / 160 / 1000)",
    `Expected 5 kg/pc, got ${blank.unitWeight}`
  );

  console.log("\n-------------------------------------------------");
  console.log(`TEST RESULTS: ${passed}/${total} TESTS PASSED`);
  console.log("-------------------------------------------------");

  if (passed !== total) {
    process.exit(1);
  }
}

runTests();
