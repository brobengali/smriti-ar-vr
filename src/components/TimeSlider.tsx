import type { Monument } from '../data/types'
import { useI18n } from '../lib/i18n'

export interface TimeSliderProps {
  monument: Monument
  value: number
  onChange: (v: number) => void
  compact?: boolean
}

/** 0 = Then, 1 = Now */
export function TimeSlider({ monument, value, onChange, compact = false }: TimeSliderProps) {
  const { t } = useI18n()
  const pct = Math.round(value * 100)

  return (
    <div
      className={`time-slider glass ${compact ? 'compact' : ''}`}
      role="group"
      aria-label={t('timeSlider')}
      style={{ ['--progress' as string]: `${pct}%` }}
    >
      <div className="time-slider-head">
        <button
          type="button"
          className={`lbl ${value <= 0.15 ? 'active' : ''}`}
          onClick={() => onChange(0)}
          title="Jump to ancient original state"
        >
          <span className="lbl-tag">🕰️ {t('then')}</span>
          <span className="lbl-year">{monument.thenYear}</span>
        </button>

        <div className="time-slider-center">
          <span className="chrono-badge">
            {value < 0.1 ? monument.thenLabel : value > 0.9 ? monument.nowLabel : `${100 - pct}% Past · ${pct}% Present`}
          </span>
          {!compact && (
            <div className="time-presets" aria-label="Quick jump">
              <button type="button" className={`preset-btn ${value === 0 ? 'active' : ''}`} onClick={() => onChange(0)}>
                0%
              </button>
              <button type="button" className={`preset-btn ${Math.abs(value - 0.5) < 0.05 ? 'active' : ''}`} onClick={() => onChange(0.5)}>
                50%
              </button>
              <button type="button" className={`preset-btn ${value === 1 ? 'active' : ''}`} onClick={() => onChange(1)}>
                100%
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          className={`lbl right ${value >= 0.85 ? 'active' : ''}`}
          onClick={() => onChange(1)}
          title="Jump to modern present state"
        >
          <span className="lbl-tag">📅 {t('now')}</span>
          <span className="lbl-year">{new Date().getFullYear()}</span>
        </button>
      </div>

      <div className="time-track-wrap">
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={t('timeSlider')}
          className="time-range-input"
        />
        <div className="time-track-glow" aria-hidden />
      </div>
    </div>
  )
}
