// Bharat Virasat XR — tiny API proxy.
// Keeps the Gemini API key on the server; the browser only ever talks to /api/*.
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import { gemini, geminiImage } from './gemini.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = Number(process.env.PORT || 8787)
const app = express()

app.use(cors())
app.use(express.json({ limit: '8mb' }))

// --- very small in-memory rate limiter (per IP, per minute) -----------------
const hits = new Map()
app.use('/api', (req, res, next) => {
  const key = req.ip || 'unknown'
  const now = Date.now()
  const entry = hits.get(key) || { count: 0, reset: now + 60_000 }
  if (now > entry.reset) {
    entry.count = 0
    entry.reset = now + 60_000
  }
  entry.count += 1
  hits.set(key, entry)
  if (entry.count > 40) return res.status(429).json({ error: 'Too many requests, slow down.' })
  next()
})

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    hasKey: Boolean(process.env.GEMINI_API_KEY),
    textModel: process.env.GEMINI_TEXT_MODEL || 'gemini-3.8-flash',
    imageModel: process.env.GEMINI_IMAGE_MODEL || 'gemini-3.1-flash-image',
  })
})

// --- /api/identify : camera frame -> which monument is this? -----------------
app.post('/api/identify', async (req, res) => {
  try {
    const { image, mime = 'image/jpeg', lat, lng, catalog = [], lang = 'en' } = req.body || {}
    if (!image || typeof image !== 'string') return res.status(400).json({ error: 'image (base64) is required' })

    const catalogText = catalog
      .map((m) => `- id="${m.id}" | ${m.name} (${m.city}, ${m.state}) | cues: ${(m.keywords || []).join(', ')}`)
      .join('\n')

    const locationHint =
      typeof lat === 'number' && typeof lng === 'number'
        ? `The photo was taken near latitude ${lat.toFixed(4)}, longitude ${lng.toFixed(4)}. Use this as a strong hint.`
        : 'No GPS location is available.'

    const prompt = `You are an expert on Indian heritage architecture. Look at the photo and identify the Indian monument.

Known catalog (prefer one of these ids if the photo matches it or a nearby structure in the same complex):
${catalogText}

${locationHint}

Rules:
- If the photo matches a catalog entry, set matchId to that id.
- If it is a real Indian monument that is NOT in the catalog, set matchId to null but fill name/description.
- If no monument is visible (e.g. a face, a room, a street), set matchId null, name "unknown", confidence 0.
- description: 2 short sentences for a tourist, in ${lang === 'hi' ? 'Hindi (Devanagari)' : 'English'}.
- alternatives: up to 3 other catalog ids it could plausibly be, most likely first.`

    const schema = {
      type: 'OBJECT',
      properties: {
        matchId: { type: 'STRING', nullable: true },
        name: { type: 'STRING' },
        confidence: { type: 'NUMBER' },
        description: { type: 'STRING' },
        alternatives: { type: 'ARRAY', items: { type: 'STRING' } },
      },
      required: ['name', 'confidence', 'description', 'alternatives'],
    }

    const text = await gemini({
      contents: [{ role: 'user', parts: [{ text: prompt }, { inline_data: { mime_type: mime, data: image } }] }],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: schema,
        temperature: 0.2,
        // recognition doesn't need long reasoning; keep latency low on the phone
        thinkingConfig: { thinkingBudget: 0 },
      },
    })
    const parsed = safeJson(text)
    if (!parsed) return res.status(502).json({ error: 'Model returned non-JSON', raw: text })
    const ids = new Set(catalog.map((m) => m.id))
    if (parsed.matchId && !ids.has(parsed.matchId)) parsed.matchId = null
    parsed.alternatives = (parsed.alternatives || []).filter((id) => ids.has(id) && id !== parsed.matchId)
    res.json(parsed)
  } catch (err) {
    console.error('[identify]', err)
    res.status(500).json({ error: String(err.message || err) })
  }
})

// --- /api/ask : grounded Q&A about one monument ------------------------------
app.post('/api/ask', async (req, res) => {
  try {
    const { question, context, history = [], lang = 'en' } = req.body || {}
    if (!question) return res.status(400).json({ error: 'question is required' })
    const system = `You are "Virasat Guide", a friendly historian-guide inside an AR app about Indian monuments.
Answer in ${lang === 'hi' ? 'Hindi (Devanagari script)' : 'English'}, in at most 120 words, warm and precise.
Ground your answer in the facts below; if you add general historical knowledge, keep it accurate and say when something is a legend or disputed. Never invent dates.

MONUMENT FACTS:
${context || '(none)'}`

    const contents = [
      ...history.slice(-8).map((h) => ({ role: h.role === 'model' ? 'model' : 'user', parts: [{ text: String(h.text) }] })),
      { role: 'user', parts: [{ text: question }] },
    ]
    const answer = await gemini({
      systemInstruction: { parts: [{ text: system }] },
      contents,
      generationConfig: { temperature: 0.6, maxOutputTokens: 2048 },
    })
    res.json({ answer })
  } catch (err) {
    console.error('[ask]', err)
    res.status(500).json({ error: String(err.message || err) })
  }
})

// --- /api/reimagine : AI artistic impression of the monument in the past -----
app.post('/api/reimagine', async (req, res) => {
  try {
    const { name, year, style, description, thenLabel } = req.body || {}
    if (!name) return res.status(400).json({ error: 'name is required' })
    const prompt = `A photorealistic wide-angle painting of ${name} in India as it looked around ${year} CE, fully intact and in its original glory. ${thenLabel || ''}
Architecture: ${style || ''}. Context: ${description || ''}.
Golden-hour light, people in period clothing in the distance for scale, no text, no watermark, no modern objects.`
    const img = await geminiImage(prompt)
    if (!img) return res.status(502).json({ error: 'No image returned by the model' })
    res.json({ image: `data:${img.mimeType};base64,${img.data}` })
  } catch (err) {
    console.error('[reimagine]', err.message)
    if (err.status === 429 && /quota/i.test(String(err.message))) {
      return res.status(429).json({
        error:
          'Image generation is not enabled for this API key (free-tier quota is 0 for image models). Enable billing on the Gemini key to use this feature — the 3D Then/Now reconstruction works without it.',
      })
    }
    res.status(500).json({ error: String(err.message || err) })
  }
})

// --- static hosting for production builds -----------------------------------
const dist = path.join(__dirname, '..', 'dist')
if (fs.existsSync(dist)) {
  app.use(express.static(dist))
  app.get(/^(?!\/api).*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')))
}

app.listen(PORT, () => {
  console.log(`[server] Bharat Virasat API listening on http://localhost:${PORT}`)
  if (!process.env.GEMINI_API_KEY) console.warn('[server] GEMINI_API_KEY missing — copy .env.example to .env')
})

function safeJson(text) {
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    const m = text.match(/\{[\s\S]*\}/)
    if (!m) return null
    try {
      return JSON.parse(m[0])
    } catch {
      return null
    }
  }
}
