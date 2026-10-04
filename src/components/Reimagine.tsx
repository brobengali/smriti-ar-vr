import { useEffect, useState } from 'react'
import type { Monument } from '../data/types'
import { reimagine } from '../lib/api'
import { useI18n } from '../lib/i18n'

/* Humanise raw API error strings so users never see "500 Internal Server Error" */
function friendlyError(raw: string): string {
  const s = raw.toLowerCase()
  if (s.includes('quota') || s.includes('billing') || s.includes('free-tier') || s.includes('not enabled'))
    return 'Image generation requires a paid Gemini API key with image models enabled. The 3D reconstruction above works without it.'
  if (s.includes('429') || s.includes('rate limit') || s.includes('too many'))
    return 'Image generation quota reached. Please wait a minute and try again.'
  if (s.includes('503') || s.includes('overloaded') || s.includes('unavailable'))
    return 'The image model is temporarily busy. Try again in a moment.'
  if (s.includes('500') || s.includes('internal server'))
    return 'Something went wrong on the server. Please try again — it usually resolves quickly.'
  if (s.includes('network') || s.includes('fetch'))
    return 'Network error — check your connection and try again.'
  return raw.length > 120 ? raw.slice(0, 117) + '…' : raw
}

export function Reimagine({ monument }: { monument: Monument }) {
  const { t } = useI18n()
  const [img, setImg] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setImg(null)
    setError(null)
  }, [monument.id])

  async function go() {
    setBusy(true)
    setError(null)
    try {
      setImg(await reimagine(monument))
    } catch (e) {
      setError(friendlyError((e as Error).message))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="reimagine">
      {img ? (
        <>
          <div className="reimagine-img-wrap">
            <img src={img} alt={`${monument.name} — ${monument.thenLabel}`} />
            <div className="reimagine-img-label">
              <span aria-hidden>🎨</span>
              <span>{t('reimagineDisclaimer')}</span>
            </div>
          </div>
          <div className="reimagine-actions">
            <button className="btn btn-ghost btn-sm reimagine-regen-btn" onClick={go} disabled={busy}>
              {busy ? (
                <><span className="reimagine-spin" aria-hidden>↻</span> {t('generating')}</>
              ) : (
                <><span aria-hidden>↻</span> Regenerate</>
              )}
            </button>
          </div>
        </>
      ) : (
        <div className="reimagine-idle">
          {/* Decorative placeholder artwork */}
          <div className="reimagine-placeholder" aria-hidden>
            <div className="rp-arch-outer">
              <div className="rp-arch-inner">
                <div className="rp-silhouette">
                  <svg viewBox="0 0 80 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M40 5 C18 5 8 22 8 38 C8 55 18 64 28 68 L28 82 L52 82 L52 68 C62 64 72 55 72 38 C72 22 62 5 40 5Z"
                      fill="currentColor" opacity="0.22"/>
                    <rect x="34" y="72" width="4" height="10" fill="currentColor" opacity="0.35"/>
                    <rect x="42" y="72" width="4" height="10" fill="currentColor" opacity="0.35"/>
                    <path d="M40 12 C24 12 14 26 14 38 C14 52 24 60 34 63 L34 72 L46 72 L46 63 C56 60 66 52 66 38 C66 26 56 12 40 12Z"
                      fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.45"/>
                    <circle cx="40" cy="38" r="8" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.5"/>
                    <circle cx="40" cy="38" r="3" fill="currentColor" opacity="0.4"/>
                  </svg>
                </div>
                <span className="rp-sparkle" aria-hidden>✦</span>
              </div>
            </div>
          </div>

          <div className="reimagine-cta-text">
            <p className="reimagine-hint-text">{t('reimagineHint')}</p>
          </div>

          <button className="btn btn-primary reimagine-trigger" onClick={go} disabled={busy}>
            {busy ? (
              <><span className="reimagine-spin" aria-hidden>✨</span> {t('generating')}</>
            ) : (
              <>✨ {t('reimagine')} · {monument.thenYear}</>
            )}
          </button>

          <p className="disclaimer">{t('reimagineDisclaimer')}</p>
        </div>
      )}

      {error && (
        <div className="reimagine-notice" role="alert">
          <span className="reimagine-notice-icon" aria-hidden>ℹ️</span>
          <div className="reimagine-notice-body">
            <strong className="reimagine-notice-title">Image Generation Unavailable</strong>
            <p className="reimagine-notice-msg">{error}</p>
          </div>
        </div>
      )}
    </div>
  )
}
