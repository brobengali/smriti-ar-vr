import { Route, Routes, useLocation } from 'react-router-dom'
import { Header } from './components/Header'
import { HomePage } from './pages/HomePage'
import { MonumentPage } from './pages/MonumentPage'
import { ScanPage } from './pages/ScanPage'
import { XRPage } from './pages/XRPage'
import { useI18n } from './lib/i18n'
import { LotusDivider } from './components/Motifs'

export function App() {
  const { t } = useI18n()
  const loc = useLocation()
  const immersive = loc.pathname.startsWith('/xr/')
  if (immersive) {
    return (
      <Routes>
        <Route path="/xr/:id" element={<XRPage />} />
      </Routes>
    )
  }
  return (
    <div className="app-root">
      <div className="tiranga" aria-hidden>
        <i />
        <i />
        <i />
      </div>
      <div className="atmosphere" aria-hidden />
      <div className="shell">
        <a className="skip" href="#main">
          Skip to content
        </a>
        <Header />
        <main id="main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/scan" element={<ScanPage />} />
            <Route path="/monument/:id" element={<MonumentPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </main>
        <footer className="footer">
          <LotusDivider />
          <p>{t('footer')}</p>
        </footer>
      </div>
    </div>
  )
}
