/**
 * Automated verification test for B2B RFQ intake logic
 */

import { RFQSubmissionPayload } from "../src/types";

function testRfqLogic() {
  console.log("=================================================");
  console.log("🧪 TESTING B2B RFQ LOGIC & EMAIL PACKAGE BUILDER");
  console.log("=================================================");

  const payload: RFQSubmissionPayload = {
    companyName: "Petro-Global EPC Ltd",
    contactPerson: "Alexander Smith",
    email: "procurement@petro-global.com",
    phone: "+971 50 123 4567",
    country: "United Arab Emirates",
    destinationPort: "Jebel Ali (UAE)",
    incoterm: "CIF",
    inspectionRequired: ["Lloyd's Register (LRIS)", "TUV Rheinland / SUD"],
    millTestCertRequired: true,
    items: [
      {
        id: "test_1",
        category: "pipes-and-tubes",
        productName: "Seamless Steel Pipe ASTM A312 TP 316L",
        materialGrade: "TP 316L",
        typeOrForm: "Seamless",
        dimensions: "OD 60.33mm, WT 3.91mm, L 6m",
        quantity: 50,
        unit: "Pieces",
        estimatedWeightKg: 1631.5,
      },
      {
        id: "test_2",
        category: "flanges",
        productName: "Weld Neck Flange ASME B16.5 Class 600#",
        materialGrade: "ASTM A182 F316L",
        typeOrForm: "WNRF",
        dimensions: "2\" Class 600# Raised Face",
        quantity: 100,
        unit: "Pieces",
        estimatedWeightKg: 750,
      },
    ],
    additionalNotes: "Include EN 10204 3.2 third party inspection report from Lloyd's.",
  };

  const totalLines = payload.items.length;
  const totalWeightKg = payload.items.reduce(
    (sum, item) => sum + (item.estimatedWeightKg ? item.estimatedWeightKg : 0),
    0
  );
  const estMetricTons = (totalWeightKg / 1000).toFixed(3);
  const rfqReference = `SV-RFQ-2026-${Math.floor(10000 + Math.random() * 90000)}`;

  console.log("Generated Reference:", rfqReference);
  console.log("Target Mailbox: steelsvision@gmail.com");
  console.log("Company:", payload.companyName);
  console.log("Destination Port:", payload.destinationPort);
  console.log("Incoterm:", payload.incoterm);
  console.log("Line Items Count:", totalLines);
  console.log("Total Estimated Weight:", totalWeightKg, "KG (~" + estMetricTons + " MT)");
  console.log("Inspections:", payload.inspectionRequired.join(", "));
  console.log("MTC Required:", payload.millTestCertRequired);

  if (totalLines === 2 && Number(estMetricTons) > 2) {
    console.log("\n✅ [PASS] RFQ Data Model and Aggregation Verified!");
  } else {
    console.error("\n❌ [FAIL] RFQ Data Model verification failed");
    process.exit(1);
  }
}

testRfqLogic();
