export type Vec3 = [number, number, number]

/**
 * Declarative procedural 3D "parts". Every part's origin is its BOTTOM-CENTER,
 * so parts can be stacked by adding heights. Units are approximate metres.
 */
export type PartBase = {
  /** position of the part's bottom-center */
  p?: Vec3
  /** rotation around Y axis in degrees */
  ry?: number
  color?: string
  /** free-form label used by tooltips */
  label?: string
}

export type PartSpec =
  | { type: 'plinth'; w: number; d: number; h: number; steps?: number }
  | { type: 'box'; w: number; h: number; d: number }
  | { type: 'cylinder'; r: number; h: number; rTop?: number; segments?: number }
  | { type: 'shikhara'; r: number; h: number; ribs?: number }
  | { type: 'pyramid'; w: number; d: number; h: number; tiers?: number }
  | { type: 'dome'; r: number; onion?: boolean; finial?: boolean }
  | { type: 'minaret'; r: number; h: number; balconies?: number; taper?: number; cupola?: boolean }
  | { type: 'hall'; w: number; d: number; h: number; cols: number; rows: number; roof?: boolean; broken?: number; seed?: number }
  | { type: 'colonnade'; length: number; h: number; count: number; roof?: boolean; broken?: number; seed?: number }
  | { type: 'wheel'; r: number; spokes?: number }
  | { type: 'stupa'; r: number; railing?: boolean; chhatra?: boolean }
  | { type: 'gopuram'; w: number; d: number; h: number; tiers?: number }
  | { type: 'chhatri'; r: number; h: number }
  | { type: 'archwall'; w: number; h: number; d: number; arches: number }
  | { type: 'rubble'; r: number; count: number; seed?: number; size?: number }
  | { type: 'water'; w: number; d: number }
  | { type: 'wall'; w: number; h: number; d: number; crenels?: boolean }
  | { type: 'tower'; r: number; h: number; crenels?: boolean }
  | { type: 'stairs'; w: number; h: number; d: number; steps: number }
  | { type: 'tree'; h: number; r: number }
  | { type: 'torana'; w: number; h: number }
  | { type: 'pillar'; r: number; h: number; broken?: boolean; capital?: boolean }

export type Part = PartSpec & PartBase

export type MonumentStatus = 'intact' | 'ruined' | 'partially-destroyed' | 'destroyed' | 'rebuilt' | 'lost'

export type ConfidenceLevel = 'documented' | 'inferred' | 'speculative'

export interface SourceCitation {
  title: string
  institution?: string
  year?: string
  url?: string
  note?: string
}

export interface TimelineEvent {
  year: string
  event: string
  kind?: 'build' | 'destroy' | 'restore' | 'other'
}

export interface Monument {
  id: string
  name: string
  nameHi: string
  nameTa?: string
  nameBn?: string
  nameKn?: string
  city: string
  state: string
  lat: number
  lng: number
  built: string
  builder: string
  style: string
  status: MonumentStatus
  confidence?: ConfidenceLevel
  confidenceRationale?: string
  sources?: SourceCitation[]
  reconstruction?: {
    model_path: string
    confidence: ConfidenceLevel
    evidence_notes: string
    reviewer: string
    review_date: string
  }
  glbModelPath?: string
  scholarReviewStatus?: 'needs_review' | 'verified' | 'peer_reviewed'
  fileSizeMb?: number
  unesco?: boolean
  /** Short, one-paragraph summary */
  summary: string
  summaryHi: string
  summaryKn?: string
  /** What was lost and why — the "destruction story" */
  whatHappened: string
  whatHappenedHi: string
  timeline: TimelineEvent[]
  facts: string[]
  /** Label for the "Then" reconstruction, e.g. "c. 1300 CE — original form" */
  thenLabel: string
  thenYear: string
  /** Label for the "Now" state */
  nowLabel: string
  then: Part[]
  now: Part[]
  /** approx. half-extent of the model in metres, used for camera framing & AR scaling */
  footprint: number
  /** Visual keywords that help identification prompts */
  keywords: string[]
  /** Hex accent colour for cards */
  accent: string
  /** Emoji used as a lightweight icon */
  emoji: string
}
