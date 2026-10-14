"use client";

import React from "react";
import { SPARRING_SCENARIOS, SparringScenario } from "@/lib/sparringScenarios";
import { X, Sparkles } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/lib/speechEngine";

interface ScenarioSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  activeScenarioId: string;
  onSelectScenario: (scenario: SparringScenario) => void;
  onCustomScenario: (topic: string, crux: string, opponentLang: string) => void;
}

export const ScenarioSelector: React.FC<ScenarioSelectorProps> = ({
  isOpen,
  onClose,
  activeScenarioId,
  onSelectScenario,
  onCustomScenario,
}) => {
  const [customTopic, setCustomTopic] = React.useState("");
  const [customCrux, setCustomCrux] = React.useState("");
  const [customOpponentLang, setCustomOpponentLang] = React.useState("es");

  if (!isOpen) return null;

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopic.trim() || !customCrux.trim()) return;
    onCustomScenario(customTopic.trim(), customCrux.trim(), customOpponentLang);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-sky-500/30 bg-[#080d17] p-5 sm:p-6 shadow-[0_0_50px_rgba(56,189,248,0.15)] overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#162134]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-400/30">
                ADVERSARIAL MATRIX
              </span>
              <span className="font-mono text-xs text-[#94a3b8]">Autonomous Sparring Models</span>
            </div>
            <h3 className="mt-1 font-mono text-lg font-bold text-sky-100">
              Configure Dialectical Interlocutor & Language Constraint
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#94a3b8] hover:text-sky-300 hover:bg-[#101726] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scenarios List */}
        <div className="mt-4 space-y-3 overflow-y-auto no-scrollbar flex-1 pr-1">
          {SPARRING_SCENARIOS.map((sc) => {
            const isSelected = sc.id === activeScenarioId;
            const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === sc.opponentLang);

            return (
              <div
                key={sc.id}
                onClick={() => {
                  onSelectScenario(sc);
                  onClose();
                }}
                className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                  isSelected
                    ? "border-amber-400/80 bg-[#141208] shadow-[0_0_20px_rgba(245,197,66,0.2)]"
                    : "border-[#172235] bg-[#0b101c] hover:border-sky-400/50 hover:bg-[#0f1728]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{sc.opponentAvatar}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-mono font-bold text-[#f1f5f9] text-sm">
                          {sc.opponentName}
                        </h4>
                        <span className="rounded bg-[#162032] border border-sky-500/20 px-1.5 py-0.5 font-mono text-[10px] text-sky-300">
                          {sc.opponentRole}
                        </span>
                      </div>
                      <p className="font-mono text-xs text-amber-300 mt-0.5">{sc.title}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-[#070d18] px-2.5 py-1 text-xs font-mono">
                    <span>{langObj?.flag}</span>
                    <span className="font-semibold text-sky-200">{langObj?.name}</span>
                  </div>
                </div>

                <div className="mt-3 rounded-lg border border-[#162236] bg-[#070b14] p-2.5 text-xs font-mono text-[#cbd5e1]">
                  <span className="text-sky-400/80 font-semibold">Core Crux:</span> {sc.crux}
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Scenario Form */}
        <div className="mt-4 border-t border-[#162134] pt-4">
          <p className="font-mono text-xs uppercase font-bold text-sky-300 mb-2 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-300" /> Construct Custom Adversarial Crucible
          </p>
          <form onSubmit={handleCreateCustom} className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <input
              type="text"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
              placeholder="Topic Domain (e.g. LLM Reasoning)"
              className="rounded-lg border border-[#172235] bg-[#070b13] px-3 py-1.5 font-mono text-xs text-[#f1f5f9] placeholder-[#64748b] focus:border-sky-400 focus:outline-none"
            />
            <input
              type="text"
              value={customCrux}
              onChange={(e) => setCustomCrux(e.target.value)}
              placeholder="Root Contention Crux"
              className="rounded-lg border border-[#172235] bg-[#070b13] px-3 py-1.5 font-mono text-xs text-[#f1f5f9] placeholder-[#64748b] focus:border-sky-400 focus:outline-none"
            />
            <div className="flex gap-2">
              <select
                value={customOpponentLang}
                onChange={(e) => setCustomOpponentLang(e.target.value)}
                className="flex-1 rounded-lg border border-[#172235] bg-[#070b13] px-2 py-1.5 font-mono text-xs text-sky-200 focus:outline-none cursor-pointer"
              >
                {SUPPORTED_LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="bg-[#0b101c] text-[#f1f5f9]">
                    {l.flag} {l.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={!customTopic.trim() || !customCrux.trim()}
                className="rounded-lg bg-gradient-to-r from-amber-400 to-amber-300 px-3.5 py-1.5 font-mono text-xs font-bold text-black hover:shadow-[0_0_15px_rgba(245,197,66,0.3)] transition-all disabled:opacity-40"
              >
                Engage
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
