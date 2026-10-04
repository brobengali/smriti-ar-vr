import * as THREE from 'three'

/** Deterministic PRNG (mulberry32) so ruins look identical on every render / device. */
export function rng(seed: number): () => number {
  let a = (seed * 1_000_003 + 12345) >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Rectangular frustum (tapered box). Origin at bottom-center. */
export function frustumGeometry(wb: number, db: number, wt: number, dt: number, h: number): THREE.BufferGeometry {
  const hb = [wb / 2, db / 2]
  const ht = [wt / 2, dt / 2]
  const b0 = [-hb[0], 0, -hb[1]],
    b1 = [hb[0], 0, -hb[1]],
    b2 = [hb[0], 0, hb[1]],
    b3 = [-hb[0], 0, hb[1]]
  const t0 = [-ht[0], h, -ht[1]],
    t1 = [ht[0], h, -ht[1]],
    t2 = [ht[0], h, ht[1]],
    t3 = [-ht[0], h, ht[1]]
  const quads = [
    [b3, b2, t2, t3],
    [b1, b0, t0, t1],
    [b0, b3, t3, t0],
    [b2, b1, t1, t2],
    [t3, t2, t1, t0],
    [b0, b1, b2, b3],
  ]
  const pos: number[] = []
  for (const [a, b, c, d] of quads) {
    pos.push(...a, ...b, ...c, ...a, ...c, ...d)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.computeVertexNormals()
  return g
}

/** Curvilinear nagara tower profile (lathe). Origin at bottom-center. */
export function shikharaGeometry(r: number, h: number, ribs = 48): THREE.BufferGeometry {
  const pts: THREE.Vector2[] = []
  const N = 28
  for (let i = 0; i <= N; i++) {
    const t = i / N
    // rekha deul: full base, gentle curve, sharp pinch near crown
    const body = Math.pow(1 - Math.pow(t, 1.75), 0.72)
    const shoulder = 1 + 0.04 * Math.sin(t * Math.PI * 3.2)
    const x = Math.max(0.03 * r, r * body * shoulder)
    pts.push(new THREE.Vector2(x, t * h))
  }
  pts.push(new THREE.Vector2(0.001, h))
  const g = new THREE.LatheGeometry(pts, Math.max(24, ribs))
  g.computeVertexNormals()
  return g
}

/** Mughal / Indo-Islamic onion dome (lathe). Origin at bottom-center of bulb. */
export function onionDomeGeometry(r: number, segments = 48): THREE.BufferGeometry {
  const pts: THREE.Vector2[] = []
  const N = 24
  for (let i = 0; i <= N; i++) {
    const t = i / N
    // bulbous lower third, then taper to a pointed tip
    const bulge = Math.sin(t * Math.PI) * 1.05
    const taper = Math.pow(1 - t, 0.55)
    const x = Math.max(0.01, r * (0.55 * bulge + 0.45 * taper) * (t < 0.08 ? t / 0.08 : 1))
    pts.push(new THREE.Vector2(x, t * r * 1.35))
  }
  pts.push(new THREE.Vector2(0.001, r * 1.35))
  const g = new THREE.LatheGeometry(pts, segments)
  g.computeVertexNormals()
  return g
}

/** Smooth hemisphere dome with slight pointed tip feel. */
export function domeGeometry(r: number, segments = 48): THREE.BufferGeometry {
  const pts: THREE.Vector2[] = []
  const N = 20
  for (let i = 0; i <= N; i++) {
    const t = i / N
    const ang = t * (Math.PI / 2)
    const x = Math.max(0.01, r * Math.cos(ang) * (1 - 0.08 * t))
    pts.push(new THREE.Vector2(x, r * Math.sin(ang) * 1.02))
  }
  pts.push(new THREE.Vector2(0.001, r * 1.05))
  const g = new THREE.LatheGeometry(pts, segments)
  g.computeVertexNormals()
  return g
}

/** Fluted column shaft (lathe). Origin at bottom-center. */
export function columnShaftGeometry(r: number, h: number, flutes = 16): THREE.BufferGeometry {
  const pts: THREE.Vector2[] = [
    new THREE.Vector2(r * 1.15, 0),
    new THREE.Vector2(r * 1.05, h * 0.04),
    new THREE.Vector2(r, h * 0.08),
    new THREE.Vector2(r * 0.92, h * 0.92),
    new THREE.Vector2(r * 0.98, h * 0.96),
    new THREE.Vector2(r * 1.08, h),
  ]
  const g = new THREE.LatheGeometry(pts, Math.max(16, flutes * 2))
  g.computeVertexNormals()
  return g
}

/** Wall with semicircular arched openings, extruded with a light bevel. Origin at bottom-center. */
export function archWallGeometry(w: number, h: number, d: number, arches: number): THREE.BufferGeometry {
  const shape = new THREE.Shape()
  shape.moveTo(-w / 2, 0)
  shape.lineTo(w / 2, 0)
  shape.lineTo(w / 2, h)
  shape.lineTo(-w / 2, h)
  shape.closePath()
  const n = Math.max(1, Math.floor(arches))
  const pitch = w / n
  const aw = Math.min(pitch * 0.62, h * 0.9)
  const ah = Math.min(h * 0.72, h - 0.3)
  for (let i = 0; i < n; i++) {
    const cx = -w / 2 + pitch * (i + 0.5)
    const hole = new THREE.Path()
    const rad = aw / 2
    const straight = Math.max(0.01, ah - rad)
    hole.moveTo(cx - rad, 0)
    hole.lineTo(cx - rad, straight)
    hole.absarc(cx, straight, rad, Math.PI, 0, true)
    hole.lineTo(cx + rad, 0)
    hole.closePath()
    shape.holes.push(hole)
  }
  const bevel = Math.min(0.12, d * 0.12)
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: d,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel * 0.6,
    bevelSegments: 2,
    curveSegments: 18,
  })
  g.translate(0, 0, -d / 2)
  g.computeVertexNormals()
  return g
}

/** Rounded box via BoxGeometry + slightly higher segments feeling from bevelled edges (manual). */
export function beveledBoxGeometry(w: number, h: number, d: number, bevel = 0.08): THREE.BufferGeometry {
  const b = Math.min(bevel, w * 0.15, h * 0.15, d * 0.15)
  // Use ExtrudeGeometry of a rounded rectangle for soft edges on the top face feel
  const hw = w / 2 - b
  const hd = d / 2 - b
  const shape = new THREE.Shape()
  shape.moveTo(-hw, -hd)
  shape.lineTo(hw, -hd)
  shape.lineTo(hw, hd)
  shape.lineTo(-hw, hd)
  shape.closePath()
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: h,
    bevelEnabled: true,
    bevelThickness: b,
    bevelSize: b,
    bevelSegments: 2,
    curveSegments: 4,
  })
  g.rotateX(-Math.PI / 2)
  g.translate(0, 0, 0)
  // Extrude along Y after rotate: origin at bottom
  g.computeBoundingBox()
  const bb = g.boundingBox!
  g.translate(0, -bb.min.y, 0)
  g.computeVertexNormals()
  return g
}
