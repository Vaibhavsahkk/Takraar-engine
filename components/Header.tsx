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
  // Determine heat state within the Sky Blue to Golden thermal scale
  let heatLabel = "Calm / Rational";
  let heatColor = "text-sky-400";
  let heatBarBg = "bg-gradient-to-r from-sky-500 to-sky-400";
  if (heatScore > 75) {
    heatLabel = "Critical Tension";
    heatColor = "text-amber-300 animate-pulse";
    heatBarBg = "bg-gradient-to-r from-sky-400 via-amber-400 to-amber-300";
  } else if (heatScore > 45) {
    heatLabel = "Heated Velocity";
    heatColor = "text-amber-400";
    heatBarBg = "bg-gradient-to-r from-sky-500 to-amber-400";
  } else if (heatScore > 20) {
    heatLabel = "Active Exchange";
    heatColor = "text-sky-300";
    heatBarBg = "bg-gradient-to-r from-sky-600 to-sky-400";
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#131b28] bg-[#050608]/95 backdrop-blur-xl px-3 py-2.5 sm:px-6 sm:py-3">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2.5 sm:gap-4">
        {/* Brand & Identity */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-lg border border-sky-500/30 bg-[#0a101b] shadow-[0_0_15px_rgba(56,189,248,0.2)] font-mono font-bold text-sky-400 text-base sm:text-lg shrink-0">
            ⚡
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="font-mono text-sm sm:text-base font-extrabold uppercase tracking-widest bg-gradient-to-r from-sky-300 via-sky-100 to-amber-300 bg-clip-text text-transparent">
                TAKRAAR
              </span>
              <span className="hidden md:inline-block rounded border border-sky-500/20 bg-[#09111c] px-2 py-0.5 font-mono text-[10px] uppercase text-sky-300 tracking-wider">
                Full-Duplex Dispute Runtime
              </span>
            </div>
            <p className="hidden text-xs text-[#94a3b8] sm:block">
              Two languages. Sub-second preemption. Acoustic heat velocity. Consensus ledger.
            </p>
          </div>
        </div>

        {/* Dynamic Heat Metric */}
        <div className="flex items-center gap-2 sm:gap-3 bg-[#0a0d14] border border-[#182338] px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg shadow-sm">
          <Flame className={`h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 ${heatScore > 50 ? "text-amber-400 animate-bounce" : "text-sky-400"}`} />
          <div className="flex flex-col min-w-[70px] sm:min-w-[140px]">
            <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono gap-1">
              <span className="hidden sm:inline uppercase text-[#94a3b8] text-[10px]">{heatLabel}</span>
              <span className={`font-bold ${heatColor}`}>{heatScore}°C</span>
            </div>
            {/* Heat Bar */}
            <div className="mt-0.5 sm:mt-1 h-1 sm:h-1.5 w-full overflow-hidden rounded-full bg-[#111723]">
              <div
                className={`h-full transition-all duration-500 rounded-full ${heatBarBg}`}
                style={{ width: `${heatScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {mode === "solo" ? (
            <button
              onClick={onOpenScenarios}
              title="Adversary Matrix"
              className="btn-glass flex items-center gap-1.5 rounded-md px-2.5 py-1.5 font-mono text-xs text-sky-200"
            >
              <Zap className="h-3.5 w-3.5 text-amber-300 shrink-0" />
              <span className="hidden sm:inline">Adversary Matrix</span>
            </button>
          ) : (
            <div className="rounded-md border border-sky-500/30 bg-[#0a111c] px-2 py-1 text-xs font-mono text-sky-300">
              <span className="font-bold text-amber-300">{roomId}</span>
            </div>
          )}

          {/* Mode Switcher */}
          <div className="flex items-center rounded-md border border-[#182338] bg-[#07090e] p-0.5">
            <button
              onClick={() => onSwitchMode("solo")}
              className={`rounded px-2 py-1 font-mono text-[11px] sm:text-xs transition-all ${
                mode === "solo"
                  ? "bg-sky-500/20 text-sky-200 border border-sky-400/40 font-semibold shadow-[0_0_10px_rgba(56,189,248,0.2)]"
                  : "text-[#64748b] hover:text-[#94a3b8]"
              }`}
            >
              <span className="sm:hidden">Solo</span>
              <span className="hidden sm:inline">Autonomous</span>
            </button>
            <button
              onClick={() => onSwitchMode("multiplayer")}
              className={`rounded px-2 py-1 font-mono text-[11px] sm:text-xs transition-all ${
                mode === "multiplayer"
                  ? "bg-amber-500/20 text-amber-200 border border-amber-400/40 font-semibold shadow-[0_0_10px_rgba(245,197,66,0.2)]"
                  : "text-[#64748b] hover:text-[#94a3b8]"
              }`}
            >
              <span className="sm:hidden">P2P</span>
              <span className="hidden sm:inline">Peer-to-Peer</span>
            </button>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleMute}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md border border-[#182338] bg-[#0a0d14] text-[#94a3b8] hover:text-sky-300 hover:border-sky-500/40 transition-colors shrink-0"
          >
            {isMuted ? <VolumeX className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Volume2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-sky-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
