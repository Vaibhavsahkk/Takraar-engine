"use client";

import React from "react";
import { SPARRING_SCENARIOS, SparringScenario } from "@/lib/sparringScenarios";
import { X, Zap, Globe, Sparkles, Scale } from "lucide-react";
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-[#2e323d] bg-[#121317] p-5 sm:p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#23252d]">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                CHALLENGE ADVERSARY
              </span>
              <span className="font-mono text-xs text-[#8b8e98]">Solo Sparring Arena</span>
            </div>
            <h3 className="mt-1 font-mono text-lg font-bold text-[#f5f5f0]">
              Select Debate Opponent & Language Barrier
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#8b8e98] hover:text-[#f5f5f0] hover:bg-[#20222a] transition-colors"
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
                    ? "border-amber-500/80 bg-[#1c1d24] shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                    : "border-[#252731] bg-[#15161b] hover:border-[#383b48] hover:bg-[#191a21]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{sc.opponentAvatar}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-mono font-bold text-[#f5f5f0] text-sm">
                          {sc.opponentName}
                        </h4>
                        <span className="rounded bg-[#22242c] px-1.5 py-0.5 font-mono text-[10px] text-[#9a9da8]">
                          {sc.opponentRole}
                        </span>
                      </div>
                      <p className="font-mono text-xs text-amber-400 mt-0.5">{sc.title}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 rounded-full border border-[#2e313b] bg-[#121316] px-2.5 py-1 text-xs font-mono">
                    <span>{langObj?.flag}</span>
                    <span className="font-semibold text-[#f5f5f0]">{langObj?.name}</span>
                  </div>
                </div>

                <div className="mt-3 text-xs font-mono text-[#a5a8b4] border-t border-[#23252e] pt-2">
                  <strong className="text-[#e2e4ec]">Crux:</strong> {sc.crux}
                </div>
              </div>
            );
          })}

          {/* Custom Arena Builder */}
          <div className="mt-4 rounded-xl border border-dashed border-[#2f333f] bg-[#14151a] p-4">
            <h4 className="flex items-center gap-2 font-mono text-xs font-bold uppercase text-amber-400">
              <Sparkles className="h-4 w-4" />
              Custom Debate Arena
            </h4>
            <form onSubmit={handleCreateCustom} className="mt-3 space-y-2.5">
              <div>
                <label className="block text-[11px] font-mono text-[#8b8e98] uppercase">
                  Debate Topic
                </label>
                <input
                  type="text"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="e.g. Remote work vs in-office density for startups"
                  className="mt-1 w-full rounded border border-[#282a35] bg-[#101115] px-3 py-1.5 font-mono text-xs text-[#f5f5f0] focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-[#8b8e98] uppercase">
                  Underlying Crux
                </label>
                <input
                  type="text"
                  value={customCrux}
                  onChange={(e) => setCustomCrux(e.target.value)}
                  placeholder="e.g. Asynchronous deep work vs spontaneous hallway osmosis"
                  className="mt-1 w-full rounded border border-[#282a35] bg-[#101115] px-3 py-1.5 font-mono text-xs text-[#f5f5f0] focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-[#8b8e98] uppercase">Opponent Tongue:</span>
                  <select
                    value={customOpponentLang}
                    onChange={(e) => setCustomOpponentLang(e.target.value)}
                    className="rounded border border-[#282a35] bg-[#101115] px-2 py-1 font-mono text-xs text-[#f5f5f0] focus:outline-none"
                  >
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.flag} {l.name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={!customTopic.trim() || !customCrux.trim()}
                  className="btn-brutalist rounded bg-amber-500 px-3 py-1 font-mono text-xs font-bold text-black hover:bg-amber-400 disabled:opacity-40"
                >
                  Launch Custom Arena
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
