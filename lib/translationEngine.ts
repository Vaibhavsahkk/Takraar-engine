// Emotional Translation, Heat Analysis & Concession Detection Engine

export interface TranslationResult {
  translatedText: string;
  sourceText: string;
  sourceLang: string;
  targetLang: string;
  detectedEmotion: "furious" | "defensive" | "sarcastic" | "conceding" | "assertive" | "rational";
  heatDelta: number; // change in room temperature (-20 to +25)
  isConcession: boolean;
  concessionSummary?: string;
  interruptionCutoff?: boolean;
}

// Built-in dictionary of heated idioms & colloquial argument patterns
const IDIOMATIC_DISPUTE_MAP: Record<string, Record<string, string>> = {
  hi: {
    "aise kaise bol sakte ho": "How on earth can you say that?!",
    "kuch bhi mat bolo": "Don't just talk nonsense!",
    "bakwaas band karo": "Cut the absolute crap!",
    "tum meri baat sun hi nahi rahe": "You aren't even listening to me!",
    "ye bilkul galat hai": "This is completely wrong and you know it!",
    "theek hai maan liya": "Alright fine, I concede that part.",
    "chalo ye baat sahi hai": "Okay, that particular point is actually fair.",
    "meri galti thi": "I admit that was my mistake.",
    "tum samajh kyu nahi rahe": "Why won't you just understand this?!",
    "sab barbaad ho jayega": "Everything will completely fall apart!",
  },
  es: {
    "eso no tiene sentido": "That makes absolutely zero sense!",
    "estas completamente equivocado": "You are completely out of your mind and wrong!",
    "escuchame de una vez": "Listen to me for once in your life!",
    "dejame hablar": "Let me speak! Stop interrupting!",
    "eso es una mentira": "That is an outright lie!",
    "esta bien admito que": "Alright fine, I admit that point.",
    "tienes razon en eso": "You are right on that specific issue.",
    "tal vez me equivoque": "Perhaps I was mistaken on that part.",
    "es una locura": "That is sheer madness!",
  },
  fr: {
    "c'est n'importe quoi": "That is utter nonsense!",
    "tu ne m'ecoutes pas": "You are not listening to a single word I say!",
    "arrete d'interrompre": "Stop interrupting me right now!",
    "c'est completement faux": "That is completely false!",
    "d'accord j'admets que": "Alright, I admit that point is valid.",
    "tu as raison sur ce point": "You are right on that specific point.",
  },
  ja: {
    "ふざけるな": "Are you kidding me?! Don't mess with me!",
    "話を聞いてくれ": "Just listen to what I'm saying for once!",
    "それは違う": "That is completely wrong!",
    "確かにそれは認める": "Indeed, I concede that specific point.",
    "一理ある": "Alright, you have a valid point there.",
    "邪魔しないで": "Don't cut me off!",
  },
  de: {
    "das ist totaler quatsch": "That is total and absolute nonsense!",
    "hor mir doch mal zu": "Just listen to me for one second!",
    "du hast vollig unrecht": "You are completely in the wrong!",
    "gut das gebe ich zu": "Fine, I admit that much.",
    "da hast du recht": "You're right about that part.",
  },
};

// Concession trigger phrases across languages
const CONCESSION_TRIGGERS: { [lang: string]: string[] } = {
  en: [
    "fair point",
    "i admit",
    "i concede",
    "you're right that",
    "you are right",
    "okay maybe",
    "i see your point",
    "my mistake",
    "i didn't think about that",
    "i agree with that part",
    "fine, but",
  ],
  hi: [
    "maan liya",
    "sahi bol rahe ho",
    "ye baat sahi hai",
    "chalo theek hai",
    "meri galti",
    "ye point valid hai",
    "samajh gaya",
    "agree karta hoon",
    "theek hai par",
  ],
  es: [
    "tienes razon",
    "admito que",
    "es un buen punto",
    "de acuerdo en eso",
    "fue mi error",
    "reconozco que",
    "esta bien",
  ],
  fr: [
    "tu as raison",
    "j'admets",
    "c'est vrai que",
    "bon d'accord",
    "mon erreur",
    "je reconnais",
  ],
  ja: [
    "確かに",
    "認める",
    "一理ある",
    "そうかもしれない",
    "私のミス",
    "分かった",
  ],
  de: [
    "du hast recht",
    "gebe ich zu",
    "guter punkt",
    "mein fehler",
    "akzeptiert",
  ],
};

// Aggression / Heated trigger phrases
const HEATED_TRIGGERS = [
  "!",
  "never",
  "always",
  "impossible",
  "ridiculous",
  "lies",
  "shut up",
  "stop",
  "nonsense",
  "madness",
  "bakwaas",
  "galat",
  "pagal",
  "chup",
  "mentira",
  "locura",
  "jamas",
  "faux",
  "idiot",
  "jamais",
  "quatsch",
];

