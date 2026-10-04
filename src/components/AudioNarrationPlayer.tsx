import { useEffect, useRef, useState } from 'react'
import type { Monument } from '../data/types'
import { useI18n } from '../lib/i18n'

export interface AudioNarrationPlayerProps {
  monument: Monument
}

export function AudioNarrationPlayer({ monument }: AudioNarrationPlayerProps) {
  const { lang, pick, monumentName } = useI18n()
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0) // 0 to 1
  const [showCaptions, setShowCaptions] = useState(true)
  const [rate, setRate] = useState<number>(1.0)
  const [currentCaption, setCurrentCaption] = useState('')
  const timerRef = useRef<number | null>(null)

  // Script-matched narration text
  const narrativeText = lang === 'hi'
    ? `${monument.nameHi}। ${monument.city}, ${monument.state} में स्थित। ${monument.summaryHi} इसके इतिहास का महत्वपूर्ण मोड़: ${monument.whatHappenedHi}`
    : `${monument.name}, located in ${monument.city}, ${monument.state}. ${monument.summary} Historical context of loss: ${monument.whatHappened}`

  const sentences = narrativeText.split(/([।.]\s*)/).filter((s) => s.trim().length > 3)

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
    if (timerRef.current) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
    setIsPlaying(false)
    setProgress(0)
    setCurrentCaption('')
  }

  const startAudio = () => {
    stopAudio()
    if (!('speechSynthesis' in window)) return

    const utter = new SpeechSynthesisUtterance(narrativeText)
    const voiceLangMap: Record<string, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      ta: 'ta-IN',
      bn: 'bn-IN',
    }
    utter.lang = voiceLangMap[lang] || 'en-US'
    utter.rate = rate

    const totalWords = narrativeText.split(/\s+/).length
    const estSeconds = Math.max(12, Math.round(totalWords / (2.5 * rate)))
    let elapsed = 0

    timerRef.current = window.setInterval(() => {
      elapsed += 0.5
      const pct = Math.min(1, elapsed / estSeconds)
      setProgress(pct)

      const sentenceIdx = Math.min(sentences.length - 1, Math.floor(pct * sentences.length))
      setCurrentCaption(sentences[sentenceIdx] || '')

      if (pct >= 1) {
        stopAudio()
      }
    }, 500)

    utter.onend = () => {
      stopAudio()
    }

    utter.onerror = () => {
      stopAudio()
    }

    window.speechSynthesis.speak(utter)
    setIsPlaying(true)
    setCurrentCaption(sentences[0] || '')
  }

  useEffect(() => {
    return () => stopAudio()
  }, [monument.id, lang])

  const toggleRate = () => {
    const nextRate = rate === 1.0 ? 1.25 : rate === 1.25 ? 0.85 : 1.0
    setRate(nextRate)
    if (isPlaying) {
      startAudio()
    }
  }

  return (
    <div className="audio-player-card">
      <div className="audio-player-head">
        <div className="audio-meta">
          <span className="audio-label">🎧 {pick('Museum Audio Guide', 'संग्रहालय ऑडियो गाइड')}</span>
          <span className="audio-title">{monumentName(monument)}</span>
        </div>
        <div className="audio-controls-top">
          <button
            type="button"
            className={`audio-rate-btn ${rate !== 1.0 ? 'active' : ''}`}
            onClick={toggleRate}
            title="Adjust playback speed"
            aria-label={`Playback speed: ${rate}x`}
          >
            {rate}x
          </button>
          <button
            type="button"
            className={`audio-cc-btn ${showCaptions ? 'active' : ''}`}
            onClick={() => setShowCaptions((c) => !c)}
            title="Toggle Closed Captions"
            aria-label="Toggle subtitles"
          >
            CC
          </button>
        </div>
      </div>

      <div className="audio-transport">
        <button
          type="button"
          className="audio-play-btn"
          onClick={isPlaying ? stopAudio : startAudio}
          aria-label={isPlaying ? 'Pause narration' : 'Play museum audio guide'}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        <div className="audio-progress-wrap">
          <div
            className="audio-progress-bar"
            role="progressbar"
            aria-valuenow={Math.round(progress * 100)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="audio-progress-fill" style={{ width: `${progress * 100}%` }} />
          </div>
          <div className="audio-timestamps">
            <span>{Math.floor(progress * 60)}s</span>
            <span>{isPlaying ? 'Narration Active' : 'Audio Guide'}</span>
            <span>~1m</span>
          </div>
        </div>
      </div>

      {showCaptions && (
        <div className="audio-caption-box" aria-live="polite">
          <span className="caption-tag">Subtitles</span>
          <p className="caption-text">
            {currentCaption || narrativeText.slice(0, 140) + '…'}
          </p>
        </div>
      )}
    </div>
  )
}
