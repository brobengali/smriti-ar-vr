import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { monuments } from '../data/monuments'
import { MonumentCard } from '../components/MonumentCard'
import { TimeSlider } from '../components/TimeSlider'
import { Viewer3D } from '../three/Viewer3D'
import { ConfidenceChip } from '../components/ConfidenceChip'
import { useI18n } from '../lib/i18n'
import { sortByDistance, useGeolocation } from '../lib/geo'
import { apiHealth } from '../lib/api'
import { JharokhaFrame, LotusDivider } from '../components/Motifs'

type Filter = 'all' | 'lost' | 'standing' | 'nearby'

export function HomePage() {
  const { t, pick, monumentName } = useI18n()
  const [q, setQ] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [blend, setBlend] = useState(0)
  const [heroIdx, setHeroIdx] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [health, setHealth] = useState<{ ok: boolean; hasKey: boolean } | null | 'loading'>('loading')
  const geo = useGeolocation(true)
  const featured = useMemo(() => monuments.filter((m) => m.status !== 'intact'), [])

  useEffect(() => {
    apiHealth().then(setHealth)
  }, [])

  useEffect(() => {
    if (isPaused) return
    let dir = 1
    const id = setInterval(() => {
      setBlend((b) => {
        let n = b + dir * 0.012
        if (n >= 1) {
          n = 1
          dir = -1
        }
        if (n <= 0) {
          n = 0
          dir = 1
          setHeroIdx((i) => (i + 1) % featured.length)
        }
        return n
      })
    }, 40)
    return () => clearInterval(id)
  }, [featured.length, isPaused])

  const hero = featured[heroIdx % featured.length]

  const counts = useMemo(
    () => ({
      all: monuments.length,
      lost: monuments.filter((m) => m.status !== 'intact').length,
      standing: monuments.filter((m) => m.status === 'intact' || m.status === 'rebuilt').length,
    }),
    [],
  )

  // Nearby list sorted by distance
  const nearbyList = useMemo(() => {
    if (geo.status === 'ok' && geo.pos) {
      return sortByDistance(monuments, geo.pos).slice(0, 3)
    }
    return monuments.slice(0, 3).map((monument) => ({ monument, km: undefined }))
  }, [geo])

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase()
    let items = monuments.filter((m) => {
      if (filter === 'lost') return m.status !== 'intact'
      if (filter === 'standing') return m.status === 'intact' || m.status === 'rebuilt'
      return true
    })
    if (needle) {
      items = items.filter((m) =>
        [m.name, m.nameHi, m.nameTa || '', m.nameBn || '', m.city, m.state, m.style, m.builder, ...m.keywords].some((s) =>
          s.toLowerCase().includes(needle),
        ),
      )
    }
    if (filter === 'nearby' && geo.status === 'ok' && geo.pos) {
      return sortByDistance(items, geo.pos)
    }
    return items.map((monument) => ({ monument, km: undefined as number | undefined }))
  }, [q, filter, geo])

  const nextHero = () => {
    setIsPaused(true)
    setHeroIdx((i) => (i + 1) % featured.length)
    setBlend(0)
  }

  const prevHero = () => {
    setIsPaused(true)
    setHeroIdx((i) => (i - 1 + featured.length) % featured.length)
    setBlend(0)
  }

  return (
    <>
      {/* Cinematic Hero */}
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow-pill">
            <span className="eyebrow-spark">✦</span>
            <span className="eyebrow-text">Open Source Archaeological AR/VR</span>
          </div>

          <h1 className="hero-headline">
            {pick('See India’s ', 'भारत के ')}
            <em className="gold-text-glow">{pick('lost monuments', 'खोए स्मारकों')}</em>
            {pick(' rise again', ' को फिर खड़ा देखें')}
          </h1>

          <p className="hero-desc">{t('heroText')}</p>

          <div className="cta">
            {/* Primary Button: Point & Discover */}
            <Link to="/scan" className="btn btn-primary btn-lg" aria-label="Point camera at monument and discover history">
              <span className="btn-icon-symbol" aria-hidden>📷</span> {t('pointAndDiscover')}
            </Link>
            <a href="#browse" className="btn btn-glass btn-lg">
              <span className="btn-icon-symbol" aria-hidden>🏛️</span> {t('browseCta')}
            </a>
          </div>

          {health !== 'loading' && (!health || !health.hasKey) && (
            <div className="notice" style={{ marginTop: 18 }} role="alert">
              {pick(
                'Gemini API key not configured — offline 3D models and verified timeline remain fully functional.',
                'Gemini API कुंजी अनुपलब्ध है — ऑफ़लाइन 3D मॉडल और समय-रेखा पूरी तरह सक्रिय हैं।',
              )}
            </div>
          )}
        </div>

        {/* Hero Visual 3D Stage with Arch Mask */}
        <div className="hero-visual arch-card">
          <JharokhaFrame />
          <Viewer3D monument={hero} blend={blend} />

          {/* Top HUD inside 3D viewer */}
          <div className="hero-top-hud">
            <Link to={`/monument/${hero.id}`} className="glass hero-chip" title="Explore monument details">
              <span className="hero-chip-emoji">{hero.emoji}</span>
              <div className="hero-chip-meta">
                <span className="hero-chip-title">{monumentName(hero)}</span>
                <span className="hero-chip-sub">
                  {hero.city} · {hero.thenYear} CE
                </span>
              </div>
              <span className="hero-chip-arrow" aria-hidden>→</span>
            </Link>

            <div className="hero-hud-right">
              <ConfidenceChip
                confidence={hero.confidence}
                rationale={hero.confidenceRationale}
                sources={hero.sources}
                monumentName={hero.name}
                compact
              />
              <div className="hero-nav-controls">
                <button
                  type="button"
                  className="hud-ctrl-btn"
                  onClick={prevHero}
                  title="Previous monument"
                  aria-label="Previous monument"
                >
                  ‹
                </button>
                <button
                  type="button"
                  className={`hud-ctrl-btn ${isPaused ? 'paused' : ''}`}
                  onClick={() => setIsPaused((p) => !p)}
                  title={isPaused ? 'Resume auto transition' : 'Pause on current monument'}
                  aria-label={isPaused ? 'Resume' : 'Pause'}
                >
                  {isPaused ? '▶' : '⏸'}
                </button>
                <button
                  type="button"
                  className="hud-ctrl-btn"
                  onClick={nextHero}
                  title="Next monument"
                  aria-label="Next monument"
                >
                  ›
                </button>
              </div>
            </div>
          </div>

          {/* Signature Time Slider */}
          <div className="slider-wrap">
            <TimeSlider
              monument={hero}
              value={blend}
              onChange={(v) => {
                setIsPaused(true)
                setBlend(v)
              }}
              compact
            />
          </div>
        </div>
      </section>

      {/* Museum Stats & Standards */}
      <ul className="stats" aria-label="Archaeological overview">
        <li>
          <div className="stat-icon">🛕</div>
          <div className="stat-info">
            <b>{monuments.length}</b>
            <span>{t('statMonuments')}</span>
          </div>
        </li>
        <li>
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <b>{monuments.length * 2}</b>
            <span>{t('statThenNow')}</span>
          </div>
        </li>
        <li>
          <div className="stat-icon">📜</div>
          <div className="stat-info">
            <b>ASI & UNESCO</b>
            <span>Cited Sources</span>
          </div>
        </li>
        <li>
          <div className="stat-icon">🌐</div>
          <div className="stat-info">
            <b>EN · हिं · த · বা</b>
            <span>{t('statLang')}</span>
          </div>
        </li>
      </ul>

      {/* Nearby Monuments Shelf */}
      <section className="nearby-shelf">
        <div className="shelf-header">
          <div>
            <span className="eyebrow-pill">
              <span className="eyebrow-spark">📍</span>
              <span>{geo.status === 'ok' ? 'Based on GPS' : 'Suggested Sites'}</span>
            </span>
            <h2 className="shelf-title">{t('nearYou')}</h2>
          </div>
          <Link to="/scan" className="shelf-link">
            <span>📷 {t('pointAndDiscover')}</span> →
          </Link>
        </div>

        <div className="grid nearby-grid">
          {nearbyList.map(({ monument, km }) => (
            <MonumentCard key={monument.id} m={monument} km={km} />
          ))}
        </div>
      </section>

      {/* Main Catalog Search & Filter */}
      <section id="browse" className="browse">
        <header className="section-head">
          <LotusDivider />
          <h2>{t('all')} {t('statMonuments')}</h2>
          <p>{t('tagline')}</p>
        </header>

        <div className="toolbar">
          <div className="search-wrap">
            <span className="search-icon" aria-hidden>🔍</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t('search')}
              aria-label={t('search')}
            />
            {q && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setQ('')}
                aria-label="Clear search query"
              >
                ✕
              </button>
            )}
          </div>

          <div className="chips" role="radiogroup" aria-label="Filter monuments">
            <button
              type="button"
              className={`chip ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
              role="radio"
              aria-checked={filter === 'all'}
            >
              {t('all')} <span className="chip-badge">{counts.all}</span>
            </button>
            <button
              type="button"
              className={`chip ${filter === 'lost' ? 'active' : ''}`}
              onClick={() => setFilter('lost')}
              role="radio"
              aria-checked={filter === 'lost'}
            >
              {t('lostOnly')} <span className="chip-badge">{counts.lost}</span>
            </button>
            <button
              type="button"
              className={`chip ${filter === 'standing' ? 'active' : ''}`}
              onClick={() => setFilter('standing')}
              role="radio"
              aria-checked={filter === 'standing'}
            >
              {t('standing')} <span className="chip-badge">{counts.standing}</span>
            </button>
            <button
              type="button"
              className={`chip ${filter === 'nearby' ? 'active' : ''}`}
              onClick={() => setFilter('nearby')}
              role="radio"
              aria-checked={filter === 'nearby'}
            >
              📍 {t('nearby')}
            </button>
          </div>
        </div>

        {filter === 'nearby' && geo.status === 'locating' && <div className="notice">{t('locating')}</div>}
        {filter === 'nearby' && geo.status === 'denied' && <div className="notice">{t('locationDenied')}</div>}

        {list.length === 0 ? (
          <div className="empty-state arch-card">
            <div className="empty-icon" aria-hidden>🏛️</div>
            <h3>No Monuments Found</h3>
            <p>No cataloged monuments match "{q}".</p>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                setQ('')
                setFilter('all')
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid">
            {list.map(({ monument, km }) => (
              <MonumentCard key={monument.id} m={monument} km={km} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
