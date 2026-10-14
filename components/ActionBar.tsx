"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Send, Zap } from "lucide-react";
import { speechEngine, SUPPORTED_LANGUAGES } from "@/lib/speechEngine";
import { soundEngine } from "@/lib/soundEngine";

interface ActionBarProps {
  onSendMessage: (text: string, isInterruption: boolean) => void;
  onBargeIn: () => void;
  userLang: string;
  onChangeUserLang: (lang: string) => void;
  opponentName: string;
  isListening: boolean;
  onToggleListening: () => void;
  quickRetorts: string[];
}

export const ActionBar: React.FC<ActionBarProps> = ({
  onSendMessage,
  onBargeIn,
  userLang,
  onChangeUserLang,
  opponentName,
  isListening,
  onToggleListening,
  quickRetorts,
}) => {
  const [inputText, setInputText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const triggerBargeIn = useCallback(() => {
    soundEngine.playInterruption();
    speechEngine.interruptSpeech();
    onBargeIn();
    inputRef.current?.focus();
  }, [onBargeIn]);

  // Keyboard shortcut: Spacebar outside input triggers Barge-In
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        triggerBargeIn();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [triggerBargeIn]);

  const handleSend = (isInterruption: boolean = false) => {
    if (!inputText.trim()) return;
    soundEngine.playKeyTick();
    onSendMessage(inputText.trim(), isInterruption);
    setInputText("");
  };

  const handleQuickRetort = (retort: string) => {
    setInputText(retort);
    inputRef.current?.focus();
  };

  return (
    <div className="border-t border-[#141e30] bg-[#06080e]/95 backdrop-blur-xl p-3.5 sm:p-4">
      <div className="mx-auto max-w-4xl space-y-3">
        {/* Quick Retorts / Rhetorical Sparks */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="shrink-0 font-mono text-[10px] uppercase text-sky-400/80 mr-1 flex items-center gap-1">
            <Zap className="h-3 w-3 text-amber-300" /> Dialectical Sparks:
          </span>
          {quickRetorts.map((retort, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickRetort(retort)}
              className="shrink-0 rounded-full border border-sky-500/20 bg-[#0a111e] px-3 py-1 text-xs font-mono text-sky-200 hover:border-amber-400/50 hover:text-amber-200 hover:bg-[#121929] transition-all"
            >
              {retort}
            </button>
          ))}
        </div>

        {/* Primary Controls Bar */}
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          {/* THE PREEMPTION BARGE IN BUTTON */}
          <button
            onClick={triggerBargeIn}
            title="Preempt opponent transmission (Press Space outside input)"
            className="btn-barge-in flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 font-mono font-extrabold uppercase tracking-wider sm:w-48 select-none"
          >
            <Zap className="h-4 w-4 animate-bounce" />
            <span>BARGE IN</span>
            <span className="hidden lg:inline text-[9px] bg-black/40 text-white px-1.5 py-0.5 rounded font-mono">SPACE</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center gap-1.5 shrink-0 bg-[#090e18] border border-[#18243a] rounded-lg px-2.5 py-1.5">
            <span className="text-[10px] font-mono text-sky-400/80 uppercase">Language:</span>
            <select
              value={userLang}
              onChange={(e) => onChangeUserLang(e.target.value)}
              className="bg-transparent text-xs font-mono font-semibold text-sky-100 focus:outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-[#090e18] text-[#f1f5f9]">
                  {lang.flag} {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>

          {/* Input Box & Tactical Controls */}
          <div className="relative flex flex-1 items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend(false);
                }
              }}
              placeholder={`Argue in your native tongue against ${opponentName}...`}
              className="w-full rounded-lg border border-[#162134] bg-[#070b13] py-2.5 pl-3.5 pr-20 font-mono text-sm text-[#f1f5f9] placeholder-[#64748b] focus:border-sky-400/70 focus:outline-none focus:ring-1 focus:ring-sky-400/50 shadow-inner transition-all"
            />

            <div className="absolute right-1.5 flex items-center gap-1.5">
              {/* Voice Dictation Button */}
              <button
                type="button"
                onClick={onToggleListening}
                title={isListening ? "Halt Speech Recognition" : "Activate Speech Dictation"}
                className={`p-1.5 rounded-md transition-all ${
                  isListening
                    ? "bg-sky-400 text-black font-bold animate-pulse shadow-[0_0_15px_rgba(56,189,248,0.7)]"
                    : "text-[#94a3b8] hover:text-sky-300 hover:bg-[#101726]"
                }`}
              >
                {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </button>

              {/* Transmit Button */}
              <button
                type="button"
                onClick={() => handleSend(false)}
                disabled={!inputText.trim()}
                title="Transmit Argument (Enter)"
                className="rounded-md bg-gradient-to-r from-amber-400 to-amber-300 p-1.5 text-black font-bold hover:shadow-[0_0_15px_rgba(245,197,66,0.4)] transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
