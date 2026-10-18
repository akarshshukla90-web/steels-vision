"use client";

import React, { useEffect, useState } from "react";
import { Player } from "@remotion/player";
import { AmbientFoundryComposition } from "./compositions/AmbientFoundryComposition";
import { useAmbience } from "@/hooks/useAmbience";

export default function RemotionBackgroundClient() {
  const { mode } = useAmbience();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[#05070B]" />
    );
  }

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none -z-10 overflow-hidden select-none"
    >
      <Player
        component={AmbientFoundryComposition}
        inputProps={{ mode }}
        durationInFrames={360}
        compositionWidth={1920}
        compositionHeight={1080}
        fps={60}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          inset: 0,
        }}
        autoPlay
        loop
        controls={false}
      />
      {/* Subtle vignette layer overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(5, 7, 11, 0.65) 100%)",
        }}
      />
    </div>
  );
}
