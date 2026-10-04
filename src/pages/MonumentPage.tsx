import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { monumentById } from '../data/monuments'
import { GuideChat } from '../components/GuideChat'
import { StatusPill } from '../components/StatusPill'
import { ConfidenceChip } from '../components/ConfidenceChip'
import { TimeSlider } from '../components/TimeSlider'
import { Timeline } from '../components/Timeline'
import { Viewer3D } from '../three/Viewer3D'
import { AudioNarrationPlayer } from '../components/AudioNarrationPlayer'
import { useI18n } from '../lib/i18n'
import { JharokhaFrame } from '../components/Motifs'

export function MonumentPage() {
  const { id } = useParams()
  const m = monumentById(id)
  const { t, pick, lang, monumentName } = useI18n()
  const [blend, setBlend] = useState(0)
  const [autoRotate, setAutoRotate] = useState(true)
  const [copied, setCopied] = useState(false)

  const lostFeatures = useMemo(() => {
    if (!m) return []
    const nowLabels = new Set(m.now.map((p) => p.label).filter(Boolean))
    return Array.from(new Set(m.then.map((p) => p.label).filter((l): l is string => Boolean(l) && !nowLabels.has(l))))
  }, [m])

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // ignore
    }
  }

  const toggleFullscreen = () => {
    const el = document.querySelector('.viewer')
    if (!el) return
    if (!document.fullscreenElement) {
      void el.requestFullscreen().catch(() => undefined)
    } else {
      void document.exitFullscreen().catch(() => undefined)
    }
  }

  if (!m) return <Navigate to="/" replace />

  const nativeName = lang === 'hi' ? m.nameHi : lang === 'ta' ? m.nameTa || m.name : lang === 'bn' ? m.nameBn || m.name : m.nameHi

  return (
    <>
      {/* Navigation Breadcrumb */}
      <nav className="breadcrumb-bar" aria-label="Breadcrumb">
        <Link to="/" className="breadcrumb-back">
          <span className="back-arrow" aria-hidden>‹</span> {pick('All Monuments', 'सभी स्मारक')}
        </Link>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-current">{monumentName(m)}</span>

        <button
          type="button"
          className="btn btn-ghost btn-sm breadcrumb-share"
          onClick={copyShareLink}
          title="Share citation and reconstruction link"
        >
          {copied ? '✓ ' + pick('Copied!', 'कॉपी किया!') : '🔗 ' + pick('Share', 'साझा करें')}
        </button>
      </nav>

      {/* Monument Header */}
      <header className="mon-head">
        <div>
          <div className="mon-pills">
            <StatusPill status={m.status} />
            <ConfidenceChip
              confidence={m.confidence}
              rationale={m.confidenceRationale}
              sources={m.sources}
              monumentName={m.name}
            />
            {m.unesco && (
              <span className="pill outline unesco-pill" title="UNESCO World Heritage Site">
                🏛️ {t('unesco')}
              </span>
            )}
            <span className="pill outline style-pill">{m.style}</span>
          </div>

          <h1 className="mon-title">
            <span className="mon-emoji" aria-hidden>{m.emoji}</span>
            <span className="mon-name-main">{monumentName(m)}</span>
          </h1>

          {nativeName && nativeName !== m.name && (
            <div className="hi mon-name-sub">{nativeName}</div>
          )}

          <div className="loc mon-meta-row">
            <span>📍 {m.city}, {m.state}</span>
            <span className="meta-dot">·</span>
            <span>🏛️ {m.built}</span>
            <span className="meta-dot">·</span>
            <span>👑 {m.builder}</span>
          </div>
        </div>

        <div className="mon-actions">
          <Link to={`/xr/${m.id}?mode=ar`} className="btn btn-primary" aria-label={`View ${m.name} in AR mode`}>
            📱 {t('viewAR')}
          </Link>
          <Link to={`/xr/${m.id}?mode=vr`} className="btn btn-glass" aria-label={`Explore ${m.name} in VR mode`}>
            🥽 {t('viewVR')}
          </Link>
          <Link to="/scan" className="btn btn-icon-only" aria-label={t('scanCta')} title="Point camera at monument">
            📷
          </Link>
        </div>
      </header>

      {/* 3D Reconstruction Studio with Arch Framing */}
      <section className="viewer arch-card" aria-label={`3D Reconstruction of ${m.name}`}>
        <JharokhaFrame />
        <Viewer3D monument={m} blend={blend} autoRotate={autoRotate} />

        <div className="overlay-top">
          <div className="viewer-status-badge glass">
            <span className="viewer-status-dot" aria-hidden />
            <span>{blend < 0.5 ? `🕰️ ${m.thenLabel}` : `📅 ${m.nowLabel}`}</span>
          </div>

          <div className="viewer-tool-group">
            <button
              type="button"
              className={`viewer-tool-btn glass ${autoRotate ? 'active' : ''}`}
              onClick={() => setAutoRotate((a) => !a)}
              title={autoRotate ? 'Pause 3D auto rotation' : 'Start 3D auto rotation'}
              aria-label="Toggle 3D auto rotation"
            >
              🔄
            </button>
            <button
              type="button"
              className="viewer-tool-btn glass"
              onClick={toggleFullscreen}
              title="Fullscreen 3D Viewer"
              aria-label="Fullscreen 3D Viewer"
            >
              ⛶
            </button>
          </div>
        </div>

        {/* Signature Time Slider */}
        <div className="overlay-bottom">
          <TimeSlider monument={m} value={blend} onChange={setBlend} />
        </div>
      </section>

      {/* Audio Narration Player */}
      <section className="audio-section" aria-label="Audio narration guide">
        <AudioNarrationPlayer monument={m} />
      </section>

      {/* Archaeological Dossier & Historical Context */}
      <div className="two-col">
        <div className="mon-details-col">
          {/* Architectural Background */}
          <section className="panel arch-card">
            <div className="panel-header">
              <h2>📖 {t('history')}</h2>
            </div>
            <p className="lead-text">{pick(m.summary, m.summaryHi)}</p>

            <div className="specs-grid">
              <div className="spec-card">
                <span className="spec-label">🏛️ {t('built')}</span>
                <span className="spec-value">{m.built}</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">👑 {t('builder')}</span>
                <span className="spec-value">{m.builder}</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">🎨 {t('style')}</span>
                <span className="spec-value">{m.style}</span>
              </div>
              <div className="spec-card">
                <span className="spec-label">📍 {t('location')}</span>
                <a
                  href={`https://www.google.com/maps?q=${m.lat},${m.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="spec-value spec-link"
                  title="Open GPS coordinates in Google Maps"
                >
                  {m.lat.toFixed(4)}, {m.lng.toFixed(4)} ↗
                </a>
              </div>
            </div>
          </section>

          {/* Destruction and Cataclysm */}
          <section className="panel panel-cataclysm arch-card">
            <div className="panel-header">
              <h2>💔 {t('whatHappened')}</h2>
            </div>
            <p>{pick(m.whatHappened, m.whatHappenedHi)}</p>
            {lostFeatures.length > 0 && (
              <div className="lost-features-wrap">
                <h3 className="lost-features-title">⚠️ {t('lostFeatures')}</h3>
                <ul className="lost-features-list">
                  {lostFeatures.map((l) => (
                    <li key={l} className="lost-feature-pill">
                      <span className="lost-bullet">✕</span>
                      <span>{l}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          {/* Chronological Timeline */}
          <section className="panel arch-card">
            <div className="panel-header">
              <h2>🗓️ {t('timeline')}</h2>
            </div>
            <Timeline events={m.timeline} />
          </section>

          {/* Cited Historical Sources List */}
          <section className="panel arch-card" aria-label="Cited sources and bibliography">
            <div className="panel-header">
              <h2>📜 {t('sources')}</h2>
              <span className="panel-tag-gemini">ASI & Archival Records</span>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: 13.5, marginBottom: 16 }}>
              All 3D reconstructions and timelines are corroborated with primary epigraphs and official field surveys:
            </p>
            <ul className="sources-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {(m.sources || [
                { title: 'Archaeological Survey of India Imperial Field Reports', institution: 'ASI', year: '1903-1984' },
                { title: 'History of Indian and Eastern Architecture', institution: 'James Fergusson', year: '1876' },
              ]).map((src, idx) => (
                <li key={idx} className="source-item">
                  <span className="source-bullet" aria-hidden>📜</span>
                  <div className="source-details">
                    <strong className="source-title">{src.title}</strong>
                    <span className="source-meta">
                      {src.institution} {src.year ? `· ${src.year}` : ''}
                    </span>
                    {src.note && <p className="source-note">{src.note}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Architectural Notes */}
          <section className="panel arch-card">
            <div className="panel-header">
              <h2>💡 {t('facts')}</h2>
            </div>
            <ul className="facts-list">
              {m.facts.map((f, idx) => (
                <li key={idx} className="fact-item">
                  <span className="fact-bullet" aria-hidden>✦</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right Column: AI Museum Archivist */}
        <div className="mon-interactive-col">
          <section className="panel panel-guide arch-card">
            <div className="panel-header">
              <h2>🧭 {t('askGuide')}</h2>
              <span className="panel-tag-gemini">✦ Gemini 3.8</span>
            </div>
            <GuideChat monument={m} />
          </section>
        </div>
      </div>
    </>
  )
}
