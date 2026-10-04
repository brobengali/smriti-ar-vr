import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { monumentById, monuments } from '../data/monuments'
import type { Monument } from '../data/types'
import { identifyMonument, type IdentifyResult } from '../lib/api'
import { formatKm, sortByDistance, useGeolocation } from '../lib/geo'
import { useI18n } from '../lib/i18n'
import { StatusPill } from '../components/StatusPill'
import { ConfidenceChip } from '../components/ConfidenceChip'
import { TimeSlider } from '../components/TimeSlider'
import { Viewer3D } from '../three/Viewer3D'
import { AudioNarrationPlayer } from '../components/AudioNarrationPlayer'

type Phase = 'live' | 'captured' | 'identifying' | 'reconstruction'

export function ScanPage() {
  const { t, lang, pick, monumentName } = useI18n()
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState(false)
  const [phase, setPhase] = useState<Phase>('live')
  const [shot, setShot] = useState<{ dataUrl: string; base64: string; mime: string } | null>(null)
  const [result, setResult] = useState<IdentifyResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeMonument, setActiveMonument] = useState<Monument | null>(null)
  const [blend, setBlend] = useState(0)
  const [sheetExpanded, setSheetExpanded] = useState(false)
  const geo = useGeolocation(true)

  // Camera stream lifecycle
  useEffect(() => {
    let cancelled = false
    async function start() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 1280 } },
          audio: false,
        })
        if (cancelled) {
          stream.getTracks().forEach((tr) => tr.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play().catch(() => undefined)
        }
      } catch {
        if (!cancelled) setCameraError(true)
      }
    }
    void start()
    const timer = window.setTimeout(() => {
      if (!cancelled && (videoRef.current?.videoWidth ?? 0) === 0) setCameraError(true)
    }, 6000)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
      streamRef.current?.getTracks().forEach((tr) => tr.stop())
      streamRef.current = null
    }
  }, [])

  const nearby = useMemo(() => (geo.status === 'ok' && geo.pos ? sortByDistance(monuments, geo.pos).slice(0, 4) : []), [geo])

  const presetItems = useMemo(() => {
    if (nearby.length > 0) {
      return nearby.map((item) => ({ monument: item.monument, kmLabel: formatKm(item.km) }))
    }
    return monuments.slice(0, 6).map((m) => ({ monument: m, kmLabel: null as string | null }))
  }, [nearby])

  // Capture frame from webcam
  const capture = useCallback(() => {
    const v = videoRef.current
    if (!v || v.videoWidth === 0) return
    const maxSide = 1024
    const scale = Math.min(1, maxSide / Math.max(v.videoWidth, v.videoHeight))
    const c = document.createElement('canvas')
    c.width = Math.round(v.videoWidth * scale)
    c.height = Math.round(v.videoHeight * scale)
    c.getContext('2d')!.drawImage(v, 0, 0, c.width, c.height)
    const dataUrl = c.toDataURL('image/jpeg', 0.85)
    setShot({ dataUrl, base64: dataUrl.split(',')[1], mime: 'image/jpeg' })
    setResult(null)
    setError(null)
    setPhase('captured')
  }, [])

  const onUpload = useCallback((file: File | undefined) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const dataUrl = String(reader.result)
      const img = new Image()
      img.onload = () => {
        const maxSide = 1024
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
        const c = document.createElement('canvas')
        c.width = Math.round(img.width * scale)
        c.height = Math.round(img.height * scale)
        c.getContext('2d')!.drawImage(img, 0, 0, c.width, c.height)
        const out = c.toDataURL('image/jpeg', 0.85)
        setShot({ dataUrl: out, base64: out.split(',')[1], mime: 'image/jpeg' })
        setResult(null)
        setError(null)
        setPhase('captured')
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  }, [])

  // Call identify API
  const identify = useCallback(async () => {
    if (!shot) return
    setPhase('identifying')
    setError(null)
    try {
      const r = await identifyMonument(shot.base64, shot.mime, lang, geo.pos)
      setResult(r)
      if (r?.matchId) {
        const found = monumentById(r.matchId)
        if (found) {
          setActiveMonument(found)
          setPhase('reconstruction')
          setBlend(0)
          return
        }
      }
      setPhase('captured')
    } catch (e) {
      setError((e as Error).message)
      setPhase('captured')
    }
  }, [shot, lang, geo.pos])

  useEffect(() => {
    if (phase === 'captured' && shot && !result && !error) void identify()
  }, [phase, shot, result, error, identify])

  // Direct sample loader
  const loadPreset = (m: Monument) => {
    setActiveMonument(m)
    setPhase('reconstruction')
    setBlend(0)
    setSheetExpanded(false)
  }

  const exitReconstruction = () => {
    setActiveMonument(null)
    setResult(null)
    setShot(null)
    setPhase('live')
    setSheetExpanded(false)
  }

  return (
    <div className={`ar-scan-container ${phase === 'reconstruction' ? 'in-reconstruction' : ''}`}>
      {/* Top Floating App Bar */}
      <div className="ar-top-bar">
        <Link to="/" className="ar-nav-back" aria-label="Return to home catalog">
          ‹ <span className="hide-on-mobile">{pick('Catalog', 'संग्रह')}</span>
        </Link>

        <div className="ar-badge-center">
          {activeMonument ? (
            <span className="ar-active-pill glass">
              <span className="ar-pulse-dot" /> {monumentName(activeMonument)}
            </span>
          ) : (
            <span className="ar-status-pill glass">
              <span className="ar-pulse-dot live" /> {pick('AR Camera Active', 'AR कैमरा सक्रिय')}
            </span>
          )}
        </div>

        {activeMonument ? (
          <button type="button" className="btn btn-sm btn-glass" onClick={exitReconstruction}>
            ✕ {pick('Reset', 'हटाएँ')}
          </button>
        ) : (
          <label className="btn btn-sm btn-glass ar-upload-label">
            <span>⬆️</span>
            <input type="file" accept="image/*" capture="environment" hidden onChange={(e) => onUpload(e.target.files?.[0])} />
          </label>
        )}
      </div>

      {/* Main Viewfinder / 3D Reconstruction Stage */}
      <div className="ar-viewport">
        {phase === 'reconstruction' && activeMonument ? (
          <div className="ar-3d-stage">
            <Viewer3D monument={activeMonument} blend={blend} autoRotate={false} />
            <div className="ar-3d-hint">
              <span>{blend < 0.2 ? 'Original Reconstructed' : blend > 0.8 ? 'Modern Ruin State' : 'Crossfade Transition'}</span>
            </div>
          </div>
        ) : (
          <div className="ar-camera-feed">
            {phase === 'live' || !shot ? (
              <>
                <video ref={videoRef} playsInline muted autoPlay className="camera-video-elem" />
                <div className="scan-laser-line" aria-hidden />
                <div className="ar-reticle arch-mask">
                  <span className="reticle-corner tl" />
                  <span className="reticle-corner tr" />
                  <span className="reticle-corner bl" />
                  <span className="reticle-corner br" />
                </div>
              </>
            ) : (
              <img src={shot.dataUrl} alt="Captured frame" className="captured-preview" />
            )}

            {phase === 'identifying' && (
              <div className="ar-identifying-overlay">
                <div className="identifying-spinner" />
                <p>{t('identifying')}</p>
                <small>Consulting archaeological epigraphs & visual index…</small>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Signature Time Slider Floating Bar */}
      {activeMonument && (
        <div className="ar-slider-dock">
          <TimeSlider
            monument={activeMonument}
            value={blend}
            onChange={setBlend}
          />
        </div>
      )}

      {/* Shutter Button when live */}
      {phase === 'live' && !activeMonument && (
        <div className="ar-shutter-dock">
          <button
            type="button"
            className="shutter"
            onClick={capture}
            disabled={cameraError}
            aria-label="Capture and identify monument"
            title="Point at monument and identify"
          >
            <span className="shutter-inner" />
          </button>
        </div>
      )}

      {/* Sample Presets Drawer when camera is empty */}
      {!activeMonument && phase === 'live' && (
        <div className="ar-presets-strip">
          <span className="presets-label">
            {nearby.length > 0
              ? pick('Nearby monuments (instant AR test):', 'निकटवर्ती स्मारक (त्वरित AR परीक्षण):')
              : pick('Test sample monuments (no camera required):', 'नमूना स्मारक चुनें (कैमरे की आवश्यकता नहीं):')}
          </span>
          <div className="presets-scroll">
            {presetItems.map(({ monument: m, kmLabel }) => (
              <button
                key={m.id}
                type="button"
                className="preset-chip-btn glass"
                onClick={() => loadPreset(m)}
              >
                <span>{m.emoji}</span>
                <span>{monumentName(m)}</span>
                {kmLabel && <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>({kmLabel})</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Expandable Bottom Sheet for History & Citations */}
      {activeMonument && (
        <aside
          className={`ar-bottom-sheet glass ${sheetExpanded ? 'expanded' : 'collapsed'}`}
          aria-label="Monument history and archaeological sources"
        >
          <button
            type="button"
            className="sheet-pull-handle"
            onClick={() => setSheetExpanded((x) => !x)}
            aria-label={sheetExpanded ? 'Collapse history sheet' : 'Expand history sheet'}
          >
            <span className="handle-bar" />
            <div className="sheet-summary-row">
              <div className="sheet-title-meta">
                <span className="sheet-emoji">{activeMonument.emoji}</span>
                <strong>{monumentName(activeMonument)}</strong>
                <span className="sheet-sub">
                  {activeMonument.city} · {activeMonument.built}
                </span>
              </div>
              <div className="sheet-badges">
                <StatusPill status={activeMonument.status} />
                <ConfidenceChip
                  confidence={activeMonument.confidence}
                  rationale={activeMonument.confidenceRationale}
                  sources={activeMonument.sources}
                  monumentName={activeMonument.name}
                  compact
                />
              </div>
            </div>
          </button>

          {sheetExpanded && (
            <div className="sheet-body-scroll">
              {/* Audio Narration Player */}
              <AudioNarrationPlayer monument={activeMonument} />

              <div className="sheet-section">
                <h4>📖 {t('history')}</h4>
                <p>{pick(activeMonument.summary, activeMonument.summaryHi)}</p>
              </div>

              <div className="sheet-section">
                <h4>💔 {t('whatHappened')}</h4>
                <p>{pick(activeMonument.whatHappened, activeMonument.whatHappenedHi)}</p>
              </div>

              <div className="sheet-actions">
                <Link to={`/monument/${activeMonument.id}`} className="btn btn-primary btn-sm">
                  Full Dossier & Sources →
                </Link>
                <Link to={`/xr/${activeMonument.id}?mode=ar`} className="btn btn-glass btn-sm">
                  📱 WebXR Immersive AR
                </Link>
                <Link to={`/xr/${activeMonument.id}?mode=vr`} className="btn btn-glass btn-sm">
                  🥽 VR Walk
                </Link>
              </div>
            </div>
          )}
        </aside>
      )}
    </div>
  )
}
