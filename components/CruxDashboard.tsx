"use client";

import React from "react";
import { CheckCircle2, Scale, Sparkles, ShieldCheck } from "lucide-react";

interface CruxDashboardProps {
  topic: string;
  crux: string;
  debaterAName: string;
  debaterALang: string;
  debaterAStance: number; // 0 to 100
  debaterBName: string;
  debaterBLang: string;
  debaterBStance: number; // 0 to 100
  commonGroundLedger: {
    id: string;
    summary: string;
    concededBy: string;
    timestamp: number;
  }[];
  isResolved: boolean;
}

export const CruxDashboard: React.FC<CruxDashboardProps> = ({
  topic,
  crux,
  debaterAName,
  debaterALang,
  debaterAStance,
  debaterBName,
  debaterBLang,
  debaterBStance,
  commonGroundLedger,
  isResolved,
}) => {
  // Calculate mutual consensus score (inversion of average stance)
  const averageStubbornness = (debaterAStance + debaterBStance) / 2;
  const consensusProgress = Math.max(0, Math.min(100, Math.round(100 - averageStubbornness)));

  return (
    <div className="border-b border-[#141e30] bg-[#07090f] px-4 py-3 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Topic & Crux Banner */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-400/30">
                ACTIVE DISPUTE CRUX
              </span>
              <span className="text-xs font-mono text-[#94a3b8]">{topic}</span>
            </div>
            <h2 className="mt-1 font-mono text-sm sm:text-base font-bold text-[#f1f5f9] tracking-tight">
              {crux}
            </h2>
          </div>

          {/* Consensus Progress Bar */}
          <div className="flex items-center gap-4 lg:w-80">
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#94a3b8] flex items-center gap-1.5">
                  <Scale className="h-3.5 w-3.5 text-amber-300" />
                  Common Ground
                </span>
                <span className="font-bold text-amber-300">{consensusProgress}%</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#101726]">
                <div
                  className="h-full bg-gradient-to-r from-sky-400 via-sky-300 to-amber-300 transition-all duration-700 rounded-full shadow-[0_0_12px_rgba(56,189,248,0.4)]"
                  style={{ width: `${consensusProgress}%` }}
                />
              </div>
            </div>

            {isResolved && (
              <div className="flex items-center gap-1 rounded-md bg-amber-400/20 px-2.5 py-1 text-xs font-mono font-bold text-amber-200 border border-amber-400/50 animate-pulse shadow-[0_0_15px_rgba(245,197,66,0.3)]">
                <Sparkles className="h-3.5 w-3.5" />
                CONSENSUS REACHED
              </div>
            )}
          </div>
        </div>

        {/* Debater Belief Certainty Meters */}
        <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2 pt-2.5 border-t border-[#121926]">
          {/* Debater A (Sky Blue Signature) */}
          <div className="flex items-center justify-between bg-[#08101c]/80 px-3.5 py-2 rounded-lg border border-sky-500/25 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]" />
              <span className="font-mono text-xs text-sky-100 font-semibold">{debaterAName}</span>
              <span className="text-[10px] font-mono text-sky-400/70 uppercase">({debaterALang})</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-[#94a3b8] text-[11px]">Certainty:</span>
              <span className="font-bold text-sky-300">
                {debaterAStance}%
              </span>
            </div>
          </div>

          {/* Debater B (Light Golden Signature) */}
          <div className="flex items-center justify-between bg-[#141008]/80 px-3.5 py-2 rounded-lg border border-amber-500/25 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,197,66,0.8)]" />
              <span className="font-mono text-xs text-amber-100 font-semibold">{debaterBName}</span>
              <span className="text-[10px] font-mono text-amber-400/70 uppercase">({debaterBLang})</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-[#94a3b8] text-[11px]">Certainty:</span>
              <span className="font-bold text-amber-300">
                {debaterBStance}%
              </span>
            </div>
          </div>
        </div>

        {/* Common Ground Ledger (Points Conceded) */}
        {commonGroundLedger.length > 0 && (
          <div className="mt-3 rounded-lg border border-amber-500/30 bg-[#0a0e17] p-3 shadow-inner">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-300 uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5" />
              Immutable Common Ground Ledger ({commonGroundLedger.length} conceded point
              {commonGroundLedger.length > 1 ? "s" : ""})
            </div>
            <div className="mt-2 space-y-1.5 max-h-24 overflow-y-auto no-scrollbar">
              {commonGroundLedger.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-2 text-xs font-mono text-[#cbd5e1] bg-[#0f1420] px-3 py-1.5 rounded border border-amber-500/20"
                >
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
                  <div>
                    <span className="font-semibold text-amber-300">[{item.concededBy} yielded ground]:</span>{" "}
                    {item.summary}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
