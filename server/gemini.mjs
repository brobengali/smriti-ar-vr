// Minimal Gemini REST client (no SDK) with model fallback.
const BASE = 'https://generativelanguage.googleapis.com/v1beta/models'

function key() {
  const k = process.env.GEMINI_API_KEY
  if (!k) throw new Error('GEMINI_API_KEY is not configured on the server')
  return k
}

async function callModel(model, body) {
  const res = await fetch(`${BASE}/${model}:generateContent`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-goog-api-key': key() },
    body: JSON.stringify(body),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = json?.error?.message || `${res.status} ${res.statusText}`
    const e = new Error(msg)
    e.status = res.status
    throw e
  }
  return json
}

/** Models that recently failed are skipped for a short while so users don't wait on serial retries. */
const cooldownUntil = new Map()
const COOLDOWN_MS = { 503: 90_000, 429: 60_000, 500: 30_000, 404: 24 * 3600_000, 400: 24 * 3600_000 }

/** Try the configured model first; fall back to alternates when a model is unavailable. */
async function withFallback(models, body) {
  let lastErr
  const now = Date.now()
  const ordered = [...models.filter((m) => (cooldownUntil.get(m) || 0) <= now), ...models.filter((m) => (cooldownUntil.get(m) || 0) > now)]
  for (const m of ordered) {
    try {
      const out = await callModel(m, body)
      cooldownUntil.delete(m)
      return out
    } catch (e) {
      lastErr = e
      // model missing / not available to this key / overloaded -> try the next model
      if (e.status in COOLDOWN_MS) {
        cooldownUntil.set(m, Date.now() + COOLDOWN_MS[e.status])
        console.warn(`[gemini] ${m} failed (${e.status}): ${e.message} — trying next model`)
        continue
      }
      throw e
    }
  }
  throw lastErr
}

function extractText(json) {
  const parts = json?.candidates?.[0]?.content?.parts || []
  return parts
    .filter((p) => typeof p.text === 'string')
    .map((p) => p.text)
    .join('')
    .trim()
}

export async function gemini(body) {
  const primary = process.env.GEMINI_TEXT_MODEL || 'gemini-3.8-flash'
  const models = [
    ...new Set([
      primary,
      'gemini-flash-latest',
      'gemini-3.7-flash',
      'gemini-3.6-flash',
      'gemini-3.5-flash',
      'gemini-3.5-flash-lite',
      'gemini-3.1-flash-lite',
      'gemini-2.5-flash-lite',
    ]),
  ]
  const json = await withFallback(models, body)
  return extractText(json)
}

/** Returns { mimeType, data } (base64) of the first image part, or null. */
export async function geminiImage(prompt) {
  const primary = process.env.GEMINI_IMAGE_MODEL || 'gemini-3.1-flash-image'
  const models = [...new Set([primary, 'gemini-3.1-flash-lite-image', 'gemini-2.5-flash-image', 'gemini-3-pro-image'])]
  const json = await withFallback(models, {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
  })
  const parts = json?.candidates?.[0]?.content?.parts || []
  const img = parts.find((p) => p.inlineData || p.inline_data)
  if (!img) return null
  const d = img.inlineData || img.inline_data
  return { mimeType: d.mimeType || d.mime_type || 'image/png', data: d.data }
}
