// Sparring Scenarios for Real-Time Solo Argument Experience

export interface SparringScenario {
  id: string;
  title: string;
  category: string;
  opponentName: string;
  opponentRole: string;
  opponentAvatar: string;
  opponentLang: string; // language code
  userDefaultLang: string;
  crux: string;
  topicPrompt: string;
  opponentInitialStance: number; // 0-100 stubbornness
  turns: {
    triggerKeywords?: string[];
    opponentSpeech: string;
    concedesIfKeywords?: string[];
    concessionResponse?: string;
    concessionCruxSummary?: string;
  }[];
}

export const SPARRING_SCENARIOS: SparringScenario[] = [
  {
    id: "microservices-vs-monolith",
    title: "Monolith vs Microservices War",
    category: "Architecture & Scale",
    opponentName: "Vikram Mehta",
    opponentRole: "Seed CTO, Bengaluru",
    opponentAvatar: "👨🏽‍💻",
    opponentLang: "hi",
    userDefaultLang: "en",
    crux: "Premature distributed complexity vs team autonomy and failure boundaries",
    topicPrompt: "Debating whether an early stage startup should adopt microservices or stick strictly to a modular monolith.",
    opponentInitialStance: 94,
    turns: [
      {
        opponentSpeech: "Bhai seed stage pe microservices aur Kubernetes kyu ghusa rahe ho?! Do customer nahi hain abhi tak tumhare, aur tum distributed tracing configure kar rahe ho! Seedha monolith banao!",
        triggerKeywords: ["scale", "growth", "modular", "team", "future"],
        concedesIfKeywords: ["autonomy", "isolation", "payment", "boundaries", "compliance", "independent"],
        concessionResponse: "Achha theek hai, chalo ye baat maan li. Agar payment pipeline aur billing ko audit compliance ke liye isolate karna hai, toh utna service boundary theek hai. But baaki core app monolith hi rehna chahiye!",
        concessionCruxSummary: "Vikram concedes: Strict isolation is justified specifically for sensitive payment and compliance services, while keeping core business logic monolithic.",
      },
      {
        opponentSpeech: "Khaali scalability ki baatein mat karo! Scale tab aayega jab product bachega! Microservices mein ek schema change karne mein teen teams se bheekh maangni padti hai. Tumhara sara runway debugging mein beh jayega!",
        triggerKeywords: ["runway", "speed", "fast", "deploy", "break"],
        concedesIfKeywords: ["database", "schema", "lockin", "monorepo", "team size"],
        concessionResponse: "Sahi bol rahe ho, agar team 15 se kam logo ki hai toh distributed overhead runway khatam kar deta hai. Theek hai, modular monolith first, extract later.",
        concessionCruxSummary: "Vikram agrees: Team size below 15 engineers cannot bear the operational tax of distributed systems.",
      },
      {
        opponentSpeech: "Netflix aur Uber ke blog posts padh ke architecture decide mat karo! Unke paas 500 SRE engineers hain jo raat ko jagte hain. Tumhare paas do intern hain jo Friday raat ko deploy fail karke so jaayenge!",
        triggerKeywords: ["netflix", "uber", "industry", "standard"],
        concedesIfKeywords: ["pragmatic", "tradeoff", "boring", "agree", "fair"],
        concessionResponse: "Chalo theek hai, kam se kam tum ye toh samajh rahe ho ki context matter karta hai. Pehle 100k revenue nikalo monolith se, phir baat karenge.",
        concessionCruxSummary: "Consensus reached: Start boring and monolithic, earn the right to distribute through revenue.",
      },
    ],
  },
  {
    id: "ai-ui-vs-human-craft",
    title: "AI Interfaces vs Human Craft",
    category: "Design & Product Taste",
    opponentName: "Elena Ramos",
    opponentRole: "Design Principal, Barcelona",
    opponentAvatar: "👩🏻‍🎨",
    opponentLang: "es",
    userDefaultLang: "en",
    crux: "Speed of automated UI generation vs emotional trust and bespoke craftsmanship",
    topicPrompt: "Debating whether AI can design production user interfaces or if human taste is irreplaceable.",
    opponentInitialStance: 91,
    turns: [
      {
        opponentSpeech: "¡Todo lo que genera la inteligencia artificial es una copia genérica y aburrida! ¡Cien botones idénticos, degradados morados y tarjetas sin alma! ¡El diseño no es ensamblar bloques, es empatía!",
        triggerKeywords: ["boilerplate", "speed", "prototype", "tailwind", "fast"],
        concedesIfKeywords: ["taste", "curator", "human", "scaffolding", "iteration", "amplifier"],
        concessionResponse: "Está bien, admito que como andamiaje inicial para no arrancar con la pantalla en blanco ahorra tiempo. Pero insisto: el criterio y la jerarquía visual tienen que ser 100% humanos.",
        concessionCruxSummary: "Elena concedes: AI is an effective high-speed scaffolding tool when paired with strict human taste curation.",
      },
      {
        opponentSpeech: "¡La velocidad no vale nada si el usuario abre la página y siente que es una plantilla prefabricada! ¡Un dueño de negocio en India o en España tarda tres segundos en detectar si un producto es digno de confianza o una trampa!",
        triggerKeywords: ["trust", "conversion", "business", "polish"],
        concedesIfKeywords: ["typography", "bespoke", "custom", "feedback", "real users"],
        concessionResponse: "De acuerdo en eso. Si un diseñador pasa tres días en la tienda observando dónde tropieza el dueño, ninguna IA puede competir con esa intuición.",
        concessionCruxSummary: "Elena agrees: Sitting with real customers reveals nuances that training data can never synthesize.",
      },
      {
        opponentSpeech: "¡Me cansa que los ingenieros confundan la ausencia de errores de sintaxis con buen gusto! ¡Un botón alineado a la perfección puede ser completamente inútil si está en el lugar equivocado!",
        triggerKeywords: ["syntax", "compiler", "button", "taste"],
        concedesIfKeywords: ["agree", "true", "fair", "hierarchy", "context"],
        concessionResponse: "Bueno, al fin nos entendemos. La herramienta ejecuta, pero la firma y la responsabilidad son humanas. En eso estamos de acuerdo.",
        concessionCruxSummary: "Consensus reached: Code syntax is mechanical; design taste is architectural judgment and empathy.",
      },
    ],
  },
  {
    id: "velocity-vs-perfection",
    title: "Ship Broken vs Ship Perfect",
    category: "Engineering Ethics",
    opponentName: "Kenji Sato",
    opponentRole: "Principal Systems Architect, Tokyo",
    opponentAvatar: "👨🏻‍🔬",
    opponentLang: "ja",
    userDefaultLang: "en",
    crux: "Customer discovery velocity vs irreversible reputational damage from defects",
    topicPrompt: "Debating whether startups should ship broken/buggy code to test demand, or hold for bulletproof stability.",
    opponentInitialStance: 93,
    turns: [
      {
        opponentSpeech: "バグだらけのコードをリリースすることは顧客に対する冒涜です！一度失った信頼は二度と取り戻せません！完璧にテストしてから公開するのが職人の責務です！",
        triggerKeywords: ["feedback", "learn", "market", "fast", "fail"],
        concedesIfKeywords: ["feedback", "validation", "non-critical", "experiment", "assumption"],
        concessionResponse: "…確かに、決済やデータ損失に関わらない表面的なUIの不具合であれば、市場検証を急ぐ論理には一理あると認めます。",
        concessionCruxSummary: "Kenji concedes: Non-critical cosmetic issues can be tolerated temporarily if strictly isolated from data integrity.",
      },
      {
        opponentSpeech: "「早く動いて壊せ」というスローガンは無責任な開発者の言い訳です！クラッシュしたアプリを前にしたユーザーの絶望を考えたことがありますか？！",
        triggerKeywords: ["break", "move fast", "users", "crash"],
        concedesIfKeywords: ["observability", "hotfix", "telemetry", "monitor", "hours"],
        concessionResponse: "24時間以内の即時修正体制と厳格なエラー監視があるならば、完全無欠を待つより前進する妥協点は理解できます。",
        concessionCruxSummary: "Kenji agrees: Continuous telemetry and rapid hotfixing within 24 hours mitigate initial defect risk.",
      },
    ],
  },
];
