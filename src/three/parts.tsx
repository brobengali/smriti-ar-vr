import { useMemo } from 'react'
import * as THREE from 'three'
import type { Part } from '../data/types'
import {
  archWallGeometry,
  columnShaftGeometry,
  domeGeometry,
  frustumGeometry,
  onionDomeGeometry,
  rng,
  shikharaGeometry,
} from './geometry'
import { FadeContext, Mat } from './materials'

export { FadeContext }

const DEFAULT_COLORS: Record<Part['type'], string> = {
  plinth: '#b58a60',
  box: '#c9885a',
  cylinder: '#c9885a',
  shikhara: '#c9885a',
  pyramid: '#b5774a',
  dome: '#efe9df',
  minaret: '#c9885a',
  hall: '#c9885a',
  colonnade: '#c9885a',
  wheel: '#8d7257',
  stupa: '#c9885a',
  gopuram: '#c9885a',
  chhatri: '#efe9df',
  archwall: '#c9885a',
  rubble: '#7e7466',
  water: '#2f6f8f',
  wall: '#c9885a',
  tower: '#c9885a',
  stairs: '#b58a60',
  tree: '#3d7a3a',
  torana: '#b7a58a',
  pillar: '#b7a58a',
}

const SEG = 32
const unitBox = new THREE.BoxGeometry(1, 1, 1)
const unitCyl = new THREE.CylinderGeometry(1, 1, 1, SEG)
const unitSphere = new THREE.SphereGeometry(1, 32, 24)
const unitDodeca = new THREE.DodecahedronGeometry(1, 1)
const unitTorus = new THREE.TorusGeometry(1, 0.11, 14, 48)
const unitPlane = new THREE.PlaneGeometry(1, 1, 1, 1)
const unitCone = new THREE.ConeGeometry(1, 1, 24)

// ---------------------------------------------------------------------------
function Box({ w, h, d, color, y = 0 }: { w: number; h: number; d: number; color: string; y?: number }) {
  return (
    <mesh geometry={unitBox} position={[0, y + h / 2, 0]} scale={[w, h, d]} castShadow receiveShadow>
      <Mat color={color} repeat={Math.max(1, Math.min(w, d) / 4)} />
    </mesh>
  )
}

function Cyl({
  r,
  h,
  rTop = r,
  color,
  y = 0,
  x = 0,
  z = 0,
  segments = SEG,
}: {
  r: number
  h: number
  rTop?: number
  color: string
  y?: number
  x?: number
  z?: number
  segments?: number
}) {
  const geo = useMemo(
    () => (rTop === r ? unitCyl : new THREE.CylinderGeometry(rTop, r, 1, segments)),
    [r, rTop, segments],
  )
  return (
    <mesh
      geometry={geo}
      position={[x, y + h / 2, z]}
      scale={rTop === r ? [r, h, r] : [1, h, 1]}
      castShadow
      receiveShadow
    >
      <Mat color={color} />
    </mesh>
  )
}

function Frustum({
  wb,
  db,
  wt,
  dt,
  h,
  color,
  y = 0,
}: {
  wb: number
  db: number
  wt: number
  dt: number
  h: number
  color: string
  y?: number
}) {
  const geo = useMemo(() => frustumGeometry(wb, db, wt, dt, h), [wb, db, wt, dt, h])
  return (
    <mesh geometry={geo} position={[0, y, 0]} castShadow receiveShadow>
      <Mat color={color} />
    </mesh>
  )
}

function Plinth({ w, d, h, steps = 2, color }: { w: number; d: number; h: number; steps?: number; color: string }) {
  const n = Math.max(1, steps)
  const sh = h / n
  return (
    <group>
      {Array.from({ length: n }, (_, i) => {
        const k = 1 - i * 0.07
        return (
          <group key={i}>
            <Box w={w * k} d={d * k} h={sh * 0.88} y={i * sh} color={color} />
            {/* moulding lip */}
            <Box w={w * k * 1.02} d={d * k * 1.02} h={sh * 0.12} y={i * sh + sh * 0.88} color={color} />
          </group>
        )
      })}
    </group>
  )
}

