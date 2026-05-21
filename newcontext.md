# CricMind AI — Build Pack (3-Hour Hackathon)

All snippets below use the **current** `@google/genai` SDK and `gemini-2.5-flash`
(syntax verified against Google's official docs). Backend only — never put the
API key in the React client.

```bash
npm install @google/genai
# backend env: GEMINI_API_KEY=...
```

---

## 0. Build order (cut from the bottom if you run out of time)

1. **MUST** — Mock-primary pipeline: serve mock JSON → Gemini text call → 3 cards render. *If only this works, you still have a demo.*
2. **MUST** — UI: live-score widget, "Trigger AI Strategy Scan" button, 3 insight cards, loader console.
3. **SHOULD** — Vision hook: upload scorecard image → Gemini reads + analyses it. *This is the closer.*
4. **COULD** — Live scraper as an optional flex (only if judging is after 7:30 PM IST AND the endpoint is warm).
5. **COULD** — Polish, animations, richer input fields.

**Feature freeze at 2:30. Last 30 min = deploy + rehearse only.**

---

## 1. System prompt (text mode)

```
You are CricMind, an elite cricket tactical analyst and broadcast commentator.
You are given the live state of a T20 match as JSON.

Your job: turn the raw numbers into an insider's read. Produce exactly three outputs.

1. momentumShift — Which side currently holds the pressure and WHY. Ground every
   claim in the provided numbers (run rates, wickets in hand, balls left,
   bowler/batter form). 2 sentences max.
2. tacticalAdvice — One concrete, actionable instruction for the NEXT over, in the
   voice of a head coach. Reference the actual matchup. 2 sentences max.
3. hypeCommentary — One high-energy line in the tone of an elite Indian broadcast
   commentator. Vivid, punchy, never generic.

Rules:
- Use ONLY the numbers provided. Never invent stats, names, or events.
- This is tactical INTERPRETATION, not a guaranteed prediction. Never claim certainty.
- Be specific. "They need to attack" is weak. "Target Rashid's 4th over before he
  bowls out" is strong.
```

---

## 2. Response schema (Gemini format — uppercase types)

```js
const schema = {
  type: "OBJECT",
  properties: {
    momentumShift:  { type: "STRING" },
    tacticalAdvice: { type: "STRING" },
    hypeCommentary: { type: "STRING" }
  },
  propertyOrdering: ["momentumShift", "tacticalAdvice", "hypeCommentary"],
  required: ["momentumShift", "tacticalAdvice", "hypeCommentary"]
};
```

---

## 3. Enriched mock (`mockMatchData.json`) — richer = sharper output

```json
{
  "matchInfo": "Gujarat Titans vs Chennai Super Kings — IPL 2026, Match 66, Narendra Modi Stadium",
  "innings": "2nd",
  "battingTeam": "Chennai Super Kings",
  "bowlingTeam": "Gujarat Titans",
  "target": 199,
  "score": "162/4",
  "overs": "16.4",
  "currentRunRate": 9.72,
  "requiredRunRate": 11.10,
  "runsNeeded": 37,
  "ballsRemaining": 20,
  "lastEvent": "WICKET — Ruturaj Gaikwad c deep midwicket b Rashid Khan 58(34)",
  "currentBatters": [
    { "name": "MS Dhoni", "runs": 12, "balls": 7, "strikeRate": 171.4 },
    { "name": "Ravindra Jadeja", "runs": 28, "balls": 19, "strikeRate": 147.4 }
  ],
  "currentBowler": { "name": "Rashid Khan", "overs": "3.4", "runs": 31, "wickets": 2, "economy": 8.45 },
  "lastFiveOvers": [9, 14, 7, 18, 11],
  "partnership": "9 (5)"
}
```

---

## 4. Gemini text call (Node backend)

```js
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function analyzeMatch(matchState) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `${SYSTEM_PROMPT}\n\nMATCH STATE:\n${JSON.stringify(matchState, null, 2)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
      temperature: 0.7
    }
  });
  return JSON.parse(response.text); // -> { momentumShift, tacticalAdvice, hypeCommentary }
}
```

Route logic — **mock is primary**:

```js
app.post("/api/scan", async (req, res) => {
  let matchState;
  try {
    // OPTIONAL flex: only attempt live if you've decided to, with a short timeout
    matchState = await fetchLiveWithTimeout(2500);
  } catch {
    matchState = require("./mockMatchData.json"); // never breaks on stage
  }
  const insights = await analyzeMatch(matchState);
  res.json({ matchState, insights });
});
```

---

## 5. Gemini vision call (the closer)

```js
export async function analyzeScorecardImage(base64Image, mimeType = "image/jpeg") {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{
      parts: [
        { inlineData: { mimeType, data: base64Image } },
        { text: `${SYSTEM_PROMPT}\n\nFirst read the match state directly from this scorecard image, then produce the analysis.` }
      ]
    }],
    config: { responseMimeType: "application/json", responseSchema: schema, temperature: 0.7 }
  });
  return JSON.parse(response.text);
}
```

Frontend sends `file` → `FileReader.readAsDataURL` → strip the `data:...;base64,`
prefix → POST the base64 string.

---

## 6. 60-second demo script

1. **(10s) Problem.** Show the raw stats blob on screen. "Fans drown in numbers and have no idea what they mean."
2. **(15s) Scan.** Hit *Trigger AI Strategy Scan* → loader console runs → 3 cards populate. "One tap. Gemini turns telemetry into an insider's tactical read."
3. **(20s) Closer.** Upload a photo of a *different* scorecard → it reads and analyses cold. "It's not wired to one feed — point it at anything on screen."
4. **(15s) Defensibility.** "The moat isn't the model — it's the structured sports-data layer feeding it and the agentic reasoning on top." If asked about accuracy: "It's tactical interpretation, not a validated prediction model."

**Deploy to Vercel and run the full demo once on the live URL — never demo from localhost.** Keep a screen recording as the ultimate fallback.