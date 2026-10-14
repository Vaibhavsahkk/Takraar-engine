"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { CruxDashboard } from "@/components/CruxDashboard";
import { DebateArena } from "@/components/DebateArena";
import { ActionBar } from "@/components/ActionBar";
import { ScenarioSelector } from "@/components/ScenarioSelector";
import { MultiplayerModal } from "@/components/MultiplayerModal";
import { SPARRING_SCENARIOS, SparringScenario } from "@/lib/sparringScenarios";
import { DebateMessage } from "@/lib/roomStore";
import { TranslationEngine } from "@/lib/translationEngine";
import { soundEngine } from "@/lib/soundEngine";
import { speechEngine } from "@/lib/speechEngine";
import confetti from "canvas-confetti";

export default function ArenaPage() {
  // Mode & Room State
  const [mode, setMode] = useState<"solo" | "multiplayer">("solo");
  const [roomId, setRoomId] = useState<string>("arena-01");
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState<boolean>(false);
  const [isMultiplayerModalOpen, setIsMultiplayerModalOpen] = useState<boolean>(false);

  // Active Solo Scenario
  const [currentScenario, setCurrentScenario] = useState<SparringScenario>(SPARRING_SCENARIOS[0]);
  const [turnIndex, setTurnIndex] = useState<number>(0);

  // Language & Audio
  const [userLang, setUserLang] = useState<string>("en");
  const [isListening, setIsListening] = useState<boolean>(false);

  // Live Debate State
  const [messages, setMessages] = useState<DebateMessage[]>([]);
  const [heatScore, setHeatScore] = useState<number>(35);
  const [userStance, setUserStance] = useState<number>(90);
  const [opponentStance, setOpponentStance] = useState<number>(currentScenario.opponentInitialStance);
  const [commonGroundLedger, setCommonGroundLedger] = useState<
    { id: string; summary: string; concededBy: string; timestamp: number }[]
  >([]);
  const [interruptionBanner, setInterruptionBanner] = useState<{
    interrupterName: string;
    interruptedName: string;
  } | null>(null);
  const [isOpponentTyping, setIsOpponentTyping] = useState<boolean>(false);
  const [isResolved, setIsResolved] = useState<boolean>(false);

  // Dynamic quick retorts based on user language
  const getQuickRetorts = () => {
    if (userLang === "hi") {
      return [
        "Aise kaise bol sakte ho tum?!",
        "Bakwaas band karo, suno meri baat!",
        "Chalo theek hai, ye baat maan li.",
        "Pehle ground reality toh dekho!",
      ];
    }
    if (userLang === "es") {
      return [
        "¡Eso no tiene ningún sentido!",
        "¡Déjame hablar de una vez!",
        "Está bien, admito ese punto.",
        "¡Estás completamente equivocado!",
      ];
    }
    return [
      "Wait, that is completely false!",
      "Stop interrupting, listen for once!",
      "Okay, fair point on that specific issue.",
      "You are ignoring the biggest problem!",
    ];
  };

  // URL query room initializer
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get("room");
      if (roomParam) {
        queueMicrotask(() => {
          setRoomId(roomParam);
          setMode("multiplayer");
        });
      }
    }
  }, []);

  // Sync ambient sound drone with room heat
  useEffect(() => {
    soundEngine.updateHeatDrone(heatScore);
  }, [heatScore]);

  // Handle Mute toggle
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
    if (nextMuted) {
      speechEngine.interruptSpeech();
    }
  };

  // Reset arena state when switching scenario
  const handleSelectScenario = (scenario: SparringScenario) => {
    setCurrentScenario(scenario);
    setTurnIndex(0);
    setMessages([]);
    setHeatScore(35);
    setUserStance(90);
    setOpponentStance(scenario.opponentInitialStance);
    setCommonGroundLedger([]);
    setInterruptionBanner(null);
    setIsOpponentTyping(false);
    setIsResolved(false);

    // Initial provocative opening line from opponent
    setTimeout(() => {
      triggerOpponentOpening(scenario);
    }, 600);
  };

  // Initial opponent provocation
  const triggerOpponentOpening = async (scenario: SparringScenario) => {
    const openingText = scenario.turns[0].opponentSpeech;
    const translation = await TranslationEngine.translate(
      openingText,
      scenario.opponentLang,
      userLang
    );

    const openMsg: DebateMessage = {
      id: `opening-${Date.now()}`,
      senderId: "opponent",
      senderName: scenario.opponentName,
      senderLang: scenario.opponentLang,
      originalText: openingText,
      translatedText: translation.translatedText,
      targetLang: userLang,
      timestamp: Date.now(),
      emotion: "furious",
      heatDelta: 10,
      isInterruption: false,
      isConcession: false,
    };

    setMessages([openMsg]);
    setHeatScore((prev) => Math.min(100, prev + 10));

    // Speak in native accent
    speechEngine.speak(openingText, scenario.opponentLang, 65);
  };

  // Run initial opening upon first mount
  useEffect(() => {
    if (mode === "solo" && messages.length === 0) {
      triggerOpponentOpening(currentScenario);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  // Trigger Barge-In Interruption
  const handleBargeIn = () => {
    soundEngine.playInterruption();
    speechEngine.interruptSpeech();

    const banner = {
      interrupterName: "You",
      interruptedName: mode === "solo" ? currentScenario.opponentName : "Debater",
    };
    setInterruptionBanner(banner);
    setHeatScore((prev) => Math.min(100, prev + 16));
    setIsOpponentTyping(false);

    setTimeout(() => setInterruptionBanner(null), 3500);
  };

  // Send a message from the User
  const handleSendMessage = async (text: string, isInterruption: boolean = false) => {
    if (isListening) {
      speechEngine.stopListening();
      setIsListening(false);
    }

    // Cut off opponent speech if interrupting
    if (isInterruption) {
      speechEngine.interruptSpeech();
      soundEngine.playInterruption();
    }

    const opponentLang = mode === "solo" ? currentScenario.opponentLang : "es";

    // 1. Translate user message to opponent's tongue with heat analysis
    const translation = await TranslationEngine.translate(text, userLang, opponentLang);

    const userMsg: DebateMessage = {
      id: `user-${Date.now()}`,
      senderId: "user",
      senderName: "You",
      senderLang: userLang,
      originalText: text,
      translatedText: translation.translatedText,
      targetLang: opponentLang,
      timestamp: Date.now(),
      emotion: translation.detectedEmotion,
      heatDelta: isInterruption ? translation.heatDelta + 15 : translation.heatDelta,
      isInterruption,
      isConcession: translation.isConcession,
      concessionSummary: translation.concessionSummary,
    };

    setMessages((prev) => [...prev, userMsg]);

    // Update heat & user stance if user conceded
    setHeatScore((prev) => Math.max(5, Math.min(100, prev + userMsg.heatDelta)));
    if (userMsg.isConcession && userMsg.concessionSummary) {
      soundEngine.playConcession();
      setUserStance((prev) => Math.max(25, prev - 25));
      setCommonGroundLedger((prev) => [
        ...prev,
        {
          id: `concession-user-${Date.now()}`,
          summary: userMsg.concessionSummary!,
          concededBy: "You",
          timestamp: Date.now(),
        },
      ]);
    }

    // 2. Solo Opponent Reaction Engine
    if (mode === "solo") {
      setIsOpponentTyping(true);

      const delay = Math.floor(Math.random() * 800) + 1200; // 1.2s to 2.0s
      setTimeout(async () => {
        setIsOpponentTyping(false);

        const currentTurn = currentScenario.turns[turnIndex % currentScenario.turns.length];
        const lowerInput = text.toLowerCase();

        // Check if user argument triggered an opponent concession
        const userTriggeredConcession =
          currentTurn.concedesIfKeywords?.some((kw) => lowerInput.includes(kw.toLowerCase())) ||
          userMsg.isConcession ||
          heatScore > 75;

        let opponentReplyText = currentTurn.opponentSpeech;
        let isOpponentConceding = false;
        let concessionNote = "";

        if (userTriggeredConcession && currentTurn.concessionResponse) {
          opponentReplyText = currentTurn.concessionResponse;
          isOpponentConceding = true;
          concessionNote = currentTurn.concessionCruxSummary || "Agreed to mutual compromise.";
        }

        // Translate opponent speech back to user's tongue
        const oppTranslation = await TranslationEngine.translate(
          opponentReplyText,
          currentScenario.opponentLang,
          userLang
        );

        const oppMsg: DebateMessage = {
          id: `opp-${Date.now()}`,
          senderId: "opponent",
          senderName: currentScenario.opponentName,
          senderLang: currentScenario.opponentLang,
          originalText: opponentReplyText,
          translatedText: oppTranslation.translatedText,
          targetLang: userLang,
          timestamp: Date.now(),
          emotion: isOpponentConceding ? "conceding" : oppTranslation.detectedEmotion,
          heatDelta: isOpponentConceding ? -25 : oppTranslation.heatDelta,
          isInterruption: false,
          isConcession: isOpponentConceding,
          concessionSummary: isOpponentConceding ? concessionNote : undefined,
        };

        setMessages((prev) => [...prev, oppMsg]);
        setHeatScore((prev) => Math.max(5, Math.min(100, prev + oppMsg.heatDelta)));

        // If opponent conceded, trigger celebration and update ledger
        if (isOpponentConceding) {
          soundEngine.playConcession();
          setOpponentStance((prev) => Math.max(25, prev - 30));
          setCommonGroundLedger((prev) => [
            ...prev,
            {
              id: `concession-opp-${Date.now()}`,
              summary: concessionNote,
              concededBy: currentScenario.opponentName,
              timestamp: Date.now(),
            },
          ]);

          // Trigger fireworks / confetti if both reached common ground
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });

          setIsResolved(true);
        }

        // Speak opponent's reply in their native accent!
        speechEngine.speak(opponentReplyText, currentScenario.opponentLang, heatScore);

        setTurnIndex((prev) => prev + 1);
      }, delay);
    }
  };

  // Toggle Microphone dictation
  const handleToggleListening = () => {
    if (isListening) {
      speechEngine.stopListening();
      setIsListening(false);
    } else {
      speechEngine.startListening(
        userLang,
        (transcript, isFinal) => {
          if (isFinal && transcript.trim()) {
            handleSendMessage(transcript.trim(), false);
          }
        },
        (error) => {
          console.warn(error);
          setIsListening(false);
        }
      );
      setIsListening(true);
    }
  };

  // Custom Arena creation
  const handleCustomScenario = (topic: string, crux: string, opponentLang: string) => {
    const customSc: SparringScenario = {
      id: `custom-${Date.now()}`,
      title: topic,
      category: "Custom Debate",
      opponentName: "Adversary",
      opponentRole: "Debate Opponent",
      opponentAvatar: "⚡",
      opponentLang,
      userDefaultLang: userLang,
      crux,
      topicPrompt: topic,
      opponentInitialStance: 92,
      turns: [
        {
          opponentSpeech: `I fundamentally reject your viewpoint on ${topic}! You are completely missing the primary constraint!`,
          concedesIfKeywords: ["compromise", "agree", "data", "fair", "evidence", "fact"],
          concessionResponse: `Alright, that particular evidence changes the calculation. I concede that part of the argument.`,
          concessionCruxSummary: `Adversary agreed to mutual synthesis on ${crux}.`,
        },
      ],
    };
    handleSelectScenario(customSc);
  };

  // Switch between Solo and Multiplayer
  const handleSwitchMode = (newMode: "solo" | "multiplayer") => {
    setMode(newMode);
    if (newMode === "multiplayer") {
      setIsMultiplayerModalOpen(true);
    }
  };

  // Calculate dynamic thermal glow color for screen borders
  const getThermalGlow = () => {
    if (heatScore > 75) return "rgba(239, 68, 68, 0.4)"; // red
    if (heatScore > 50) return "rgba(245, 158, 11, 0.35)"; // amber
    if (heatScore > 30) return "rgba(234, 179, 8, 0.25)"; // yellow
    return "rgba(59, 130, 246, 0.2)"; // cool blue
  };

  return (
    <div
      className="flex min-h-screen flex-col bg-[#090a0d] text-[#f4f4f0] select-none grain-overlay relative transition-all duration-700"
      style={
        {
          "--heat-glow": getThermalGlow(),
        } as React.CSSProperties
      }
    >
      {/* Dynamic thermal screen border indicator */}
      <div className="pointer-events-none fixed inset-0 z-30 border-[3px] border-transparent thermal-ambient transition-all duration-500" />

      {/* Header */}
      <Header
        heatScore={heatScore}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        mode={mode}
        onSwitchMode={handleSwitchMode}
        roomId={roomId}
        onOpenScenarios={() => setIsScenarioModalOpen(true)}
      />

      {/* Crux & Belief Shift Dashboard */}
      <CruxDashboard
        topic={mode === "solo" ? currentScenario.title : "Live 2-Player Arena"}
        crux={mode === "solo" ? currentScenario.crux : "Consensus through confrontation"}
        debaterAName="You"
        debaterALang={userLang.toUpperCase()}
        debaterAStance={userStance}
        debaterBName={mode === "solo" ? currentScenario.opponentName : "Debater B"}
        debaterBLang={mode === "solo" ? currentScenario.opponentLang.toUpperCase() : "ES"}
        debaterBStance={opponentStance}
        commonGroundLedger={commonGroundLedger}
        isResolved={isResolved}
      />

      {/* Debate Arena */}
      <DebateArena
        messages={messages}
        debaterAId="user"
        debaterAName="You"
        debaterALang={userLang}
        debaterBId="opponent"
        debaterBName={mode === "solo" ? currentScenario.opponentName : "Debater B"}
        debaterBLang={mode === "solo" ? currentScenario.opponentLang : "es"}
        activeSpeakerId={messages.length > 0 ? messages[messages.length - 1].senderId : null}
        heatScore={heatScore}
        interruptionBanner={interruptionBanner}
        isOpponentTyping={isOpponentTyping}
      />

      {/* Action Bar */}
      <ActionBar
        onSendMessage={handleSendMessage}
        onBargeIn={handleBargeIn}
        userLang={userLang}
        onChangeUserLang={setUserLang}
        opponentName={mode === "solo" ? currentScenario.opponentName : "Opponent"}
        isListening={isListening}
        onToggleListening={handleToggleListening}
        quickRetorts={getQuickRetorts()}
      />

      {/* Scenario Selector Modal */}
      <ScenarioSelector
        isOpen={isScenarioModalOpen}
        onClose={() => setIsScenarioModalOpen(false)}
        activeScenarioId={currentScenario.id}
        onSelectScenario={handleSelectScenario}
        onCustomScenario={handleCustomScenario}
      />

      {/* Multiplayer Modal */}
      <MultiplayerModal
        isOpen={isMultiplayerModalOpen}
        onClose={() => setIsMultiplayerModalOpen(false)}
        roomId={roomId}
        onJoinRoom={(newRoomId) => {
          setRoomId(newRoomId);
          setMode("multiplayer");
        }}
      />
    </div>
  );
}
