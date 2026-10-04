import { useEffect, useRef, useState } from 'react'
import type { Monument } from '../data/types'
import { askGuide, type ChatTurn } from '../lib/api'
import { useI18n } from '../lib/i18n'

const SUGGESTIONS: Record<string, string[]> = {
  en: ['Why was it destroyed?', 'Who built it and why?', 'What did it look like originally?', 'Best time to visit?'],
  hi: ['यह क्यों नष्ट हुआ?', 'इसे किसने और क्यों बनवाया?', 'मूल रूप में यह कैसा दिखता था?', 'घूमने का सबसे अच्छा समय?'],
  kn: ['ಇದು ಏಕೆ ನಾಶವಾಯಿತು?', 'ಇದನ್ನು ಯಾರು ಮತ್ತು ಏಕೆ ನಿರ್ಮಿಸಿದರು?', 'ಮೂಲತಃ ಇದು ಹೇಗೆ ಕಾಣುತ್ತಿತ್ತು?', 'ಭೇಟಿ ನೀಡಲು ಉತ್ತಮ ಸಮಯ ಯಾವುದು?'],
  ta: ['இது ஏன் அழிக்கப்பட்டது?', 'இதை யார் எதற்காக கட்டினார்கள்?', 'முதலில் இது எப்படி இருந்தது?', 'பார்வையிட சிறந்த நேரம் எது?'],
  bn: ['এটি কেন ধ্বংস হয়েছিল?', 'কে এটি নির্মাণ করেছিলেন এবং কেন?', 'মূল রূপে এটি কেমন দেখতে ছিল?', 'পরিদর্শন করার সেরা সময় কোনটি?'],
}

export function GuideChat({ monument }: { monument: Monument }) {
  const { t, lang, pick } = useI18n()
  const [history, setHistory] = useState<ChatTurn[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setHistory([])
    setError(null)
  }, [monument.id])

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' })
  }, [history, busy])

  async function ask(q: string) {
    const question = q.trim()
    if (!question || busy) return
    setInput('')
    setError(null)
    const next: ChatTurn[] = [...history, { role: 'user', text: question }]
    setHistory(next)
    setBusy(true)
    try {
      const answer = await askGuide(monument, question, history, lang)
      setHistory([...next, { role: 'model', text: answer }])
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="chat">
      {/* Archivist Status Bar */}
      <div className="chat-toolbar-micro">
        <span className="chat-archivist-status">
          <span className="live-dot" />
          {pick('AI Historian Online', 'AI इतिहासकार ऑनलाइन')}
        </span>
        {history.length > 0 && (
          <button
            type="button"
            className="chat-clear-btn"
            onClick={() => setHistory([])}
            title="Clear chat history"
          >
            {pick('Clear', 'साफ़ करें')}
          </button>
        )}
      </div>

      {/* Chat Transcript */}
      <div className="log" ref={logRef}>
        {history.length === 0 && (
          /* Welcome / Idle State — Archivist Card */
          <div className="archivist-welcome">
            <div className="archivist-avatar-wrap" aria-hidden>
              <div className="archivist-avatar">
                <span>🏛️</span>
                <span className="archivist-avatar-ring" />
              </div>
              <div className="archivist-avatar-glow" />
            </div>
            <div className="archivist-intro">
              <div className="archivist-role">
                <span className="archivist-role-icon" aria-hidden>✦</span>
                {pick('Royal Archivist', 'शाही अभिलेखागार')}
              </div>
              <p className="archivist-greeting">
                {pick(
                  `Namaste! I am your historical archivist for ${monument.name}. Ask me anything about its original design, the builder, ancient rituals, or the tragedy that altered it.`,
                  `नमस्ते! मैं ${monument.nameHi || monument.name} के लिए आपका ऐतिहासिक मार्गदर्शक हूँ। इसके मूल स्वरूप, निर्माण, और इसके इतिहास के बारे में कुछ भी पूछें।`,
                )}
              </p>
              <div className="archivist-badge-row">
                <span className="archivist-badge">📜 Sourced</span>
                <span className="archivist-badge">🔎 Cited</span>
                <span className="archivist-badge">🤝 Neutral tone</span>
              </div>
            </div>
          </div>
        )}

        {history.map((h, i) => (
          <div key={i} className={`msg ${h.role}`}>
            <div className="msg-avatar" aria-hidden>
              {h.role === 'model' ? '🏛️' : '👤'}
            </div>
            <div className="msg-bubble">
              <span className="msg-sender">
                {h.role === 'model' ? pick('Royal Archivist', 'शाही अभिलेखागार') : pick('You', 'आप')}
              </span>
              <div className="msg-body">{h.text}</div>
            </div>
          </div>
        ))}

        {busy && (
          <div className="msg model msg-typing">
            <div className="msg-avatar" aria-hidden>🏛️</div>
            <div className="msg-bubble">
              <div className="typing-dots">
                <span /><span /><span />
              </div>
            </div>
          </div>
        )}

        {error && <div className="error">⚠️ {error}</div>}
      </div>

      {/* Suggested Queries */}
      <div className="suggest">
        <div className="suggest-hint">
          <span aria-hidden>💡</span>
          <span>{pick('Suggested historical queries:', 'सुझाए गए ऐतिहासिक प्रश्न:')}</span>
        </div>
        <div className="suggest-chips-grid">
          {(SUGGESTIONS[lang] ?? SUGGESTIONS.en).map((s: string) => (
            <button
              key={s}
              type="button"
              onClick={() => ask(s)}
              disabled={busy}
              className="suggest-chip"
            >
              <span className="chip-spark" aria-hidden>✦</span>
              <span>{s}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form
        className="chat-form"
        onSubmit={(e) => {
          e.preventDefault()
          void ask(input)
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('askPlaceholder')}
          disabled={busy}
          className="chat-input"
        />
        <button className="btn btn-primary btn-sm chat-send-btn" type="submit" disabled={busy || !input.trim()}>
          {t('send')} ➔
        </button>
      </form>
    </div>
  )
}
