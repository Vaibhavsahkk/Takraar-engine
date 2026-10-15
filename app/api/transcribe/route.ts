import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as Blob | null;
    const language = formData.get("language") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No audio file provided in request." },
        { status: 400 }
      );
    }

    // Prepare multipart form data for Groq Whisper API
    const groqFormData = new FormData();
    groqFormData.append("file", file, "audio.webm");
    // Use whisper-large-v3 for highest multilingual fidelity
    groqFormData.append("model", "whisper-large-v3");

    if (language && language !== "auto") {
      groqFormData.append("language", language);
    }

    const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "User-Agent": "Takraar-Engine/1.0",
      },
      body: groqFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq Whisper API error:", response.status, errorText);
      return NextResponse.json(
        { error: `Groq Whisper failed: ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({
      text: data.text || "",
      model: "whisper-large-v3",
      source: "groq",
    });
  } catch (error: unknown) {
    console.error("Transcription route error:", error);
    return NextResponse.json(
      { error: (error as Error)?.message || "Internal transcription error" },
      { status: 500 }
    );
  }
}
