import { createContext, useContext, useMemo } from 'react'
import * as THREE from 'three'

/** Global fade for a whole "Then" or "Now" group (used for the time-slider crossfade). */
export const FadeContext = createContext(1)

type SurfaceKind = 'stone' | 'marble' | 'brick' | 'rubble' | 'metal' | 'water' | 'foliage' | 'wood'

const textureCache = new Map<string, THREE.CanvasTexture>()

function hash(n: number) {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453
  return x - Math.floor(x)
}

/** Lightweight procedural albedo — stone grain / marble veins / brick — cached per key. */
function makeSurfaceTexture(kind: SurfaceKind, hex: string, size = 256): THREE.CanvasTexture {
  const key = `v2:${kind}:${hex}:${size}`
  const hit = textureCache.get(key)
  if (hit) return hit

  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const base = new THREE.Color(hex)
  ctx.fillStyle = `#${base.getHexString()}`
  ctx.fillRect(0, 0, size, size)

  const img = ctx.getImageData(0, 0, size, size)
  const d = img.data

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4
      const n1 = hash(x * 0.07 + y * 0.11)
      const n2 = hash(x * 0.31 + y * 0.17 + 9)
      const n3 = hash(x * 0.03 + y * 0.05 + 21)
      let shade = 0

      if (kind === 'marble') {
        const vein = Math.abs(Math.sin((x + y * 0.6) * 0.045 + n3 * 4))
        shade = (n1 - 0.5) * 28 + (1 - Math.pow(vein, 0.35)) * -55
      } else if (kind === 'brick') {
        const bx = ((x / size) * 8) % 1
        const by = ((y / size) * 12) % 1
        const mortar = bx < 0.08 || by < 0.1 ? -40 : 0
        shade = (n1 - 0.5) * 36 + mortar
      } else if (kind === 'rubble') {
        shade = (n1 - 0.5) * 70 + (n2 - 0.5) * 40
      } else if (kind === 'foliage') {
        shade = (n1 - 0.5) * 50 + (n2 - 0.5) * 25
      } else if (kind === 'wood') {
        const ring = Math.sin(x * 0.08 + n2 * 2) * 18
        shade = (n1 - 0.5) * 22 + ring
      } else {
        // sandstone / stone grain — stronger so it reads at monument scale
        shade = (n1 - 0.5) * 58 + (n2 - 0.5) * 28 + (n3 - 0.5) * 16
      }

      d[i] = THREE.MathUtils.clamp(d[i] + shade, 0, 255)
      d[i + 1] = THREE.MathUtils.clamp(d[i + 1] + shade * 0.92, 0, 255)
      d[i + 2] = THREE.MathUtils.clamp(d[i + 2] + shade * 0.85, 0, 255)
    }
  }
  ctx.putImageData(img, 0, 0)

  // ashlar block lines for large stone faces
  if (kind === 'stone') {
    ctx.strokeStyle = 'rgba(40,20,8,0.18)'
    ctx.lineWidth = 1.25
    for (let i = 1; i < 8; i++) {
      const p = (i / 8) * size
      ctx.beginPath()
      ctx.moveTo(0, p)
      ctx.lineTo(size, p)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(p, 0)
      ctx.lineTo(p, size)
      ctx.stroke()
    }
  }

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.anisotropy = 4
  tex.needsUpdate = true
  textureCache.set(key, tex)
  return tex
}

function classify(hex: string, hint?: SurfaceKind): SurfaceKind {
  if (hint) return hint
  const c = new THREE.Color(hex)
  const { r, g, b } = c
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
  // pale → marble; green → foliage; blue → water; dark brown → wood; red-orange → brick
  if (b > r * 1.15 && b > g * 1.05) return 'water'
  if (g > r * 1.15 && g > b) return 'foliage'
  if (lum > 0.78 && Math.abs(r - g) < 0.08) return 'marble'
  if (r > 0.45 && r > g * 1.15 && g > b) return 'brick'
  if (lum < 0.28 && r > g) return 'wood'
  return 'stone'
}

export function Mat({
  color,
  roughness,
  metalness,
  alpha = 1,
  kind,
  repeat = 2,
}: {
  color: string
  roughness?: number
  metalness?: number
  alpha?: number
  kind?: SurfaceKind
  repeat?: number
}) {
  const fade = useContext(FadeContext)
  const opacity = fade * alpha
  const surface = classify(color, kind)

  const { map, envMapIntensity, rough, metal } = useMemo(() => {
    if (surface === 'water' || surface === 'metal') {
      return {
        map: null as THREE.CanvasTexture | null,
        envMapIntensity: surface === 'water' ? 1.4 : 1.1,
        rough: roughness ?? (surface === 'water' ? 0.12 : 0.35),
        metal: metalness ?? (surface === 'water' ? 0.55 : 0.65),
      }
    }
    const tex = makeSurfaceTexture(surface, color)
    const cloned = tex.clone()
    cloned.repeat.set(repeat, repeat)
    cloned.needsUpdate = true
    return {
      map: cloned,
      envMapIntensity: surface === 'marble' ? 0.55 : 0.28,
      rough: roughness ?? (surface === 'marble' ? 0.35 : surface === 'rubble' ? 0.95 : 0.78),
      metal: metalness ?? (surface === 'marble' ? 0.08 : 0.04),
    }
  }, [color, surface, roughness, metalness, repeat])

  return (
    <meshStandardMaterial
      color={map ? '#ffffff' : color}
      map={map ?? undefined}
      roughness={rough}
      metalness={metal}
      envMapIntensity={envMapIntensity}
      transparent={opacity < 0.99}
      opacity={opacity}
      depthWrite={opacity > 0.45}
      flatShading={false}
    />
  )
}
