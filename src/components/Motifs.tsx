/** Decorative Indian motifs used as frames, dividers and the brand mark. */

export function LogoMark() {
  return (
    <svg className="logo-mark" viewBox="0 0 48 48" aria-hidden>
      <defs>
        <linearGradient id="lm-g" x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f6d48a" />
          <stop offset="0.55" stopColor="#e0a84a" />
          <stop offset="1" stopColor="#c96a1a" />
        </linearGradient>
      </defs>
      <circle cx="24" cy="24" r="23" fill="url(#lm-g)" />
      <circle cx="24" cy="24" r="20.5" fill="none" stroke="#6b3a10" strokeOpacity="0.35" />
      {/* kalasha + shikhara */}
      <path
        d="M24 7.5c1.2 2.4 1.6 3.6 0 5.2-1.6-1.6-1.2-2.8 0-5.2Z"
        fill="#5a2c0c"
      />
      <path
        d="M24 12.2c6.4 3.2 8.8 8.4 8.2 14.6H15.8c-.6-6.2 1.8-11.4 8.2-14.6Z"
        fill="#5a2c0c"
      />
      <rect x="16.2" y="26.6" width="15.6" height="4.2" rx="0.6" fill="#5a2c0c" />
      <path d="M14 30.8h20l1.6 3.4H12.4L14 30.8Z" fill="#5a2c0c" />
      <rect x="13.4" y="34.2" width="21.2" height="3.2" rx="0.5" fill="#5a2c0c" />
      <circle cx="24" cy="20.4" r="1.5" fill="#f6d48a" />
    </svg>
  )
}

export function LotusDivider() {
  return (
    <div className="lotus-div" aria-hidden>
      <span className="lotus-div-line" />
      <svg viewBox="0 0 64 28" className="lotus-svg">
        <path
          d="M32 24c-2.4-5.2-8-8.8-14.8-9.2 5.2-1.6 9.2-5.2 11.2-10C30 9.6 32 12 32 12s2-2.4 3.6-7.2c2 4.8 6 8.4 11.2 10C40 15.2 34.4 18.8 32 24Z"
          fill="currentColor"
        />
        <circle cx="32" cy="14" r="2.2" fill="#f6d48a" />
      </svg>
      <span className="lotus-div-line" />
    </div>
  )
}

export function JharokhaFrame() {
  return (
    <div className="jharokha" aria-hidden>
      <i className="ornament tl" />
      <i className="ornament tr" />
      <i className="ornament bl" />
      <i className="ornament br" />
    </div>
  )
}
