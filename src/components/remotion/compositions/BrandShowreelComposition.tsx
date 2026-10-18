"use client";

import React from "react";
import {
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  AbsoluteFill,
} from "remotion";

export const BrandShowreelComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  // SCENE 1: The Forge & Molten Core (0 - 110 frames)
  const s1Opacity = interpolate(frame, [0, 15, 95, 110], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s1Scale = interpolate(frame, [0, 110], [1.08, 1.0], {
    extrapolateRight: "clamp",
  });

  // SCENE 2: Precision Engineering & CNC Extrusion (110 - 220 frames)
  const s2Opacity = interpolate(frame, [110, 125, 205, 220], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s2LaserX = interpolate(frame, [115, 215], [5, 95], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // SCENE 3: Certified Zero-Defect QA (220 - 330 frames)
  const s3Opacity = interpolate(frame, [220, 235, 315, 330], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s3PressureVal = Math.round(
    interpolate(frame, [230, 310], [0, 15000], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );

  // SCENE 4: Global Supply Chain & Dispatch (330 - 450 frames)
  const s4Opacity = interpolate(frame, [330, 345, 435, 450], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s4GlobeAngle = interpolate(frame, [330, 450], [0, 60]);

  // Global overlay progress
  const progressPercent = (frame / 450) * 100;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#05070B",
        color: "#FFFFFF",
        fontFamily: "Inter, system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Background cinematic grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 50% 50%, rgba(255,59,48,0.12) 0%, transparent 60%), linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "100% 100%, 60px 60px, 60px 60px",
        }}
      />

      {/* ===================== SCENE 1: THE FORGE ===================== */}
      {frame >= 0 && frame < 115 && (
        <AbsoluteFill
          style={{
            opacity: s1Opacity,
            transform: `scale(${s1Scale})`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "40px",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontFamily: "monospace",
              color: "#FF3B30",
              letterSpacing: "0.3em",
              marginBottom: "16px",
              textTransform: "uppercase",
            }}
          >
            Phase 01 // Metallurgical Induction & Refining
          </div>
          <h1
            style={{
              fontSize: "64px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              maxWidth: "1000px",
              margin: 0,
              background: "linear-gradient(135deg, #FFFFFF 0%, #FF9500 60%, #FF3B30 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            THE ART OF RAW METALLURGICAL MASTERY
          </h1>
          <p
            style={{
              fontSize: "22px",
              color: "#94A3B8",
              marginTop: "20px",
              maxWidth: "800px",
              lineHeight: 1.5,
            }}
          >
            Vacuum-induction melting of Super Duplex 2507, Inconel 625, and ASTM A312 alloys refined at 1,650°C.
          </p>

          {/* Alloy Matrix Pills */}
          <div
            style={{
              display: "flex",
              gap: "14px",
              marginTop: "32px",
            }}
          >
            {["SUPER DUPLEX 2507", "INCONEL 625", "TITANIUM GR. 5", "HASTELLOY C276", "STAINLESS 316L"].map(
              (alloy, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "8px 18px",
                    borderRadius: "999px",
                    border: "1px solid rgba(255, 59, 48, 0.35)",
                    background: "rgba(255, 59, 48, 0.08)",
                    fontSize: "12px",
                    fontWeight: 600,
                    fontFamily: "monospace",
                    color: "#FFD2CE",
                  }}
                >
                  {alloy}
                </div>
              )
            )}
          </div>
        </AbsoluteFill>
      )}

      {/* ===================== SCENE 2: PRECISION CNC & EXTRUSION ===================== */}
      {frame >= 105 && frame < 225 && (
        <AbsoluteFill
          style={{
            opacity: s2Opacity,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "40px",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontFamily: "monospace",
              color: "#00D2FF",
              letterSpacing: "0.3em",
              marginBottom: "16px",
              textTransform: "uppercase",
            }}
          >
            Phase 02 // Seamless Extrusion & CNC Machining
          </div>
          <h2
            style={{
              fontSize: "64px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              maxWidth: "1000px",
              margin: 0,
              background: "linear-gradient(135deg, #FFFFFF 0%, #00D2FF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            SUB-MILLIMETER CAD TOLERANCE
          </h2>
          <p
            style={{
              fontSize: "22px",
              color: "#94A3B8",
              marginTop: "20px",
              maxWidth: "800px",
            }}
          >
            High-precision cold pilgering and CNC flange serrations complying with ASME B16.5 & DIN standards.
          </p>

          {/* Animated Laser Scanning Graphic */}
          <div
            style={{
              position: "relative",
              width: "700px",
              height: "120px",
              marginTop: "36px",
              border: "1px solid rgba(0, 210, 255, 0.2)",
              borderRadius: "12px",
              background: "rgba(10, 14, 24, 0.6)",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 30px",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${s2LaserX}%`,
                width: "2px",
                backgroundColor: "#00D2FF",
                boxShadow: "0 0 15px #00D2FF, 0 0 30px #00D2FF",
              }}
            />
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "11px", fontFamily: "monospace", color: "#00D2FF" }}>DIMENSIONAL ACCURACY</div>
              <div style={{ fontSize: "28px", fontWeight: 700 }}>±0.02 mm</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "11px", fontFamily: "monospace", color: "#00D2FF" }}>SURFACE FINISH (Ra)</div>
              <div style={{ fontSize: "28px", fontWeight: 700 }}>0.2 µm</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "11px", fontFamily: "monospace", color: "#00D2FF" }}>WALL UNIFORMITY</div>
              <div style={{ fontSize: "28px", fontWeight: 700 }}>99.98%</div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ===================== SCENE 3: ZERO-DEFECT QUALITY ASSURANCE ===================== */}
      {frame >= 215 && frame < 335 && (
        <AbsoluteFill
          style={{
            opacity: s3Opacity,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "40px",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontFamily: "monospace",
              color: "#10B981",
              letterSpacing: "0.3em",
              marginBottom: "16px",
              textTransform: "uppercase",
            }}
          >
            Phase 03 // Certified Zero-Defect QA & Inspection
          </div>
          <h2
            style={{
              fontSize: "64px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              maxWidth: "1000px",
              margin: 0,
              background: "linear-gradient(135deg, #FFFFFF 0%, #34D399 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            EN 10204 3.1 & 3.2 VERIFIED
          </h2>
          <p
            style={{
              fontSize: "22px",
              color: "#94A3B8",
              marginTop: "20px",
              maxWidth: "800px",
            }}
          >
            Complete heat-wise chemical PMI, 100% Ultrasonic NDT, and high-pressure hydrostatic testing.
          </p>

          {/* Hydrostatic Pressure Gauge Stat */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "40px",
              marginTop: "36px",
            }}
          >
            <div
              style={{
                padding: "20px 40px",
                borderRadius: "16px",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                background: "rgba(16, 185, 129, 0.08)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "12px", fontFamily: "monospace", color: "#34D399" }}>HYDROSTATIC TEST PEAK</div>
              <div style={{ fontSize: "44px", fontWeight: 800, color: "#FFFFFF", marginTop: "4px" }}>
                {s3PressureVal.toLocaleString()} <span style={{ fontSize: "20px", color: "#34D399" }}>PSI</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", textAlign: "left" }}>
              <div style={{ fontSize: "14px", color: "#E2E8F0" }}>✓ 100% Ultrasonic & Radiographic NDT</div>
              <div style={{ fontSize: "14px", color: "#E2E8F0" }}>✓ Intergranular Corrosion (ASTM A262 Prac. E)</div>
              <div style={{ fontSize: "14px", color: "#E2E8F0" }}>✓ Approved: Lloyd's, DNV, TUV, Bureau Veritas, IBR</div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ===================== SCENE 4: GLOBAL EXPORT DISPATCH ===================== */}
      {frame >= 325 && (
        <AbsoluteFill
          style={{
            opacity: s4Opacity,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            padding: "40px",
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontFamily: "monospace",
              color: "#FF3B30",
              letterSpacing: "0.3em",
              marginBottom: "16px",
              textTransform: "uppercase",
            }}
          >
            Phase 04 // Global Port Dispatch & Supply Chain
          </div>
          <h2
            style={{
              fontSize: "64px",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              maxWidth: "1000px",
              margin: 0,
              background: "linear-gradient(135deg, #FFFFFF 0%, #FF9500 50%, #FF3B30 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            DISPATCHED TO 60+ COUNTRIES
          </h2>
          <p
            style={{
              fontSize: "22px",
              color: "#94A3B8",
              marginTop: "20px",
              maxWidth: "800px",
            }}
          >
            Daily container shipments from Nhava Sheva (Mumbai) and Mundra Ports directly to EPC contractors worldwide.
          </p>

          <div
            style={{
              display: "flex",
              gap: "24px",
              marginTop: "36px",
            }}
          >
            <div
              style={{
                padding: "16px 28px",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "11px", fontFamily: "monospace", color: "#94A3B8" }}>READY STOCK</div>
              <div style={{ fontSize: "32px", fontWeight: 800, color: "#FFFFFF" }}>2,500+ MT</div>
            </div>

            <div
              style={{
                padding: "16px 28px",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.04)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "11px", fontFamily: "monospace", color: "#94A3B8" }}>GLOBAL DESTINATIONS</div>
              <div style={{ fontSize: "32px", fontWeight: 800, color: "#FFFFFF" }}>60+ Ports</div>
            </div>

            <div
              style={{
                padding: "16px 28px",
                borderRadius: "14px",
                border: "1px solid rgba(255, 59, 48, 0.3)",
                background: "rgba(255, 59, 48, 0.12)",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "11px", fontFamily: "monospace", color: "#FF3B30" }}>RFQ GUARANTEE</div>
              <div style={{ fontSize: "32px", fontWeight: 800, color: "#FFFFFF" }}>&lt; 4 Hours</div>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Persistent Bottom Cinematic Telemetry Bar */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "14px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          background: "rgba(5, 7, 11, 0.8)",
          backdropFilter: "blur(12px)",
          fontSize: "11px",
          fontFamily: "monospace",
          color: "#64748B",
        }}
      >
        <div style={{ display: "flex", gap: "20px" }}>
          <span style={{ color: "#FF3B30" }}>● LIVE PLAYBACK</span>
          <span>STEELS VISION // INDUSTRIAL EXPORT CINEMA</span>
          <span>VADODARA · MUMBAI · MUNDRA</span>
        </div>
        <div>
          FRAME {frame.toString().padStart(3, "0")} / 450 // 60 FPS
        </div>
      </div>

      {/* Top Scrub Progress Line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "3px",
          width: `${progressPercent}%`,
          backgroundColor: "#FF3B30",
          boxShadow: "0 0 10px #FF3B30",
        }}
      />
    </AbsoluteFill>
  );
};
