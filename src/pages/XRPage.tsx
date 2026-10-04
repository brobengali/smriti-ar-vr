import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import { IfInSessionMode, XR, XROrigin, createXRStore, useXR, useXRHitTest, useXRInputSourceEvent, type XRStore } from '@react-three/xr'
import { Suspense, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom'
import * as THREE from 'three'
import { monumentById } from '../data/monuments'
import type { Monument } from '../data/types'
import { TimeSlider } from '../components/TimeSlider'
import { ConfidenceChip } from '../components/ConfidenceChip'
import { useI18n } from '../lib/i18n'
import { MonumentModel } from '../three/MonumentModel'
import { SceneLights } from '../three/Viewer3D'

type Mode = 'ar' | 'vr'

/** Shared mutable state between the R3F scene and the DOM overlay (updated per frame, so not React state). */
interface PlacementRefs {
  reticle: THREE.Vector3
  reticleVisible: boolean
}

export function XRPage() {
  const { id } = useParams()
  const [params] = useSearchParams()
  const mode = (params.get('mode') === 'vr' ? 'vr' : 'ar') as Mode
  // Dev aid: `?emulate=1` injects the IWER WebXR emulator (Meta Quest 3) so AR/VR flows can be tested on a desktop.
  const emulate = params.get('emulate') === '1'
  const m = monumentById(id)
  if (!m) return <Navigate to="/" replace />
  return <XRExperience monument={m} mode={mode} emulate={emulate} />
}

function XRExperience({ monument, mode, emulate }: { monument: Monument; mode: Mode; emulate: boolean }) {
  const { t, monumentName } = useI18n()
  /**
   * The DOM-overlay root must be a direct child of <body> (the XR store re-appends it there),
   * so we own a detached element and portal our React UI into it. Portals keep router/i18n context.
   */
  const overlayEl = useMemo(() => {
    const el = document.createElement('div')
    el.className = 'xr-ui'
    return el
  }, [])
  const [store, setStore] = useState<XRStore | null>(null)
  const [blend, setBlend] = useState(0)
  const [placed, setPlaced] = useState<THREE.Vector3 | null>(null)
  /** AR: model width in metres. */
  const [arWidth, setArWidth] = useState(1.2)
  /** VR: scale factor relative to real size. */
  const [vrScale, setVrScale] = useState(0.2)
  const [xrError, setXrError] = useState<string | null>(null)
  const refs = useMemo<PlacementRefs>(() => ({ reticle: new THREE.Vector3(), reticleVisible: false }), [])

  // Re-check after the store (and possibly the emulator) is ready.
  const arSupported = useXRModeSupport('immersive-ar', store)
  const vrSupported = useXRModeSupport('immersive-vr', store)

  // Mount the overlay element and create the XR store bound to it.
  useEffect(() => {
    let cancelled = false
    let s: XRStore | null = null
    let uninstall: (() => void) | undefined
    async function setup() {
      if (emulate) {
        // Force-install the IWER emulator (Meta Quest 3 profile) even when the browser exposes a native navigator.xr.
        // NOTE: @iwer/devui is intentionally not used — it bundles its own (older) three.js and
        // breaks the shared WebGL frame loop ("material.onBuild is not a function").
        const [{ XRDevice, metaQuest3 }, { SyntheticEnvironmentModule }] = await Promise.all([
          import('iwer'),
          import('@iwer/sem'),
        ])
        const device = new XRDevice(metaQuest3, { stereoEnabled: false, ipd: 0 })
        device.installRuntime({ forceInstall: true })
        // a synthetic room gives the hit-test a floor/walls to hit
        // (type-level mismatch between iwer and @iwer/sem releases; runtime API is compatible)
        device.installSEM(SyntheticEnvironmentModule as unknown as Parameters<typeof device.installSEM>[0])
        device.sem?.loadDefaultEnvironment('office_small')
        device.position.set(0, 1.6, 0)
        ;(window as unknown as { __xrdevice?: unknown }).__xrdevice = device // dev-console handle
        uninstall = () => device.uninstallRuntime()
        if (cancelled) return
      }
      document.body.appendChild(overlayEl)
      s = createXRStore({
        domOverlay: overlayEl,
        emulate: false,
        offerSession: false,
        hitTest: true,
        anchors: false,
        planeDetection: false,
        meshDetection: false,
        handTracking: false,
        layers: false,
        hand: { teleportPointer: false },
        controller: { teleportPointer: false },
      })
      setStore(s)
    }
    void setup()
    return () => {
      cancelled = true
      s?.destroy()
      setStore(null)
      overlayEl.remove()
      uninstall?.()
    }
  }, [overlayEl, emulate])

  // Prevent taps on UI from counting as "place" selects in AR.
  useEffect(() => {
    const stop = (e: Event) => e.preventDefault()
    const targets = overlayEl.querySelectorAll<HTMLElement>('[data-ui]')
    targets.forEach((n) => n.addEventListener('beforexrselect', stop))
    return () => targets.forEach((n) => n.removeEventListener('beforexrselect', stop))
  }, [overlayEl, store, placed])

  const sessionMode = useSyncExternalStore(
    (cb) => (store ? store.subscribe(cb) : () => undefined),
    () => (store ? store.getState().mode : null),
  )
  const inAR = sessionMode === 'immersive-ar'
  const inVR = sessionMode === 'immersive-vr'
  const inSession = inAR || inVR

  useEffect(() => {
    if (!inSession) setPlaced(null)
  }, [inSession])

  const enter = useCallback(
    async (which: Mode) => {
      if (!store) return
      setXrError(null)
      try {
        const session = which === 'ar' ? await store.enterAR() : await store.enterVR()
        if (!session) setXrError(which === 'ar' ? t('arUnsupported') : t('vrUnsupported'))
      } catch (e) {
        setXrError(`${which === 'ar' ? t('arUnsupported') : t('vrUnsupported')} (${(e as Error).message})`)
      }
    },
    [store, t],
  )

  const exit = useCallback(() => {
    store?.getState().session?.end().catch(() => undefined)
  }, [store])

  const f = monument.footprint
  const arScale = arWidth / (2 * f)
  const supported = mode === 'ar' ? arSupported : vrSupported

  return (
    <div className={`xr-page${inSession ? ' in-session' : ''}`}>
      <Canvas
        shadows
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.12 }}
        camera={{ position: [f * 2.1, f * 1.25, f * 2.5], fov: 42, near: 0.05, far: f * 60 }}
      >
        {store && (
          <XR store={store}>
            <SceneLights intensity={inAR ? 1.1 : 1} />
            {/* Non-immersive fallback: orbit viewer */}
            <IfInSessionMode deny={['immersive-ar', 'immersive-vr']}>
              <color attach="background" args={['#e5ecf2']} />
              <FallbackScene monument={monument} blend={blend} />
            </IfInSessionMode>
            {/* Handheld AR */}
            <IfInSessionMode allow="immersive-ar">
              <ARScene monument={monument} blend={blend} scale={arScale} placed={placed} setPlaced={setPlaced} refs={refs} />
            </IfInSessionMode>
            {/* Immersive VR */}
            <IfInSessionMode allow="immersive-vr">
              <color attach="background" args={['#bcd7ea']} />
              <fog attach="fog" args={['#bcd7ea', f * vrScale * 6, f * vrScale * 30]} />
              <VRScene monument={monument} blend={blend} scale={vrScale} />
            </IfInSessionMode>
          </XR>
        )}
      </Canvas>

      {/* DOM overlay — also shown inside AR sessions via the dom-overlay feature */}
      {createPortal(
        <>
        <div className="xr-top" data-ui>
          {inSession ? (
            <button className="btn btn-sm glass" onClick={exit}>
              ✕ {t('exit')}
            </button>
          ) : (
            <Link to={`/monument/${monument.id}`} className="btn btn-sm glass">
              ← {t('back')}
            </Link>
          )}
          <div className="xr-monument-badge glass">
            <span className="xr-badge-emoji">{monument.emoji}</span>
            <span className="xr-badge-title">{monumentName(monument)}</span>
            <ConfidenceChip
              confidence={monument.confidence}
              rationale={monument.confidenceRationale}
              sources={monument.sources}
              monumentName={monument.name}
              compact
            />
          </div>
        </div>

        <div className="xr-bottom" data-ui>
          {inAR && (
            <div className="glass xr-hint">{placed ? `✅ ${t('placed')}` : `👆 ${t('placeHint')} · ${t('arHelp')}`}</div>
          )}
          {inVR && <div className="glass xr-hint">🥽 {t('vrHelp')}</div>}
          {!inSession && xrError && <div className="glass xr-hint">⚠️ {xrError}</div>}
          {!inSession && supported === false && (
            <div className="glass xr-hint">ℹ️ {mode === 'ar' ? t('arUnsupported') : t('vrUnsupported')}</div>
          )}
          {!inSession && supported === undefined && <div className="glass xr-hint">{t('checkingXR')}</div>}

          <TimeSlider monument={monument} value={blend} onChange={setBlend} compact />

          {(inAR || (!inSession && mode === 'ar')) && (
            <div className="glass size-row">
              <span>{t('size')}</span>
              <input type="range" min={0.4} max={Math.max(2 * f, 3)} step={0.1} value={arWidth} onChange={(e) => setArWidth(Number(e.target.value))} />
              <span style={{ minWidth: 70, textAlign: 'right' }}>{arWidth >= 2 * f - 0.05 ? t('lifeSize') : `${arWidth.toFixed(1)} m`}</span>
              <button className="btn btn-sm" onClick={() => setArWidth(1.2)}>
                {t('tabletop')}
              </button>
              <button className="btn btn-sm" onClick={() => setArWidth(2 * f)}>
                {t('lifeSize')}
              </button>
            </div>
          )}
          {(inVR || (!inSession && mode === 'vr')) && (
            <div className="glass size-row">
              <span>{t('size')}</span>
              <input type="range" min={0.05} max={1} step={0.05} value={vrScale} onChange={(e) => setVrScale(Number(e.target.value))} />
              <span style={{ minWidth: 70, textAlign: 'right' }}>{vrScale >= 1 ? t('lifeSize') : `1 : ${Math.round(1 / vrScale)}`}</span>
            </div>
          )}

          {!inSession && (
            <div className="xr-modes">
              <button className="btn btn-primary" onClick={() => enter('ar')} disabled={!store || arSupported === false}>
                📱 {t('viewAR')}
              </button>
              <button className="btn glass" onClick={() => enter('vr')} disabled={!store || vrSupported === false}>
                🥽 {t('viewVR')}
              </button>
            </div>
          )}
        </div>
        </>,
        overlayEl,
      )}
    </div>
  )
}

