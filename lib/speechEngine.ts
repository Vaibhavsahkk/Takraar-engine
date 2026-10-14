// Web Speech API Engine for Real-Time Dictation and Heated Voice Synthesis

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
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
  onstart: (() => void) | null;
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
  private wantListening: boolean = false;
  private isListening: boolean = false;
  private onEndCallback: (() => void) | null = null;
  private onStartCallback: (() => void) | null = null;

  public isRecognitionSupported(): boolean {
    if (typeof window === "undefined") return false;
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  // Explicitly prompt for hardware microphone permission
  public async requestMicPermission(): Promise<{ granted: boolean; error?: string }> {
    if (typeof window === "undefined" || !navigator?.mediaDevices?.getUserMedia) {
      return { granted: false, error: "Audio capture API is not supported in this browser." };
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Release stream immediately once permission is verified
      stream.getTracks().forEach((track) => track.stop());
      return { granted: true };
    } catch (err: unknown) {
      const errName = (err as { name?: string })?.name || "";
      if (errName === "NotAllowedError" || errName === "PermissionDeniedError") {
        return {
          granted: false,
          error: "Microphone permission was blocked. Please click the lock or camera icon in your browser address bar to allow microphone access, then refresh.",
        };
      }
      return { granted: false, error: (err as Error)?.message || "Microphone access failed." };
    }
  }

  // Start continuous mic listening with live interim text stream
  public async startListening(
    langCode: string,
    onTranscript: (text: string, isFinal: boolean) => void,
    onError: (err: string) => void,
    onStart?: () => void,
    onEnd?: () => void
  ) {
    if (typeof window === "undefined") return;

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      onError("Speech recognition is not supported in this browser. Please use Chrome, Edge, Safari, or Brave.");
      return;
    }

    // Verify microphone permission first
    const perm = await this.requestMicPermission();
    if (!perm.granted && perm.error) {
      onError(perm.error);
      return;
    }

    this.wantListening = true;
    this.onStartCallback = onStart || null;
    this.onEndCallback = onEnd || null;

    if (this.recognition) {
      try {
        this.recognition.abort();
      } catch {
        // ignore
      }
    }

    const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
    const bcp47 = langObj ? langObj.bcp47 : "en-US";

    try {
      this.recognition = new SpeechRec();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = bcp47;

      this.recognition.onstart = () => {
        this.isListening = true;
        if (this.onStartCallback) this.onStartCallback();
      };

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let fullTranscript = "";
        let isFinal = false;

        for (let i = 0; i < event.results.length; ++i) {
          fullTranscript += event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            isFinal = true;
          }
        }

        if (fullTranscript.trim()) {
          onTranscript(fullTranscript.trim(), isFinal);
        }
      };

      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        // 'no-speech' is routine pause between sentences, keep listening
        if (event.error === "no-speech") {
          return;
        }

        if (event.error === "not-allowed" || event.error === "service-not-allowed") {
          this.wantListening = false;
          this.isListening = false;
          onError("Microphone permission denied. Allow mic access in browser settings.");
          return;
        }

        if (event.error === "network") {
          console.warn("Speech recognition network error, retrying...");
          return;
        }

        console.warn("Speech recognition error:", event.error);
      };

      this.recognition.onend = () => {
        // Chrome frequently stops speech recognition after short silence pauses.
        // If the user hasn't explicitly clicked stop, auto-restart to stay live.
        if (this.wantListening) {
          try {
            this.recognition?.start();
          } catch {
            this.isListening = false;
            if (this.onEndCallback) this.onEndCallback();
          }
        } else {
          this.isListening = false;
          if (this.onEndCallback) this.onEndCallback();
        }
      };

      this.recognition.start();
    } catch (e) {
      console.error(e);
      this.wantListening = false;
      this.isListening = false;
      onError("Failed to initialize microphone.");
    }
  }

  // Stop listening explicitly
  public stopListening() {
    this.wantListening = false;
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
    }
    if (this.onEndCallback) {
      this.onEndCallback();
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }

  // Preempt active speech synthesis immediately (Barge-In)
  public interruptSpeech() {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Speak with dynamic thermal scaling
  public speak(text: string, langCode: string, heatScore: number = 50) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
    utterance.lang = langObj ? langObj.bcp47 : "en-US";

    const rateMultiplier = 1.0 + (heatScore / 100) * 0.25;
    const pitchMultiplier = 0.95 + (heatScore / 100) * 0.25;

    utterance.rate = Math.min(1.35, Math.max(0.9, rateMultiplier));
    utterance.pitch = Math.min(1.3, Math.max(0.95, pitchMultiplier));

    const voices = window.speechSynthesis.getVoices();
    const prefix = langObj ? langObj.code : "en";
    const voice = voices.find(
      (v) => v.lang.toLowerCase().startsWith(prefix) || v.lang.toLowerCase().includes(prefix)
    );
    if (voice) {
      utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
  }
}

export const speechEngine = new SpeechEngine();
