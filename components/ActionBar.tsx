"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Mic, MicOff, Send, Zap, Volume2, X } from "lucide-react";
import { speechEngine, SUPPORTED_LANGUAGES } from "@/lib/speechEngine";
import { soundEngine } from "@/lib/soundEngine";

interface ActionBarProps {
  onSendMessage: (text: string, isInterruption: boolean) => void;
  onBargeIn: () => void;
  userLang: string;
  onChangeUserLang: (lang: string) => void;
  opponentName: string;
  quickRetorts: string[];
}

export const ActionBar: React.FC<ActionBarProps> = ({
  onSendMessage,
  onBargeIn,
  userLang,
  onChangeUserLang,
  opponentName,
  quickRetorts,
}) => {
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [micStatus, setMicStatus] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedLang = SUPPORTED_LANGUAGES.find((l) => l.code === userLang) || SUPPORTED_LANGUAGES[0];

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

  // Toggle Microphone dictation with live continuous streaming into input
  const handleToggleListening = async () => {
    setMicError(null);

    if (isListening) {
      setMicStatus("Refining transcript via Whisper Large v3...");
      speechEngine.stopListening();
      setIsListening(false);
      return;
    }

    setMicStatus(`Activating Whisper Large v3 for ${selectedLang.name}...`);

    await speechEngine.startListening(
      userLang,
      (liveTranscript, isFinal) => {
        setInputText(liveTranscript);
        if (isFinal) {
          setMicStatus(`Verified by Whisper: "${liveTranscript}" (Press Enter or click Send)`);
        } else {
          setMicStatus(`Listening: "${liveTranscript}"`);
        }
      },
      (errorMessage) => {
        setMicError(errorMessage);
        setMicStatus(null);
        setIsListening(false);
      },
      () => {
        setIsListening(true);
        setMicStatus(`Microphone active (Whisper v3) — Speak now in ${selectedLang.name}...`);
        inputRef.current?.focus();
      },
      () => {
        setIsListening(false);
      }
    );
  };

  const handleSend = (isInterruption: boolean = false) => {
    if (!inputText.trim()) return;

    if (isListening) {
      speechEngine.stopListening();
      setIsListening(false);
      setMicStatus(null);
    }

    soundEngine.playKeyTick();
    onSendMessage(inputText.trim(), isInterruption);
    setInputText("");
    setMicStatus(null);
  };

  const handleQuickRetort = (retort: string) => {
    setInputText(retort);
    inputRef.current?.focus();
  };

  return (
    <div className="border-t border-[#141e30] bg-[#06080e]/95 backdrop-blur-xl p-3.5 sm:p-4">
      <div className="mx-auto max-w-4xl space-y-3">
        {/* Live Microphone Status Banner */}
        {isListening && (
          <div className="flex items-center justify-between rounded-lg border border-sky-400/60 bg-[#081324] px-3.5 py-2 text-xs font-mono text-sky-200 shadow-[0_0_20px_rgba(56,189,248,0.3)] animate-pulse">
            <div className="flex items-center gap-2.5">
              <span className="flex h-2.5 w-2.5 rounded-full bg-sky-400 animate-ping" />
              <Volume2 className="h-4 w-4 text-sky-300" />
              <span>{micStatus || `Listening in ${selectedLang.name}... Speak into your microphone`}</span>
            </div>
            <button
              type="button"
              onClick={handleToggleListening}
              className="text-[11px] font-bold text-amber-300 hover:text-white uppercase tracking-wider underline"
            >
              Done Speaking (Stop)
            </button>
          </div>
        )}

        {/* Microphone Error Notification */}
        {micError && (
          <div className="flex items-center justify-between rounded-lg border border-amber-500/60 bg-[#161106] px-3.5 py-2 text-xs font-mono text-amber-200 shadow-md">
            <span>{micError}</span>
            <button
              type="button"
              onClick={() => setMicError(null)}
              className="p-1 text-amber-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

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
              onChange={(e) => {
                onChangeUserLang(e.target.value);
                if (isListening) {
                  speechEngine.stopListening();
                  setIsListening(false);
                  setMicStatus(null);
                }
              }}
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
              placeholder={
                isListening
                  ? `Listening to your voice in ${selectedLang.name}... Speak now!`
                  : `Argue in ${selectedLang.name} against ${opponentName}... (Speak or Type)`
              }
              className={`w-full rounded-lg border bg-[#070b13] py-2.5 pl-3.5 pr-20 font-mono text-sm text-[#f1f5f9] placeholder-[#64748b] transition-all shadow-inner focus:outline-none ${
                isListening
                  ? "border-sky-400 ring-2 ring-sky-400/40 shadow-[0_0_20px_rgba(56,189,248,0.25)]"
                  : "border-[#162134] focus:border-sky-400/70 focus:ring-1 focus:ring-sky-400/50"
              }`}
            />

            <div className="absolute right-1.5 flex items-center gap-1.5">
              {/* Voice Dictation Button */}
              <button
                type="button"
                onClick={handleToggleListening}
                title={isListening ? "Stop & Finalize with Whisper Large v3" : "Voice Dictation (Groq Whisper Large v3)"}
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
