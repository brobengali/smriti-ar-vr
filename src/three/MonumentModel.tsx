import { useMemo } from 'react'
import type { Monument } from '../data/types'
import { FadeContext, PartNode } from './parts'

export interface MonumentModelProps {
  monument: Monument
  /** 0 = "Then" (historical), 1 = "Now" (present). Values in between crossfade. */
  blend: number
  /** Uniform scale (model units are approx. metres). */
  scale?: number
}

/**
 * Renders both reconstructions of a monument and crossfades them with the `blend` value.
 * Model origin is the ground centre of the monument.
 */
export function MonumentModel({ monument, blend, scale = 1 }: MonumentModelProps) {
  const thenOpacity = Math.max(0, Math.min(1, 1 - blend))
  const nowOpacity = Math.max(0, Math.min(1, blend))
  const thenNodes = useMemo(() => monument.then.map((p, i) => <PartNode key={i} part={p} />), [monument])
  const nowNodes = useMemo(() => monument.now.map((p, i) => <PartNode key={i} part={p} />), [monument])
  return (
    <group scale={scale}>
      <group visible={thenOpacity > 0.01} renderOrder={1}>
        <FadeContext.Provider value={thenOpacity}>{thenNodes}</FadeContext.Provider>
      </group>
      <group visible={nowOpacity > 0.01} renderOrder={2}>
        <FadeContext.Provider value={nowOpacity}>{nowNodes}</FadeContext.Provider>
      </group>
    </group>
  )
}
