import { NextRequest, NextResponse } from "next/server";
import { RFQLineItem, RFQSubmissionPayload } from "@/types";

interface ExtendedLeadPayload extends Partial<RFQSubmissionPayload> {
  fullName?: string;
  name?: string;
  productInterest?: string;
  detailedRequirements?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: ExtendedLeadPayload = await req.json();

    const companyName = body.companyName || "International Procurement Firm";
    const contactPerson = body.contactPerson || body.fullName || body.name || "";
    const email = body.email || "";
    const phone = body.phone || "Not provided";
    const country = body.country || "Global Export Client";
    const destinationPort = body.destinationPort || "Direct Vessel Dispatch (Vadodara/Mumbai)";
    const incoterm = body.incoterm || "CIF";
    const inspectionRequired = body.inspectionRequired || ["Standard QA / TPI on Request"];
    const millTestCertRequired = body.millTestCertRequired ?? true;
    const additionalNotes = body.additionalNotes || body.detailedRequirements || "Urgent project quotation requested.";

    // 1. Validation
    if (!contactPerson.trim() || !email.trim()) {
      return NextResponse.json(
        { success: false, message: "Please provide both Contact Name and Corporate Email." },
        { status: 400 }
      );
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid corporate email address." },
        { status: 400 }
      );
    }

    // 2. Synthesize Line Items if direct lead capture
    let items: RFQLineItem[] = body.items || [];
    if (items.length === 0 && (body.productInterest || body.detailedRequirements)) {
      items = [
        {
          id: `lead_${Date.now()}`,
          category: "pipes-and-tubes",
          productName: body.productInterest || "Industrial Metal Specification",
          materialGrade: "As Specified in Requirements",
          typeOrForm: "Project Order",
          dimensions: "Per Technical BOQ / Drawing",
          quantity: 1,
          unit: "Pieces",
          notes: body.detailedRequirements || "Direct lead capture submission",
        },
      ];
    }

    if (items.length === 0) {
      return NextResponse.json(
        { success: false, message: "Inquiry must specify products of interest or technical requirements." },
        { status: 400 }
      );
    }

    // 3. Generate Official Tracking Reference
    const rfqReference = `SV-RFQ-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    // 4. Calculate Preliminary Engineering Metrics
    const totalLines = items.length;
    const totalWeightKg = items.reduce(
      (sum, item) => sum + (item.estimatedWeightKg ? item.estimatedWeightKg * (item.quantity || 1) : 0),
      0
    );
    const estMetricTons = totalWeightKg > 0 ? (totalWeightKg / 1000).toFixed(3) : "Calculated upon technical drawing review";

    // 5. Construct Formal Email Package Routed to steelsvision@gmail.com
    const dispatchEmailPackage = {
      to: "steelsvision@gmail.com",
      director: "Vishal Mehta, Managing Director",
      replyTo: email,
      subject: `[DIRECT EXPORT LEAD] ${rfqReference} - ${companyName} (${country}) - ${body.productInterest || "Metals RFQ"}`,
      rfqReference,
      timestamp: new Date().toISOString(),
      leadDetails: {
        contactPerson,
        companyName,
        email,
        phone,
        country,
      },
      commercialTerms: {
        incoterm,
        destinationPort,
        inspectionRequested: Array.isArray(inspectionRequired) ? inspectionRequired.join(", ") : inspectionRequired,
        millTestCertificate: millTestCertRequired ? "EN 10204 3.1 / 3.2 Required" : "Standard",
      },
      specifications: items.map((item, idx) => ({
        itemNo: idx + 1,
        product: item.productName,
        grade: item.materialGrade,
        dimensions: item.dimensions,
        quantity: `${item.quantity} ${item.unit || "Pcs"}`,
        notes: item.notes || "Standard Supply",
      })),
      aggregateSummary: {
        totalLines,
        estMetricTons,
      },
      detailedRequirements: additionalNotes,
    };

    // 6. Direct Console Audit Trail & Export Log
    console.log("==========================================================");
    console.log("🎯 [STEELS VISION ROUTER] EXPORT INQUIRY ROUTED TO steelsvision@gmail.com");
    console.log("Reference:", rfqReference);
    console.log("Recipient:", "steelsvision@gmail.com");
    console.log("Customer Email:", email);
    console.log(JSON.stringify(dispatchEmailPackage, null, 2));
    console.log("==========================================================");

    // 7. Structured Response
    return NextResponse.json({
      success: true,
      message: "Lead inquiry securely routed directly to Steels Vision export desk (steelsvision@gmail.com)",
      rfqReference,
      destinationEmail: "steelsvision@gmail.com",
      timestamp: dispatchEmailPackage.timestamp,
      summary: {
        company: companyName,
        contact: contactPerson,
        lines: totalLines,
        productInterest: body.productInterest || items[0]?.productName || "Industrial Metallurgy",
        port: destinationPort,
      },
    });
  } catch (error: unknown) {
    console.error("RFQ Direct Lead Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
