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
        <div className="sticky top-2 z-20 mx-auto mb-4 flex max-w-lg items-center justify-center gap-2 rounded-full border border-red-500/60 bg-red-950/90 px-4 py-2 text-xs font-mono font-bold text-red-200 shadow-xl backdrop-blur-md interruption-flash">
          <Zap className="h-4 w-4 animate-bounce text-red-400" />
          <span>
            ⚡ BARGE-IN COLLISION: <strong className="text-white">{interruptionBanner.interrupterName}</strong> cut
            off <strong className="text-white">{interruptionBanner.interruptedName}</strong>!
          </span>
        </div>
      )}

      {/* Message Feed */}
      <div className="mx-auto max-w-4xl space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-[#2e323b] bg-[#141519] text-amber-400">
              ⚡
            </div>
            <h3 className="mt-4 font-mono text-base font-bold text-[#f5f5f0]">
              The Arena is Primed
            </h3>
            <p className="mt-1 max-w-md text-xs font-mono text-[#8b8e98]">
              Both speakers are connected across different languages. Start arguing, hit{" "}
              <strong className="text-red-400">BARGE IN</strong> to cut in mid-sentence, and force a concession!
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isDebaterA = msg.senderId === debaterAId;
            const isFurious = msg.emotion === "furious";
            const isConcession = msg.isConcession;

            // Border & Card styling based on emotion and interruption
            let cardBg = isDebaterA ? "bg-[#13151a]" : "bg-[#18191f]";
            let borderColor = isDebaterA ? "border-[#252833]" : "border-[#2c2e3a]";
            if (msg.isInterruption) {
              borderColor = "border-red-500/80 shadow-[0_0_15px_rgba(255,59,48,0.25)]";
              cardBg = isDebaterA ? "bg-[#1c1214]" : "bg-[#1e1315]";
            } else if (isConcession) {
              borderColor = "border-emerald-500/80 shadow-[0_0_15px_rgba(16,185,129,0.25)]";
              cardBg = "bg-[#101915]";
            }

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isDebaterA ? "items-start" : "items-end"}`}
              >
                {/* Speaker Header */}
                <div className="flex items-center gap-2 px-1 mb-1 font-mono text-[11px] text-[#8b8e98]">
                  <span className="font-semibold text-[#f5f5f0]">{msg.senderName}</span>
                  <span className="uppercase text-[#636773]">[{msg.senderLang.toUpperCase()}]</span>

                  {/* Emotion Badge */}
                  {msg.isInterruption && (
                    <span className="flex items-center gap-0.5 rounded bg-red-600/30 px-1.5 py-0.2 text-[10px] font-bold text-red-400 border border-red-500/40">
                      <Zap className="h-3 w-3" /> INTERRUPTED
                    </span>
                  )}
                  {isConcession && (
                    <span className="flex items-center gap-0.5 rounded bg-emerald-600/30 px-1.5 py-0.2 text-[10px] font-bold text-emerald-300 border border-emerald-500/40">
                      <CheckCircle2 className="h-3 w-3" /> GROUND YIELDED
                    </span>
                  )}
                  {!msg.isInterruption && !isConcession && (
                    <span className="rounded bg-[#202228] px-1.5 py-0.2 text-[10px] uppercase text-[#a0a4b0]">
                      {msg.emotion}
                    </span>
                  )}

                  <span className="text-[10px] text-[#555864]">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`w-full max-w-xl rounded-xl border p-4 transition-all duration-200 ${cardBg} ${borderColor}`}
                >
                  {/* Interruption Header Tag */}
                  {msg.isInterruption && (
                    <div className="mb-2 flex items-center gap-1.5 rounded bg-red-950/60 px-2 py-1 text-[11px] font-mono text-red-300 border border-red-800/40">
                      <Zap className="h-3.5 w-3.5 text-red-400" />
                      <span>Cut off mid-speech to deliver rebuttal:</span>
                    </div>
                  )}

                  {/* Translated Text (In Focus for the other listener) */}
                  <div className="flex items-start justify-between gap-3">
                    <p
                      className={`text-sm sm:text-base font-medium leading-relaxed text-[#f4f4f0] ${
                        isFurious ? "shake-heated" : ""
                      }`}
                    >
                      {msg.translatedText}
                    </p>

                    {/* Listen Button */}
                    <button
                      onClick={() => handlePlayVoice(msg.translatedText, msg.targetLang)}
                      title="Play spoken audio"
                      className="shrink-0 p-1 rounded hover:bg-[#2b2d36] text-[#8b8e98] hover:text-[#f4f4f0] transition-colors"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Original Native Speech Transcript */}
                  <div className="mt-3 pt-2.5 border-t border-[#23252e] flex items-center justify-between text-xs font-mono text-[#8b8e98]">
                    <div className="truncate max-w-[85%]">
                      <span className="text-[#5f6370]">Spoken [{msg.senderLang}]:</span>{" "}
                      <span className="italic text-[#a8abb6]">&ldquo;{msg.originalText}&rdquo;</span>
                    </div>
                    <button
                      onClick={() => handlePlayVoice(msg.originalText, msg.senderLang)}
                      title="Play original language voice"
                      className="text-[10px] uppercase tracking-wider text-[#737785] hover:text-white"
                    >
                      Original
                    </button>
                  </div>

                  {/* Concession Announcement in Bubble */}
                  {isConcession && msg.concessionSummary && (
                    <div className="mt-2.5 rounded bg-emerald-950/40 p-2 text-xs font-mono text-emerald-300 border border-emerald-800/40 flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                      <span>Concession recorded in Common Ground Ledger.</span>
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
            <div className="flex items-center gap-2 px-1 mb-1 font-mono text-[11px] text-amber-400 animate-pulse">
              <span>{debaterBName} is delivering a counter-argument...</span>
            </div>
            <div className="rounded-xl border border-[#2e313d] bg-[#16171d] px-4 py-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
              <span className="font-mono text-xs text-[#a8abb5]">Drafting retort...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};
