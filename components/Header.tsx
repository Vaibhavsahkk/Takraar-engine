"use client";

import React from "react";
import { Volume2, VolumeX, Flame, Zap } from "lucide-react";

interface HeaderProps {
  heatScore: number;
  isMuted: boolean;
  onToggleMute: () => void;
  mode: "solo" | "multiplayer";
  onSwitchMode: (mode: "solo" | "multiplayer") => void;
  roomId?: string;
  onOpenScenarios: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  heatScore,
  isMuted,
  onToggleMute,
  mode,
  onSwitchMode,
  roomId,
  onOpenScenarios,
}) => {
  // Determine heat category & color
  let heatLabel = "Rational / Cold";
  let heatColor = "text-blue-400";
  let heatBarBg = "bg-blue-500";
  if (heatScore > 75) {
    heatLabel = "CRITICAL BOILING POINT";
    heatColor = "text-red-500 animate-pulse";
    heatBarBg = "bg-red-600";
  } else if (heatScore > 50) {
    heatLabel = "Heated / Passionate";
    heatColor = "text-amber-500";
    heatBarBg = "bg-amber-500";
  } else if (heatScore > 30) {
    heatLabel = "Simmering Tension";
    heatColor = "text-yellow-400";
    heatBarBg = "bg-yellow-500";
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#23252a] bg-[#0c0d10]/95 backdrop-blur-md px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Brand & Ethos */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded border border-[#2e323b] bg-[#16171b] shadow-inner font-mono font-bold text-red-500 text-lg">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-extrabold uppercase tracking-widest text-[#f5f5f0]">
                TAKRAAR
              </span>
              <span className="rounded bg-[#1e2025] px-1.5 py-0.5 font-mono text-[10px] uppercase text-[#8b8e98] tracking-wider border border-[#2c2f37]">
                v1.0 // Cross-Lingual Dispute Engine
              </span>
            </div>
            <p className="hidden text-xs text-[#8b8e98] sm:block">
              Two languages. Real interruptions. Heated tempers. Mind-shifts tracked.
            </p>
          </div>
        </div>

        {/* Heat Meter Display */}
        <div className="flex items-center gap-3 bg-[#131418] border border-[#23252a] px-3 py-1.5 rounded-md shadow-sm">
          <Flame className={`h-4 w-4 ${heatScore > 60 ? "text-red-500 animate-bounce" : "text-amber-400"}`} />
          <div className="flex flex-col min-w-[120px] sm:min-w-[150px]">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="uppercase text-[#8b8e98]">{heatLabel}</span>
              <span className={`font-bold ${heatColor}`}>{heatScore}°C</span>
            </div>
            {/* Heat Progress Bar */}
            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#202227]">
              <div
                className={`h-full transition-all duration-500 ${heatBarBg}`}
                style={{ width: `${heatScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Scenario / Mode selector */}
          {mode === "solo" ? (
            <button
              onClick={onOpenScenarios}
              className="btn-brutalist flex items-center gap-1.5 rounded bg-[#18191e] px-3 py-1.5 font-mono text-xs text-[#e1e2e6] hover:bg-[#22242b]"
            >
              <Zap className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline">Change Adversary</span>
            </button>
          ) : (
            <div className="rounded border border-[#2e323b] bg-[#141519] px-2.5 py-1 text-xs font-mono text-[#8b8e98]">
              Room: <span className="font-bold text-amber-400">{roomId}</span>
            </div>
          )}

          {/* Mode Switcher */}
          <div className="flex items-center rounded border border-[#2e323b] bg-[#121316] p-0.5">
            <button
              onClick={() => onSwitchMode("solo")}
              className={`rounded px-2.5 py-1 font-mono text-xs transition-colors ${
                mode === "solo"
                  ? "bg-[#272930] text-[#f5f5f0] font-semibold"
                  : "text-[#8b8e98] hover:text-[#f5f5f0]"
              }`}
            >
              Solo Sparring
            </button>
            <button
              onClick={() => onSwitchMode("multiplayer")}
              className={`rounded px-2.5 py-1 font-mono text-xs transition-colors ${
                mode === "multiplayer"
                  ? "bg-[#272930] text-[#f5f5f0] font-semibold"
                  : "text-[#8b8e98] hover:text-[#f5f5f0]"
              }`}
            >
              Live 2-Player
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            className="flex h-8 w-8 items-center justify-center rounded border border-[#2e323b] bg-[#16171b] text-[#8b8e98] hover:text-[#f5f5f0] hover:bg-[#202228] transition-colors"
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4 text-emerald-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
