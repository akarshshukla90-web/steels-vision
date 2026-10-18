"use client";

import React, { useMemo } from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export type AmbienceMode = "molten" | "blueprint" | "cryo";

interface AmbientFoundryProps {
  mode?: AmbienceMode;
}

// Deterministically generated particle metadata (45 particles)
const PARTICLES = Array.from({ length: 48 }, (_, i) => ({
  id: i,
  baseX: ((i * 37) % 94) + 3, // 3% to 97% width
  speedMultiplier: 0.6 + ((i * 13) % 10) * 0.12,
  radius: 1.2 + ((i * 7) % 5) * 1.1,
  offsetFrame: (i * 53) % 360,
  swayFreq: 0.025 + ((i * 3) % 4) * 0.015,
  swayAmp: 12 + ((i * 11) % 15) * 1.5,
  opacityMax: 0.35 + ((i * 17) % 5) * 0.12,
}));

// Technical HUD crosshair coordinates
const CORNER_CROSSHAIRS = [
  { x: "5%", y: "12%" },
  { x: "95%", y: "12%" },
  { x: "5%", y: "88%" },
  { x: "95%", y: "88%" },
];

export const AmbientFoundryComposition: React.FC<AmbientFoundryProps> = ({
  mode = "molten",
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Mode-based color palettes
  const theme = useMemo(() => {
    switch (mode) {
      case "blueprint":
        return {
          primaryGlow: "rgba(0, 210, 255, 0.12)",
          secondaryGlow: "rgba(59, 130, 246, 0.08)",
          accentGlow: "rgba(99, 102, 241, 0.06)",
          particleColors: ["#00D2FF", "#38BDF8", "#60A5FA", "#93C5FD"],
          laserColor: "rgba(0, 210, 255, 0.65)",
          laserGlow: "rgba(0, 210, 255, 0.2)",
          cadText: "rgba(0, 210, 255, 0.4)",
          gridLine: "rgba(0, 210, 255, 0.04)",
        };
      case "cryo":
        return {
          primaryGlow: "rgba(56, 189, 248, 0.12)",
          secondaryGlow: "rgba(165, 243, 252, 0.07)",
          accentGlow: "rgba(129, 140, 248, 0.06)",
          particleColors: ["#38BDF8", "#A5F3FC", "#BAE6FD", "#E0F2FE"],
          laserColor: "rgba(56, 189, 248, 0.7)",
          laserGlow: "rgba(56, 189, 248, 0.2)",
          cadText: "rgba(56, 189, 248, 0.4)",
          gridLine: "rgba(56, 189, 248, 0.04)",
        };
      case "molten":
      default:
        return {
          primaryGlow: "rgba(255, 59, 48, 0.13)",
          secondaryGlow: "rgba(255, 149, 0, 0.08)",
          accentGlow: "rgba(225, 29, 72, 0.07)",
          particleColors: ["#FF3B30", "#FF6B00", "#FF9500", "#FFB340"],
          laserColor: "rgba(255, 59, 48, 0.65)",
          laserGlow: "rgba(255, 59, 48, 0.2)",
          cadText: "rgba(255, 87, 34, 0.4)",
          gridLine: "rgba(255, 255, 255, 0.025)",
        };
    }
  }, [mode]);

  // Breathing ambient energy orbs
  const orb1Scale = 1 + 0.12 * Math.sin(frame * 0.035);
  const orb2Scale = 1 + 0.15 * Math.cos(frame * 0.028);
  const orb3Scale = 1 + 0.08 * Math.sin(frame * 0.02 + 1.5);

  // Laser scanline position (sweeps vertically every 240 frames)
  const scanProgress = (frame % 240) / 240;
  const scanY = scanProgress * 100; // in %
  const scanOpacity = Math.sin(scanProgress * Math.PI) * 0.85;

  // Crosshair rotation
  const crosshairAngle = (frame * 0.4) % 360;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#030508",
        position: "relative",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      {/* 1. Volumetric Breathing Ambient Glow Orbs */}
      <div
        style={{
          position: "absolute",
          top: "-15%",
          right: "-10%",
          width: "70vw",
          height: "70vw",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.primaryGlow} 0%, rgba(3,5,8,0) 70%)`,
          filter: "blur(60px)",
          transform: `scale(${orb1Scale})`,
          transition: "transform 0.1s linear",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          left: "-15%",
          width: "75vw",
          height: "75vw",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.secondaryGlow} 0%, rgba(3,5,8,0) 70%)`,
          filter: "blur(70px)",
          transform: `scale(${orb2Scale})`,
          transition: "transform 0.1s linear",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "25%",
          width: "50vw",
          height: "50vw",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${theme.accentGlow} 0%, rgba(5,7,11,0) 65%)`,
          filter: "blur(50px)",
          transform: `scale(${orb3Scale})`,
          pointerEvents: "none",
        }}
      />

      {/* 2. Precision Laser Scanline Sweep */}
      <div
        style={{
          position: "absolute",
          top: `${scanY}%`,
          left: 0,
          right: 0,
          height: "2px",
          backgroundColor: theme.laserColor,
          boxShadow: `0 0 20px 2px ${theme.laserGlow}, 0 0 8px ${theme.laserColor}`,
          opacity: scanOpacity,
          pointerEvents: "none",
        }}
      >
        {/* Subtle trailing gradient above the beam */}
        <div
          style={{
            position: "absolute",
            bottom: "2px",
            left: 0,
            right: 0,
            height: "50px",
            background: `linear-gradient(to top, ${theme.laserGlow}, transparent)`,
            opacity: 0.35,
          }}
        />
      </div>

      {/* 3. Dynamic Ember / Spark Particles with Remotion Interpolation */}
      {PARTICLES.map((p) => {
        const loopFrames = durationInFrames || 360;
        const progress = ((frame * p.speedMultiplier + p.offsetFrame) % loopFrames) / loopFrames;
        
        // Starts near bottom (105%), floats up past top (-5%)
        const yPos = 105 - progress * 115;
        // Natural sine-wave horizontal drift
        const xDrift = Math.sin((frame * p.swayFreq) + p.id) * p.swayAmp;
        const xPos = p.baseX + (xDrift / 1920) * 100;
        
        // Bell curve opacity: fade in at spawn, fade out at apex
        const opacity = Math.sin(progress * Math.PI) * p.opacityMax;
        const color = theme.particleColors[p.id % theme.particleColors.length];

        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `${xPos}%`,
              top: `${yPos}%`,
              width: `${p.radius * 2}px`,
              height: `${p.radius * 2}px`,
              borderRadius: "50%",
              backgroundColor: color,
              boxShadow: `0 0 ${p.radius * 4}px ${color}, 0 0 ${p.radius * 8}px ${theme.laserGlow}`,
              opacity: Math.max(0, opacity),
              pointerEvents: "none",
              transform: `translate(-50%, -50%)`,
            }}
          />
        );
      })}

      {/* 4. Industrial CAD Telemetry & Precision Coordinate HUD */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        {/* Precision rotating corner crosshairs */}
        {CORNER_CROSSHAIRS.map((pos, idx) => (
          <g
            key={idx}
            transform={`translate(${pos.x === "5%" ? 50 : 1870}, ${
              pos.y === "12%" ? 120 : 960
            }) rotate(${crosshairAngle})`}
          >
            <circle r="12" fill="none" stroke={theme.cadText} strokeWidth="0.8" strokeDasharray="3 3" />
            <line x1="-16" y1="0" x2="16" y2="0" stroke={theme.cadText} strokeWidth="1" />
            <line x1="0" y1="-16" x2="0" y2="16" stroke={theme.cadText} strokeWidth="1" />
          </g>
        ))}
      </svg>

      {/* 5. Minimalist Telemetry Ticker (Corner Overlays) */}
      <div
        style={{
          position: "absolute",
          bottom: "16px",
          left: "24px",
          fontFamily: "monospace",
          fontSize: "10px",
          color: theme.cadText,
          letterSpacing: "0.15em",
          pointerEvents: "none",
          display: "flex",
          gap: "16px",
          opacity: 0.6,
        }}
      >
        <span>REMOTION ENGINE v4 // 60 FPS</span>
        <span>SYS.FRAME: {frame.toString().padStart(4, "0")}</span>
        <span>ALLOY STATUS: STABLE</span>
      </div>

      <div
        style={{
          position: "absolute",
          top: "16px",
          right: "24px",
          fontFamily: "monospace",
          fontSize: "9px",
          color: theme.cadText,
          letterSpacing: "0.12em",
          pointerEvents: "none",
          textAlign: "right",
          opacity: 0.5,
        }}
      >
        <div>VADODARA HUB // NHAVA SHEVA CORRIDOR</div>
        <div>ISO 9001:2015 · 14001:2015 · 45001:2018</div>
      </div>
    </div>
  );
};