/** `navigator.xr.isSessionSupported` as React state; re-evaluated whenever `dep` changes. */
function useXRModeSupport(mode: XRSessionMode, dep: unknown): boolean | undefined {
  const [supported, setSupported] = useState<boolean | undefined>(undefined)
  useEffect(() => {
    let cancelled = false
    const xr = navigator.xr
    if (!xr) {
      setSupported(false)
      return
    }
    xr.isSessionSupported(mode)
      .then((ok) => !cancelled && setSupported(ok))
      .catch(() => !cancelled && setSupported(false))
    return () => {
      cancelled = true
    }
  }, [mode, dep])
  return supported
}

// ---------------------------------------------------------------------------
function FallbackScene({ monument, blend }: { monument: Monument; blend: number }) {
  const f = monument.footprint
  return (
    <>
      <fog attach="fog" args={['#c9d8e8', f * 5, f * 14]} />
      <Suspense fallback={null}>
        <Environment preset="park" environmentIntensity={0.4} />
      </Suspense>
      <MonumentModel monument={monument} blend={blend} />
      <Suspense fallback={null}>
        <ContactShadows position={[0, 0.01, 0]} opacity={0.42} scale={f * 6} blur={2.2} far={f * 2} color="#2a1a10" />
      </Suspense>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.03, 0]} receiveShadow>
        <circleGeometry args={[f * 3.4, 96]} />
        <meshStandardMaterial color="#6f8450" roughness={0.95} />
      </mesh>
      <OrbitControls makeDefault autoRotate autoRotateSpeed={0.4} enablePan={false} minDistance={f * 0.55} maxDistance={f * 5.5} maxPolarAngle={Math.PI / 2 - 0.04} target={[0, f * 0.32, 0]} />
    </>
  )
}

