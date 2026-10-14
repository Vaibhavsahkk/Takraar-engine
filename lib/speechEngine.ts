// Web Speech API Engine for Real-Time Dictation and Heated Voice Synthesis

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: {
      new (): SpeechRecognitionInstance;
    };
    webkitSpeechRecognition?: {
      new (): SpeechRecognitionInstance;
    };
  }
}

export interface VoiceLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  bcp47: string;
}

export const SUPPORTED_LANGUAGES: VoiceLanguage[] = [
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", bcp47: "hi-IN" },
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧", bcp47: "en-US" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", bcp47: "es-ES" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", bcp47: "ja-JP" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", bcp47: "fr-FR" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", bcp47: "de-DE" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦", bcp47: "ar-SA" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺", bcp47: "ru-RU" },
  { code: "zh", name: "Mandarin", nativeName: "中文", flag: "🇨🇳", bcp47: "zh-CN" },
];

class SpeechEngine {
  private recognition: SpeechRecognitionInstance | null = null;
  private isListening: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  // Check if speech recognition is available in browser
  public isRecognitionSupported(): boolean {
    if (typeof window === "undefined") return false;
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  // Start continuous mic listening in specified language
  public startListening(
    langCode: string,
    onTranscript: (text: string, isFinal: boolean) => void,
    onError: (err: string) => void
  ) {
    if (typeof window === "undefined") return;
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      onError("Speech recognition not supported in this browser. You can type directly!");
      return;
    }

    if (this.isListening && this.recognition) {
      this.recognition.abort();
    }

    const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
    const bcp47 = langObj ? langObj.bcp47 : "en-US";

    try {
      this.recognition = new SpeechRec();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = bcp47;

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (final.trim()) {
          onTranscript(final.trim(), true);
        } else if (interim.trim()) {
          onTranscript(interim.trim(), false);
        }
      };

      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        if (event.error !== "no-speech") {
          console.warn("Speech recognition error:", event.error);
          onError(`Mic error: ${event.error}`);
        }
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
      this.isListening = true;
    } catch (e) {
      console.error(e);
      onError("Could not start microphone.");
      this.isListening = false;
    }
  }

  // Stop listening
  public stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  // Interrupt Speech Synthesis immediately (Barge-In)
  public interruptSpeech() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      this.currentUtterance = null;
    }
  }

  // Speak with heated emotional inflection: higher pitch and faster rate as heat rises!
  public speak(text: string, langCode: string, heatScore: number = 50) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    // Cut off any existing speech first (interruption priority)
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
    utterance.lang = langObj ? langObj.bcp47 : "en-US";

    // Dynamic rate & pitch scaling for arguments
    // Heat 0 -> rate 1.0, pitch 1.0
    // Heat 100 -> rate 1.25, pitch 1.2 (urgent, heated, breathless)
    const rateMultiplier = 1.0 + (heatScore / 100) * 0.28;
    const pitchMultiplier = 0.95 + (heatScore / 100) * 0.3;

    utterance.rate = Math.min(1.4, Math.max(0.9, rateMultiplier));
    utterance.pitch = Math.min(1.4, Math.max(0.9, pitchMultiplier));

    // Try finding a matching native voice
    const voices = window.speechSynthesis.getVoices();
    const prefix = langObj ? langObj.code : "en";
    const voice = voices.find(
      (v) => v.lang.toLowerCase().startsWith(prefix) || v.lang.toLowerCase().includes(prefix)
    );
    if (voice) {
      utterance.voice = voice;
    }

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }
}

export const speechEngine = new SpeechEngine();
