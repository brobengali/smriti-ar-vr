import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Monument } from '../data/types'

export type Lang = 'en' | 'hi' | 'ta' | 'bn' | 'kn'

export interface LangOption {
  code: Lang
  label: string
  native: string
}

export const LANGUAGES: LangOption[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
]

const STRINGS: Record<string, Partial<Record<Lang, string>> & { en: string }> = {
  appName: { en: 'Smriti AR', hi: 'स्मृति AR', kn: 'ಸ್ಮೃತಿ AR', ta: 'ஸ்மிருதி AR', bn: 'স্মৃতি AR' },
  tagline: {
    en: 'Point. Discover. Travel back in time.',
    hi: 'पॉइंट करें। जानें। समय में पीछे जाएँ।',
    ta: 'சுட்டிக்காட்டவும். கண்டறியவும். காலப்பயணம் செய்க.',
    bn: 'চিহ্নিত করুন। আবিষ্কার করুন। অতীতে ফিরে যান।',
  },
  heroTitle: {
    en: "See India's lost monuments rise again",
    hi: 'भारत के खोए स्मारकों को फिर खड़ा देखें',
    ta: 'இந்தியாவின் இழந்த நினைவுச் சின்னங்கள் மீண்டும் எழுவதைக் காண்க',
    bn: 'ভারতের হারিয়ে যাওয়া স্মৃতিসৌধগুলিকে আবার পুনরুজ্জীবিত হতে দেখুন',
  },
  heroText: {
    en: 'Point your phone at a monument to identify it, explore verified 3D reconstructions, and slide between ruined present and architectural past.',
    hi: 'अपने फ़ोन को किसी स्मारक की ओर करें — उसे पहचानें, प्रमाणित 3D पुनर्निर्माण देखें, और खंडहर वर्तमान तथा मूल अतीत के बीच स्लाइड करें।',
    ta: 'நினைவுச் சின்னத்தை அடையாளம் காண உங்கள் தொலைபேசியைச் சுட்டிக்காட்டவும், சரிபார்க்கப்பட்ட 3D மறுசீரமைப்பைக் காணவும்.',
    bn: 'একটি স্মৃতিস্তম্ভকে শনাক্ত করতে আপনার ফোনটি ধরুন, যাচাইকৃত 3D পুনর্নির্মাণ দেখুন এবং অতীত ও বর্তমানের মধ্যে তুলনা করুন।',
  },
  pointAndDiscover: {
    en: 'Point & Discover',
    hi: 'पॉइंट करें और जानें',
    ta: 'சுட்டிக்காட்டி கண்டறியவும்',
    bn: 'চিহ্নিত করে আবিষ্কার করুন',
  },
  scanCta: {
    en: 'Point Camera at Monument',
    hi: 'कैमरा स्मारक की ओर करें',
    ta: 'கேமராவை சுட்டிக்காட்டவும்',
    bn: 'ক্যামেরা স্মৃতিস্তম্ভের দিকে তাক করুন',
  },
  browseCta: {
    en: 'Explore Catalog',
    hi: 'स्मारक सूची देखें',
    ta: 'தொகுப்பை ஆராய்க',
    bn: 'সংগ্রহ অন্বেষণ করুন',
  },
  nearby: { en: 'Nearby', hi: 'आस-पास', ta: 'அருகில்', bn: 'কাছাকাছি' },
  all: { en: 'All', hi: 'सभी', ta: 'அனைத்தும்', bn: 'সব' },
  lostOnly: { en: 'Ruined / Lost', hi: 'नष्ट / खंडहर', ta: 'இழந்தவை', bn: 'ধ্বংসপ্রাপ্ত' },
  standing: { en: 'Standing', hi: 'संरक्षित', ta: 'நிற்கும் சின்னங்கள்', bn: 'দণ্ডায়মান' },
  search: {
    en: 'Search by monument, city, dynasty, or style…',
    hi: 'स्मारक, शहर, राजवंश या शैली खोजें…',
    ta: 'நினைவுச்சின்னம், நகரம், வம்சம் தேடவும்…',
    bn: 'স্মৃতিস্তম্ভ, শহর বা রাজবংশ অনুসন্ধান করুন…',
  },
  then: { en: 'Original Form', hi: 'मूल स्वरूप', ta: 'பண்டைய வடிவம்', bn: 'আসল রূপ' },
  now: { en: 'Present State', hi: 'वर्तमान स्थिति', ta: 'தற்போதைய நிலை', bn: 'বর্তমান অবস্থা' },
  today: { en: 'Today (Ruin)', hi: 'आज (खंडहर)', ta: 'இன்று (சிதிலம்)', bn: 'আজ (ধ্বংসাবশেষ)' },
  reconstructed: { en: 'Reconstructed', hi: 'पुनर्निर्मित', ta: 'மறுசீரமைப்பு', bn: 'পুনর্নির্মিত' },
  timeSlider: { en: 'Time Slider', hi: 'समय स्लाइडर', ta: 'நேர ஸ்லைடர்', bn: 'সময় স্লাইডার' },
  viewAR: { en: 'View in AR', hi: 'AR में देखें', ta: 'AR இல் காண்க', bn: 'AR-এ দেখুন' },
  viewVR: { en: 'Enter VR / Explore', hi: 'VR / वर्चुअल वॉक', ta: 'VR ஆராய்க', bn: 'VR অন্বেষণ' },
  view3D: { en: '3D Gallery', hi: '3D गैलरी', ta: '3D காட்சியகம்', bn: '3D গ্যালারি' },
  history: { en: 'Historical Context', hi: 'ऐतिहासिक संदर्भ', ta: 'வரலாற்றுப் பின்னணி', bn: 'ঐতিহাসিক পটভূমি' },
  whatHappened: { en: 'Destruction & Alteration', hi: 'विनाश और परिवर्तन', ta: 'அழிவு மற்றும் மாற்றம்', bn: 'ধ্বংস এবং পরিবর্তন' },
  timeline: { en: 'Chronological Timeline', hi: 'समय-रेखा', ta: 'காலவரிசை', bn: 'কালপঞ্জি' },
  facts: { en: 'Archaeological Notes', hi: 'पुरातात्विक तथ्य', ta: 'தொல்பொருள் குறிப்புகள்', bn: 'প্রত্নতাত্ত্বিক তথ্য' },
  lostFeatures: { en: 'Lost Architectural Elements', hi: 'खोए स्थापत्य अंग', ta: 'இழந்த கட்டிடக்கலை கூறுகள்', bn: 'হারিয়ে যাওয়া স্থাপত্য উপাদান' },
  askGuide: { en: 'Ask Museum Guide', hi: 'संग्रहालय गाइड से पूछें', ta: 'வழிகாட்டியிடம் கேட்கவும்', bn: 'গাইডকে জিজ্ঞাসা করুন' },
  askPlaceholder: { en: 'Ask about builders, rituals, structural collapse…', hi: 'निर्माण, अनुष्ठान या पतन के बारे में पूछें…', ta: 'கட்டுமானம் அல்லது வரலாறு பற்றி கேட்கவும்…', bn: 'নির্মাণ বা ইতিহাস সম্পর্কে জিজ্ঞাসা করুন…' },
  send: { en: 'Inquire', hi: 'पूछें', ta: 'அனுப்புக', bn: 'জিজ্ঞাসা' },
  thinking: { en: 'Consulting archaeological archives…', hi: 'अभिलेखों का विश्लेषण हो रहा है…', ta: 'ஆவணங்களை ஆய்வு செய்கிறது…', bn: 'নথিপত্র পর্যালোচনা করা হচ্ছে…' },
  reimagine: { en: 'AI Impression of the Past', hi: 'अतीत की AI झलक', ta: 'AI வரலாற்று காட்சி', bn: 'AI ঐতিহাসিক দৃশ্য' },
  reimagineHint: { en: 'Generate a respectful artistic impression of intact form', hi: 'अखंड स्वरूप का एक कलात्मक ऐतिहासिक चित्रण बनाएँ', ta: 'முழுமையான வடிவத்தின் கலைக் காட்சி', bn: 'অক্ষত রূপের শৈল্পিক চিত্র তৈরি করুন' },
  reimagineDisclaimer: { en: 'Artistic impression synthesized from archaeological drawings; not an original photograph.', hi: 'पुरातात्विक रेखाचित्रों पर आधारित कलात्मक चित्रण; वास्तविक फ़ोटो नहीं।', ta: 'தொல்பொருள் வரைபடங்களின் அடிப்படையில் உருவாக்கப்பட்ட கலை வடிவம்.', bn: 'প্রত্নতাত্ত্বিক নকশার উপর ভিত্তি করে তৈরি শৈল্পিক চিত্র।' },
  generating: { en: 'Synthesizing historical impression…', hi: 'चित्रण तैयार किया जा रहा है…', ta: 'உருவாக்குகிறது…', bn: 'তৈরি করা হচ্ছে…' },
  built: { en: 'Period Built', hi: 'निर्माण काल', ta: 'கட்டப்பட்ட காலம்', bn: 'নির্মাণকাল' },
  builder: { en: 'Patron / Builder', hi: 'संरक्षक / निर्माता', ta: 'கட்டியவர்', bn: 'নির্মাতা' },
  style: { en: 'Architectural Style', hi: 'स्थापत्य शैली', ta: 'கட்டிடக்கலை பாணி', bn: 'স্থাপত্যশৈলী' },
  location: { en: 'Coordinates', hi: 'स्थान निर्देशांक', ta: 'அமைவிடம்', bn: 'অবস্থান' },
  unesco: { en: 'UNESCO World Heritage', hi: 'यूनेस्को विश्व धरोहर', ta: 'யுனெஸ்கோ பாரம்பரிய தளம்', bn: 'ইউনেস্কো বিশ্ব ঐতিহ্য' },

  // Confidence & Sources
  documented: { en: 'Documented', hi: 'प्रमाणित', ta: 'ஆவணப்படுத்தப்பட்டது', bn: 'নথিবদ্ধ' },
  inferred: { en: 'Inferred', hi: 'अनुमानित', ta: 'ஊகிக்கப்பட்டது', bn: 'অনুমানকৃত' },
  speculative: { en: 'Speculative', hi: 'काल्पनिक', ta: 'கருதுகோள்', bn: 'কাল্পনিক' },
  sources: { en: 'Sources & Citations', hi: 'स्रोत और संदर्भ', ta: 'ஆதாரங்கள் & சான்றுகள்', bn: 'উৎস ও তথ্যসূত্র' },
  confidenceTooltip: { en: 'Reconstruction Confidence Level', hi: 'पुनर्निर्माण प्रमाण स्तर', ta: 'மறுசீரமைப்பு நம்பிக்கை நிலை', bn: 'পুনর্নির্মাণ বিশ্বাসযোগ্যতা স্তর' },

  // Audio Narration & Captions
  audioNarration: { en: 'Audio Narration', hi: 'ऑडियो गाइड', ta: 'ஆடியோ வழிகாட்டி', bn: 'অডিও বিবরণ' },
  captions: { en: 'Captions', hi: 'उपशीर्षक', ta: 'வசனங்கள்', bn: 'ক্যাপশন' },
  listenStory: { en: 'Listen to Narration', hi: 'विवरण सुनें', ta: 'வரலாற்றைக் கேளுங்கள்', bn: 'বিবরণ শুনুন' },
  stopNarration: { en: 'Stop Audio', hi: 'ऑडियो रोकें', ta: 'நிறுத்துக', bn: 'অডিও বন্ধ করুন' },

  // Offline Packs
  offlinePacks: { en: 'Offline Packs', hi: 'ऑफ़लाइन पैक', ta: 'ஆஃப்லைன் தொகுப்பு', bn: 'অফলাইন প্যাক' },
  downloadPack: { en: 'Download AR Pack', hi: 'AR पैक डाउनलोड करें', ta: 'பதிவிறக்குக', bn: 'ডাউনলোড করুন' },
  downloaded: { en: 'Ready Offline', hi: 'ऑफ़लाइन उपलब्ध', ta: 'ஆஃப்லைனில் தயார்', bn: 'অফলাইনে প্রস্তুত' },
  storageUsed: { en: 'Storage Used', hi: 'प्रयुक्त मेमोरी', ta: 'பயன்படுத்திய சேமிப்பு', bn: 'ব্যবহৃত সঞ্চয়স্থান' },

  // Scan & AR
  scanTitle: { en: 'Point & Discover', hi: 'स्मारक की ओर पॉइंट करें', ta: 'சுட்டிக்காட்டி கண்டறியவும்', bn: 'চিহ্নিত করে আবিষ্কার' },
  scanHelp: { en: 'Frame any pillar, dome, or ruin. Gemini vision identifies the monument and places the reconstruction in AR.', hi: 'किसी स्तंभ, गुंबद या अवशेष को फ़्रेम में लें। AI दृष्टि स्मारक को पहचानकर 3D पुनर्निर्माण प्रस्तुत करती है।', ta: 'தூண் அல்லது கோபுரத்தை மையப்படுத்துங்கள். AI அதை அடையாளம் காணும்.', bn: 'যেকোনো স্তম্ভ বা গম্বুজ ফ্রেমে নিন। AI শনাক্ত করে 3D রূপ প্রদর্শন করবে।' },
  identify: { en: 'Analyze Frame', hi: 'पहचानें', ta: 'ஆராய்க', bn: 'বিশ্লেষণ করুন' },
  identifying: { en: 'Identifying monument…', hi: 'पहचान की जा रही है…', ta: 'அடையாளம் காண்கிறது…', bn: 'শনাক্ত করা হচ্ছে…' },
  retake: { en: 'Retake', hi: 'पुनः लें', ta: 'மீண்டும் எடுக்கவும்', bn: 'আবার নিন' },
  upload: { en: 'Upload Photo', hi: 'फ़ोटो चुनें', ta: 'புகைப்படம் பதிவேற்றுக', bn: 'ছবি আপলোড' },
  cameraError: { en: 'Camera not available. You can upload a photo or select a sample below.', hi: 'कैमरा उपलब्ध नहीं है। आप फ़ोटो चुन सकते हैं या नीचे दिए नमूने आज़मा सकते हैं।', ta: 'கேமரா கிடைக்கவில்லை. புகைப்படத்தைப் பதிவேற்றலாம்.', bn: 'ক্যামেরা অনুপলব্ধ। ছবি আপলোড করতে পারেন।' },
  matched: { en: 'Identified Monument', hi: 'पहचाना गया स्मारक', ta: 'கண்டறியப்பட்ட சின்னம்', bn: 'শনাক্তকৃত স্মৃতিস্তম্ভ' },
  confidence: { en: 'match confidence', hi: 'पहचान सटीकता', ta: 'நம்பகத்தன்மை', bn: 'নির্ভুলতা' },
  nearYou: { en: 'Monuments Near You', hi: 'आपके निकटवर्ती स्मारक', ta: 'அருகிலுள்ள சின்னங்கள்', bn: 'আপনার নিকটবর্তী স্মৃতিস্তম্ভ' },
  locating: { en: 'Calibrating GPS position…', hi: 'GPS स्थिति जाँची जा रही है…', ta: 'GPS கண்டறிகிறது…', bn: 'GPS অবস্থান নির্ণয় হচ্ছে…' },
  locationDenied: { en: 'Location off — showing full national catalog.', hi: 'लोकेशन बंद है — राष्ट्रीय संग्रह प्रदर्शित है।', ta: 'அமைவிடம் முடக்கப்பட்டுள்ளது.', bn: 'অবস্থান বন্ধ — সম্পূর্ণ তালিকা প্রদর্শিত।' },
  kmAway: { en: 'km away', hi: 'किमी दूर', ta: 'கி.மீ தொலைவில்', bn: 'কিমি দূরে' },

  // AR & VR Modes
  arTitle: { en: 'AR Spatial View', hi: 'AR स्थानिक दृश्य', ta: 'AR பார்வை', bn: 'AR দৃশ্য' },
  arHelp: { en: 'Pan device across the floor to detect horizontal surface, then tap to place.', hi: 'फ़र्श पहचानने के लिए फ़ोन धीरे घुमाएँ, फिर स्मारक स्थापित करने के लिए टैप करें।', ta: 'தரையை ஸ்கேன் செய்து தட்டவும்.', bn: 'মেঝে শনাক্ত করতে ফোনটি আস্তে ঘোরান এবং স্থাপন করুন।' },
  vrHelp: { en: 'Walk around the reconstructed structure in full 3D space.', hi: 'संपूर्ण 3D अंतरिक्ष में पुनर्निर्मित संरचना का अन्वेषण करें।', ta: '3D முறையில் பார்வையிடவும்.', bn: 'সম্পূর্ণ 3D স্থানে স্মৃতিসৌধটি ঘুরে দেখুন।' },
  size: { en: 'Scale Mode', hi: 'पैमाना', ta: 'அளவு', bn: 'স্কেল' },
  tabletop: { en: 'Tabletop (1:50)', hi: 'मेज़ पर (1:50)', ta: 'மேசை அளவு', bn: 'টেবিলটপ' },
  lifeSize: { en: 'Life-Size (1:1)', hi: 'वास्तविक आकार (1:1)', ta: 'உண்மை அளவு', bn: 'আসল আকার' },
  exit: { en: 'Close Portal', hi: 'बाहर निकलें', ta: 'வெளியேறு', bn: 'প্রস্থান' },
  statMonuments: { en: 'Cataloged Monuments', hi: 'अभिलेखित स्मारक', ta: 'பதிவான சின்னங்கள்', bn: 'নথিবদ্ধ স্মৃতিসৌধ' },
  statThenNow: { en: 'Chrono-Models', hi: 'काल-पुनर्निर्माण मॉडल', ta: 'கால மாதிரிகள்', bn: 'দ্বৈত মডেল' },
  statARVR: { en: 'AR & VR Ready', hi: 'AR और VR सक्षम', ta: 'AR / VR தயார்', bn: 'AR ও VR প্রস্তুত' },
  statLang: { en: '4 Indian Scripts', hi: '4 भारतीय लिपियाँ', ta: '4 இந்திய மொழிகள்', bn: '৪টি ভারতীয় ভাষা' },
}

