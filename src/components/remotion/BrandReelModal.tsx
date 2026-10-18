"use client";

import React, { useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useAmbience } from "@/hooks/useAmbience";
import { X, Play, Shield, Globe, Award, Sparkles } from "lucide-react";
import type { PlayerRef } from "@remotion/player";

const Player = dynamic(
  () => import("@remotion/player").then((mod) => mod.Player),
  { ssr: false }
);

import { BrandShowreelComposition } from "./compositions/BrandShowreelComposition";

export default function BrandReelModal() {
  const { isCinemaOpen, setIsCinemaOpen } = useAmbience();
  const playerRef = useRef<PlayerRef>(null);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCinemaOpen(false);
      }
    };
    if (isCinemaOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isCinemaOpen, setIsCinemaOpen]);

  if (!isCinemaOpen) return null;

  const seekToFrame = (frame: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(frame);
      playerRef.current.play();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-5xl rounded-3xl overflow-hidden border border-white/10 bg-[#0A0E18] shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 bg-[#05070B]/80">
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 rounded-full bg-red-500 animate-pulse" />
            <div>
              <h3 className="text-sm font-bold tracking-tight text-white flex items-center gap-2">
                STEELS VISION // INDUSTRIAL EXPORT CINEMA
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-red-500/15 text-red-400 border border-red-500/30">
                  Remotion 4K 60FPS
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                ISO 9001:2015 · 14001:2015 · 45001:2018 · EN 10204 3.1 Certified
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCinemaOpen(false)}
            aria-label="Close cinema player"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 16:9 Video Canvas Frame */}
        <div className="relative w-full aspect-video bg-[#05070B] overflow-hidden">
          <Player
            ref={playerRef}
            component={BrandShowreelComposition}
            durationInFrames={450}
            compositionWidth={1920}
            compositionHeight={1080}
            fps={60}
            style={{
              width: "100%",
              height: "100%",
            }}
            controls
            autoPlay
            loop
          />
        </div>

        {/* Interactive Scene Navigation Ticks */}
        <div className="p-4 bg-[#05070B]/90 border-t border-white/8">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-red-500" />
            Direct Scene Navigation (Jump to Milestone):
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={() => seekToFrame(0)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-red-500/15 border border-white/8 hover:border-red-500/30 text-left transition-all group"
            >
              <div className="w-6 h-6 rounded-lg bg-red-500/20 text-red-400 font-mono text-xs flex items-center justify-center font-bold">
                01
              </div>
              <div className="text-xs">
                <div className="font-semibold text-white group-hover:text-red-400 transition-colors">
                  The Forge
                </div>
                <div className="text-[10px] text-slate-400 font-mono">1,650°C Molten Core</div>
              </div>
            </button>

            <button
              onClick={() => seekToFrame(110)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-cyan-500/15 border border-white/8 hover:border-cyan-500/30 text-left transition-all group"
            >
              <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-mono text-xs flex items-center justify-center font-bold">
                02
              </div>
              <div className="text-xs">
                <div className="font-semibold text-white group-hover:text-cyan-400 transition-colors">
                  Precision CNC
                </div>
                <div className="text-[10px] text-slate-400 font-mono">±0.02 mm Extrusion</div>
              </div>
            </button>

            <button
              onClick={() => seekToFrame(220)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-emerald-500/15 border border-white/8 hover:border-emerald-500/30 text-left transition-all group"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center justify-center font-bold">
                03
              </div>
              <div className="text-xs">
                <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors">
                  Zero-Defect QA
                </div>
                <div className="text-[10px] text-slate-400 font-mono">15,000 PSI & MTC 3.1</div>
              </div>
            </button>

            <button
              onClick={() => seekToFrame(330)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-red-500/15 border border-white/8 hover:border-red-500/30 text-left transition-all group"
            >
              <div className="w-6 h-6 rounded-lg bg-red-500/20 text-red-400 font-mono text-xs flex items-center justify-center font-bold">
                04
              </div>
              <div className="text-xs">
                <div className="font-semibold text-white group-hover:text-red-400 transition-colors">
                  Global Dispatch
                </div>
                <div className="text-[10px] text-slate-400 font-mono">60+ Countries Direct</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
