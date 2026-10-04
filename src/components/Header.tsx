import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useI18n, LANGUAGES, type Lang } from '../lib/i18n'
import { useTheme } from '../lib/theme'
import { LogoMark } from './Motifs'
import { OfflineManager } from './OfflineManager'

export function Header() {
  const { t, lang, setLang } = useI18n()
  const { theme, toggleTheme } = useTheme()
  const loc = useLocation()
  const [open, setOpen] = useState(false)
  const [showOffline, setShowOffline] = useState(false)

  useEffect(() => {
    setOpen(false)
  }, [loc.pathname])

  useEffect(() => {
    document.body.classList.toggle('nav-lock', open)
    return () => document.body.classList.remove('nav-lock')
  }, [open])

  return (
    <>
      {open && <button type="button" className="nav-backdrop" aria-label={t('close')} onClick={() => setOpen(false)} />}
      <header className={`header${open ? ' is-open' : ''}`}>
        <NavLink to="/" className="brand" onClick={() => setOpen(false)}>
          <LogoMark />
          <span>
            {t('appName')}
            <small>{t('tagline')}</small>
          </span>
        </NavLink>

        <button
          className="nav-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? t('close') : t('menu')}
        >
          <span className="nav-toggle-bars" aria-hidden />
        </button>

        <nav id="site-nav" className="nav">
          <NavLink to="/" end onClick={() => setOpen(false)}>
            🏛️ <span>{t('browseCta')}</span>
          </NavLink>
          <NavLink to="/scan" onClick={() => setOpen(false)}>
            📷 <span>{t('pointAndDiscover')}</span>
          </NavLink>

          {/* Offline Packs Button */}
          <button
            type="button"
            className="header-tool-btn"
            onClick={() => setShowOffline(true)}
            title="Manage offline packs for zero-reception sites"
            aria-label="Open offline packs manager"
          >
            💾 <span className="hide-on-mobile">{t('offlinePacks')}</span>
          </button>

          {/* Theme Switcher */}
          <button
            type="button"
            className="header-tool-btn theme-toggle-btn"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Sandstone Light' : 'Indigo Dark'} theme`}
            aria-label={`Switch theme (currently ${theme})`}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Language Switcher */}
          <div className="lang-selector-wrap" role="group" aria-label="Language selection">
            <select
              className="lang-select"
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              aria-label="Select interface language"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.native} ({l.code.toUpperCase()})
                </option>
              ))}
            </select>
          </div>
        </nav>
      </header>

      <OfflineManager isOpen={showOffline} onClose={() => setShowOffline(false)} />
    </>
  )
}
