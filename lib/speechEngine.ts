// Speech Engine with Groq Whisper Large v3 Backend + Web Speech Live Interim Feedback

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

  // MediaRecorder state for Groq Whisper pipeline
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private mediaStream: MediaStream | null = null;
  private activeLangCode: string = "en";
  private networkErrorCount: number = 0;

  public isRecognitionSupported(): boolean {
    if (typeof window === "undefined") return false;
    return !!(
      window.SpeechRecognition ||
      window.webkitSpeechRecognition ||
      (navigator.mediaDevices && window.MediaRecorder)
    );
  }

  // Explicitly prompt for hardware microphone permission
  public async requestMicPermission(): Promise<{ granted: boolean; stream?: MediaStream; error?: string }> {
    if (typeof window === "undefined" || !navigator?.mediaDevices?.getUserMedia) {
      return { granted: false, error: "Audio capture API is not supported in this browser." };
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      return { granted: true, stream };
    } catch (err: unknown) {
      const errName = (err as { name?: string })?.name || "";
      if (errName === "NotAllowedError" || errName === "PermissionDeniedError") {
        return {
          granted: false,
          error: "Microphone permission was blocked. Please click the lock icon in your browser address bar to allow microphone access, then try again.",
        };
      }
      return { granted: false, error: (err as Error)?.message || "Microphone access failed." };
    }
  }

  // Transcribe recorded audio blob with Groq Whisper Large v3
  private async transcribeWithGroq(blob: Blob, langCode: string): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append("file", blob, "recording.webm");
      formData.append("language", langCode);

      const res = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        console.warn("Groq Whisper API returned status:", res.status);
        return null;
      }

      const data = await res.json();
      return data.text ? data.text.trim() : null;
    } catch (err) {
      console.error("Failed to transcribe via Groq Whisper:", err);
      return null;
    }
  }

  // Start continuous mic listening with live interim text stream + Groq Whisper refinement
  public async startListening(
    langCode: string,
    onTranscript: (text: string, isFinal: boolean) => void,
    onError: (err: string) => void,
    onStart?: () => void,
    onEnd?: () => void
  ) {
    if (typeof window === "undefined") return;

    this.activeLangCode = langCode;
    this.wantListening = true;
    this.networkErrorCount = 0;
    this.onStartCallback = onStart || null;
    this.onEndCallback = onEnd || null;

    // 1. Acquire microphone stream
    const perm = await this.requestMicPermission();
    if (!perm.granted || !perm.stream) {
      this.wantListening = false;
      this.isListening = false;
      onError(perm.error || "Microphone access failed.");
      return;
    }

    this.mediaStream = perm.stream;
    this.audioChunks = [];

    // 2. Setup MediaRecorder for audio capture to feed Groq Whisper
    try {
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
        ? "audio/webm"
        : "audio/ogg";

      this.mediaRecorder = new MediaRecorder(this.mediaStream, { mimeType });
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = async () => {
        if (this.audioChunks.length > 0) {
          const audioBlob = new Blob(this.audioChunks, { type: mimeType });
          // Send to Groq Whisper for sub-second, highly accurate transcription
          const whisperText = await this.transcribeWithGroq(audioBlob, this.activeLangCode);
          if (whisperText) {
            onTranscript(whisperText, true);
          }
        }
        // Release hardware audio tracks
        this.mediaStream?.getTracks().forEach((track) => track.stop());
        this.mediaStream = null;
      };

      this.mediaRecorder.start(250); // Slice every 250ms
    } catch (recorderErr) {
      console.warn("MediaRecorder initialization fallback:", recorderErr);
    }

    // 3. Setup Browser Web Speech API for instantaneous zero-latency interim live display
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
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
            // Live typing feedback
            onTranscript(fullTranscript.trim(), isFinal);
          }
        };

        this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          if (event.error === "no-speech") return;
          if (event.error === "not-allowed" || event.error === "service-not-allowed") {
            this.wantListening = false;
            this.isListening = false;
            onError("Microphone permission denied.");
            return;
          }
          if (event.error === "network") {
            this.networkErrorCount++;
            if (this.networkErrorCount >= 2) {
              // Break infinite retry loop; fall back cleanly to MediaRecorder + Groq Whisper
              try {
                this.recognition?.abort();
              } catch {
                // ignore
              }
              this.recognition = null;
              onError("Browser speech network unavailable. Audio recording active — speak freely, Whisper will transcribe upon stop.");
              return;
            }
            return;
          }
          console.warn("Speech recognition warning:", event.error);
        };

        this.recognition.onend = () => {
          if (this.wantListening && this.recognition && this.networkErrorCount < 2) {
            try {
              this.recognition.start();
            } catch {
              // will finish via stopListening
            }
          }
        };

        this.recognition.start();
      } catch (recInitErr) {
        console.warn("WebSpeech recognition start failed:", recInitErr);
      }
    } else {
      // Browser doesn't have Web Speech, but MediaRecorder is active
      this.isListening = true;
      if (this.onStartCallback) this.onStartCallback();
    }
  }

  // Stop listening explicitly and trigger Groq Whisper processing
  public stopListening() {
    this.wantListening = false;
    this.isListening = false;

    // Stop Web Speech
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
    }

    // Stop MediaRecorder which triggers onstop -> Groq Whisper API
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      try {
        this.mediaRecorder.stop();
      } catch (err) {
        console.warn("Error stopping MediaRecorder:", err);
      }
    }

    if (this.onEndCallback) {
      this.onEndCallback();
    }
  }

  // Active audio element for neural speech playback
  private activeAudio: HTMLAudioElement | null = null;
  private activeAudioUrl: string | null = null;

  // Preempt active speech immediately (Barge-In)
  public interruptSpeech() {
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
      } catch {
        // ignore
      }
      this.activeAudio = null;
    }
    if (this.activeAudioUrl) {
      try {
        URL.revokeObjectURL(this.activeAudioUrl);
      } catch {
        // ignore
      }
      this.activeAudioUrl = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  // Fallback to local browser speech synthesis only if network is offline
  private speakLocalFallback(text: string, langCode: string, heatScore: number = 50) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      const langObj = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
      utterance.lang = langObj ? langObj.bcp47 : "en-US";

      const rateMultiplier = 1.0 + (heatScore / 100) * 0.22;
      utterance.rate = Math.min(1.3, Math.max(0.9, rateMultiplier));

      const voices = window.speechSynthesis.getVoices();
      const prefix = langObj ? langObj.code.toLowerCase() : "en";
      const matching = voices.filter(
        (v) => v.lang.toLowerCase().startsWith(prefix) || v.lang.toLowerCase().includes(prefix)
      );
      if (matching.length > 0) utterance.voice = matching[0];
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  }

  // Speak with conversational human neural voice (like ChatGPT / Gemini Live)
  public async speak(text: string, langCode: string, heatScore: number = 50) {
    if (typeof window === "undefined") return;

    // Immediate interruption of any ongoing speech (Barge-In)
    this.interruptSpeech();

    const cleanText = text
      .replace(/\[.*?\]/g, "")
      .replace(/[#*`_~]/g, "")
      .trim();

    if (!cleanText) return;

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: cleanText,
          lang: langCode,
          heatScore,
        }),
      });

      if (!response.ok) {
        throw new Error(`TTS server returned status ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      this.activeAudioUrl = audioUrl;

      const audio = new Audio(audioUrl);
      this.activeAudio = audio;

      audio.onended = () => {
        if (this.activeAudioUrl === audioUrl) {
          URL.revokeObjectURL(audioUrl);
          this.activeAudioUrl = null;
        }
        if (this.activeAudio === audio) {
          this.activeAudio = null;
        }
      };

      audio.onerror = () => {
        console.warn("Neural audio playback failed, falling back to local synthesis.");
        this.speakLocalFallback(cleanText, langCode, heatScore);
      };

      await audio.play();
    } catch (err) {
      console.warn("Neural TTS request failed, using fallback:", err);
      this.speakLocalFallback(cleanText, langCode, heatScore);
    }
  }
}

export const speechEngine = new SpeechEngine();