function Shikhara({ r, h, ribs, color }: { r: number; h: number; ribs?: number; color: string }) {
  const geo = useMemo(() => shikharaGeometry(r, h, ribs ?? 48), [r, h, ribs])
  return (
    <group>
      <mesh geometry={geo} castShadow receiveShadow>
        <Mat color={color} />
      </mesh>
      {/* bhumi rings */}
      {[0.22, 0.42, 0.62, 0.8].map((t, i) => (
        <mesh
          key={i}
          geometry={unitTorus}
          position={[0, h * t, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[r * (1 - t * 0.75) * 0.95, r * (1 - t * 0.75) * 0.95, r * 0.55]}
          castShadow
        >
          <Mat color={color} />
        </mesh>
      ))}
      {/* amalaka */}
      <mesh geometry={unitTorus} position={[0, h, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[r * 0.38, r * 0.38, r * 1.1]} castShadow>
        <Mat color={color} />
      </mesh>
      <mesh geometry={unitSphere} position={[0, h + r * 0.08, 0]} scale={[r * 0.22, r * 0.1, r * 0.22]} castShadow>
        <Mat color={color} />
      </mesh>
      {/* kalasha */}
      <mesh geometry={unitSphere} position={[0, h + r * 0.26, 0]} scale={r * 0.15} castShadow>
        <Mat color="#d9a441" kind="metal" roughness={0.32} metalness={0.7} />
      </mesh>
      <mesh geometry={unitCyl} position={[0, h + r * 0.48, 0]} scale={[r * 0.025, r * 0.32, r * 0.025]} castShadow>
        <Mat color="#d9a441" kind="metal" roughness={0.32} metalness={0.7} />
      </mesh>
      <mesh geometry={unitCone} position={[0, h + r * 0.72, 0]} scale={[r * 0.06, r * 0.18, r * 0.06]} castShadow>
        <Mat color="#d9a441" kind="metal" roughness={0.32} metalness={0.7} />
      </mesh>
    </group>
  )
}

function Pyramid({ w, d, h, tiers = 3, color }: { w: number; d: number; h: number; tiers?: number; color: string }) {
  const n = Math.max(1, tiers)
  const th = h / n
  const s = (x: number) => 1 - 0.82 * Math.min(1, x)
  return (
    <group>
      {Array.from({ length: n }, (_, i) => {
        const sb = s(i / n)
        const st = s((i + 0.72) / n)
        return (
          <group key={i}>
            <Frustum wb={w * sb} db={d * sb} wt={w * st} dt={d * st} h={th * 0.9} y={i * th} color={color} />
            <Box w={w * st * 1.04} d={d * st * 1.04} h={th * 0.1} y={i * th + th * 0.9} color={color} />
          </group>
        )
      })}
      <mesh geometry={unitSphere} position={[0, h + 0.25, 0]} scale={Math.min(w, d) * 0.06 + 0.2} castShadow>
        <Mat color="#d9a441" kind="metal" roughness={0.32} metalness={0.7} />
      </mesh>
    </group>
  )
}

function Dome({ r, onion = false, finial = true, color }: { r: number; onion?: boolean; finial?: boolean; color: string }) {
  const geo = useMemo(() => (onion ? onionDomeGeometry(r) : domeGeometry(r)), [r, onion])
  const tipY = onion ? r * 1.35 : r * 1.05
  return (
    <group>
      {onion && <Cyl r={r * 0.92} h={r * 0.18} color={color} />}
      <mesh geometry={geo} position={[0, onion ? r * 0.18 : 0, 0]} castShadow receiveShadow>
        <Mat color={color} kind="marble" roughness={0.38} metalness={0.1} />
      </mesh>
      {finial && (
        <group position={[0, (onion ? r * 0.18 : 0) + tipY, 0]}>
          <mesh geometry={unitSphere} scale={r * 0.08} castShadow>
            <Mat color="#d9a441" kind="metal" roughness={0.3} metalness={0.75} />
          </mesh>
          <mesh geometry={unitCyl} position={[0, r * 0.18, 0]} scale={[r * 0.025, r * 0.28, r * 0.025]} castShadow>
            <Mat color="#d9a441" kind="metal" roughness={0.3} metalness={0.75} />
          </mesh>
          <mesh geometry={unitCone} position={[0, r * 0.4, 0]} scale={[r * 0.05, r * 0.16, r * 0.05]} castShadow>
            <Mat color="#d9a441" kind="metal" roughness={0.3} metalness={0.75} />
          </mesh>
        </group>
      )}
    </group>
  )
}

function Chhatri({ r, h, color }: { r: number; h: number; color: string }) {
  const o = r * 0.72
  return (
    <group>
      {[-o, o].flatMap((x) =>
        [-o, o].map((z) => (
          <group key={`${x}${z}`} position={[x, 0, z]}>
            <Cyl r={Math.max(0.06, r * 0.1)} h={h} color={color} />
            <Box w={r * 0.22} d={r * 0.22} h={r * 0.08} y={h} color={color} />
          </group>
        )),
      )}
      <Box w={r * 2.05} d={r * 2.05} h={Math.max(0.1, r * 0.14)} y={h} color={color} />
      <group position={[0, h + Math.max(0.1, r * 0.14), 0]}>
        <Dome r={r * 0.88} onion color={color} />
      </group>
    </group>
  )
}

function Minaret({
  r,
  h,
  balconies = 3,
  taper = 0.6,
  cupola = true,
  color,
}: {
  r: number
  h: number
  balconies?: number
  taper?: number
  cupola?: boolean
  color: string
}) {
  const rTop = r * taper
  return (
    <group>
      <Cyl r={r * 1.15} h={r * 0.35} color={color} />
      <Cyl r={r} rTop={rTop} h={h} color={color} segments={40} />
      {Array.from({ length: balconies }, (_, i) => {
        const t = (i + 1) / (balconies + 1)
        const ri = r + (rTop - r) * t
        return (
          <group key={i} position={[0, h * t, 0]}>
            <mesh geometry={unitTorus} rotation={[Math.PI / 2, 0, 0]} scale={[ri * 1.35, ri * 1.35, ri * 1.2]} castShadow>
              <Mat color={color} />
            </mesh>
            <Cyl r={ri * 1.2} h={ri * 0.12} y={-ri * 0.06} color={color} />
          </group>
        )
      })}
      {cupola ? (
        <group position={[0, h, 0]}>
          <Chhatri r={rTop * 1.3} h={rTop * 1.7} color={color} />
        </group>
      ) : (
        <Box w={rTop * 2.2} d={rTop * 2.2} h={rTop * 0.3} y={h} color={color} />
      )}
    </group>
  )
}

function Columns({
  positions,
  h,
  r,
  broken = 0,
  seed = 1,
  color,
}: {
  positions: [number, number][]
  h: number
  r: number
  broken?: number
  seed?: number
  color: string
}) {
  const rand = useMemo(() => rng(seed), [seed])
  const spec = useMemo(
    () =>
      positions.map(([x, z]) => {
        const isBroken = rand() < broken
        const hh = isBroken ? h * (0.15 + rand() * 0.5) : h
        return { x, z, hh, isBroken }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [positions, h, broken, seed],
  )
  const shaft = useMemo(() => columnShaftGeometry(r, 1, 20), [r])
  return (
    <group>
      {spec.map((c, i) => (
        <group key={i} position={[c.x, 0, c.z]}>
          <Box w={r * 2.6} d={r * 2.6} h={r * 0.35} color={color} />
          <mesh geometry={shaft} position={[0, r * 0.35, 0]} scale={[1, c.hh - r * 0.35, 1]} castShadow receiveShadow>
            <Mat color={color} />
          </mesh>
          {!c.isBroken && (
            <>
              <mesh
                geometry={unitTorus}
                position={[0, c.hh, 0]}
                rotation={[Math.PI / 2, 0, 0]}
                scale={[r * 1.15, r * 1.15, r * 1.3]}
                castShadow
              >
                <Mat color={color} />
              </mesh>
              <Box w={r * 2.5} d={r * 2.5} h={r * 0.45} y={c.hh} color={color} />
            </>
          )}
        </group>
      ))}
    </group>
  )
}

function Hall({
  w,
  d,
  h,
  cols,
  rows,
  roof = true,
  broken = 0,
  seed = 1,
  color,
}: {
  w: number
  d: number
  h: number
  cols: number
  rows: number
  roof?: boolean
  broken?: number
  seed?: number
  color: string
}) {
  const positions = useMemo(() => {
    const out: [number, number][] = []
    const nx = Math.max(2, cols)
    const nz = Math.max(2, rows)
    for (let i = 0; i < nx; i++)
      for (let j = 0; j < nz; j++) out.push([-w / 2 + (w / (nx - 1)) * i, -d / 2 + (d / (nz - 1)) * j])
    return out
  }, [w, d, cols, rows])
  const r = THREE.MathUtils.clamp(Math.min(w / cols, d / rows) * 0.13, 0.25, 1.1)
  return (
    <group>
      <Columns positions={positions} h={h} r={r} broken={broken} seed={seed} color={color} />
      {roof && (
        <>
          <Box w={w + r * 3} d={d + r * 3} h={Math.max(0.35, h * 0.08)} y={h + r * 0.5} color={color} />
          <Box w={w + r * 3.4} d={d + r * 3.4} h={Math.max(0.12, h * 0.03)} y={h + r * 0.5 + Math.max(0.35, h * 0.08)} color={color} />
        </>
      )}
    </group>
  )
}

function Colonnade({
  length,
  h,
  count,
  roof = true,
  broken = 0,
  seed = 1,
  color,
}: {
  length: number
  h: number
  count: number
  roof?: boolean
  broken?: number
  seed?: number
  color: string
}) {
  const positions = useMemo(() => {
    const n = Math.max(2, count)
    return Array.from({ length: n }, (_, i): [number, number] => [-length / 2 + (length / (n - 1)) * i, 0])
  }, [length, count])
  const r = THREE.MathUtils.clamp((length / count) * 0.14, 0.2, 0.9)
  return (
    <group>
      <Columns positions={positions} h={h} r={r} broken={broken} seed={seed} color={color} />
      {roof && <Box w={length + r * 3} d={r * 5.5} h={Math.max(0.3, h * 0.1)} y={h + r * 0.5} color={color} />}
    </group>
  )
}

function Wheel({ r, spokes = 8, color }: { r: number; spokes?: number; color: string }) {
  return (
    <group position={[0, r, 0]}>
      <mesh geometry={unitTorus} scale={[r, r, r * 1.15]} castShadow>
        <Mat color={color} />
      </mesh>
      <mesh geometry={unitTorus} scale={[r * 0.55, r * 0.55, r * 0.9]} castShadow>
        <Mat color={color} />
      </mesh>
      {Array.from({ length: spokes }, (_, i) => (
        <mesh
          key={i}
          geometry={unitBox}
          rotation={[0, 0, (Math.PI / spokes) * i]}
          scale={[r * 0.08, r * 1.85, r * 0.1]}
          castShadow
        >
          <Mat color={color} />
        </mesh>
      ))}
      <mesh geometry={unitCyl} rotation={[Math.PI / 2, 0, 0]} scale={[r * 0.24, r * 0.35, r * 0.24]} castShadow>
        <Mat color={color} />
      </mesh>
    </group>
  )
}

function Stupa({ r, railing = true, chhatra = true, color }: { r: number; railing?: boolean; chhatra?: boolean; color: string }) {
  const drum = r * 0.2
  const dome = useMemo(() => domeGeometry(r), [r])
  const posts = useMemo(() => Array.from({ length: 48 }, (_, i) => (i / 48) * Math.PI * 2), [])
  return (
    <group>
      <Cyl r={r * 1.15} h={drum * 0.45} color={color} />
      <Cyl r={r * 1.05} h={drum * 0.55} y={drum * 0.45} color={color} />
      <mesh geometry={dome} position={[0, drum, 0]} castShadow receiveShadow>
        <Mat color={color} roughness={0.72} />
      </mesh>
      <Box w={r * 0.36} d={r * 0.36} h={r * 0.16} y={drum + r} color={color} />
      {chhatra && (
        <group position={[0, drum + r + r * 0.16, 0]}>
          <Cyl r={r * 0.03} h={r * 0.55} color={color} />
          {[0.4, 0.3, 0.2].map((s, i) => (
            <mesh
              key={i}
              geometry={unitCone}
              position={[0, r * (0.18 + i * 0.14), 0]}
              scale={[r * s, r * 0.05, r * s]}
              castShadow
            >
              <Mat color={color} />
            </mesh>
          ))}
        </group>
      )}
      {railing && (
        <group>
          {posts.map((a, i) => (
            <Cyl key={i} r={r * 0.022} h={r * 0.24} x={Math.cos(a) * r * 1.35} z={Math.sin(a) * r * 1.35} color={color} />
          ))}
          <mesh
            geometry={unitTorus}
            position={[0, r * 0.24, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            scale={[r * 1.35, r * 1.35, r * 0.22]}
          >
            <Mat color={color} />
          </mesh>
        </group>
      )}
    </group>
  )
}

function Gopuram({ w, d, h, tiers = 5, color }: { w: number; d: number; h: number; tiers?: number; color: string }) {
  const n = Math.max(1, tiers)
  const bodyH = n === 1 ? h : h * 0.85
  const th = bodyH / n
  const s = (x: number) => 1 - 0.55 * Math.min(1, x)
  const topS = s(1)
  return (
    <group>
      {Array.from({ length: n }, (_, i) => {
        const sb = s(i / n)
        const st = s((i + 0.8) / n)
        return (
          <group key={i}>
            <Frustum wb={w * sb} db={d * sb} wt={w * st} dt={d * st} h={th * 0.88} y={i * th} color={color} />
            <Box w={w * st * 1.06} d={d * st * 1.06} h={th * 0.12} y={i * th + th * 0.88} color={color} />
          </group>
        )
      })}
      {n > 1 && (
        <mesh
          geometry={unitCyl}
          position={[0, bodyH, 0]}
          rotation={[0, 0, Math.PI / 2]}
          scale={[(d * topS) / 2, w * topS, (d * topS) / 2]}
          castShadow
        >
          <Mat color={color} />
        </mesh>
      )}
    </group>
  )
}

function ArchWall({ w, h, d, arches, color }: { w: number; h: number; d: number; arches: number; color: string }) {
  const geo = useMemo(() => archWallGeometry(w, h, d, arches), [w, h, d, arches])
  return (
    <mesh geometry={geo} castShadow receiveShadow>
      <Mat color={color} repeat={Math.max(1.5, w / 6)} />
    </mesh>
  )
}

function Rubble({ r, count, seed = 1, size = 1, color }: { r: number; count: number; seed?: number; size?: number; color: string }) {
  const stones = useMemo(() => {
    const rand = rng(seed)
    return Array.from({ length: count }, () => {
      const a = rand() * Math.PI * 2
      const rr = Math.sqrt(rand()) * r
      const s = size * (0.4 + rand() * 0.9)
      return {
        x: Math.cos(a) * rr,
        z: Math.sin(a) * rr,
        s,
        rot: [rand() * 3, rand() * 3, rand() * 3] as [number, number, number],
        sx: 0.7 + rand() * 0.6,
        sy: 0.45 + rand() * 0.5,
        sz: 0.7 + rand() * 0.6,
      }
    })
  }, [r, count, seed, size])
  return (
    <group>
      {stones.map((s, i) => (
        <mesh
          key={i}
          geometry={unitDodeca}
          position={[s.x, s.s * s.sy * 0.5, s.z]}
          rotation={s.rot}
          scale={[s.s * s.sx, s.s * s.sy, s.s * s.sz]}
          castShadow
          receiveShadow
        >
          <Mat color={color} kind="rubble" roughness={1} />
        </mesh>
      ))}
    </group>
  )
}

function Water({ w, d }: { w: number; d: number }) {
  return (
    <group>
      <mesh geometry={unitPlane} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} scale={[w, d, 1]} receiveShadow>
        <Mat color="#3a8aaa" kind="water" roughness={0.1} metalness={0.65} alpha={0.82} />
      </mesh>
      <mesh geometry={unitPlane} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} scale={[w * 1.02, d * 1.02, 1]}>
        <Mat color="#1a4a5c" kind="water" roughness={0.4} metalness={0.3} alpha={0.5} />
      </mesh>
    </group>
  )
}

function Wall({ w, h, d, crenels = false, color }: { w: number; h: number; d: number; crenels?: boolean; color: string }) {
  const alongX = w >= d
  const len = alongX ? w : d
  const n = Math.max(1, Math.floor(len / 2.2))
  return (
    <group>
      <Box w={w} h={h} d={d} color={color} />
      <Box w={alongX ? w : w * 1.15} h={h * 0.08} d={alongX ? d * 1.15 : d} y={h} color={color} />
      {crenels &&
        Array.from({ length: n }, (_, i) => {
          const o = -len / 2 + (len / n) * (i + 0.5)
          return (
            <mesh
              key={i}
              geometry={unitBox}
              position={alongX ? [o, h + h * 0.1, 0] : [0, h + h * 0.1, o]}
              scale={alongX ? [len / n / 2.2, h * 0.2, d * 1.05] : [w * 1.05, h * 0.2, len / n / 2.2]}
              castShadow
            >
              <Mat color={color} />
            </mesh>
          )
        })}
    </group>
  )
}

function Tower({ r, h, crenels = true, color }: { r: number; h: number; crenels?: boolean; color: string }) {
  const n = Math.max(8, Math.round(r * 4))
  return (
    <group>
      <Cyl r={r * 1.08} h={r * 0.3} color={color} />
      <Cyl r={r} h={h} color={color} segments={40} />
      <Cyl r={r * 1.12} h={r * 0.28} y={h - r * 0.28} color={color} />
      {crenels &&
        Array.from({ length: n }, (_, i) => {
          const a = (i / n) * Math.PI * 2
          return (
            <mesh
              key={i}
              geometry={unitBox}
              position={[Math.cos(a) * r * 0.98, h + r * 0.18, Math.sin(a) * r * 0.98]}
              rotation={[0, -a, 0]}
              scale={[r * 0.28, r * 0.36, r * 0.55]}
              castShadow
            >
              <Mat color={color} />
            </mesh>
          )
        })}
    </group>
  )
}

function Stairs({ w, h, d, steps, color }: { w: number; h: number; d: number; steps: number; color: string }) {
  const n = Math.max(2, steps)
  const sh = h / n
  const sd = d / n
  return (
    <group>
      {Array.from({ length: n }, (_, i) => (
        <mesh
          key={i}
          geometry={unitBox}
          position={[0, ((i + 1) * sh) / 2, d / 2 - sd * (i + 0.5)]}
          scale={[w, (i + 1) * sh, sd * 0.96]}
          castShadow
          receiveShadow
        >
          <Mat color={color} />
        </mesh>
      ))}
    </group>
  )
}

function Tree({ h, r, color }: { h: number; r: number; color: string }) {
  return (
    <group>
      <Cyl r={Math.max(0.08, r * 0.12)} rTop={Math.max(0.05, r * 0.08)} h={h * 0.55} color="#5a3b21" />
      <mesh geometry={unitSphere} position={[0, h * 0.55 + r * 0.7, 0]} scale={[r, r * 1.05, r]} castShadow>
        <Mat color={color} kind="foliage" roughness={0.95} />
      </mesh>
      <mesh geometry={unitSphere} position={[r * 0.35, h * 0.55 + r * 0.95, r * 0.15]} scale={[r * 0.7, r * 0.65, r * 0.7]} castShadow>
        <Mat color={color} kind="foliage" roughness={0.95} />
      </mesh>
      <mesh geometry={unitSphere} position={[-r * 0.3, h * 0.55 + r * 0.85, -r * 0.2]} scale={[r * 0.6, r * 0.55, r * 0.6]} castShadow>
        <Mat color={color} kind="foliage" roughness={0.95} />
      </mesh>
    </group>
  )
}

function Torana({ w, h, color }: { w: number; h: number; color: string }) {
  const t = w * 0.12
  return (
    <group>
      <mesh geometry={unitBox} position={[-w / 2, h * 0.5, 0]} scale={[t, h, t]} castShadow>
        <Mat color={color} />
      </mesh>
      <mesh geometry={unitBox} position={[w / 2, h * 0.5, 0]} scale={[t, h, t]} castShadow>
        <Mat color={color} />
      </mesh>
      {[0.72, 0.85, 0.98].map((f, i) => (
        <mesh key={i} geometry={unitBox} position={[0, h * f, 0]} scale={[w * 1.35, h * 0.08, t * 1.3]} castShadow>
          <Mat color={color} />
        </mesh>
      ))}
      {[-1, 1].map((s) => (
        <mesh key={s} geometry={unitSphere} position={[(w / 2) * s, h * 1.05, 0]} scale={t * 0.7} castShadow>
          <Mat color={color} />
        </mesh>
      ))}
    </group>
  )
}

function Pillar({
  r,
  h,
  broken = false,
  capital = false,
  color,
}: {
  r: number
  h: number
  broken?: boolean
  capital?: boolean
  color: string
}) {
  const hh = broken ? h * 0.3 : h
  const shaft = useMemo(() => columnShaftGeometry(r, 1, 22), [r])
  return (
    <group>
      <Box w={r * 2.8} d={r * 2.8} h={r * 0.4} color={color} />
      <mesh geometry={shaft} position={[0, r * 0.4, 0]} scale={[1, hh - r * 0.4, 1]} castShadow receiveShadow>
        <Mat color={color} />
      </mesh>
      {capital && !broken && (
        <group position={[0, h, 0]}>
          <mesh geometry={unitTorus} position={[0, r * 0.2, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[r * 1.15, r * 1.15, r * 1.3]}>
            <Mat color={color} />
          </mesh>
          <Box w={r * 2.7} d={r * 2.7} h={r * 0.5} y={r * 0.5} color={color} />
          {[-1, 1].flatMap((sx) =>
            [-1, 1].map((sz) => (
              <mesh key={`${sx}${sz}`} geometry={unitSphere} position={[sx * r * 0.75, r * 1.65, sz * r * 0.75]} scale={r * 0.55} castShadow>
                <Mat color={color} />
              </mesh>
            )),
          )}
        </group>
      )}
    </group>
  )
}

// ---------------------------------------------------------------------------
export function PartNode({ part }: { part: Part }) {
  const color = part.color ?? DEFAULT_COLORS[part.type]
  const pos = part.p ?? [0, 0, 0]
  const rot: [number, number, number] = [0, THREE.MathUtils.degToRad(part.ry ?? 0), 0]
  let node: React.ReactNode = null
  switch (part.type) {
    case 'plinth':
      node = <Plinth w={part.w} d={part.d} h={part.h} steps={part.steps} color={color} />
      break
    case 'box':
      node = <Box w={part.w} h={part.h} d={part.d} color={color} />
      break
    case 'cylinder':
      node = <Cyl r={part.r} h={part.h} rTop={part.rTop} color={color} />
      break
    case 'shikhara':
      node = <Shikhara r={part.r} h={part.h} ribs={part.ribs} color={color} />
      break
    case 'pyramid':
      node = <Pyramid w={part.w} d={part.d} h={part.h} tiers={part.tiers} color={color} />
      break
    case 'dome':
      node = <Dome r={part.r} onion={part.onion} finial={part.finial} color={color} />
      break
    case 'minaret':
      node = (
        <Minaret r={part.r} h={part.h} balconies={part.balconies} taper={part.taper} cupola={part.cupola} color={color} />
      )
      break
    case 'hall':
      node = (
        <Hall
          w={part.w}
          d={part.d}
          h={part.h}
          cols={part.cols}
          rows={part.rows}
          roof={part.roof}
          broken={part.broken}
          seed={part.seed}
          color={color}
        />
      )
      break
    case 'colonnade':
      node = (
        <Colonnade
          length={part.length}
          h={part.h}
          count={part.count}
          roof={part.roof}
          broken={part.broken}
          seed={part.seed}
          color={color}
        />
      )
      break
    case 'wheel':
      node = <Wheel r={part.r} spokes={part.spokes} color={color} />
      break
    case 'stupa':
      node = <Stupa r={part.r} railing={part.railing} chhatra={part.chhatra} color={color} />
      break
    case 'gopuram':
      node = <Gopuram w={part.w} d={part.d} h={part.h} tiers={part.tiers} color={color} />
      break
    case 'chhatri':
      node = <Chhatri r={part.r} h={part.h} color={color} />
      break
    case 'archwall':
      node = <ArchWall w={part.w} h={part.h} d={part.d} arches={part.arches} color={color} />
      break
    case 'rubble':
      node = <Rubble r={part.r} count={part.count} seed={part.seed} size={part.size} color={color} />
      break
    case 'water':
      node = <Water w={part.w} d={part.d} />
      break
    case 'wall':
      node = <Wall w={part.w} h={part.h} d={part.d} crenels={part.crenels} color={color} />
      break
    case 'tower':
      node = <Tower r={part.r} h={part.h} crenels={part.crenels} color={color} />
      break
    case 'stairs':
      node = <Stairs w={part.w} h={part.h} d={part.d} steps={part.steps} color={color} />
      break
    case 'tree':
      node = <Tree h={part.h} r={part.r} color={color} />
      break
    case 'torana':
      node = <Torana w={part.w} h={part.h} color={color} />
      break
    case 'pillar':
      node = <Pillar r={part.r} h={part.h} broken={part.broken} capital={part.capital} color={color} />
      break
  }
  return (
    <group position={pos} rotation={rot}>
      {node}
    </group>
  )
}
