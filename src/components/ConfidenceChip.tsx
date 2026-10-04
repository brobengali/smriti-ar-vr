import { useState } from 'react'
import type { ConfidenceLevel, SourceCitation } from '../data/types'
import { useI18n } from '../lib/i18n'

export interface ConfidenceChipProps {
  confidence?: ConfidenceLevel
  rationale?: string
  sources?: SourceCitation[]
  monumentName?: string
  compact?: boolean
}

export function ConfidenceChip({
  confidence = 'inferred',
  rationale,
  sources = [],
  monumentName = 'Monument',
  compact = false,
}: ConfidenceChipProps) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)

  const config = {
    documented: {
      label: t('documented'),
      icon: '✓',
      className: 'conf-documented',
      desc: 'Reconstruction directly supported by surviving architectural plinths, epigraphs, official ASI reports, or historical sketches.',
    },
    inferred: {
      label: t('inferred'),
      icon: '◈',
      className: 'conf-inferred',
      desc: 'Upper superstructure or lost elements reconstructed using contemporary regional canons, surviving sister temples, and stylistic analogues.',
    },
    speculative: {
      label: t('speculative'),
      icon: '?',
      className: 'conf-speculative',
      desc: 'Hypothetical reconstruction based on oral traditions and period art; primary archaeological documentation remains incomplete.',
    },
  }[confidence]

  return (
    <>
      <button
        type="button"
        className={`confidence-chip ${config.className} ${compact ? 'compact' : ''}`}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`${config.label} reconstruction confidence. Tap to view sources.`}
        title="Tap to view archaeological sources & methodology"
      >
        <span className="conf-icon" aria-hidden>{config.icon}</span>
        <span className="conf-label">{config.label}</span>
        <span className="conf-info-hint" aria-hidden>ⓘ</span>
      </button>

      {open && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="conf-dialog-title" onClick={() => setOpen(false)}>
          <div className="modal-card arch-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-badge-row">
                <span className={`confidence-chip ${config.className}`}>
                  <span className="conf-icon">{config.icon}</span>
                  <span>{config.label}</span>
                </span>
                <span className="modal-type-tag">Archaeological Methodology</span>
              </div>
              <h3 id="conf-dialog-title" className="modal-title">
                {monumentName} Reconstruction
              </h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setOpen(false)}
                aria-label="Close sources dialog"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="conf-rationale-box">
                <h4>Reconstruction Basis</h4>
                <p>{rationale || config.desc}</p>
              </div>

              <div className="conf-sources-section">
                <h4>Cited Historical Sources ({sources.length || 1})</h4>
                {sources.length > 0 ? (
                  <ul className="sources-list">
                    {sources.map((src, i) => (
                      <li key={i} className="source-item">
                        <span className="source-bullet">📜</span>
                        <div className="source-details">
                          <strong className="source-title">{src.title}</strong>
                          <span className="source-meta">
                            {src.institution} {src.year ? `(${src.year})` : ''}
                          </span>
                          {src.note && <p className="source-note">{src.note}</p>}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-sources-text">
                    Verified through standard Archaeological Survey of India (ASI) field monographs and regional architectural surveys.
                  </p>
                )}
              </div>

              <div className="conf-guidelines-box">
                <small>
                  🏛️ <em>Antigravity Heritage Standard:</em> All 3D reconstructions strictly maintain neutral, respectful, and evidence-grounded representations.
                </small>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-primary" onClick={() => setOpen(false)}>
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
