"use client";

import React, { useEffect, useRef } from "react";
import { DebateMessage } from "@/lib/roomStore";
import { Volume2, Zap, Sparkles, CheckCircle2 } from "lucide-react";
import { speechEngine } from "@/lib/speechEngine";

interface DebateArenaProps {
  messages: DebateMessage[];
  debaterAId: string;
  debaterAName?: string;
  debaterALang?: string;
  debaterBId?: string;
  debaterBName: string;
  debaterBLang?: string;
  activeSpeakerId?: string | null;
  heatScore: number;
  interruptionBanner: {
    interrupterName: string;
    interruptedName: string;
  } | null;
  currentDraft?: string;
  isOpponentTyping?: boolean;
}

export const DebateArena: React.FC<DebateArenaProps> = ({
  messages,
  debaterAId,
  debaterBName,
  heatScore,
  interruptionBanner,
  isOpponentTyping,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, interruptionBanner, isOpponentTyping]);

  const handlePlayVoice = (text: string, langCode: string) => {
    speechEngine.speak(text, langCode, heatScore);
  };

  return (
    <div className="relative flex-1 overflow-y-auto px-4 py-6 sm:px-6 no-scrollbar">
      {/* Live Interruption Banner Notice */}
      {interruptionBanner && (
        <div className="sticky top-2 z-20 mx-auto mb-4 flex max-w-lg items-center justify-center gap-2 rounded-full border border-sky-400/40 bg-[#080d18]/95 px-4 py-2 text-xs font-mono font-bold text-sky-200 shadow-[0_0_25px_rgba(56,189,248,0.3)] backdrop-blur-md interruption-flash">
          <Zap className="h-4 w-4 animate-bounce text-amber-300" />
          <span>
            PREEMPTION COLLISION: <strong className="text-white">{interruptionBanner.interrupterName}</strong> cut
            off <strong className="text-white">{interruptionBanner.interruptedName}</strong>
          </span>
        </div>
      )}

      {/* Message Feed */}
      <div className="mx-auto max-w-4xl space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-sky-500/30 bg-[#0a111e] text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.2)]">
              ⚡
            </div>
            <h3 className="mt-4 font-mono text-base font-bold text-[#f1f5f9]">
              The Arena is Primed
            </h3>
            <p className="mt-1 max-w-md text-xs font-mono text-[#94a3b8]">
              Both speakers are connected across natural languages. Begin arguing, trigger{" "}
              <strong className="text-sky-300">BARGE IN</strong> to seize floor custody mid-speech, and force concessions.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isDebaterA = msg.senderId === debaterAId;
            const isFurious = msg.emotion === "furious";
            const isConcession = msg.isConcession;

            // Light Sky Blue for Debater A, Light Golden for Debater B
            let cardBg = isDebaterA ? "bg-[#09101d]/90" : "bg-[#141007]/90";
            let borderColor = isDebaterA
              ? "border-[#152338] border-l-4 border-l-sky-400"
              : "border-[#2c2010] border-r-4 border-r-amber-400";

            if (msg.isInterruption) {
              borderColor = isDebaterA
                ? "border-sky-400/80 border-l-4 border-l-amber-400 shadow-[0_0_20px_rgba(56,189,248,0.2)]"
                : "border-amber-400/80 border-r-4 border-r-sky-400 shadow-[0_0_20px_rgba(245,197,66,0.2)]";
            } else if (isConcession) {
              borderColor = "border-amber-400/80 border-l-4 border-l-amber-300 shadow-[0_0_20px_rgba(245,197,66,0.25)]";
              cardBg = "bg-[#161208]";
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isDebaterA ? "items-start" : "items-end"}`}
              >
                {/* Speaker Header */}
                <div className="flex items-center gap-2 px-1 mb-1 font-mono text-[11px] text-[#94a3b8]">
                  <span className={`font-semibold ${isDebaterA ? "text-sky-300" : "text-amber-300"}`}>
                    {msg.senderName}
                  </span>
                  <span className={`uppercase text-[10px] px-1 rounded ${
                    isDebaterA ? "text-sky-400/70 bg-sky-950/40" : "text-amber-400/70 bg-amber-950/40"
                  }`}>
                    [{msg.senderLang.toUpperCase()}]
                  </span>

                  {/* Emotion / Status Badge */}
                  {msg.isInterruption && (
                    <span className="flex items-center gap-0.5 rounded bg-sky-950/60 px-1.5 py-0.2 text-[10px] font-bold text-sky-300 border border-sky-400/40 shadow-sm">
                      <Zap className="h-3 w-3 text-amber-300" /> PREEMPTED
                    </span>
                  )}
                  {isConcession && (
                    <span className="flex items-center gap-0.5 rounded bg-amber-950/60 px-1.5 py-0.2 text-[10px] font-bold text-amber-300 border border-amber-400/40 shadow-sm">
                      <CheckCircle2 className="h-3 w-3 text-amber-400" /> GROUND YIELDED
                    </span>
                  )}
                  {!msg.isInterruption && !isConcession && (
                    <span className="rounded bg-[#121826] px-1.5 py-0.2 text-[10px] uppercase text-[#94a3b8]">
                      {msg.emotion}
                    </span>
                  )}

                  <span className="text-[10px] text-[#475569]">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`w-full max-w-xl rounded-xl p-4 transition-all duration-200 backdrop-blur-md ${cardBg} ${borderColor}`}
                >
                  {/* Interruption Header Tag */}
                  {msg.isInterruption && (
                    <div className="mb-2 flex items-center gap-1.5 rounded bg-[#0b1424] px-2.5 py-1 text-[11px] font-mono text-sky-200 border border-sky-500/30">
                      <Zap className="h-3.5 w-3.5 text-amber-300" />
                      <span>Cut off mid-speech to deliver rebuttal:</span>
                    </div>
                  )}

                  {/* Translated Text (In Focus for listener) */}
                  <div className="flex items-start justify-between gap-3">
                    <p
                      className={`text-sm sm:text-base font-medium leading-relaxed text-[#f1f5f9] ${
                        isFurious ? "shake-heated" : ""
                      }`}
                    >
                      {msg.translatedText}
                    </p>

                    {/* Speech audio replay button */}
                    <button
                      onClick={() => handlePlayVoice(msg.translatedText, msg.targetLang)}
                      aria-label="Play translated speech"
                      className="shrink-0 rounded-md border border-[#1e293b] bg-[#0c121e] p-1.5 text-sky-400 hover:text-amber-300 hover:border-amber-400/40 transition-colors"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Original Native Utterance (Subordinate display) */}
                  <div className="mt-2.5 flex items-center justify-between border-t border-[#1a253a]/60 pt-2 text-xs font-mono text-[#94a3b8]">
                    <span className="italic text-[#94a3b8]/80">
                      &quot;{msg.originalText}&quot;
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-[#64748b]">
                      Original ({msg.senderLang})
                    </span>
                  </div>

                  {/* Concession summary note */}
                  {isConcession && msg.concessionSummary && (
                    <div className="mt-2 flex items-center gap-1.5 rounded border border-amber-500/30 bg-amber-950/20 px-2.5 py-1 text-xs font-mono text-amber-200">
                      <Sparkles className="h-3 w-3 text-amber-300" />
                      <span>Conceded: {msg.concessionSummary}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Live Typing / Opponent Speaking Indicator */}
        {isOpponentTyping && (
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 px-1 mb-1 font-mono text-[11px] text-amber-300 animate-pulse">
              <span>{debaterBName} is formulating counter-argument...</span>
            </div>
            <div className="rounded-xl border border-amber-500/30 bg-[#141007] px-4 py-3 flex items-center gap-2 shadow-[0_0_15px_rgba(245,197,66,0.15)]">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              <span className="font-mono text-xs text-[#cbd5e1]">Synthesizing retort...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};
