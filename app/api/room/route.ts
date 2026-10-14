import { NextRequest, NextResponse } from "next/server";
import { RoomStore } from "@/lib/roomStore";
import { TranslationEngine } from "@/lib/translationEngine";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const roomId = searchParams.get("roomId") || "default-arena";
  const room = RoomStore.getOrCreateRoom(roomId);
  return NextResponse.json(room);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, roomId = "default-arena" } = body;

    if (action === "interrupt") {
      const { interrupterId, interrupterName } = body;
      const room = RoomStore.triggerInterruption(roomId, interrupterId, interrupterName);
      return NextResponse.json(room);
    }

    if (action === "updateProfile") {
      const { debaterId, updates } = body;
      const room = RoomStore.updateDebater(roomId, debaterId, updates);
      return NextResponse.json(room);
    }

    if (action === "message") {
      const {
        senderId,
        senderName,
        senderLang,
        targetLang,
        text,
        isInterruption = false,
        interruptedSenderId,
      } = body;

      // Translate text dynamically with emotion analysis
      const translation = await TranslationEngine.translate(text, senderLang, targetLang);

      const message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        senderId,
        senderName,
        senderLang,
        originalText: text,
        translatedText: translation.translatedText,
        targetLang,
        timestamp: Date.now(),
        emotion: translation.detectedEmotion,
        heatDelta: isInterruption ? translation.heatDelta + 10 : translation.heatDelta,
        isInterruption,
        interruptedSenderId,
        isConcession: translation.isConcession,
        concessionSummary: translation.concessionSummary,
      };

      const room = RoomStore.postMessage(roomId, message);
      return NextResponse.json({ room, message });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Room API Error:", error);
    return NextResponse.json({ error: "Failed to process room action" }, { status: 500 });
  }
}
