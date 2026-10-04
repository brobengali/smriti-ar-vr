import { statusLabel } from '../data/monuments'
import type { MonumentStatus } from '../data/types'
import { useI18n } from '../lib/i18n'

export function StatusPill({ status, outline = false }: { status: MonumentStatus; outline?: boolean }) {
  const { lang } = useI18n()
  const s = statusLabel[status]
  return (
    <span className={`pill ${outline ? 'outline' : ''}`} style={{ ['--tone' as string]: s.tone }}>
      <span className="pill-dot" aria-hidden />
      <span>{lang === 'hi' ? s.hi : s.en}</span>
    </span>
  )
}
