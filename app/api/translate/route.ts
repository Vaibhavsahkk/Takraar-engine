import { NextRequest, NextResponse } from "next/server";
import { TranslationEngine } from "@/lib/translationEngine";

export async function POST(req: NextRequest) {
  try {
    const { text, fromLang, toLang } = await req.json();
    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const result = await TranslationEngine.translate(text, fromLang || "en", toLang || "hi");
    return NextResponse.json(result);
  } catch (error) {
    console.error("Translation API error:", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
