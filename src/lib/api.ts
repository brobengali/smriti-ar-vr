import { monuments } from '../data/monuments'
import type { Monument } from '../data/types'
import type { Lang } from './i18n'

export interface IdentifyResult {
  matchId: string | null
  name: string
  confidence: number
  description: string
  alternatives: string[]
}

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error((json as { error?: string }).error || `${res.status} ${res.statusText}`)
  return json as T
}

const catalog = monuments.map((m) => ({ id: m.id, name: m.name, city: m.city, state: m.state, keywords: m.keywords }))

export function identifyMonument(imageBase64: string, mime: string, lang: Lang, pos?: { lat: number; lng: number }): Promise<IdentifyResult> {
  return post<IdentifyResult>('/api/identify', { image: imageBase64, mime, lang, lat: pos?.lat, lng: pos?.lng, catalog })
}

export function monumentContext(m: Monument): string {
  return [
    `Name: ${m.name} (${m.nameHi}) — ${m.city}, ${m.state}`,
    `Built: ${m.built} by ${m.builder}. Style: ${m.style}. Status today: ${m.status}.`,
    `Summary: ${m.summary}`,
    `What happened: ${m.whatHappened}`,
    `Timeline: ${m.timeline.map((t) => `${t.year}: ${t.event}`).join(' | ')}`,
    `Facts: ${m.facts.join(' | ')}`,
  ].join('\n')
}

export interface ChatTurn {
  role: 'user' | 'model'
  text: string
}

export async function askGuide(m: Monument, question: string, history: ChatTurn[], lang: Lang): Promise<string> {
  const r = await post<{ answer: string }>('/api/ask', { question, history, lang, context: monumentContext(m) })
  return r.answer
}

export async function reimagine(m: Monument): Promise<string> {
  const r = await post<{ image: string }>('/api/reimagine', {
    name: m.name,
    year: m.thenYear,
    style: m.style,
    description: m.summary,
    thenLabel: m.thenLabel,
  })
  return r.image
}

export async function apiHealth(): Promise<{ ok: boolean; hasKey: boolean } | null> {
  try {
    const res = await fetch('/api/health')
    return res.ok ? ((await res.json()) as { ok: boolean; hasKey: boolean }) : null
  } catch {
    return null
  }
}
