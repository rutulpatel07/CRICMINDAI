import express from 'express';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();

let aiInstance = null;
const getAI = () => {
  if (!aiInstance) aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return aiInstance;
};

const SYSTEM_PROMPT = `You are CricMind, an elite cricket tactical analyst and broadcast commentator.
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
  bowls out" is strong.`;

const SCHEMA = {
  type: 'OBJECT',
  properties: {
    momentumShift:  { type: 'STRING' },
    tacticalAdvice: { type: 'STRING' },
    hypeCommentary: { type: 'STRING' }
  },
  propertyOrdering: ['momentumShift', 'tacticalAdvice', 'hypeCommentary'],
  required: ['momentumShift', 'tacticalAdvice', 'hypeCommentary']
};

function readLiveScore() {
  const filePath = path.join(process.cwd(), 'livescore.json');
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

async function analyzeMatch(matchState) {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `${SYSTEM_PROMPT}\n\nMATCH STATE:\n${JSON.stringify(matchState, null, 2)}`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: SCHEMA,
      temperature: 0.7
    }
  });
  return JSON.parse(response.text);
}

async function analyzeScorecardImage(base64Image, mimeType = 'image/jpeg') {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{
      parts: [
        { inlineData: { mimeType, data: base64Image } },
        { text: `${SYSTEM_PROMPT}\n\nFirst read the match state directly from this scorecard image, then produce the analysis.` }
      ]
    }],
    config: {
      responseMimeType: 'application/json',
      responseSchema: SCHEMA,
      temperature: 0.7
    }
  });
  return JSON.parse(response.text);
}

// GET /api/livescore — serves the manually updated livescore.json
router.get('/livescore', (req, res) => {
  try {
    const data = readLiveScore();
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: 'livescore.json not found or invalid.' });
  }
});

// POST /api/scan — reads livescore.json + calls Gemini
router.post('/scan', async (req, res) => {
  let matchState;
  try {
    matchState = readLiveScore();
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Cannot read livescore.json: ' + err.message });
  }

  try {
    const insights = await analyzeMatch(matchState);
    return res.json({ matchState, insights, dataSource: 'livescore' });
  } catch (err) {
    console.error('Gemini error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/scan-image — vision analysis from uploaded scorecard
router.post('/scan-image', async (req, res) => {
  const { base64Image, mimeType } = req.body;
  if (!base64Image) return res.status(400).json({ success: false, error: 'base64Image required' });

  try {
    const insights = await analyzeScorecardImage(base64Image, mimeType || 'image/jpeg');
    return res.json({ insights, dataSource: 'vision' });
  } catch (err) {
    console.error('Gemini vision error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/chat — fan asks a free-form question about the live match
router.post('/chat', async (req, res) => {
  const { question } = req.body;
  if (!question?.trim()) return res.status(400).json({ success: false, error: 'question required' });

  let matchState;
  try {
    matchState = readLiveScore();
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Cannot read livescore.json' });
  }

  const prompt = `You are CricMind, an elite cricket tactical analyst with the energy of a top IPL broadcast commentator.

A fan is watching the live match and has a question. Answer in 2-3 sentences max:
- Be specific — use the ACTUAL numbers from the match data provided
- Keep energy high, like you are live on air
- Never invent stats not present in the data
- If asking about prediction, give a direct, honest read based on the numbers

LIVE MATCH STATE:
${JSON.stringify(matchState, null, 2)}

FAN ASKS: ${question.trim()}`;

  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: { temperature: 0.8 }
    });
    return res.json({ answer: response.text.trim(), success: true });
  } catch (err) {
    console.error('Chat error:', err.message);
    return res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
