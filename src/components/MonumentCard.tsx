import { Link } from 'react-router-dom'
import type { Monument } from '../data/types'
import { useI18n } from '../lib/i18n'
import { formatKm } from '../lib/geo'
import { StatusPill } from './StatusPill'
import { ConfidenceChip } from './ConfidenceChip'
import { JharokhaFrame } from './Motifs'

export function MonumentCard({ m, km }: { m: Monument; km?: number }) {
  const { t, monumentName, lang } = useI18n()

  const nativeName = lang === 'hi' ? m.nameHi : lang === 'ta' ? m.nameTa || m.name : lang === 'bn' ? m.nameBn || m.name : m.nameHi

  return (
    <Link
      to={`/monument/${m.id}`}
      className="card arch-card"
      style={{ ['--accent' as string]: m.accent }}
      aria-label={`${m.name}, ${m.city}, ${m.state}. Reconstruction status: ${m.status}`}
    >
      <div className="thumb arch-mask">
        <JharokhaFrame />
        <div className="thumb-badges">
          <StatusPill status={m.status} />
          <ConfidenceChip
            confidence={m.confidence}
            rationale={m.confidenceRationale}
            sources={m.sources}
            monumentName={m.name}
            compact
          />
        </div>

        <span className="thumb-emoji" aria-hidden>
          {m.emoji}
        </span>

        <div className="thumb-meta-bottom">
          <span className="thumb-style">{m.style}</span>
          <span className="thumb-year">{m.thenYear} CE</span>
        </div>
      </div>

      <div className="body">
        <div className="title-row">
          <h3 className="card-monument-title">{monumentName(m)}</h3>
          <span className="card-arrow" aria-hidden>→</span>
        </div>

        {nativeName && nativeName !== m.name && (
          <div className="sub bilingual">{nativeName}</div>
        )}

        <div className="sub loc-sub">
          📍 {m.city}, {m.state}
        </div>

        <div className="meta">
          <span className="era-span">
            ⏳ {m.thenYear} → {t('now')}
          </span>
          {typeof km === 'number' ? (
            <span className="dist-span">
              📍 {formatKm(km)} {t('kmAway')}
            </span>
          ) : (
            <span className="builder-span">{m.built}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