interface I18nContextType {
  lang: Lang
  setLang: (l: Lang) => void
  t: (k: string) => string
  pick: (en: string, hi: string, ta?: string, bn?: string) => string
  monumentName: (m: Monument) => string
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => (localStorage.getItem('bv-lang') as Lang) || 'en')

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    localStorage.setItem('bv-lang', l)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const t = useCallback(
    (k: string): string => {
      const entry = STRINGS[k]
      if (!entry) return k
      return entry[lang] || entry['en'] || k
    },
    [lang],
  )

  const pick = useCallback(
    (en: string, hi: string, ta?: string, bn?: string, kn?: string): string => {
      if (lang === 'hi' && hi) return hi
      if (lang === 'kn' && kn) return kn
      if (lang === 'ta' && ta) return ta
      if (lang === 'bn' && bn) return bn
      return en
    },
    [lang],
  )

  const monumentName = useCallback(
    (m: Monument): string => {
      if (lang === 'hi' && m.nameHi) return m.nameHi
      if (lang === 'kn' && m.nameKn) return m.nameKn
      if (lang === 'ta' && m.nameTa) return m.nameTa
      if (lang === 'bn' && m.nameBn) return m.nameBn
      return m.name
    },
    [lang],
  )

  const value = useMemo(
    () => ({ lang, setLang, t, pick, monumentName }),
    [lang, setLang, t, pick, monumentName],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextType {
  const v = useContext(I18nContext)
  if (!v) throw new Error('useI18n outside provider')
  return v
}