// ---------------------------------------------------------------------------
const matrixHelper = new THREE.Matrix4()

function ARScene({
  monument,
  blend,
  scale,
  placed,
  setPlaced,
  refs,
}: {
  monument: Monument
  blend: number
  scale: number
  placed: THREE.Vector3 | null
  setPlaced: (v: THREE.Vector3 | null) => void
  refs: PlacementRefs
}) {
  const reticleRef = useRef<THREE.Group>(null)
  const session = useXR((s) => s.session)

  // Continuous hit test from the viewer (phone camera) against real-world surfaces.
  useXRHitTest(
    (results, getWorldMatrix) => {
      if (results.length === 0) {
        refs.reticleVisible = false
        return
      }
      if (getWorldMatrix(matrixHelper, results[0])) {
        refs.reticle.setFromMatrixPosition(matrixHelper)
        refs.reticleVisible = true
      }
    },
    'viewer',
    ['plane', 'point', 'mesh'],
  )

  useFrame(() => {
    const r = reticleRef.current
    if (!r) return
    r.visible = refs.reticleVisible && !placed
    if (refs.reticleVisible) r.position.copy(refs.reticle)
  })

  // Tap anywhere (screen select) -> place / re-place the monument at the reticle.
  useXRInputSourceEvent(
    'all',
    'select',
    () => {
      if (refs.reticleVisible) setPlaced(refs.reticle.clone())
    },
    [refs, setPlaced],
  )

  // If the session is lost, clear placement.
  useEffect(() => {
    if (!session) setPlaced(null)
  }, [session, setPlaced])

  return (
    <>
      <XROrigin />
      <group ref={reticleRef} visible={false}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.08, 0.11, 40]} />
          <meshBasicMaterial color="#f3c66d" transparent opacity={0.95} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.012, 16]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      </group>
      {placed && (
        <group position={placed}>
          <MonumentModel monument={monument} blend={blend} scale={scale} />
          {/* soft contact shadow disc */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0]}>
            <circleGeometry args={[monument.footprint * scale * 1.1, 48]} />
            <meshBasicMaterial color="#000" transparent opacity={0.18} />
          </mesh>
        </group>
      )}
    </>
  )
}

// ---------------------------------------------------------------------------
function VRScene({ monument, blend, scale }: { monument: Monument; blend: number; scale: number }) {
  const f = monument.footprint
  const camera = useThree((s) => s.camera)
  useEffect(() => {
    camera.near = 0.05
    camera.updateProjectionMatrix()
  }, [camera])
  return (
    <>
      <XROrigin position={[0, 0, f * scale * 1.6]} />
      <MonumentModel monument={monument} blend={blend} scale={scale} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <circleGeometry args={[f * scale * 12 + 20, 64]} />
        <meshStandardMaterial color="#6f7e52" roughness={1} />
      </mesh>
      <gridHelper args={[f * scale * 12 + 20, 40, '#8ea36a', '#7a8c5c']} position={[0, 0, 0]} />
    </>
  )
}
