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
    <div className="border-b border-[#23252a] bg-[#0f1013] px-4 py-3 sm:px-6">
      <div className="mx-auto max-w-7xl">
        {/* Topic & Crux Banner */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                ACTIVE DISPUTE CRUX
              </span>
              <span className="text-xs font-mono text-[#8b8e98]">{topic}</span>
            </div>
            <h2 className="mt-1 font-mono text-sm sm:text-base font-bold text-[#f5f5f0] tracking-tight">
              {crux}
            </h2>
          </div>

          {/* Consensus Progress Bar */}
          <div className="flex items-center gap-4 lg:w-80">
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#8b8e98] flex items-center gap-1">
                  <Scale className="h-3.5 w-3.5 text-emerald-400" />
                  Common Ground
                </span>
                <span className="font-bold text-emerald-400">{consensusProgress}%</span>
              </div>
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-[#1e2025]">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-700"
                  style={{ width: `${consensusProgress}%` }}
                />
              </div>
            </div>

            {isResolved && (
              <div className="flex items-center gap-1 rounded bg-emerald-500/20 px-2.5 py-1 text-xs font-mono font-bold text-emerald-300 border border-emerald-500/40 animate-pulse">
                <Sparkles className="h-3.5 w-3.5" />
                MIND-SHIFT RESOLVED
              </div>
            )}
          </div>
        </div>

        {/* Debater Belief Meters */}
        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 pt-2 border-t border-[#1c1d22]">
          {/* Debater A */}
          <div className="flex items-center justify-between bg-[#141519] px-3 py-1.5 rounded border border-[#202227]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-400" />
              <span className="font-mono text-xs text-[#f5f5f0] font-semibold">{debaterAName}</span>
              <span className="text-[10px] font-mono text-[#8b8e98] uppercase">({debaterALang})</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-[#8b8e98]">Certainty:</span>
              <span className={`font-bold ${debaterAStance > 60 ? "text-red-400" : "text-emerald-400"}`}>
                {debaterAStance}%
              </span>
            </div>
          </div>

          {/* Debater B */}
          <div className="flex items-center justify-between bg-[#141519] px-3 py-1.5 rounded border border-[#202227]">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span className="font-mono text-xs text-[#f5f5f0] font-semibold">{debaterBName}</span>
              <span className="text-[10px] font-mono text-[#8b8e98] uppercase">({debaterBLang})</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-[#8b8e98]">Certainty:</span>
              <span className={`font-bold ${debaterBStance > 60 ? "text-red-400" : "text-emerald-400"}`}>
                {debaterBStance}%
              </span>
            </div>
          </div>
        </div>

        {/* Common Ground Ledger (Points Conceded) */}
        {commonGroundLedger.length > 0 && (
          <div className="mt-3 rounded border border-emerald-500/30 bg-emerald-950/10 p-2.5">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
              <ShieldCheck className="h-3.5 w-3.5" />
              Immutable Common Ground Ledger ({commonGroundLedger.length} conceded point
              {commonGroundLedger.length > 1 ? "s" : ""})
            </div>
            <div className="mt-2 space-y-1.5 max-h-24 overflow-y-auto no-scrollbar">
              {commonGroundLedger.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-2 text-xs font-mono text-[#dcded8] bg-[#141816] px-2.5 py-1 rounded border border-emerald-900/40"
                >
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                  <div>
                    <span className="font-semibold text-emerald-300">[{item.concededBy} yielded ground]:</span>{" "}
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
