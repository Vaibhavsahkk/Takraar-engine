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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
      <div className="relative w-full max-w-md rounded-2xl border border-sky-500/30 bg-[#080d16] p-5 sm:p-6 shadow-[0_0_50px_rgba(56,189,248,0.15)]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#162134]">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-sky-400" />
            <h3 className="font-mono text-sm font-bold uppercase tracking-wider text-sky-100">
              Peer-to-Peer Arena Connection
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#94a3b8] hover:text-sky-300 hover:bg-[#101726] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Room Link */}
        <div className="mt-4 space-y-4">
          <div className="rounded-xl border border-amber-500/25 bg-[#0e1422] p-4 shadow-sm">
            <p className="text-xs font-mono text-[#94a3b8]">Live Arena Room Instance:</p>
            <div className="mt-1 flex items-center justify-between">
              <span className="font-mono text-xl font-bold text-amber-300 tracking-wider">
                {roomId}
              </span>
              <button
                onClick={handleCopy}
                className="btn-glass flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-xs text-sky-200"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-amber-300" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Copied" : "Copy URL"}</span>
              </button>
            </div>
          </div>

          <div className="rounded-lg bg-[#070b13] p-3 text-xs font-mono text-[#94a3b8] border border-[#162134] leading-relaxed">
            <strong className="text-sky-300 uppercase tracking-wider text-[10px] block mb-1">Testing Full-Duplex Dispute:</strong>
            <ol className="list-decimal pl-4 space-y-1">
              <li>Open this instance URL in an adjacent browser tab or separate device.</li>
              <li>Configure Tab 1 to Hindi or Spanish, and Tab 2 to English.</li>
              <li>Transmit from one client and trigger <span className="text-amber-300 font-bold">BARGE IN</span> from the opposing client to test immediate preemption.</li>
            </ol>
          </div>

          {/* Join Existing Room */}
          <div className="border-t border-[#162134] pt-4">
            <p className="text-xs font-mono text-[#94a3b8]">Connect to existing active room code:</p>
            <form onSubmit={handleJoin} className="mt-2 flex gap-2">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="Enter Room ID (e.g. dispute-104)"
                className="flex-1 rounded-lg border border-[#18253b] bg-[#060910] px-3 py-1.5 font-mono text-xs text-[#f1f5f9] focus:border-sky-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!joinCode.trim()}
                className="rounded-lg bg-gradient-to-r from-amber-400 to-amber-300 px-3.5 py-1.5 font-mono text-xs font-bold text-black hover:shadow-[0_0_15px_rgba(245,197,66,0.3)] transition-all disabled:opacity-40"
              >
                Connect
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
