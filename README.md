# TAKRAAR (तकरार // تکرار)
### Real-Time Cross-Lingual Dispute Engine

> *"Two people who don't share a single language need to have an argument. A real one: interrupting each other, getting heated, changing their minds. Build the thing that lets them."*  
> — Challenge brief by **Pari Goyal, ZERO** (`zero4genz.in`)

---

## ⚡ Why TAKRAAR Exists

Standard translation tools (Google Translate, Zoom live captions, Siri) are designed for polite, sequential, turn-taking conversation. They fail completely in an **argument**.

In a real argument:
1. **Nobody waits politely.** Debaters cut across each other, talking over points before the other person finishes.
2. **Emotions escalate.** Speech accelerates, volume spikes, words shake with exclamation, and tension mounts.
3. **Arguments have a trajectory.** They aren't static. People clash over an underlying crux, yield concessions under pressure, and reach pivotal mind-shifts.

**TAKRAAR** is built from first principles to enable heated, high-stakes arguments across language barriers.

---

## 🥊 The Three Core Pillars

```
+-------------------------------------------------------------------------+
|                               TAKRAAR                                   |
+--------------------+--------------------+-------------------------------+
|  1. THE BARGE-IN   |  2. THERMAL HEAT   |  3. THE MIND-SHIFT            |
|     INTERRUPTION   |     DYNAMICS       |     & COMMON GROUND LEDGER    |
+--------------------+--------------------+-------------------------------+
| • Dual-duplex audio| • Dynamic 0-100°C  | • Crux Arbiter extracts root  |
|   & text overlap   |   Room Heat index  |   disagreement                |
| • Instant speech   | • Thermal viewport | • Detects subtle linguistic   |
|   cut-off marker   |   border pulsation |   concessions                 |
| • Procedural audio | • Kinetic word     | • Immutable Common Ground     |
|   scratch SFX      |   vibration/shake  |   Ledger records ground given |
+--------------------+--------------------+-------------------------------+
```

### 1. The Barge-In Interruption Engine
- When an opponent is speaking or holding the floor, hitting **BARGE IN** (or pressing `SPACE`) immediately terminates their speech synthesis stream.
- An acoustic record-scratch / glitch slice SFX fires via the browser's Web Audio API.
- The previous speaker's message is marked with `[INTERRUPTED MID-SENTENCE ⚡]`.
- The interrupter immediately seizes floor custody with an aggressive crimson border surge.

### 2. Thermal Heat Dynamics
- Room Heat runs from **0°C (Rational / Cold)** to **100°C (Critical Boiling Point)**.
- Calculated live from:
  - Typing burst velocity and speech tempo.
  - Exclamation density and ALL CAPS intensity.
  - Aggressive and dismissive vocabulary across supported tongues.
  - Frequency of interruptions.
- The entire viewport pulses with dynamic thermal glow (ice blue -> volatile amber -> heated crimson -> boiling magma). Words delivered in heated states physically vibrate using kinetic CSS keyframes (`.shake-heated`).

### 3. The Mind-Shift & Common Ground Ledger
- Why argue if minds never change? The system features a continuous **Crux & Belief Shift Tracker**:
  - Monitors both debaters' **Certainty Stance** (0% conceded to 100% entrenched).
  - Listens for linguistic concessions across Hindi, Spanish, Japanese, French, German, and English (*"fair point"*, *"maan liya"*, *"tienes razón"*, *"d'accord j'admets"*).
  - When ground is yielded, the concession is permanently etched into the **Immutable Common Ground Ledger**.
  - Heat cools down, stance drops, and reaching mutual consensus triggers resolution fanfare and confetti.

---

## 🌐 Supported Languages & Accents
- 🇮🇳 **Hindi (हिन्दी)**
- 🇬🇧 **English**
- 🇪🇸 **Spanish (Español)**
- 🇯🇵 **Japanese (日本語)**
- 🇫🇷 **French (Français)**
- 🇩🇪 **German (Deutsch)**
- 🇸🇦 **Arabic (العربية)**
- 🇷🇺 **Russian (Русский)**
- 🇨🇳 **Mandarin (中文)**

---

## 🎮 Game Modes

### Mode 1: Solo Sparring (Instant AI Adversaries)
Test immediately without needing a second person:
- **Vikram Mehta (Bengaluru, Hindi/Hinglish):** Seed CTO arguing furiously that microservices are cancer for early-stage startups and modular monoliths are the only rational choice.
- **Elena Ramos (Barcelona, Spanish):** Design Principal arguing passionately that AI-generated UI has zero human taste and produces bland generic templates.
- **Kenji Sato (Tokyo, Japanese):** Systems Architect insisting that shipping buggy code to production irreversibly poisons user trust.
- **Custom Arena:** Enter any topic, define the crux, and face an opponent in any language.

### Mode 2: Live 2-Player Duplex Arena
- Share a Room Code or direct URL with another person (or open two browser tabs / phones side-by-side).
- Choose different native tongues and argue in real time with synchronized interruptions, thermal heat meters, and concession recording.

---

## 🛠️ Technical Architecture

- **Framework:** Next.js 16 (App Router) with Turbopack & React 19
- **Styling:** Tailwind CSS v4 with bespoke Brutalist tokens (`#08090A`, thermal glowing borders, tactile raised buttons)
- **Audio Synthesizer:** Pure procedural Web Audio API (zero external mp3 assets)
  - Vinyl glitch slice / interruption stop
  - Dynamic low-frequency tension drone linked to heat score
  - Harmonious major chord chime on concessions
- **Speech Engine:**
  - Browser Web Speech Recognition for real-time dictation
  - Web Speech Synthesis with dynamic pitch and rate acceleration during heated moments
- **Translation & Emotion Engine:** Resilient multi-tier translation layer preserving idiomatic sarcasm, slang, and emotional heat.

---

## 🚀 Local Setup

```bash
# Clone the repository
git clone https://github.com/Vaibhavsahkk/Takraar-engine.git
cd Takraar-engine

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👤 Author

**Vaibhav Kumar**  
- **Role Candidate:** Forward Deployed Builder at ZERO (`zero4genz.in`)  
- **GitHub:** [@Vaibhavsahkk](https://github.com/Vaibhavsahkk)  
- **Email:** vaibhavkkr24@gmail.com  
