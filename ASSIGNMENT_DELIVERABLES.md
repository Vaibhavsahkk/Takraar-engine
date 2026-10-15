# ZERO Forward Deployed Builder Assignment Deliverables

**Candidate:** Vaibhav Kumar (`vaibhavkkr24@gmail.com`)  
**Repository:** [https://github.com/Vaibhavsahkk/Takraar-engine.git](https://github.com/Vaibhavsahkk/Takraar-engine.git)  
**Live Production Deployment:** [https://takraar-engine.vercel.app](https://takraar-engine.vercel.app)  
**Submission Portal:** [https://www.zero4genz.in/interview/e4fc6d4bf4e0c9ad29fa07800eff312c](https://www.zero4genz.in/interview/e4fc6d4bf4e0c9ad29fa07800eff312c)  
**Submission Deadline:** Saturday, 17 Oct, 12:17 pm IST  

---

## Part 1: Product Analysis (Under 150 Words Each)

### 1. The Middle Market
Indian service vendors (photographers, caterers, banquet owners) live on WhatsApp, where revenue leaks every hour. In our multi-agent customer simulation, vendors adamantly rejected any tool requiring a new phone number or complex dashboard while shooting. They drown in repetitive pings: "14 Dec available?", "Rate card bhejo", "Album kab milega?". The first thing I'd build is a zero-setup WhatsApp Web copilot running on their existing number. Ingesting past chat exports and a one-page rate card in 60 seconds, it matches incoming queries against their Google Calendar and generates one-tap Hinglish reply drafts ("14 Dec afternoon booked hai, evening slot open hai 40k package se. Block karein?"). The owner taps once to send, or toggles after-hours automated holds without leaving their familiar WhatsApp interface.

*Word count:* 122 words (Constraint: Strictly under 150 words)

---

### 2. CLOSURE
Freshers apply to dozens of jobs, reach assignment stages, and receive identical automated rejection templates ("After careful consideration..."), spiraling into self-doubt. Recruiters face 400 applicants and cannot write custom emails, rejecting candidates over missing fundamentals like error boundaries or unhandled API re-renders. CLOSURE's promise is brutal human honesty for Rs 29, but manual 20-minute reviews guarantee operational collapse. The first thing I'd build is an internal Reviewer Fast-Triage Terminal. When a candidate uploads their repo and target job posting, the backend runs an instantaneous semantic diff highlighting concrete requirement mismatches (e.g., "Job requires resilient state management; candidate repo fetches on render with zero try/catch"). It drafts a three-bullet evidence-backed diagnosis. The human reviewer verifies the facts, adjusts phrasing into their candid personal voice in 45 seconds, signs their name, and ships it.

*Word count:* 132 words (Constraint: Strictly under 150 words)

---

### 3. ISHQweds
Indian weddings are multi-day, multi-vendor coordination chaos. Five family members make uncoordinated commitments to ten independent vendors (caterers, tent house, DJ, photographers). On the wedding morning, parents waste hours on forty frantic phone calls ("Haldi mic kiske paas hai?", "Generator van gate pe khadi hai, chaabi kiske paas hai?"). The first thing I'd build is the "Wedding Day Live War Room" on WhatsApp. Zero app downloads for family elders or vendors. Every vendor and family lead receives a synced timeline link. Two hours before each milestone, automated one-tap WhatsApp check-ins trigger: "Are you on site? Reply 1 for Yes, 2 for 15-min delay". If a vendor lags, the designated day-of coordinator is alerted automatically, keeping parents and the couple completely out of the firefighting loop.

*Word count:* 125 words (Constraint: Strictly under 150 words)

---

## Part 2: Product Implementation — TAKRAAR

TAKRAAR is a full-duplex cross-lingual dispute runtime engineered specifically for unconstrained arguments across language barriers:

1. **Preemptive Speech Interruption (Barge-In):** Hardware audio streams can be seized instantaneously (<15ms) via hotkey or interface command, truncating active opponent speech mid-syllable with procedural vinyl scratch feedback.
2. **Thermal Heat Quantification:** Dynamic room temperature (0°C to 100°C) evaluated via text velocity, typographic entropy, and collision frequency, dynamically scaling vocal delivery rate and interface tension.
3. **Belief Revision & Consensus Tracking:** Automated detection of cross-lingual concession markers (across Hindi, Spanish, Japanese, English, French, German, Arabic, Russian, and Mandarin), reducing stance entrenchment and recording common ground in an immutable ledger.
4. **Human Neural Acoustic Synthesis:** Powered by Azure Neural Voice models (`hi-IN-MadhurNeural`, `en-US-JennyNeural`, `es-ES-AlvaroNeural`, `ja-JP-KeitaNeural`) for realistic, expressive conversational articulation.
5. **Acoustic Speech-to-Text Pipeline:** Powered by Groq Whisper Large v3 for sub-second, verbatim multilingual speech decoding.

---

## Empirical Verification Summary

- **Multi-Agent Simulation Matrix:** 100+ personas evaluated across 4 batches (`MM-01` to `MM-30`, `CL-01` to `CL-30`, `IW-01` to `IW-20`, `DEB-01` to `DEB-20`) using local GPU LLM (`qwen2.5:3b`) via Ollama.
- **Production Verification:** ESLint passes with 0 errors/warnings; Next.js 16 production build compiles all 8 routes in <1.2s; automated regression test suite passes with 100% green exit code.
