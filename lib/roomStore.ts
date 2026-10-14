// In-Memory Multi-Room Engine for TAKRAAR

export interface DebateMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderLang: string;
  originalText: string;
  translatedText: string;
  targetLang: string;
  timestamp: number;
  emotion: "furious" | "defensive" | "sarcastic" | "conceding" | "assertive" | "rational";
  heatDelta: number;
  isInterruption: boolean;
  interruptedSenderId?: string;
  interruptedAtText?: string;
  isConcession: boolean;
  concessionSummary?: string;
}

export interface DebaterProfile {
  id: string;
  name: string;
  lang: string;
  stance: number; // 0 (completely conceded) to 100 (inflexibly entrenched)
  isSpeaking: boolean;
  isTyping: boolean;
  currentDraft?: string;
}

export interface RoomState {
  roomId: string;
  createdAt: number;
  topic: string;
  crux: string;
  heatScore: number; // 0 to 100
  debaterA: DebaterProfile;
  debaterB: DebaterProfile;
  activeSpeakerId: string | null;
  interruptionNotice: {
    interrupterName: string;
    interruptedName: string;
    timestamp: number;
  } | null;
  commonGroundLedger: {
    id: string;
    summary: string;
    concededBy: string;
    timestamp: number;
  }[];
  messages: DebateMessage[];
  resolved: boolean;
}

// Global in-memory storage (persists across requests in node process)
const globalRooms: Map<string, RoomState> = new Map();

export class RoomStore {
  public static getOrCreateRoom(roomId: string, initialTopic?: string): RoomState {
    const existing = globalRooms.get(roomId);
    if (existing) {
      return existing;
    }

    const defaultRoom: RoomState = {
      roomId,
      createdAt: Date.now(),
      topic: initialTopic || "Startup Architecture: Microservices vs Monolith",
      crux: "Premature distributed complexity vs failure domain isolation",
      heatScore: 35, // starting temperature
      debaterA: {
        id: "debater-1",
        name: "Debater 1",
        lang: "hi",
        stance: 90,
        isSpeaking: false,
        isTyping: false,
      },
      debaterB: {
        id: "debater-2",
        name: "Debater 2",
        lang: "en",
        stance: 90,
        isSpeaking: false,
        isTyping: false,
      },
      activeSpeakerId: null,
      interruptionNotice: null,
      commonGroundLedger: [],
      messages: [],
      resolved: false,
    };

    globalRooms.set(roomId, defaultRoom);
    return defaultRoom;
  }

  public static getRoom(roomId: string): RoomState | undefined {
    return globalRooms.get(roomId);
  }

  public static postMessage(roomId: string, message: DebateMessage): RoomState {
    const room = this.getOrCreateRoom(roomId);
    room.messages.push(message);

    // Update room heat (clamp between 5 and 100)
    room.heatScore = Math.max(5, Math.min(100, room.heatScore + message.heatDelta));

    // Update debater stance on concession
    if (message.isConcession && message.concessionSummary) {
      if (message.senderId === room.debaterA.id) {
        room.debaterA.stance = Math.max(20, room.debaterA.stance - 25);
      } else if (message.senderId === room.debaterB.id) {
        room.debaterB.stance = Math.max(20, room.debaterB.stance - 25);
      }

      room.commonGroundLedger.push({
        id: `concession-${Date.now()}`,
        summary: message.concessionSummary,
        concededBy: message.senderName,
        timestamp: Date.now(),
      });

      // Check if dispute is resolved
      if (room.debaterA.stance <= 45 && room.debaterB.stance <= 45) {
        room.resolved = true;
      }
    }

    // Set active speaker
    room.activeSpeakerId = message.senderId;

    return room;
  }

  public static triggerInterruption(
    roomId: string,
    interrupterId: string,
    interrupterName: string
  ): RoomState {
    const room = this.getOrCreateRoom(roomId);
    const interruptedName = interrupterId === room.debaterA.id ? room.debaterB.name : room.debaterA.name;

    // Heat jumps by +15 on interruption
    room.heatScore = Math.min(100, room.heatScore + 15);
    room.activeSpeakerId = interrupterId;

    room.interruptionNotice = {
      interrupterName,
      interruptedName,
      timestamp: Date.now(),
    };

    return room;
  }

  public static updateDebater(
    roomId: string,
    debaterId: string,
    updates: Partial<DebaterProfile>
  ): RoomState {
    const room = this.getOrCreateRoom(roomId);
    if (room.debaterA.id === debaterId) {
      room.debaterA = { ...room.debaterA, ...updates };
    } else if (room.debaterB.id === debaterId) {
      room.debaterB = { ...room.debaterB, ...updates };
    }
    return room;
  }
}
