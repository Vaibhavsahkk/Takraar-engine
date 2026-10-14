"use client";

import React, { useState } from "react";
import { X, Copy, Check, Users } from "lucide-react";

interface MultiplayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  onJoinRoom: (roomId: string) => void;
}

export const MultiplayerModal: React.FC<MultiplayerModalProps> = ({
  isOpen,
  onClose,
  roomId,
  onJoinRoom,
}) => {
  const [copied, setCopied] = useState(false);
  const [joinCode, setJoinCode] = useState("");

  if (!isOpen) return null;

  const currentUrl = typeof window !== "undefined" ? `${window.location.origin}/?room=${roomId}` : "";

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    onJoinRoom(joinCode.trim().toLowerCase());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-[#2e323d] bg-[#121317] p-5 sm:p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#23252d]">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-400" />
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-[#f5f5f0]">
              Live 2-Player Arena Link
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#8b8e98] hover:text-[#f5f5f0] hover:bg-[#20222a] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Room Link */}
        <div className="mt-4 space-y-4">
          <div className="rounded-xl border border-[#252833] bg-[#16171d] p-4">
            <p className="text-xs font-mono text-[#8b8e98]">Your Live Arena Room Code:</p>
            <div className="mt-1 flex items-center justify-between">
              <span className="font-mono text-xl font-black text-amber-400 tracking-wider">
                {roomId}
              </span>
              <button
                onClick={handleCopy}
                className="btn-brutalist flex items-center gap-1.5 rounded bg-[#20222a] px-3 py-1.5 font-mono text-xs text-[#f5f5f0] hover:bg-[#2b2d38]"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied!" : "Copy URL"}</span>
              </button>
            </div>
          </div>

          <div className="rounded-lg bg-[#181920] p-3 text-xs font-mono text-[#a5a8b5] border border-[#252732] leading-relaxed">
            💡 <strong>How to test duplex argument right now:</strong>
            <ol className="mt-1.5 list-decimal pl-4 space-y-1">
              <li>Copy this URL and open it in a second browser window or on your phone.</li>
              <li>Set Tab 1 to Hindi or Spanish, and Tab 2 to English.</li>
              <li>Speak or type in one tab; hit <span className="text-red-400 font-bold">BARGE IN</span> from the other tab to interrupt!</li>
            </ol>
          </div>

          {/* Join Another Room */}
          <div className="border-t border-[#23252d] pt-4">
            <p className="text-xs font-mono text-[#8b8e98]">Or connect to an existing room:</p>
            <form onSubmit={handleJoin} className="mt-2 flex gap-2">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Enter Room Code (e.g. argue-492)"
                className="flex-1 rounded border border-[#282a35] bg-[#101115] px-3 py-1.5 font-mono text-xs text-[#f5f5f0] focus:border-amber-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!joinCode.trim()}
                className="btn-brutalist rounded bg-[#22242c] px-3 py-1.5 font-mono text-xs font-bold text-amber-400 hover:bg-amber-500 hover:text-black transition-colors disabled:opacity-40"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
