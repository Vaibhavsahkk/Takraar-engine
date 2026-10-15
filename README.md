# TAKRAAR (तकरार)
### Distributed Full-Duplex Multilingual Dispute Runtime

TAKRAAR is a specialized real-time communication system engineered for unconstrained verbal and textual conflict across natural language barriers. Traditional automated translation and computer-mediated communication platforms enforce polite, turn-based turn-taking protocols. In genuine human dispute, participants do not wait for translation latency; they talk over one another, seize conversational floor custody, escalate emotional velocity, and revise core stances under argumentative pressure.

TAKRAAR provides a sub-second, full-duplex runtime featuring hardware-accelerated speech synthesis preemption (Barge-In), dynamic emotional heat quantification, and deterministic concession tracking with an immutable consensus ledger.

---

## Technical Problem Statement

Conventional translation architectures fail under the dynamics of interpersonal debate due to four fundamental limitations:

1. Turn-Taking Serialization: Systems like Google Meet or Zoom enforce serialized audio pipelines where participant B must wait for participant A to complete an utterance and for downstream transcription to finish before speaking.
2. Lack of Preemption Primitives: Standard speech synthesis queues buffer audio chunks sequentially. If participant B interrupts, participant A's audio continues playing, destroying the physical cadence of conversational dominance.
3. Loss of Rhetorical Stress: Semantic content is translated literally while acoustic velocity, punctuation entropy, and affective intensity are stripped out.
4. Epistemic Stagnation: Disagreements generate extensive transcripts without tracking whether either party conceded ground on specific propositions.

TAKRAAR resolves these issues through a unified client-server architecture combining low-latency speech pipelines, procedural audio synthesis, and semantic concession arbitration.

---

## System Architecture

```
+---------------------------------------------------------------------------------------+
|                                    CLIENT APPLICATION                                 |
+---------------------------------------------------------------------------------------+
|  +--------------------+     +---------------------+     +--------------------------+  |
|  | Web Speech Capture | --> | Translation Runtime | --> | Speech Synthesis Engine  |  |
|  +--------------------+     +---------------------+     +--------------------------+  |
|            |                           |                             |                |
|            v                           v                             v                |
|  +--------------------+     +---------------------+     +--------------------------+  |
|  | Interruption Logic |     | Thermal Heat Index  |     | Crux Arbiter & Consensus |  |
|  | (Barge-In State)   |     | (0-100 C Velocity)  |     | (Belief Revision Engine) |  |
|  +--------------------+     +---------------------+     +--------------------------+  |
|            |                           |                             |                |
+------------|---------------------------|-----------------------------|----------------+
             |                           |                             |
             v                           v                             v
+---------------------------------------------------------------------------------------+
|                             IN-MEMORY STATE STORE & API LAYER                         |
|                 /api/room (State Sync)  |  /api/translate (Semantic Matrix)           |
+---------------------------------------------------------------------------------------+
```

The runtime operates through three coordinated subsystems:

### 1. Conversational Preemption Engine (Barge-In)

The preemption protocol permits any interlocutor to immediately seize conversational custody regardless of the opponent's transmission state:

* Execution Vector: When an interruption event is triggered (via vocal detection, keyboard hotkey, or interface command), the active Web Speech synthesis queue is flushed in under 15 milliseconds using immediate cancellation signals.
* Acoustic Cut-off Marker: An asynchronous Web Audio API procedural synthesis block generates a vinyl scratch attenuation sound, providing visceral acoustic feedback that speech was terminated mid-utterance.
* State Stamping: The truncated message in the session log is permanently annotated with an interruption marker, preserving conversational history and recording which participant surrendered floor custody.

### 2. Thermal Stress and Velocity Quantification

The system maintains a continuous room heat score scaled from 0 degrees Celsius (baseline rational exchange) to 100 degrees Celsius (critical conversational boiling point). Heat is calculated through a deterministic state function evaluated on each message delivery:

* Text Velocity: Words-per-minute delivery rate and transmission frequency.
* Typographic Stress: Exclamation mark density, punctuation clustering, and capitalized character ratios.
* Affective Lexicon: Presence of dismissive, urgent, or confrontational tokens across all supported languages.
* Collision Frequency: Rate of barge-in interruptions within a rolling 60-second window.

Viewport rendering and typography dynamically react to the thermal score. High-temperature states apply kinetic vibration shaders and color temperature shifts across the interface.

### 3. Semantic Concession and Consensus Tracking

