"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Send, Zap, CornerDownLeft, Sparkles, MessageSquare } from "lucide-react";
import { speechEngine, SUPPORTED_LANGUAGES, VoiceLanguage } from "@/lib/speechEngine";
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

  // Keyboard shortcut: Spacebar outside input or Alt+Space triggers Barge-In
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Trigger barge-in if pressing Space while not focused in an input
      if (e.code === "Space" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        triggerBargeIn();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const triggerBargeIn = () => {
    soundEngine.playInterruption();
    speechEngine.interruptSpeech();
    onBargeIn();
    inputRef.current?.focus();
  };

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
    <div className="border-t border-[#23252a] bg-[#0c0d10] p-3 sm:p-4">
      <div className="mx-auto max-w-4xl space-y-2.5">
        {/* Quick Retorts / Heated Sparks */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <span className="shrink-0 font-mono text-[10px] uppercase text-[#6d7180] mr-1">
            ⚡ Quick Spars:
          </span>
          {quickRetorts.map((retort, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickRetort(retort)}
              className="btn-brutalist shrink-0 rounded-full bg-[#16171d] px-2.5 py-1 text-xs font-mono text-[#c6c9d4] hover:bg-[#22242c] hover:text-white transition-colors"
            >
              {retort}
            </button>
          ))}
        </div>

        {/* Primary Controls Bar */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* THE GIANT BARGE IN BUTTON */}
          <button
            onClick={triggerBargeIn}
            title="Interrupt opponent mid-sentence (Press Space outside input)"
            className="btn-interrupt flex items-center justify-center gap-2 rounded-lg py-2.5 px-4 font-mono font-extrabold uppercase text-white tracking-wider sm:w-48 select-none"
          >
            <Zap className="h-4 w-4 animate-bounce" />
            <span>BARGE IN</span>
            <span className="hidden lg:inline text-[9px] bg-black/30 px-1 py-0.5 rounded">SPACE</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center gap-1 shrink-0 bg-[#141519] border border-[#252831] rounded-lg px-2 py-1">
            <span className="text-[10px] font-mono text-[#737785] uppercase">My Tongue:</span>
            <select
              value={userLang}
              onChange={(e) => onChangeUserLang(e.target.value)}
              className="bg-transparent text-xs font-mono font-semibold text-[#f5f5f0] focus:outline-none cursor-pointer"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code} className="bg-[#141519] text-[#f5f5f0]">
                  {lang.flag} {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>

          {/* Input Box & Mic */}
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
              placeholder={`Argue in your tongue... (e.g. Speak or type to challenge ${opponentName})`}
              className="w-full rounded-lg border border-[#252831] bg-[#141519] py-2.5 pl-3.5 pr-20 font-mono text-sm text-[#f5f5f0] placeholder-[#626673] focus:border-amber-500/80 focus:outline-none focus:ring-1 focus:ring-amber-500/80 transition-all"
            />

            <div className="absolute right-1.5 flex items-center gap-1">
              {/* Mic Toggle Button */}
              <button
                type="button"
                onClick={onToggleListening}
                title={isListening ? "Stop Microphone" : "Start Real-Time Voice Dictation"}
                className={`p-1.5 rounded-md transition-colors ${
                  isListening
                    ? "bg-red-600 text-white animate-pulse"
                    : "text-[#8b8e98] hover:text-[#f5f5f0] hover:bg-[#20222a]"
                }`}
              >
                {isListening ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </button>

              {/* Send Button */}
              <button
                type="button"
                onClick={() => handleSend(false)}
                disabled={!inputText.trim()}
                title="Send argument (Enter)"
                className="btn-brutalist rounded-md bg-[#22242c] p-1.5 text-amber-400 hover:bg-amber-500 hover:text-black transition-colors disabled:opacity-30 disabled:pointer-events-none"
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
