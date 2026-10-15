import { NextRequest, NextResponse } from "next/server";
import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

// Human Neural Voice mapping for ultra-realistic conversational debate
const NEURAL_VOICE_MAP: Record<string, string> = {
  hi: "hi-IN-MadhurNeural", // Deep, natural, expressive Hindi male
  en: "en-US-JennyNeural",  // Extremely natural conversational English (similar to ChatGPT Voice)
  es: "es-ES-AlvaroNeural", // Passionate, natural Castilian Spanish
  ja: "ja-JP-KeitaNeural",  // Confident, native conversational Japanese
  fr: "fr-FR-HenriNeural",  // Natural French articulation
  de: "de-DE-KillianNeural",// Expressive German debate voice
  ar: "ar-SA-HamedNeural",  // Standard fluent Arabic
  ru: "ru-RU-DmitryNeural", // Natural Russian inflection
  zh: "zh-CN-YunxiNeural",  // Natural Putonghua Mandarin
};

export async function POST(req: NextRequest) {
  try {
    const { text, lang = "en", heatScore = 50 } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Missing text payload" }, { status: 400 });
    }

    const voice = NEURAL_VOICE_MAP[lang.toLowerCase()] || NEURAL_VOICE_MAP.en;

    // Calculate dynamic rate & pitch based on heat score
    // Higher heat = slightly faster and more urgent argumentative delivery
    const ratePercent = Math.min(25, Math.max(-5, Math.round((heatScore - 50) * 0.35)));
    const rateStr = ratePercent >= 0 ? `+${ratePercent}%` : `${ratePercent}%`;

    const tts = new MsEdgeTTS({
      connectionTimeoutMs: 8000,
      synthesisTimeoutMs: 20000,
    });

    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

    // Clean text to avoid XML breaks
    const cleanText = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

    const { audioStream } = tts.toStream(cleanText, { rate: rateStr });

    const chunks: Buffer[] = [];

    return await new Promise<NextResponse>((resolve) => {
      audioStream.on("data", (chunk: Buffer) => {
        chunks.push(chunk);
      });

      audioStream.on("close", () => {
        const fullBuffer = Buffer.concat(chunks);
        resolve(
          new NextResponse(fullBuffer, {
            status: 200,
            headers: {
              "Content-Type": "audio/mpeg",
              "Content-Length": fullBuffer.length.toString(),
              "Cache-Control": "public, max-age=3600, immutable",
            },
          })
        );
      });

      audioStream.on("error", (err: Error) => {
        console.error("Neural TTS Stream error:", err);
        resolve(
          NextResponse.json(
            { error: "TTS generation failed: " + err.message },
            { status: 500 }
          )
        );
      });
    });
  } catch (error: unknown) {
    console.error("Neural TTS Route error:", error);
    return NextResponse.json(
      { error: (error as Error)?.message || "Internal TTS error" },
      { status: 500 }
    );
  }
}
