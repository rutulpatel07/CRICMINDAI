
```markdown
# 📄 Product Requirement Document (PRD)
## Project Name: CricMind AI
### Track: Data & Insights Problem Statement

---

## 1. Executive Summary & Objective
**CricMind AI** is an autonomous **AI Sports Strategy Agent** designed for the Data & Insights challenge. The platform ingests live, raw cricket data payloads (via a public IPL scraper endpoint) and translates dense, unstructured match telemetries into immediate, hyper-engaging tactical insights, predictive shifts, and professional-grade commentary. 

The objective is to elevate user experience from passive score-watching to an active, insider **"AI Tactical Control Room"** view.

---

## 2. Core Target User & Problem Statement Fit
* **The Problem:** Modern sports fans are flooded with raw numbers (e.g., strike rates, economy rates, wagon wheels) but lack the deep analytical context to understand *why* a game is turning or *what* strategic adjustments must be made next.
* **The User:** Modern cricket fans who crave deeper, analytical, second-screen immersion during a live match.
* **The Fit:** Directly aligns with the problem statement by **simplifying advanced statistics** and converting complex numbers into **intuitive, actionable insight cards**.

---

## 3. Feature & Functional Requirements

### 3.1. Core Agentic Ingestion Pipeline
* **REQ-1 (Data Fetch):** The system must programmatically hit the live scraping endpoint (`https://ipl-okn0.onrender.com/`).
* **REQ-2 (Robust Fail-Safe):** If the network times out or faces a cold start, the backend must instantly capture the error catch block and parse a localized `mockMatchData.json` snapshot so the application never breaks during a live judging presentation.

### 3.2. Cognitive Reasoning Engine (Gemini API)
The agent must feed the parsed JSON payload to `gemini-2.5-flash` using a strict, machine-readable output schema. It must autonomously extract three distinct analytical tracks:
* **`momentumShift`:** A real-time data interpretation showing which team is applying pressure and why.
* **`tacticalAdvice`:** An actionable, professional coach-level instruction for the upcoming over.
* **`hypeCommentary`:** An engaging, high-energy textual breakdown written in the tone of an elite sports broadcaster.

### 3.3. The "AI Tactical Control Room" Frontend UI
* **Live Score Widget (Top Layer):** Displays real-time team names, wickets, runs, overs, and active personnel parsed from the scraper payload.
* **The Action Trigger:** A highly prominent **"Trigger AI Strategy Scan"** button that initiates the pipeline.
* **Dynamic Insight Grid (Main Body):** Three cleanly separated visual containers mapping directly to the Gemini schema properties.
* **Immersive Loader Experience:** A simulated status console that prints systemic micro-steps (e.g., `[ANALYZING BOWLER MATCH-UPS]`) while waiting for the API response.

---

## 4. Technical Architecture & System Flow

```text
[ Frontend: React App ] --( Click Scan )--> [ Backend: Node/Express API ]
                                                      |
                                           ( Fetches Live Score Feed )
                                                      |
                                                      v
[ Gemini API Engine ]   <--( Passes JSON )--- [ IPL Scraper Endpoint ]
         |
  (Processes Prompt 
   & Strict Schema)
         |
         v
[ Structured JSON Output ] ----( Map to Components )----> [ Frontend UI Cards ]

```

---

## 5. Backend JSON Contract (Data Schemas)

### 5.1. Target Input Payload to Gemini (Sample Structure)

```json
{
  "matchInfo": "Gujarat Titans vs Chennai Super Kings",
  "score": "162/2",
  "overs": "16.4",
  "requiredRate": "11.4",
  "lastEvent": "WICKET - Ruturaj Gaikwad caught at deep midwicket."
}

```

### 5.2. Strict Agent Output Schema (`responseSchema`)

The backend enforces this exact structural contract from the Gemini SDK to prevent formatting or parsing errors on the frontend:

```json
{
  "type": "OBJECT",
  "properties": {
    "momentumShift": { "type": "STRING" },
    "tacticalAdvice": { "type": "STRING" },
    "hypeCommentary": { "type": "STRING" }
  },
  "required": ["momentumShift", "tacticalAdvice", "hypeCommentary"]
}

```

---

## 6. Hackathon Success Criteria (The "Wow" Strategy)

1. **Zero-Crash Guarantee:** The `try/catch` mock backup must preserve application functionality under any network condition.
2. **Immediate Comprehension:** A judge looking at the screen must immediately grasp what the AI calculated within 3 seconds of the UI updating.
3. **Speed over Complexity:** Using `gemini-2.5-flash` satisfies the need for fast response times during a live performance.

```

---

### ⏱️ Time to Play: Powerplay (Overs 1–6) Starts Now!
Your specifications are formally locked down. Open your terminal, set up your workspace directories, and let's get building. Do you want to jump straight into setting up the Express backend route code next?

```