export class TranslationEngine {
  // Analyze emotional temperature and heat change of an incoming message
  public static analyzeHeat(text: string): {
    emotion: TranslationResult["detectedEmotion"];
    heatDelta: number;
    isConcession: boolean;
  } {
    const lower = text.toLowerCase();
    const length = text.length;

    // 1. Check for Concession (The Mind-Change trigger)
    let isConcession = false;
    for (const lang in CONCESSION_TRIGGERS) {
      if (CONCESSION_TRIGGERS[lang].some((trigger) => lower.includes(trigger))) {
        isConcession = true;
        break;
      }
    }

    if (isConcession) {
      return {
        emotion: "conceding",
        heatDelta: -22, // significant cooling effect
        isConcession: true,
      };
    }

    // 2. Count aggression indicators
    let heatPoints = 5; // baseline increment for speaking

    // Exclamations
    const exclamations = (text.match(/!/g) || []).length;
    heatPoints += exclamations * 6;

    // Caps lock ratio
    const letters = text.replace(/[^a-zA-Z]/g, "");
    if (letters.length > 5) {
      const upper = text.replace(/[^A-Z]/g, "").length;
      if (upper / letters.length > 0.45) {
        heatPoints += 15; // shouting in caps
      }
    }

    // Trigger words
    const hitTriggers = HEATED_TRIGGERS.filter((t) => lower.includes(t)).length;
    heatPoints += hitTriggers * 7;

    // Pacing / Short sharp retorts
    if (length < 25 && (exclamations > 0 || hitTriggers > 0)) {
      heatPoints += 8; // sharp snide jab
    }

    let emotion: TranslationResult["detectedEmotion"] = "assertive";
    if (heatPoints >= 22) emotion = "furious";
    else if (lower.includes("why") || lower.includes("kyu") || lower.includes("por que")) emotion = "defensive";
    else if (lower.includes("surely") || lower.includes("obviously") || lower.includes("bhai")) emotion = "sarcastic";

    return {
      emotion,
      heatDelta: Math.min(30, Math.max(-25, heatPoints)),
      isConcession: false,
    };
  }

  // Fast client-side translation with emotional idiom preservation
  public static async translate(
    text: string,
    fromLang: string,
    toLang: string
  ): Promise<TranslationResult> {
    const heatAnalysis = this.analyzeHeat(text);
    const cleanLower = text.trim().toLowerCase().replace(/[?!.,]/g, "");

    // 1. If identical language, return text with exclamation/punch intact
    if (fromLang === toLang) {
      return {
        translatedText: text,
        sourceText: text,
        sourceLang: fromLang,
        targetLang: toLang,
        detectedEmotion: heatAnalysis.emotion,
        heatDelta: heatAnalysis.heatDelta,
        isConcession: heatAnalysis.isConcession,
        concessionSummary: heatAnalysis.isConcession ? this.extractConcessionSummary(text) : undefined,
      };
    }

    // 2. Check for idiomatic slang match
    if (IDIOMATIC_DISPUTE_MAP[fromLang] && IDIOMATIC_DISPUTE_MAP[fromLang][cleanLower]) {
      const punchyEnglish = IDIOMATIC_DISPUTE_MAP[fromLang][cleanLower];
      return {
        translatedText: punchyEnglish,
        sourceText: text,
        sourceLang: fromLang,
        targetLang: toLang,
        detectedEmotion: heatAnalysis.emotion,
        heatDelta: heatAnalysis.heatDelta,
        isConcession: heatAnalysis.isConcession,
        concessionSummary: heatAnalysis.isConcession ? this.extractConcessionSummary(text) : undefined,
      };
    }

    // 3. Perform live API translation with timeout fallback
    let translated = "";
    try {
      const response = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data?.responseData?.translatedText) {
          translated = data.responseData.translatedText;
        }
      }
    } catch {
      // Fallback below
    }

    // If external translation failed or timed out, provide clean transliteration fallback
    if (!translated || translated.toUpperCase().includes("MYMEMORY WARNING")) {
      translated = `[${toLang.toUpperCase()}] ${text}`;
    }

    return {
      translatedText: translated,
      sourceText: text,
      sourceLang: fromLang,
      targetLang: toLang,
      detectedEmotion: heatAnalysis.emotion,
      heatDelta: heatAnalysis.heatDelta,
      isConcession: heatAnalysis.isConcession,
      concessionSummary: heatAnalysis.isConcession ? this.extractConcessionSummary(text) : undefined,
    };
  }

  // Extract a clean summary of what point was conceded
  private static extractConcessionSummary(text: string): string {
    const trimmed = text.trim();
    if (trimmed.length > 70) {
      return trimmed.substring(0, 67) + "...";
    }
    return trimmed;
  }
}
