// Official @google/genai SDK integration with Gemma 4 and fallback chain.
import { GoogleGenAI } from '@google/genai'

function getAI() {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured on the server')
  return new GoogleGenAI({ apiKey })
}

/** Models that recently failed are skipped for a short while so users don't wait on serial retries. */
const cooldownUntil = new Map()
const COOLDOWN_MS = { 503: 90_000, 429: 60_000, 500: 30_000, 404: 24 * 3600_000, 400: 24 * 3600_000 }

/** Try the configured model first; fall back to alternates when a model is unavailable. */
async function withModelFallback(models, execute) {
  let lastErr
  const now = Date.now()
  const ordered = [
    ...models.filter((m) => (cooldownUntil.get(m) || 0) <= now),
    ...models.filter((m) => (cooldownUntil.get(m) || 0) > now),
  ]
  for (const m of ordered) {
    try {
      const out = await execute(m)
      cooldownUntil.delete(m)
      return out
    } catch (e) {
      lastErr = e
      const status = e.status || (e.message?.includes('429') ? 429 : e.message?.includes('503') ? 503 : 500)
      if (status in COOLDOWN_MS) {
        cooldownUntil.set(m, Date.now() + COOLDOWN_MS[status])
        console.warn(`[genai] ${m} failed (${status}): ${e.message} — trying next model`)
        continue
      }
      throw e
    }
  }
  throw lastErr
}

/**
 * Text and multimodal generation using official @google/genai SDK.
 * Defaults to Google Gemma (gemma-4-26b-a4b-it) or GEMMA_MODEL env var.
 */
export async function gemini(params) {
  const ai = getAI()
  const primary = process.env.GEMMA_MODEL || process.env.GEMINI_TEXT_MODEL || 'gemma-4-26b-a4b-it'
  const models = [
    ...new Set([
      primary,
      'gemma-4-26b-a4b-it',
      'gemini-2.5-flash',
      'gemini-2.5-flash-lite',
      'gemini-1.5-flash',
      'gemini-flash-latest',
    ]),
  ]

  let contents = params.contents
  if (Array.isArray(contents)) {
    contents = contents.map((c) => {
      if (typeof c === 'string') return c
      const parts = (c.parts || []).map((p) => {
        if (p.inline_data) {
          return { inlineData: { mimeType: p.inline_data.mime_type, data: p.inline_data.data } }
        }
        return p
      })
      return { role: c.role || 'user', parts }
    })
  }

  const rawConfig = params.config || params.generationConfig || {}
  const config = { ...rawConfig }
  if (params.systemInstruction) {
    config.systemInstruction =
      typeof params.systemInstruction === 'string'
        ? params.systemInstruction
        : params.systemInstruction.parts?.[0]?.text || params.systemInstruction
  }

  const response = await withModelFallback(models, async (model) => {
    return await ai.models.generateContent({
      model,
      contents,
      ...(Object.keys(config).length > 0 ? { config } : {}),
    })
  })

  return response.text || ''
}

/** Returns { mimeType, data } (base64) of the first image part, or null. */
export async function geminiImage(prompt) {
  const ai = getAI()
  const primary = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image'
  const models = [...new Set([primary, 'gemini-3.1-flash-image', 'imagen-3.0-generate-002'])]

  return await withModelFallback(models, async (model) => {
    const res = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { responseModalities: ['IMAGE', 'TEXT'] },
    })
    const candidates = res.candidates || []
    for (const c of candidates) {
      for (const p of c.content?.parts || []) {
        if (p.inlineData) {
          return { mimeType: p.inlineData.mimeType || 'image/png', data: p.inlineData.data }
        }
      }
    }
    return null
  })
}
