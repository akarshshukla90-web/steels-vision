import { NextRequest, NextResponse } from "next/server";
import { RFQSubmissionPayload } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body: RFQSubmissionPayload = await req.json();

    // 1. Validation
    if (!body.companyName || !body.contactPerson || !body.email) {
      return NextResponse.json(
        { success: false, message: "Missing required corporate contact fields" },
        { status: 400 }
      );
    }

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "RFQ must contain at least one line item" },
        { status: 400 }
      );
    }

    // 2. Generate Tracking Reference
    const rfqReference = `SV-RFQ-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    // 3. Preliminary Engineering Aggregations
    const totalLines = body.items.length;
    const totalWeightKg = body.items.reduce(
      (sum, item) => sum + (item.estimatedWeightKg ? item.estimatedWeightKg * (item.quantity || 1) : 0),
      0
    );
    const estMetricTons = totalWeightKg > 0 ? (totalWeightKg / 1000).toFixed(3) : "TBD based on drawing";

    // 4. Construct Structured Dispatch Package for steelsvision@gmail.com
    const dispatchEmailPackage = {
      to: "steelsvision@gmail.com",
      director: "Vishal Mehta, Managing Director",
      replyTo: body.email,
      subject: `[URGENT B2B RFQ] ${rfqReference} - ${body.companyName} (${body.country || "Global"}) - Incoterm: ${body.incoterm}`,
      rfqReference,
      timestamp: new Date().toISOString(),
      buyerDetails: {
        company: body.companyName,
        contact: body.contactPerson,
        email: body.email,
        phone: body.phone || "Not provided",
        country: body.country || "International",
      },
      logistics: {
        incoterm: body.incoterm,
        destinationPort: body.destinationPort,
        targetDelivery: body.targetDeliveryDate || "Earliest Export Vessel",
        inspectionAgencies: body.inspectionRequired.join(", ") || "Standard Mill QC",
        millTestCertificate: body.millTestCertRequired ? "EN 10204 3.1 / 3.2 Required" : "Standard",
      },
      lineItems: body.items.map((item, idx) => ({
        itemNo: idx + 1,
        product: item.productName,
        grade: item.materialGrade,
        sizeDimensions: item.dimensions,
        quantity: `${item.quantity} ${item.unit || "Pcs"}`,
        notes: item.notes || "Standard Mill Supply",
      })),
      aggregateSummary: {
        totalLines,
        estMetricTons,
      },
      specialNotes: body.additionalNotes || "None specified.",
    };

    // 5. Server-side log for inquiry audit trail
    console.log("==========================================================");
    console.log("🚀 [STEELS VISION EXPORT ROUTER] INCOMING INTERNATIONAL RFQ");
    console.log("Reference:", rfqReference);
    console.log("Target Mailbox: steelsvision@gmail.com");
    console.log(JSON.stringify(dispatchEmailPackage, null, 2));
    console.log("==========================================================");

    // 6. Return response to front-end buyer
    return NextResponse.json({
      success: true,
      message: "RFQ successfully processed and routed to Steels Vision export desk",
      rfqReference,
      destinationEmail: "steelsvision@gmail.com",
      timestamp: dispatchEmailPackage.timestamp,
      summary: {
        company: body.companyName,
        lines: totalLines,
        estimatedTonnageMT: estMetricTons,
        port: body.destinationPort,
      },
    });
  } catch (error: unknown) {
    console.error("RFQ Processing Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