Disputes are structured around an explicitly defined crux (the primary point of contention). To measure convergence:

* Each debater maintains a numeric stance index ranging from 100 percent (fully entrenched) to 0 percent (fully capitulated).
* The consensus engine tokenizes incoming text against an idiomatic concession taxonomy across Hindi, English, Spanish, Japanese, French, German, Arabic, Russian, and Mandarin.
* When a participant yields a point (for example, "fair point", "maan liya", "tienes razon"), the system records the concession in an immutable consensus ledger.
* Concessions reduce stance entrenchment, cool thermal room metrics, and compute mutual common ground.

---

## Core Operational Modes

### Mode 1: Autonomous Adversarial Sparring

Designed for single-operator testing and rhetorical stress evaluation. Operators debate against persistent synthetic interlocutors configured with divergent belief priors and dialectical strategies:

| Adversary Profile | Native Tongue | Argument Vector | Initial Prior |
|---|---|---|---|
| Vikram Mehta | Hindi / Hinglish | Distributed Systems Architecture | Modular Monoliths vs Microservices |
| Elena Ramos | Spanish | Human Design vs Generative Interfaces | Algorithmic UI Homogenization |
| Kenji Sato | Japanese | Production Reliability Engineering | Zero-Defect Deployment vs Rapid Iteration |
| Custom Arena | Any Language | User-defined topic and root crux | Configurable Stance Parameters |

### Mode 2: Multi-Client Dispute Arena

Two human participants join a shared room instance via distinct endpoints. The room state engine synchronizes transcript streams, floor possession flags, thermal velocity indices, and concession ledgers in real time.

---

## Linguistic Coverage Matrix

| Language | ISO Code | Speech Recognition | Speech Synthesis | Concession Token Set |
|---|---|---|---|---|
| Hindi | hi-IN | Groq Whisper Large v3 / hi-IN | Regional Formant Synthesis | maan liya, sahi baat hai, thik hai |
| English | en-US | Groq Whisper Large v3 / en-US | Native Neutral Engine | fair point, you are right, I concede |
| Spanish | es-ES | Groq Whisper Large v3 / es-ES | Castilian / Latin Formant | tienes razon, de acuerdo, admito |
| Japanese | ja-JP | Groq Whisper Large v3 / ja-JP | Native Japanese Pipeline | tashikani, sono toori, mitomemasu |
| French | fr-FR | Groq Whisper Large v3 / fr-FR | Hexagonal Engine | d'accord, c'est vrai, j'admets |
| German | de-DE | Groq Whisper Large v3 / de-DE | Native German Engine | stimmt, da hast du recht, akzeptiert |
| Arabic | ar-SA | Groq Whisper Large v3 / ar-SA | Modern Standard Arabic | saheeh, ma3ak haq, uqirr |
| Russian | ru-RU | Groq Whisper Large v3 / ru-RU | Slavic Formant Profile | soglasen, ty prav, priznayu |
| Mandarin | zh-CN | Groq Whisper Large v3 / zh-CN | Standard Putonghua | you daoli, wo tongyi, chengren |

---

## Technical Specifications

* Application Framework: Next.js 16 (App Router) utilizing Turbopack runtime
* UI Component Architecture: React 19 with strict immutability patterns
* Styling Engine: Tailwind CSS v4 with low-latency CSS variable binding
* Audio Generation: Procedural Web Audio API oscillator nodes (zero external media asset dependencies)
* Speech-to-Text Pipeline: Dual-layer engine pairing client-side interim stream with Groq Whisper Large v3 for verbatim acoustic decoding (<200ms latency)
* Speech Synthesis Layer: Prioritized neural voice selection with dynamic thermal scaling
* Code Quality: ESLint strict verification with zero errors and zero warnings
* TypeScript Compilation: Complete type coverage with zero strict-mode violations

---

## Getting Started

### Prerequisites

* Node.js version 18.17.0 or higher
* npm version 9.0.0 or higher

### Installation

```bash
git clone https://github.com/Vaibhavsahkk/Takraar-engine.git
cd Takraar-engine
npm install
cp .env.example .env.local
```

Configure your `GROQ_API_KEY` in `.env.local` for high-precision Whisper Large v3 transcription.

### Running Locally

To start the local development server:

```bash
npm run dev
```

The application will be accessible at http://localhost:3000.

### Production Build

To validate type integrity and generate the optimized production deployment:

```bash
npm run build
```

To run the production build locally:

```bash
npm start
```
