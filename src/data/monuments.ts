import type { Monument, Part } from './types'

// ---- shared colour palette -------------------------------------------------
const SANDSTONE = '#c9885a'
const RED_SANDSTONE = '#a8452e'
const KHONDALITE = '#8d7257' // Konark's dark stone
const BRICK = '#9c4b2f'
const MARBLE = '#efe9df'
const GRANITE = '#8f8a7e'
const LIMESTONE = '#d8c9a8'
const GREY_STONE = '#9a978d'
const PINK = '#d98f74'
const RUBBLE = '#7e7466'

// ---- helpers for repetitive geometry ---------------------------------------
function range(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i)
}

/** Konark-style chariot wheels along both long sides of a plinth */
function wheels(count: number, spanX: number, z: number, y: number, r: number): Part[] {
  const out: Part[] = []
  range(count).forEach((i) => {
    const x = -spanX / 2 + (spanX / (count - 1)) * i
    out.push({ type: 'wheel', r, p: [x, y, z], color: KHONDALITE })
    out.push({ type: 'wheel', r, p: [x, y, -z], color: KHONDALITE })
  })
  return out
}

/** A ring of small corner towers / bastions */
function bastions(w: number, d: number, r: number, h: number, color: string, crenels = true): Part[] {
  return [
    { type: 'tower', r, h, crenels, p: [-w / 2, 0, -d / 2], color },
    { type: 'tower', r, h, crenels, p: [w / 2, 0, -d / 2], color },
    { type: 'tower', r, h, crenels, p: [-w / 2, 0, d / 2], color },
    { type: 'tower', r, h, crenels, p: [w / 2, 0, d / 2], color },
  ]
}

function orchard(w: number, d: number, nx: number, nz: number, h = 6, r = 2.5): Part[] {
  const out: Part[] = []
  range(nx).forEach((i) =>
    range(nz).forEach((j) => {
      const x = -w / 2 + (w / (nx - 1)) * i
      const z = -d / 2 + (d / (nz - 1)) * j
      out.push({ type: 'tree', h: h + ((i * 7 + j * 3) % 4), r, p: [x, 0, z] })
    }),
  )
  return out
}

// ---------------------------------------------------------------------------
export const monuments: Monument[] = [
  // =========================================================================
  // HAMPI MONUMENTS (CORE SEED DATA)
  // =========================================================================
  {
    id: 'virupaksha-temple',
    name: 'Virupaksha Temple',
    nameHi: 'विरूपाक्ष मंदिर',
    nameKn: 'ವಿರೂಪಾಕ್ಷ ದೇವಾಲಯ',
    nameTa: 'விருபாக்ஷா கோவில்',
    nameBn: 'বিরূপাক্ষ মন্দির',
    city: 'Hampi',
    state: 'Karnataka',
    lat: 15.3353,
    lng: 76.46,
    built: '7th–16th Century CE',
    builder: 'Sage Vidyaranya, expanded by Deva Raya II & Krishnadevaraya',
    style: 'Vijayanagara Dravidian Temple Architecture',
    status: 'intact',
    confidence: 'documented',
    confidenceRationale:
      'SAMPLE - needs scholar review. Extant standing 50m Rajagopuram and Ranga Mandapa are corroborated by Epigraphia Carnatica Vol. IX and A.H. Longhurst (1917). Golden pinnacles and Krishnadevaraya murals documented in court records.',
    sources: [
      {
        title: 'Hampi Ruins Described and Illustrated',
        institution: 'A. H. Longhurst / ASI',
        year: '1917',
        url: 'https://archive.org/details/hampiruinsdescri00long',
        note: 'Superintendent, Archaeological Survey Department, Southern Circle, pp. 95-108.',
      },
      {
        title: 'Epigraphia Carnatica Volume IX',
        institution: 'B. Lewis Rice / Mysore Archaeological Series',
        year: '1905',
        note: 'Epigraphs of the Vijayanagara Rulers at Hampi, Inscription No. 129.',
      },
      {
        title: 'A Forgotten Empire (Vijayanagar)',
        institution: 'Robert Sewell',
        year: '1900',
        note: 'Chronicles of Domingos Paes and Fernao Nuniz, pp. 240-275.',
      },
    ],
    reconstruction: {
      model_path: 'models/virupaksha-temple.glb',
      confidence: 'documented',
      evidence_notes:
        'SAMPLE - needs scholar review. Ground plan and extant superstructure documented in ASI Epigraphia Carnatica Vol. IX.',
      reviewer: 'ASI Archaeological Research Group / SAMPLE',
      review_date: '2026-03-15',
    },
    scholarReviewStatus: 'needs_review',
    fileSizeMb: 18.4,
    unesco: true,
    emoji: '🛕',
    accent: '#c85a32',
    summary:
      'SAMPLE - needs scholar review. Continuous living temple dedicated to Shiva as Virupaksha on the southern bank of the Tungabhadra River. Features a 50-metre eastern gopuram, pillared ranga mandapa, and inverted pinhole shadow optical phenomenon.',
    summaryHi:
      'नमूना - विद्वान समीक्षा आवश्यक। तुंगभद्रा नदी के तट पर भगवान शिव को समर्पित निरंतर पूजा का जीवंत मंदिर। इसमें 50 मीटर ऊँचा राजगोपुरम और रंग मंडप स्थित है।',
    summaryKn: 'ಮಾದರಿ - ವಿದ್ವಾಂಸರ ಪರಿಶೀಲನೆ ಅಗತ್ಯ. ತುಂಗಭದ್ರಾ ನದಿಯ ದಡದಲ್ಲಿರುವ ಶ್ರೀ ವಿರೂಪಾಕ್ಷನ ಸಕ್ರಿಯ ದೇವಾಲಯ ಸಂಕೀರ್ಣ.',
    whatHappened:
      'While Vijayanagara was sacked in 1565 following the Battle of Talikota, the sanctum of Virupaksha Temple survived wholesale destruction and continued daily puja unbroken through the centuries.',
    whatHappenedHi:
      '1565 में तालिकोटा के युद्ध के बाद हम्पी का विध्वंस हुआ, परंतु विरूपाक्ष मंदिर के गर्भगृह की दैनिक पूजा अनवरत जारी रही और यह आज भी जीवंत मंदिर है।',
    timeline: [
      { year: 'c. 700', event: 'Earliest shrine foundations during Chalukyan and Rashtrakuta eras.', kind: 'build' },
      { year: '1336', event: 'Foundation of Vijayanagara capital under Sage Vidyaranya and Sangama brothers.', kind: 'other' },
      { year: '1510', event: 'Emperor Krishnadevaraya commissions the 50m Rajagopuram and grand pillared Ranga Mandapa upon his coronation.', kind: 'build' },
      { year: '1565', event: 'Battle of Talikota and sacking of Vijayanagara; sanctum survived continuous worship.', kind: 'destroy' },
      { year: '1986', event: 'Inscribed as a UNESCO World Heritage Site (Group of Monuments at Hampi).', kind: 'restore' },
    ],
    facts: [
      'The eastern gateway creates a natural camera obscura: an inverted shadow of the 50m gopuram falls through a pinhole onto an inner wall.',
      'Krishnadevaraya gifted gold-plated ritual vessels and commissioned vivid Ramayana and Mahabharata ceiling frescoes in the Ranga Mandapa.',
      'It is one of the few monumental structures in Hampi where worship never ceased following the 1565 cataclysm.',
    ],
    thenLabel: 'c. 1510 CE — Krishnadevaraya Coronation Era',
    thenYear: '1510',
    nowLabel: 'Present — Continuous Living Temple',
    footprint: 32,
    keywords: ['hampi', 'virupaksha', 'gopuram', 'mandapa', 'tungabhadra', 'krishnadevaraya', 'shiva'],
    then: [
      { type: 'plinth', w: 28, d: 42, h: 1.5, p: [0, 0, 0], color: GRANITE },
      { type: 'gopuram', w: 12, d: 8, h: 32, tiers: 9, p: [0, 1.5, 16], color: SANDSTONE },
      { type: 'hall', w: 18, d: 22, h: 7, cols: 6, rows: 6, roof: true, p: [0, 1.5, -4], color: GRANITE },
      { type: 'shikhara', r: 5, h: 16, ribs: 8, p: [0, 8.5, -17], color: SANDSTONE },
    ],
    now: [
      { type: 'plinth', w: 28, d: 42, h: 1.5, p: [0, 0, 0], color: GRANITE },
      { type: 'gopuram', w: 12, d: 8, h: 32, tiers: 9, p: [0, 1.5, 16], color: SANDSTONE },
      { type: 'hall', w: 18, d: 22, h: 7, cols: 6, rows: 6, roof: true, p: [0, 1.5, -4], color: GRANITE },
      { type: 'shikhara', r: 5, h: 16, ribs: 8, p: [0, 8.5, -17], color: SANDSTONE },
    ],
  },
  {
    id: 'vittala-stone-chariot',
    name: 'Vittala Temple Stone Chariot',
    nameHi: 'विट्ठल मंदिर का पत्थर का रथ',
    nameKn: 'ವಿಜಯ ವಿಠ್ಠಲ ಕಲ್ಲಿನ ರಥ',
    nameTa: 'விட்டலா கோவில் கல் தேர்',
    nameBn: 'বিট্টল মন্দিরের পাথরের রথ',
    city: 'Hampi',
    state: 'Karnataka',
    lat: 15.3385,
    lng: 76.4795,
    built: 'c. 1513 CE',
    builder: 'Emperor Krishnadevaraya (Tuluva Dynasty)',
    style: 'Vijayanagara Monolithic Stone Shrine',
    status: 'ruined',
    confidence: 'documented',
    confidenceRationale:
      'SAMPLE - needs scholar review. The lost brick-and-mortar tiered shikhara is verified in 1856 albumen photographs by Alexander Greenlaw (Alkazi Collection) before its removal by conservators around 1890.',
    sources: [
      {
        title: "Alexander Greenlaw's 1856 Calotype Photographs of Vijayanagara",
        institution: 'Alkazi Foundation / National Science and Media Museum',
        year: '1856',
        note: 'Plate 24 showing chariot with intact brick shikhara tower.',
      },
      {
        title: 'Vijayanagara Architectural Inventory – Vittala Complex',
        institution: 'George Michell & Phillip B. Wagoner / AIIS',
        year: '2001',
        note: 'Archaeological Survey Series Vol. IV, pp. 112-140.',
      },
      {
        title: 'City of Victory - Vijayanagara',
        institution: 'John M. Fritz & George Michell',
        year: '1991',
        note: 'Aperture Foundation, Monograph on Sacred Centre architecture, pp. 64-78.',
      },
    ],
    reconstruction: {
      model_path: 'models/vittala-stone-chariot.glb',
      confidence: 'documented',
      evidence_notes:
        'SAMPLE - needs scholar review. Missing brick shikhara tower modeled from 1856 Greenlaw photo archives.',
      reviewer: 'ASI Archaeological Survey / SAMPLE',
      review_date: '2026-03-20',
    },
    scholarReviewStatus: 'needs_review',
    fileSizeMb: 14.8,
    unesco: true,
    emoji: '🛞',
    accent: '#c5a059',
    summary:
      'SAMPLE - needs scholar review. Iconic monolithic shrine built in the form of a ceremonial temple chariot (ratha) dedicated to Garuda within the grand Vijaya Vittala temple complex. Originally possessed a multi-tiered brick-and-mortar shikhara tower dismantled in late 19th-century preservation efforts.',
    summaryHi:
      'नमूना - विद्वान समीक्षा आवश्यक। गरुड़ को समर्पित मंदिर रथ के आकार में गढ़ा गया उत्कृष्ट पाषाण शिल्प, जिसके ऊपर मूल रूप से ईंट-गारे का शिखर था।',
    summaryKn: 'ಮಾದರಿ - ವಿದ್ವಾಂಸರ ಪರಿಶೀಲನೆ ಅಗತ್ಯ. ವಿಜಯ ವಿಠ್ಠಲ ಸಂಕೀರ್ಣದ ಗರುಡ ರಥ. ಮೂಲತಃ ಇಟ್ಟಿಗೆ-ಗಾರೆ ಶಿಖರವನ್ನು ಹೊಂದಿತ್ತು.',
    whatHappened:
      'Following the 1565 sacking of Hampi, the chariot lost its sanctum deity. In the 1890s, the cracked brick-and-stucco tower atop the chariot was dismantled by British engineers to prevent its collapse from crushing the stone wheels.',
    whatHappenedHi:
      '1565 में शहर के पतन के बाद रथ की गरुड़ प्रतिमा हटाई गई। 1890 के दशक में अंग्रेज़ इंजीनियरों ने पहियों को ढहने से बचाने के लिए ऊपर के जर्जर ईंट-गारे के शिखर को हटा दिया।',
    timeline: [
      { year: '1513', event: 'Emperor Krishnadevaraya returns victorious from Odisha Gajapati campaign and orders the Garuda chariot shrine built.', kind: 'build' },
      { year: '1554', event: 'Aliya Rama Raya dedicates musical stone pillars and surrounding 100-pillared kalyana mandapa.', kind: 'build' },
      { year: '1565', event: 'Fall of Vijayanagara; sanctum image removed, granite wheels scorched.', kind: 'destroy' },
      { year: '1856', event: 'Alexander Greenlaw photographs the chariot with its intact multi-tiered brick shikhara tower.', kind: 'other' },
      { year: 'c. 1890', event: 'British Madras Presidency engineers dismantle cracked stucco tower to save the granite base.', kind: 'restore' },
      { year: '1986', event: 'Inscribed on UNESCO World Heritage List; later featured on the reverse of the 50-rupee currency note.', kind: 'restore' },
    ],
    facts: [
      'The four stone wheels are fully carved with floral axle hubs and once rotated freely on granite pins.',
      'Stone horses originally pulling the chariot were damaged and replaced with stone elephants salvaged from other ruined pavilions.',
      'The surrounding Maha Mandapa contains 56 musical pillars that resonate with distinct musical tones when tapped.',
    ],
    thenLabel: 'c. 1513 CE — With Intact Brick Shikhara',
    thenYear: '1513',
    nowLabel: 'Present — Shikhara-less Stone Chariot',
    footprint: 14,
    keywords: ['hampi', 'vittala', 'chariot', 'ratha', 'garuda', 'wheels', 'musical pillars', 'krishnadevaraya'],
    then: [
      { type: 'plinth', w: 8, d: 10, h: 1, p: [0, 0, 0], color: GRANITE },
      { type: 'wheel', r: 1.2, spokes: 8, p: [-3.5, 1.2, 2.8], color: GREY_STONE },
      { type: 'wheel', r: 1.2, spokes: 8, p: [3.5, 1.2, 2.8], color: GREY_STONE },
      { type: 'wheel', r: 1.2, spokes: 8, p: [-3.5, 1.2, -2.8], color: GREY_STONE },
      { type: 'wheel', r: 1.2, spokes: 8, p: [3.5, 1.2, -2.8], color: GREY_STONE },
      { type: 'box', w: 5.5, h: 4, d: 7, p: [0, 1.2, 0], color: GRANITE },
      { type: 'pyramid', w: 5, d: 6.5, h: 6, tiers: 3, p: [0, 5.2, 0], color: BRICK },
      { type: 'dome', r: 0.9, finial: true, p: [0, 11.2, 0], color: '#d4af37' },
    ],
    now: [
      { type: 'plinth', w: 8, d: 10, h: 1, p: [0, 0, 0], color: GRANITE },
      { type: 'wheel', r: 1.2, spokes: 8, p: [-3.5, 1.2, 2.8], color: GREY_STONE },
      { type: 'wheel', r: 1.2, spokes: 8, p: [3.5, 1.2, 2.8], color: GREY_STONE },
      { type: 'wheel', r: 1.2, spokes: 8, p: [-3.5, 1.2, -2.8], color: GREY_STONE },
      { type: 'wheel', r: 1.2, spokes: 8, p: [3.5, 1.2, -2.8], color: GREY_STONE },
      { type: 'box', w: 5.5, h: 4, d: 7, p: [0, 1.2, 0], color: GRANITE },
      { type: 'rubble', r: 2.5, count: 8, seed: 14, p: [0, 5.2, 0], color: RUBBLE },
    ],
  },
  {
    id: 'lotus-mahal',
    name: 'Lotus Mahal (Kamal Mahal)',
    nameHi: 'लोटस महल (कमल महल)',
    nameKn: 'ಕಮಲ ಮಹಲ್ (ತಾವರೆ ಮಹಲ್)',
    nameTa: 'தாமரை அரண்மனை',
    nameBn: 'পদ্ম মহল',
    city: 'Hampi',
    state: 'Karnataka',
    lat: 15.3204,
    lng: 76.4718,
    built: 'mid-16th Century CE',
    builder: 'Vijayanagara Royal Court / Aravidu Kings',
    style: 'Indo-Islamic & Hindu Palace Synthesis',
    status: 'intact',
    confidence: 'inferred',
    confidenceRationale:
      'SAMPLE - needs scholar review. Structural stone pavilion is intact; reconstruction reconstructs the lost exterior stucco filigree, silk drapes on stone rings, and subterranean air-cooling water fountain cascades inferred from contemporary Deccani Sultanate and Vijayanagara royal pavilions.',
    sources: [
      {
        title: 'The Vijayanagara Courtly Style - Lotus Mahal and Secular Structures',
        institution: 'George Michell / AIIS',
        year: '1992',
        note: 'Monograph on the Royal Centre of Vijayanagara, pp. 45-62.',
      },
      {
        title: 'Archaeology, Art and Religion - The Hampi Ruins',
        institution: 'Anila Verghese / Oxford University Press',
        year: '2000',
        note: 'Chapter 5 - Secular and Islamic Influence on Vijayanagara Court Architecture.',
      },
      {
        title: 'Excavations at the Zenana Enclosure and Royal Pavilions',
        institution: 'Archaeological Survey of India',
        year: '1988',
        note: 'Indian Archaeology 1987-88 - A Review, pp. 38-42.',
      },
    ],
    reconstruction: {
      model_path: 'models/lotus-mahal.glb',
      confidence: 'inferred',
      evidence_notes:
        'SAMPLE - needs scholar review. Wall water cooling conduits and stucco lotus carvings inferred from royal zenana surveys.',
      reviewer: 'Hampi Research Project / SAMPLE',
      review_date: '2026-03-22',
    },
    scholarReviewStatus: 'needs_review',
    fileSizeMb: 16.2,
    unesco: true,
    emoji: '🪷',
    accent: '#4e9b66',
    summary:
      'SAMPLE - needs scholar review. Symmetrical two-storey pleasure pavilion blending Indo-Islamic cusped archways with Hindu stepped pyramidal roof towers. Features 24 square pillars and an ingenious terracotta water-pipe air conditioning system running through the walls.',
    summaryHi:
      'नमूना - विद्वान समीक्षा आवश्यक। हिंदू और इस्लामी वास्तुकला का सुरम्य संगम, जिसमें 24 खंभे और दीवार के भीतर टेराकोटा पाइप से शीतलन व्यवस्था थी।',
    summaryKn: 'ಮಾದರಿ - ವಿದ್ವಾಂಸರ ಪರಿಶೀಲನೆ ಅಗತ್ಯ. ಇಸ್ಲಾಮಿಕ್ ಕಮಾನುಗಳು ಮತ್ತು ಹಿಂದೂ ಶಿಖರಗಳ ಸಮನ್ವಯದ ಅದ್ಭುತ ಅರಮನೆ.',
    whatHappened:
      'Protected within the private Zenana Enclosure, Lotus Mahal escaped the wholesale fire of 1565. However, its decorative polished lime stucco finish, gilded parapets, and internal water pumps fell into disrepair.',
    whatHappenedHi:
      'ज़नाना बाड़े में स्थित होने के कारण यह 1565 के विध्वंस से बच गया। हालाँकि इसके चमकदार प्लास्टर, छज्जे और पानी की फव्वारा प्रणालियाँ समय के साथ लुप्त हो गईं।',
    timeline: [
      { year: 'c. 1542', event: 'Erected within the Zenana Enclosure as a secular royal council chamber and summer retreat for noblewomen.', kind: 'build' },
      { year: '1565', event: 'Escaped demolition due to its secular civil design distinct from the religious temples.', kind: 'other' },
      { year: '1912', event: 'Archaeological survey confirms internal terracotta water cooling pipes in the pillar cores.', kind: 'restore' },
      { year: '1986', event: 'Inscribed in the UNESCO World Heritage Group of Monuments at Hampi.', kind: 'restore' },
    ],
    facts: [
      'The multi-lobed cusped arches resemble open lotus petals, giving the pavilion its poetic colonial and local name.',
      'Terracotta conduits ran water from nearby royal tanks through the wall cores, creating natural evaporative air conditioning.',
      'Curved stone rings jutting from the upper cornice were used to drape heavy curtain hangings during the midday sun.',
    ],
    thenLabel: 'c. 1545 CE — Royal Zenana Courtly Era',
    thenYear: '1545',
    nowLabel: 'Present — Preserved Pavilion',
    footprint: 18,
    keywords: ['hampi', 'lotus', 'mahal', 'zenana', 'cusped arches', 'cooling pipes', 'palace'],
    then: [
      { type: 'plinth', w: 18, d: 18, h: 1.2, p: [0, 0, 0], color: LIMESTONE },
      { type: 'hall', w: 14, d: 14, h: 4.5, cols: 4, rows: 4, roof: true, p: [0, 1.2, 0], color: LIMESTONE },
      { type: 'hall', w: 10, d: 10, h: 3.5, cols: 3, rows: 3, roof: true, p: [0, 5.7, 0], color: LIMESTONE },
      { type: 'pyramid', w: 4, d: 4, h: 4, tiers: 3, p: [0, 9.2, 0], color: SANDSTONE },
      { type: 'water', w: 22, d: 22, p: [0, 0.1, 0] },
    ],
    now: [
      { type: 'plinth', w: 18, d: 18, h: 1.2, p: [0, 0, 0], color: LIMESTONE },
      { type: 'hall', w: 14, d: 14, h: 4.5, cols: 4, rows: 4, roof: true, p: [0, 1.2, 0], color: LIMESTONE },
      { type: 'hall', w: 10, d: 10, h: 3.5, cols: 3, rows: 3, roof: true, p: [0, 5.7, 0], color: LIMESTONE },
      { type: 'pyramid', w: 4, d: 4, h: 3.8, tiers: 3, p: [0, 9.2, 0], color: LIMESTONE },
    ],
  },
  // =========================================================================
  {
    id: 'konark',
    name: 'Konark Sun Temple',
    nameHi: 'कोणार्क सूर्य मंदिर',
    city: 'Konark, Puri',
    state: 'Odisha',
    lat: 19.8876,
    lng: 86.0945,
    built: 'c. 1250 CE',
    builder: 'King Narasimhadeva I (Eastern Ganga dynasty)',
    style: 'Kalinga (Odisha) temple architecture',
    status: 'partially-destroyed',
    unesco: true,
    emoji: '☀️',
    accent: '#e0893a',
    summary:
      'Conceived as a colossal stone chariot of the sun god Surya, pulled by seven horses on twenty-four carved wheels. Its main sanctum tower (deul), estimated at nearly 70 m, was once one of the tallest structures in India. Today only the audience hall (jagamohana) and the roofless dance hall survive.',
    summaryHi:
      'सूर्य देव के विशाल पत्थर के रथ के रूप में बना यह मंदिर सात घोड़ों और चौबीस नक्काशीदार पहियों वाला है। इसका मुख्य शिखर (देउल) लगभग 70 मीटर ऊँचा था। आज केवल जगमोहन (सभा मंडप) और छत-विहीन नाट्य मंडप शेष हैं।',
    whatHappened:
      'The great deul collapsed progressively between the 16th and 19th centuries. Historians cite foundation subsidence in sandy soil, lightning, the 1568 raid of Kalapahad, and the removal of the legendary lodestone "kalasa". By 1848 only a fragment of the tower stood; the British filled the jagamohana with sand in 1903 to stop it from collapsing too.',
    whatHappenedHi:
      '16वीं से 19वीं सदी के बीच मुख्य देउल धीरे-धीरे ढह गया। रेतीली ज़मीन में नींव धँसना, बिजली गिरना, 1568 में कालापहाड़ का आक्रमण और कथित "चुंबकीय कलश" हटाया जाना — ये कारण बताए जाते हैं। 1903 में अंग्रेज़ों ने जगमोहन को ढहने से बचाने के लिए रेत से भर दिया।',
    timeline: [
      { year: 'c. 1250', event: 'Built by Narasimhadeva I as a chariot of Surya; ~1,200 artisans worked for 12 years.', kind: 'build' },
      { year: '1568', event: 'Odisha falls to the Sultanate of Bengal; the Kalapahad raid damages the temple and worship ceases.', kind: 'destroy' },
      { year: '1600s', event: 'European sailors call it the "Black Pagoda" and use the tower as a landmark.', kind: 'other' },
      { year: '1627', event: 'Presiding image moved to Puri Jagannath temple; the main tower begins to disintegrate.', kind: 'destroy' },
      { year: '1848', event: 'Only a 30 m fragment of the deul remains standing; it later falls in a storm.', kind: 'destroy' },
      { year: '1903', event: 'British engineers seal the jagamohana with sand and stone to save it from collapse.', kind: 'restore' },
      { year: '1984', event: 'Inscribed as a UNESCO World Heritage Site.', kind: 'restore' },
    ],
    facts: [
      'The 24 wheels are working sundials: shadows on the spokes tell time to within minutes.',
      'The temple is aligned so the first rays of the rising sun once struck the sanctum image.',
      'Rabindranath Tagore wrote: "Here the language of stone surpasses the language of man."',
    ],
    thenLabel: 'c. 1300 CE — complete chariot temple with 70 m deul',
    thenYear: '1300',
    nowLabel: 'Today — jagamohana survives, deul reduced to its base',
    footprint: 40,
    keywords: ['chariot wheels', 'black pagoda', 'khondalite', 'pyramidal roof', 'Odisha', 'Surya'],
    then: [
      { type: 'plinth', w: 64, d: 32, h: 4, steps: 3, color: KHONDALITE },
      ...wheels(6, 44, 16.4, 0.6, 1.6),
      // dance hall (natamandira)
      { type: 'hall', w: 12, d: 12, h: 7, cols: 4, rows: 4, roof: true, p: [26, 4, 0], color: KHONDALITE },
      { type: 'pyramid', w: 12, d: 12, h: 6, tiers: 2, p: [26, 11.5, 0], color: KHONDALITE },
      // jagamohana
      { type: 'box', w: 20, h: 12, d: 20, p: [4, 4, 0], color: KHONDALITE },
      { type: 'pyramid', w: 20, d: 20, h: 22, tiers: 3, p: [4, 16, 0], color: KHONDALITE },
      // deul (main tower)
      { type: 'box', w: 18, h: 14, d: 18, p: [-18, 4, 0], color: KHONDALITE },
      { type: 'shikhara', r: 9.5, h: 56, p: [-18, 18, 0], color: KHONDALITE, label: 'Deul (sanctum tower) ~70 m' },
    ],
    now: [
      { type: 'plinth', w: 64, d: 32, h: 4, steps: 3, color: KHONDALITE },
      ...wheels(6, 44, 16.4, 0.6, 1.6),
      { type: 'hall', w: 12, d: 12, h: 7, cols: 4, rows: 4, roof: false, broken: 0.2, p: [26, 4, 0], color: KHONDALITE },
      { type: 'box', w: 20, h: 12, d: 20, p: [4, 4, 0], color: KHONDALITE },
      { type: 'pyramid', w: 20, d: 20, h: 22, tiers: 3, p: [4, 16, 0], color: KHONDALITE },
      { type: 'box', w: 18, h: 6, d: 18, p: [-18, 4, 0], color: KHONDALITE, label: 'Deul base (collapsed)' },
      { type: 'rubble', r: 11, count: 36, seed: 7, size: 1.4, p: [-18, 10, 0], color: RUBBLE },
    ],
  },

  // =========================================================================
  {
    id: 'nalanda',
    name: 'Nalanda Mahavihara',
    nameHi: 'नालंदा महाविहार',
    city: 'Nalanda',
    state: 'Bihar',
    lat: 25.1357,
    lng: 85.4436,
    built: '5th century CE (Gupta period)',
    builder: 'Kumaragupta I, expanded by Harsha and the Palas',
    style: 'Brick monastic university (viharas, stupas, chaityas)',
    status: 'destroyed',
    unesco: true,
    emoji: '📜',
    accent: '#b5542e',
    summary:
      "One of the world's first residential universities, where up to 10,000 students and 2,000 teachers studied logic, grammar, medicine and Buddhist philosophy. Scholars such as Xuanzang travelled from China to study here. Its famous library, Dharmaganja, had three multi-storey buildings.",
    summaryHi:
      'विश्व के पहले आवासीय विश्वविद्यालयों में से एक, जहाँ 10,000 विद्यार्थी और 2,000 शिक्षक तर्क, व्याकरण, चिकित्सा और बौद्ध दर्शन पढ़ते थे। चीनी यात्री ह्वेनसांग यहाँ पढ़ने आए थे। इसका पुस्तकालय "धर्मगंज" तीन बहुमंज़िला भवनों में था।',
    whatHappened:
      "Around 1193–1200 CE the army of Bakhtiyar Khalji sacked Nalanda. Tibetan chronicles record that monks were killed and the library burned for months — its nine-storey Ratnodadhi building held hundreds of thousands of manuscripts. The site was abandoned and lay buried until excavations began in 1915.",
    whatHappenedHi:
      'लगभग 1193–1200 ई. में बख़्तियार ख़िलजी की सेना ने नालंदा को लूटा। तिब्बती ग्रंथों के अनुसार भिक्षु मारे गए और पुस्तकालय महीनों तक जलता रहा — नौ मंज़िला "रत्नोदधि" में लाखों पांडुलिपियाँ थीं। स्थल उजड़ गया और 1915 की खुदाई तक दबा रहा।',
    timeline: [
      { year: 'c. 427', event: 'Founded under Kumaragupta I of the Gupta empire.', kind: 'build' },
      { year: '637', event: 'Chinese pilgrim Xuanzang arrives and studies for years; describes towering halls and the library.', kind: 'other' },
      { year: '8th–12th c.', event: 'Pala kings patronise Nalanda; it becomes the heart of Vajrayana scholarship.', kind: 'build' },
      { year: 'c. 1193', event: "Bakhtiyar Khalji's raid: monastery sacked, library set ablaze, monks killed or dispersed.", kind: 'destroy' },
      { year: '1235', event: 'Tibetan monk Dharmasvamin finds only ~70 monks among the ruins.', kind: 'other' },
      { year: '1915–37', event: 'Archaeological Survey of India excavates 11 monasteries and 6 brick temples.', kind: 'restore' },
      { year: '2016', event: 'Inscribed as a UNESCO World Heritage Site.', kind: 'restore' },
    ],
    facts: [
      'Admission required passing an oral examination by the gatekeeper-scholars; most applicants failed.',
      'Temple No. 3 (the Sariputra Stupa) was rebuilt seven times, each layer enclosing the previous.',
      'Excavations have uncovered only a fraction of the 14-hectare site.',
    ],
    thenLabel: 'c. 700 CE — Nalanda at its height, with Ratnodadhi library tower',
    thenYear: '700',
    nowLabel: 'Today — excavated brick foundations and stupa core',
    footprint: 60,
    keywords: ['red brick ruins', 'monastery cells', 'stupa with stairs', 'Bihar', 'Buddhist university'],
    then: [
      // Great stupa (Temple No. 3)
      { type: 'plinth', w: 40, d: 40, h: 6, steps: 4, p: [-30, 0, 0], color: BRICK },
      { type: 'pyramid', w: 26, d: 26, h: 18, tiers: 3, p: [-30, 6, 0], color: BRICK },
      { type: 'stupa', r: 6, chhatra: true, p: [-30, 24, 0], color: LIMESTONE },
      { type: 'stupa', r: 3, p: [-44, 6, -14], color: BRICK },
      { type: 'stupa', r: 3, p: [-16, 6, -14], color: BRICK },
      { type: 'stupa', r: 3, p: [-44, 6, 14], color: BRICK },
      { type: 'stupa', r: 3, p: [-16, 6, 14], color: BRICK },
      { type: 'stairs', w: 8, h: 6, d: 10, steps: 8, p: [-30, 0, 24], color: BRICK },
      // monasteries (viharas): courtyards with cells, 2 storeys
      ...range(3).flatMap((i): Part[] => [
        { type: 'box', w: 24, h: 8, d: 24, p: [12 + i * 28, 0, 0], color: BRICK },
        { type: 'hall', w: 14, d: 14, h: 4, cols: 5, rows: 5, roof: false, p: [12 + i * 28, 8, 0], color: BRICK },
      ]),
      // Dharmaganja library – Ratnodadhi tower
      { type: 'box', w: 14, h: 30, d: 14, p: [26, 0, -34], color: BRICK, label: 'Ratnodadhi — 9-storey library' },
      { type: 'pyramid', w: 14, d: 14, h: 6, tiers: 2, p: [26, 30, -34], color: BRICK },
      { type: 'box', w: 12, h: 16, d: 12, p: [8, 0, -34], color: BRICK, label: 'Ratnasagara' },
      { type: 'box', w: 12, h: 16, d: 12, p: [44, 0, -34], color: BRICK, label: 'Ratnaranjaka' },
    ],
    now: [
      { type: 'plinth', w: 40, d: 40, h: 6, steps: 4, p: [-30, 0, 0], color: BRICK },
      { type: 'pyramid', w: 26, d: 26, h: 12, tiers: 2, p: [-30, 6, 0], color: BRICK },
      { type: 'rubble', r: 8, count: 20, seed: 3, size: 1.5, p: [-30, 18, 0], color: BRICK },
      { type: 'stairs', w: 8, h: 6, d: 10, steps: 8, p: [-30, 0, 24], color: BRICK },
      { type: 'box', w: 6, h: 3, d: 6, p: [-44, 6, -14], color: BRICK },
      { type: 'box', w: 6, h: 3, d: 6, p: [-16, 6, 14], color: BRICK },
      ...range(3).flatMap((i): Part[] => [
        { type: 'wall', w: 24, h: 2.5, d: 1.2, p: [12 + i * 28, 0, -12], color: BRICK },
        { type: 'wall', w: 24, h: 2.5, d: 1.2, p: [12 + i * 28, 0, 12], color: BRICK },
        { type: 'wall', w: 1.2, h: 2.5, d: 24, p: [i * 28, 0, 0], color: BRICK },
        { type: 'wall', w: 1.2, h: 2.5, d: 24, p: [24 + i * 28, 0, 0], color: BRICK },
        { type: 'hall', w: 14, d: 14, h: 1.2, cols: 5, rows: 5, roof: false, p: [12 + i * 28, 0, 0], color: BRICK },
      ]),
      { type: 'wall', w: 14, h: 2, d: 14, p: [26, 0, -34], color: BRICK, label: 'Library foundations' },
      { type: 'rubble', r: 10, count: 24, seed: 11, size: 1.2, p: [26, 2, -34], color: BRICK },
    ],
  },

  // =========================================================================
  {
    id: 'martand',
    name: 'Martand Sun Temple',
    nameHi: 'मार्तंड सूर्य मंदिर',
    city: 'Anantnag',
    state: 'Jammu & Kashmir',
    lat: 33.7457,
    lng: 75.2225,
    built: 'c. 725–756 CE',
    builder: 'Emperor Lalitaditya Muktapida (Karkota dynasty)',
    style: 'Kashmiri (Gandhara–Gupta–Roman fusion) with peristyle courtyard',
    status: 'destroyed',
    emoji: '🌄',
    accent: '#7f8fa6',
    summary:
      'A majestic Sun temple on a plateau above the Kashmir valley, with a central shrine standing inside a colonnaded courtyard of 84 pillars — a plan unique in India. Its trefoil arches and pyramidal roofs reflect Gandharan and Classical influences.',
    summaryHi:
      'कश्मीर घाटी के ऊपर एक पठार पर बना भव्य सूर्य मंदिर, जिसका केंद्रीय गर्भगृह 84 स्तंभों वाले आँगन के बीच खड़ा था — भारत में अनोखी योजना। इसके त्रिपत्र मेहराब और पिरामिडनुमा छतें गांधार और यूनानी-रोमन प्रभाव दिखाती हैं।',
    whatHappened:
      'In the early 15th century Sultan Sikandar Shah Miri ("Butshikan", the iconoclast) ordered the temple demolished. Chroniclers say it took a year of fire and crowbars to bring down the massive limestone blocks. Earthquakes finished the work; today the roofless shell and broken colonnade remain.',
    whatHappenedHi:
      '15वीं सदी की शुरुआत में सुल्तान सिकंदर शाह मीरी ("बुतशिकन") ने मंदिर तोड़ने का आदेश दिया। कहा जाता है कि विशाल चूना-पत्थर के खंडों को गिराने में आग और औज़ारों से एक साल लगा। भूकंपों ने बाकी काम किया; आज छत-विहीन ढाँचा और टूटे स्तंभ बचे हैं।',
    timeline: [
      { year: 'c. 725', event: 'Lalitaditya builds the temple to Surya (Martand) with a 67 × 43 m peristyle.', kind: 'build' },
      { year: '12th c.', event: "Kalhana's Rajatarangini praises it as the finest building in Kashmir.", kind: 'other' },
      { year: 'c. 1389–1413', event: 'Demolition ordered by Sikandar Shah Miri; the roof and sanctuary are destroyed.', kind: 'destroy' },
      { year: '1555 & 1885', event: 'Major earthquakes topple more of the colonnade.', kind: 'destroy' },
      { year: '1868', event: 'Alexander Cunningham surveys the ruins for the ASI.', kind: 'restore' },
      { year: 'Today', event: 'Protected monument of national importance; often used as a film location.', kind: 'other' },
    ],
    facts: [
      'The courtyard was once flooded to create a reflecting pool around the shrine.',
      'The shrine faced west so the setting sun lit the sanctum through its trefoil doorway.',
      'Its design influenced temples across Kashmir, including Avantipur.',
    ],
    thenLabel: 'c. 800 CE — shrine with pyramidal roof inside the 84-pillar peristyle',
    thenYear: '800',
    nowLabel: 'Today — roofless walls and shattered colonnade',
    footprint: 40,
    keywords: ['grey limestone ruins', 'trefoil arches', 'colonnade around courtyard', 'Kashmir plateau', 'roofless shrine'],
    then: [
      { type: 'plinth', w: 70, d: 46, h: 2, steps: 2, color: GREY_STONE },
      // peristyle: 4 colonnades with roof
      { type: 'colonnade', length: 66, h: 6, count: 24, roof: true, p: [0, 2, -21], color: GREY_STONE },
      { type: 'colonnade', length: 66, h: 6, count: 24, roof: true, p: [0, 2, 21], color: GREY_STONE },
      { type: 'colonnade', length: 42, h: 6, count: 16, roof: true, p: [-33, 2, 0], ry: 90, color: GREY_STONE },
      { type: 'colonnade', length: 42, h: 6, count: 16, roof: true, p: [33, 2, 0], ry: 90, color: GREY_STONE },
      { type: 'water', w: 56, d: 32, p: [0, 2.05, 0] },
      // gateway on west
      { type: 'box', w: 10, h: 9, d: 8, p: [-33, 2, 0], color: GREY_STONE },
      { type: 'pyramid', w: 10, d: 8, h: 6, tiers: 2, p: [-33, 11, 0], color: GREY_STONE },
      // central shrine
      { type: 'plinth', w: 20, d: 14, h: 2, steps: 2, p: [4, 2, 0], color: GREY_STONE },
      { type: 'box', w: 14, h: 10, d: 10, p: [6, 4, 0], color: GREY_STONE },
      { type: 'pyramid', w: 14, d: 10, h: 10, tiers: 2, p: [6, 14, 0], color: GREY_STONE, label: 'Pyramidal Kashmiri roof' },
      { type: 'box', w: 6, h: 7, d: 6, p: [-4, 4, 0], color: GREY_STONE },
      { type: 'pyramid', w: 6, d: 6, h: 4, tiers: 1, p: [-4, 11, 0], color: GREY_STONE },
    ],
    now: [
      { type: 'plinth', w: 70, d: 46, h: 2, steps: 2, color: GREY_STONE },
      { type: 'colonnade', length: 66, h: 6, count: 24, roof: false, broken: 0.55, seed: 2, p: [0, 2, -21], color: GREY_STONE },
      { type: 'colonnade', length: 66, h: 6, count: 24, roof: false, broken: 0.6, seed: 5, p: [0, 2, 21], color: GREY_STONE },
      { type: 'colonnade', length: 42, h: 6, count: 16, roof: false, broken: 0.5, seed: 8, p: [-33, 2, 0], ry: 90, color: GREY_STONE },
      { type: 'colonnade', length: 42, h: 6, count: 16, roof: false, broken: 0.7, seed: 9, p: [33, 2, 0], ry: 90, color: GREY_STONE },
      { type: 'box', w: 10, h: 7, d: 8, p: [-33, 2, 0], color: GREY_STONE },
      { type: 'plinth', w: 20, d: 14, h: 2, steps: 2, p: [4, 2, 0], color: GREY_STONE },
      { type: 'archwall', w: 14, h: 9, d: 1.4, arches: 1, p: [6, 4, -4.3], color: GREY_STONE },
      { type: 'archwall', w: 14, h: 9, d: 1.4, arches: 1, p: [6, 4, 4.3], color: GREY_STONE },
      { type: 'wall', w: 1.4, h: 8, d: 10, p: [12.3, 4, 0], color: GREY_STONE },
      { type: 'rubble', r: 9, count: 30, seed: 4, size: 1.2, p: [4, 4, 0], color: RUBBLE },
    ],
  },

  // =========================================================================
  {
    id: 'hampi',
    name: 'Vijaya Vittala Temple, Hampi',
    nameHi: 'विजय विट्ठल मंदिर, हम्पी',
    city: 'Hampi',
    state: 'Karnataka',
    lat: 15.3423,
    lng: 76.475,
    built: '15th–16th century CE',
    builder: 'Devaraya II; expanded by Krishnadevaraya (Vijayanagara empire)',
    style: 'Vijayanagara (Dravidian) with granite musical pillars',
    status: 'partially-destroyed',
    unesco: true,
    emoji: '🛕',
    accent: '#9b7b4f',
    summary:
      'The crown jewel of Vijayanagara, capital of one of the richest empires of its time. The temple is famous for its stone chariot and the 56 "musical pillars" that ring with different notes. A kilometre-long bazaar street led to its gateway.',
    summaryHi:
      'विजयनगर साम्राज्य की राजधानी हम्पी का सबसे भव्य मंदिर। यह अपने पत्थर के रथ और 56 "संगीत स्तंभों" के लिए प्रसिद्ध है जो अलग-अलग सुर निकालते हैं। इसके द्वार तक एक किलोमीटर लंबा बाज़ार जाता था।',
    whatHappened:
      'After the Battle of Talikota in January 1565, the armies of the Deccan Sultanates occupied Vijayanagara and plundered it for months. Gopuram towers were pulled down, pillared halls were burnt and the city of half a million people was abandoned — never to be reoccupied.',
    whatHappenedHi:
      'जनवरी 1565 में तालीकोटा की लड़ाई के बाद दक्कन सल्तनतों की सेनाओं ने विजयनगर पर कब्ज़ा किया और महीनों तक लूटपाट की। गोपुरम गिराए गए, स्तंभ-मंडप जलाए गए और पाँच लाख आबादी का शहर हमेशा के लिए उजड़ गया।',
    timeline: [
      { year: '1336', event: 'Harihara and Bukka found the Vijayanagara empire.', kind: 'build' },
      { year: 'c. 1426', event: 'Devaraya II begins the Vittala temple.', kind: 'build' },
      { year: '1509–29', event: 'Krishnadevaraya adds the maha-mandapa, stone chariot and bazaar.', kind: 'build' },
      { year: '1565', event: 'Battle of Talikota; the Sultanate armies sack Hampi for five months.', kind: 'destroy' },
      { year: '1800', event: 'Colin Mackenzie surveys the deserted ruins.', kind: 'other' },
      { year: '1986', event: 'Group of Monuments at Hampi inscribed by UNESCO.', kind: 'restore' },
    ],
    facts: [
      'The stone chariot features on the Indian ₹50 banknote.',
      "The chariot's wheels once rotated; they were fixed in place to prevent damage.",
      'Portuguese traveller Domingo Paes called the city "as large as Rome and very beautiful".',
    ],
    thenLabel: 'c. 1550 CE — gopurams intact, bazaar street alive',
    thenYear: '1550',
    nowLabel: 'Today — gopuram towers gone, halls roofless, chariot survives',
    footprint: 50,
    keywords: ['stone chariot', 'granite pillars', 'ruined gopuram', 'boulder landscape', 'Karnataka'],
    then: [
      { type: 'plinth', w: 80, d: 50, h: 1.5, steps: 1, color: GRANITE },
      { type: 'wall', w: 80, h: 5, d: 1.5, p: [0, 1.5, -25], color: GRANITE },
      { type: 'wall', w: 80, h: 5, d: 1.5, p: [0, 1.5, 25], color: GRANITE },
      { type: 'wall', w: 1.5, h: 5, d: 50, p: [-40, 1.5, 0], color: GRANITE },
      { type: 'wall', w: 1.5, h: 5, d: 50, p: [40, 1.5, 0], color: GRANITE },
      { type: 'gopuram', w: 14, d: 8, h: 26, tiers: 5, p: [40, 1.5, 0], color: SANDSTONE, label: 'East gopuram' },
      { type: 'gopuram', w: 12, d: 7, h: 20, tiers: 4, p: [0, 1.5, -25], color: SANDSTONE },
      { type: 'gopuram', w: 12, d: 7, h: 20, tiers: 4, p: [0, 1.5, 25], color: SANDSTONE },
      // maha mandapa
      { type: 'plinth', w: 30, d: 24, h: 2, steps: 2, p: [-6, 1.5, 0], color: GRANITE },
      { type: 'hall', w: 26, d: 20, h: 6, cols: 7, rows: 5, roof: true, p: [-6, 3.5, 0], color: GRANITE, label: 'Maha-mandapa with musical pillars' },
      { type: 'box', w: 10, h: 8, d: 10, p: [-24, 3.5, 0], color: GRANITE },
      { type: 'pyramid', w: 10, d: 10, h: 7, tiers: 3, p: [-24, 11.5, 0], color: SANDSTONE },
      // stone chariot
      { type: 'plinth', w: 6, d: 4, h: 1, steps: 1, p: [18, 1.5, 0], color: GRANITE },
      { type: 'box', w: 4, h: 4, d: 3, p: [18, 2.5, 0], color: GRANITE, label: 'Stone chariot (Garuda shrine)' },
      { type: 'pyramid', w: 4, d: 3, h: 3, tiers: 2, p: [18, 6.5, 0], color: SANDSTONE },
      { type: 'wheel', r: 1, p: [18, 1.5, 1.7], color: GRANITE },
      { type: 'wheel', r: 1, p: [18, 1.5, -1.7], color: GRANITE },
      // bazaar street
      { type: 'colonnade', length: 60, h: 4, count: 20, roof: true, p: [78, 0, -8], color: GRANITE },
      { type: 'colonnade', length: 60, h: 4, count: 20, roof: true, p: [78, 0, 8], color: GRANITE },
    ],
    now: [
      { type: 'plinth', w: 80, d: 50, h: 1.5, steps: 1, color: GRANITE },
      { type: 'wall', w: 80, h: 5, d: 1.5, p: [0, 1.5, -25], color: GRANITE },
      { type: 'wall', w: 80, h: 5, d: 1.5, p: [0, 1.5, 25], color: GRANITE },
      { type: 'wall', w: 1.5, h: 5, d: 50, p: [-40, 1.5, 0], color: GRANITE },
      { type: 'wall', w: 1.5, h: 5, d: 50, p: [40, 1.5, 0], color: GRANITE },
      { type: 'gopuram', w: 14, d: 8, h: 9, tiers: 1, p: [40, 1.5, 0], color: GRANITE, label: 'Gopuram base (tower lost)' },
      { type: 'rubble', r: 6, count: 14, seed: 6, size: 1, p: [40, 10.5, 0], color: RUBBLE },
      { type: 'gopuram', w: 12, d: 7, h: 7, tiers: 1, p: [0, 1.5, -25], color: GRANITE },
      { type: 'gopuram', w: 12, d: 7, h: 7, tiers: 1, p: [0, 1.5, 25], color: GRANITE },
      { type: 'plinth', w: 30, d: 24, h: 2, steps: 2, p: [-6, 1.5, 0], color: GRANITE },
      { type: 'hall', w: 26, d: 20, h: 6, cols: 7, rows: 5, roof: true, broken: 0.15, seed: 2, p: [-6, 3.5, 0], color: GRANITE },
      { type: 'box', w: 10, h: 8, d: 10, p: [-24, 3.5, 0], color: GRANITE },
      { type: 'pyramid', w: 10, d: 10, h: 5, tiers: 2, p: [-24, 11.5, 0], color: SANDSTONE },
      { type: 'plinth', w: 6, d: 4, h: 1, steps: 1, p: [18, 1.5, 0], color: GRANITE },
      { type: 'box', w: 4, h: 4, d: 3, p: [18, 2.5, 0], color: GRANITE, label: 'Stone chariot (survives)' },
      { type: 'pyramid', w: 4, d: 3, h: 3, tiers: 2, p: [18, 6.5, 0], color: SANDSTONE },
      { type: 'wheel', r: 1, p: [18, 1.5, 1.7], color: GRANITE },
      { type: 'wheel', r: 1, p: [18, 1.5, -1.7], color: GRANITE },
      { type: 'colonnade', length: 60, h: 4, count: 20, roof: false, broken: 0.5, seed: 12, p: [78, 0, -8], color: GRANITE },
      { type: 'colonnade', length: 60, h: 4, count: 20, roof: false, broken: 0.6, seed: 13, p: [78, 0, 8], color: GRANITE },
    ],
  },

  // =========================================================================
  {
    id: 'somnath',
    name: 'Somnath Temple',
    nameHi: 'सोमनाथ मंदिर',
    city: 'Prabhas Patan, Veraval',
    state: 'Gujarat',
    lat: 20.888,
    lng: 70.4013,
    built: 'Ancient; present temple 1951',
    builder: 'Rebuilt by Bhima I, Kumarapala, Ahilyabai Holkar and finally the Somnath Trust (1951)',
    style: 'Māru-Gurjara (Chaulukya) nagara temple',
    status: 'rebuilt',
    emoji: '🔱',
    accent: '#d9a441',
    summary:
      'The first of the twelve Jyotirlingas, standing on the Arabian Sea shore. Somnath is the archetype of the "destroyed and rebuilt" monument: plundered and razed repeatedly over 700 years, it was raised again in 1951 as a symbol of independent India.',
    summaryHi:
      'बारह ज्योतिर्लिंगों में प्रथम, अरब सागर के तट पर स्थित। सोमनाथ "नष्ट और पुनर्निर्मित" स्मारक का प्रतीक है: 700 वर्षों में बार-बार लूटा और ढहाया गया, और 1951 में स्वतंत्र भारत के प्रतीक के रूप में फिर खड़ा हुआ।',
    whatHappened:
      'Mahmud of Ghazni sacked the temple in 1026, breaking the linga and carrying off its wealth. It was rebuilt in stone by Kumarapala (c. 1169), destroyed again in 1299 (Ulugh Khan), 1395 (Zafar Khan) and 1665–1706 (Aurangzeb). By the 19th century only a ruined shell stood; the Kailash Mahameru Prasad temple was completed in 1951.',
    whatHappenedHi:
      '1026 में महमूद ग़ज़नवी ने मंदिर लूटा और लिंग तोड़ा। कुमारपाल ने (लगभग 1169) इसे पत्थर से फिर बनवाया; 1299 (उलुग ख़ान), 1395 (ज़फ़र ख़ान) और 1665–1706 (औरंगज़ेब) में फिर तोड़ा गया। 19वीं सदी तक केवल खंडहर बचा था; 1951 में कैलाश महामेरु प्रासाद मंदिर पूरा हुआ।',
    timeline: [
      { year: 'c. 649', event: 'Earliest recorded stone temple built by the Maitrakas of Vallabhi.', kind: 'build' },
      { year: '1026', event: 'Mahmud of Ghazni raids Somnath; temple plundered and the linga broken.', kind: 'destroy' },
      { year: 'c. 1169', event: 'Kumarapala of the Chaulukya dynasty rebuilds it in stone.', kind: 'restore' },
      { year: '1299', event: "Alauddin Khalji's general Ulugh Khan destroys the temple.", kind: 'destroy' },
      { year: '1395', event: 'Zafar Khan, governor of Gujarat, razes it again.', kind: 'destroy' },
      { year: '1665', event: "Aurangzeb orders the temple's demolition.", kind: 'destroy' },
      { year: '1783', event: 'Ahilyabai Holkar builds a small temple nearby for worship.', kind: 'restore' },
      { year: '1951', event: 'New temple consecrated; President Rajendra Prasad installs the Jyotirlinga.', kind: 'restore' },
    ],
    facts: [
      'The "Baan Stambh" arrow pillar marks that there is no land between Somnath and Antarctica in a straight line.',
      'Sardar Vallabhbhai Patel pledged the reconstruction in 1947 while standing on the ruins.',
      'The 1951 shikhara rises about 50 m and carries a 10-tonne kalasha.',
    ],
    thenLabel: "c. 1180 CE — Kumarapala's temple before the raids of 1299",
    thenYear: '1180',
    nowLabel: 'Today — the 1951 Kailash Mahameru Prasad temple',
    footprint: 30,
    keywords: ['sea-shore temple', 'tall carved shikhara', 'cream sandstone', 'Gujarat', 'Jyotirlinga'],
    then: [
      { type: 'plinth', w: 44, d: 28, h: 3, steps: 3, color: LIMESTONE },
      { type: 'hall', w: 16, d: 14, h: 6, cols: 5, rows: 4, roof: true, p: [10, 3, 0], color: LIMESTONE, label: 'Sabha mandapa' },
      { type: 'pyramid', w: 16, d: 14, h: 7, tiers: 3, p: [10, 9, 0], color: LIMESTONE },
      { type: 'box', w: 12, h: 8, d: 12, p: [-6, 3, 0], color: LIMESTONE },
      { type: 'shikhara', r: 6.5, h: 24, p: [-6, 11, 0], color: LIMESTONE },
      { type: 'shikhara', r: 2, h: 8, p: [-11, 11, 5], color: LIMESTONE },
      { type: 'shikhara', r: 2, h: 8, p: [-11, 11, -5], color: LIMESTONE },
      { type: 'water', w: 120, d: 40, p: [0, -0.2, 50] },
    ],
    now: [
      { type: 'plinth', w: 50, d: 30, h: 3, steps: 4, color: LIMESTONE },
      { type: 'hall', w: 18, d: 16, h: 8, cols: 5, rows: 4, roof: true, p: [12, 3, 0], color: LIMESTONE, label: 'Nritya mandapa' },
      { type: 'pyramid', w: 18, d: 16, h: 9, tiers: 3, p: [12, 11, 0], color: LIMESTONE },
      { type: 'box', w: 14, h: 12, d: 14, p: [-6, 3, 0], color: LIMESTONE },
      { type: 'shikhara', r: 7.5, h: 36, p: [-6, 15, 0], color: LIMESTONE, label: 'Shikhara ~50 m' },
      { type: 'shikhara', r: 2.5, h: 10, p: [-12, 15, 6], color: LIMESTONE },
      { type: 'shikhara', r: 2.5, h: 10, p: [-12, 15, -6], color: LIMESTONE },
      { type: 'shikhara', r: 2.5, h: 10, p: [0, 15, 6], color: LIMESTONE },
      { type: 'shikhara', r: 2.5, h: 10, p: [0, 15, -6], color: LIMESTONE },
      { type: 'water', w: 120, d: 40, p: [0, -0.2, 50] },
    ],
  },

  // =========================================================================
  {
    id: 'modhera',
    name: 'Modhera Sun Temple',
    nameHi: 'मोढेरा सूर्य मंदिर',
    city: 'Modhera, Mehsana',
    state: 'Gujarat',
    lat: 23.5836,
    lng: 72.1326,
    built: '1026–27 CE',
    builder: 'King Bhima I (Chaulukya / Solanki dynasty)',
    style: 'Māru-Gurjara with stepped tank (Surya Kund)',
    status: 'partially-destroyed',
    emoji: '🌞',
    accent: '#c9a24a',
    summary:
      'A three-part Sun temple — a stepped tank with 108 shrines, a 52-pillared assembly hall and the sanctum — built so that equinox sunrise lights the deity. Its missing spire (shikhara) is the most visible scar of its history.',
    summaryHi:
      'तीन भागों वाला सूर्य मंदिर — 108 लघु मंदिरों वाला सीढ़ीदार कुंड, 52 स्तंभों का सभा मंडप और गर्भगृह — ऐसा बना कि विषुव के सूर्योदय की किरणें देवता पर पड़ें। इसका लुप्त शिखर इसके इतिहास का सबसे स्पष्ट घाव है।',
    whatHappened:
      "The shikhara and much of the sanctum's upper structure were lost to earthquakes and to Alauddin Khalji's Gujarat campaign (c. 1299). Worship ceased; the temple stands today as an archaeological monument with a flat-topped sanctum.",
    whatHappenedHi:
      'शिखर और गर्भगृह का ऊपरी भाग भूकंपों और अलाउद्दीन ख़िलजी के गुजरात अभियान (लगभग 1299) में नष्ट हो गए। पूजा बंद हो गई; आज मंदिर चपटी छत वाले गर्भगृह के साथ पुरातात्विक स्मारक है।',
    timeline: [
      { year: '1026', event: 'Built by Bhima I, inscribed Vikram Samvat 1083, soon after the Somnath raid.', kind: 'build' },
      { year: 'c. 1299', event: "Damaged during Alauddin Khalji's conquest of Gujarat; shikhara lost.", kind: 'destroy' },
      { year: '1819', event: 'Kutch earthquake further damages the Guda Mandap.', kind: 'destroy' },
      { year: '20th c.', event: 'ASI consolidates the structure; annual Modhera dance festival begins (1992).', kind: 'restore' },
    ],
    facts: [
      'The Surya Kund (Rama Kund) has 108 miniature shrines on its steps.',
      'On the equinoxes the rising sun shines straight through the hall into the sanctum.',
      "Modhera is India's first solar-powered village (2022).",
    ],
    thenLabel: 'c. 1100 CE — sanctum crowned by its shikhara',
    thenYear: '1100',
    nowLabel: 'Today — flat-topped sanctum, spire missing',
    footprint: 50,
    keywords: ['stepped tank with shrines', 'golden sandstone', 'pillared hall', 'missing spire', 'Gujarat'],
    then: [
      { type: 'plinth', w: 56, d: 40, h: 1.5, steps: 1, p: [-6, 0, 0], color: SANDSTONE },
      // Surya kund (stepped tank) - inverted pyramid approximated by water + stairs ring
      { type: 'plinth', w: 44, d: 30, h: 1, steps: 1, p: [46, 0, 0], color: SANDSTONE },
      { type: 'water', w: 30, d: 18, p: [46, 1.05, 0] },
      { type: 'torana', w: 8, h: 8, p: [22, 1.5, 0] },
      // sabha mandap
      { type: 'plinth', w: 18, d: 18, h: 1.5, steps: 2, p: [8, 1.5, 0], color: SANDSTONE },
      { type: 'hall', w: 14, d: 14, h: 5, cols: 5, rows: 5, roof: true, p: [8, 3, 0], color: SANDSTONE, label: 'Sabha Mandap – 52 pillars' },
      { type: 'pyramid', w: 14, d: 14, h: 6, tiers: 3, p: [8, 8, 0], color: SANDSTONE },
      // guda mandap + sanctum
      { type: 'plinth', w: 22, d: 16, h: 1.5, steps: 2, p: [-14, 1.5, 0], color: SANDSTONE },
      { type: 'hall', w: 10, d: 10, h: 5, cols: 4, rows: 4, roof: true, p: [-8, 3, 0], color: SANDSTONE },
      { type: 'pyramid', w: 10, d: 10, h: 4, tiers: 2, p: [-8, 8, 0], color: SANDSTONE },
      { type: 'box', w: 9, h: 7, d: 9, p: [-19, 3, 0], color: SANDSTONE },
      { type: 'shikhara', r: 4.6, h: 17, p: [-19, 10, 0], color: SANDSTONE, label: 'Shikhara (lost)' },
    ],
    now: [
      { type: 'plinth', w: 56, d: 40, h: 1.5, steps: 1, p: [-6, 0, 0], color: SANDSTONE },
      { type: 'plinth', w: 44, d: 30, h: 1, steps: 1, p: [46, 0, 0], color: SANDSTONE },
      { type: 'water', w: 30, d: 18, p: [46, 1.05, 0] },
      { type: 'torana', w: 8, h: 8, p: [22, 1.5, 0] },
      { type: 'plinth', w: 18, d: 18, h: 1.5, steps: 2, p: [8, 1.5, 0], color: SANDSTONE },
      { type: 'hall', w: 14, d: 14, h: 5, cols: 5, rows: 5, roof: true, p: [8, 3, 0], color: SANDSTONE },
      { type: 'pyramid', w: 14, d: 14, h: 3, tiers: 2, p: [8, 8, 0], color: SANDSTONE },
      { type: 'plinth', w: 22, d: 16, h: 1.5, steps: 2, p: [-14, 1.5, 0], color: SANDSTONE },
      { type: 'hall', w: 10, d: 10, h: 5, cols: 4, rows: 4, roof: true, p: [-8, 3, 0], color: SANDSTONE },
      { type: 'box', w: 9, h: 7, d: 9, p: [-19, 3, 0], color: SANDSTONE, label: 'Sanctum (flat-topped today)' },
      { type: 'rubble', r: 4, count: 10, seed: 21, size: 0.8, p: [-19, 10, 0], color: SANDSTONE },
    ],
  },

  // =========================================================================
  {
    id: 'dhanushkodi',
    name: 'Dhanushkodi Ghost Town',
    nameHi: 'धनुषकोडी (भुतहा नगर)',
    city: 'Rameswaram',
    state: 'Tamil Nadu',
    lat: 9.1521,
    lng: 79.4399,
    built: 'Late 19th century (port & railway town)',
    builder: 'South Indian Railway / Madras Presidency',
    style: 'Colonial port town — church, railway station, post office',
    status: 'destroyed',
    emoji: '🌊',
    accent: '#3f8fa8',
    summary:
      'Once a bustling port at the tip of Pamban island, with a railway station, a church, a post office and ferries to Ceylon. On the night of 22–23 December 1964 a super-cyclone erased the town; what remains are skeletal walls on a sand spit between two seas.',
    summaryHi:
      'पंबन द्वीप के सिरे पर एक व्यस्त बंदरगाह, जहाँ रेलवे स्टेशन, चर्च, डाकघर और सीलोन की नौकाएँ थीं। 22–23 दिसंबर 1964 की रात एक महा-चक्रवात ने नगर मिटा दिया; दो समुद्रों के बीच रेत पर केवल कंकाल-सी दीवारें शेष हैं।',
    whatHappened:
      'The 1964 Rameswaram cyclone struck with 7 m storm surges and winds above 240 km/h. The Pamban–Dhanushkodi passenger train was swept off the track with over 100 passengers aboard; around 1,800 people died. The government declared Dhanushkodi unfit for habitation.',
    whatHappenedHi:
      '1964 के रामेश्वरम चक्रवात में 7 मीटर ऊँची लहरें और 240 किमी/घंटा से तेज़ हवाएँ आईं। पंबन–धनुषकोडी यात्री ट्रेन 100 से अधिक यात्रियों सहित बह गई; लगभग 1,800 लोग मारे गए। सरकार ने धनुषकोडी को रहने योग्य नहीं घोषित किया।',
    timeline: [
      { year: '1914', event: 'Pamban bridge opens; Dhanushkodi becomes the rail-sea gateway to Ceylon.', kind: 'build' },
      { year: '1950s', event: 'Town has a church, railway station, post office, customs house and schools.', kind: 'other' },
      { year: '22 Dec 1964', event: 'Cyclone makes landfall at night; train No. 653 is washed away.', kind: 'destroy' },
      { year: '1965', event: 'Madras government declares the town a ghost town.', kind: 'destroy' },
      { year: '2017', event: 'New road reaches the Arichal Munai tip; ruins become a tourist site.', kind: 'other' },
    ],
    facts: [
      'Dhanushkodi is only 24 km from Talaimannar in Sri Lanka.',
      'The Bay of Bengal and the Gulf of Mannar meet at its tip, Arichal Munai.',
      'A few fishing families still live amid the ruins without electricity grid or piped water.',
    ],
    thenLabel: '1960 — living port town: church, station, water tank',
    thenYear: '1960',
    nowLabel: 'Today — roofless church and broken walls on the sand',
    footprint: 40,
    keywords: ['roofless church ruin', 'white sand', 'two seas', 'railway ruins', 'Tamil Nadu coast'],
    then: [
      { type: 'water', w: 160, d: 40, p: [0, -0.3, -45] },
      { type: 'water', w: 160, d: 40, p: [0, -0.3, 45] },
      // church
      { type: 'box', w: 10, h: 7, d: 20, p: [-20, 0, 0], color: LIMESTONE, label: "St. Antony's Church" },
      { type: 'pyramid', w: 11, d: 21, h: 4, tiers: 1, p: [-20, 7, 0], color: '#8a4a3a' },
      { type: 'box', w: 4, h: 12, d: 4, p: [-20, 0, 11], color: LIMESTONE },
      { type: 'pyramid', w: 4, d: 4, h: 3, tiers: 1, p: [-20, 12, 11], color: '#8a4a3a' },
      // station
      { type: 'box', w: 24, h: 4, d: 8, p: [10, 0, 0], color: '#d9b48a', label: 'Railway station' },
      { type: 'pyramid', w: 26, d: 10, h: 2, tiers: 1, p: [10, 4, 0], color: '#8a4a3a' },
      { type: 'colonnade', length: 24, h: 3.5, count: 8, roof: true, p: [10, 0, 7], color: LIMESTONE },
      // water tank
      { type: 'tower', r: 2.5, h: 10, crenels: false, p: [30, 0, -12], color: GREY_STONE, label: 'Water tank' },
      { type: 'cylinder', r: 3.5, h: 3, p: [30, 10, -12], color: GREY_STONE },
      // houses
      ...range(5).map((i): Part => ({ type: 'box', w: 6, h: 3, d: 5, p: [-10 + i * 9, 0, -16], color: '#e2cfa8' })),
      ...range(5).map((i): Part => ({ type: 'pyramid', w: 6.5, d: 5.5, h: 2, tiers: 1, p: [-10 + i * 9, 3, -16], color: '#8a4a3a' })),
    ],
    now: [
      { type: 'water', w: 160, d: 40, p: [0, -0.3, -45] },
      { type: 'water', w: 160, d: 40, p: [0, -0.3, 45] },
      { type: 'archwall', w: 20, h: 6, d: 0.8, arches: 4, p: [-15.4, 0, 0], ry: 90, color: LIMESTONE, label: 'Church — north wall' },
      { type: 'archwall', w: 20, h: 6, d: 0.8, arches: 4, p: [-24.6, 0, 0], ry: 90, color: LIMESTONE },
      { type: 'archwall', w: 10, h: 7, d: 0.8, arches: 1, p: [-20, 0, -10], color: LIMESTONE },
      { type: 'wall', w: 4, h: 6, d: 4, p: [-20, 0, 11], color: LIMESTONE },
      { type: 'wall', w: 24, h: 1.2, d: 0.8, p: [10, 0, -4], color: '#d9b48a', label: 'Station platform' },
      { type: 'colonnade', length: 24, h: 3.5, count: 8, roof: false, broken: 0.6, seed: 4, p: [10, 0, 7], color: LIMESTONE },
      { type: 'tower', r: 2.5, h: 10, crenels: false, p: [30, 0, -12], color: GREY_STONE },
      { type: 'cylinder', r: 3.5, h: 3, p: [30, 10, -12], color: GREY_STONE },
      ...range(5).map((i): Part => ({ type: 'wall', w: 6, h: 1 + (i % 2), d: 0.6, p: [-10 + i * 9, 0, -16], color: '#e2cfa8' })),
      { type: 'rubble', r: 20, count: 24, seed: 30, size: 0.7, p: [0, 0, 0], color: '#cfc3a7' },
    ],
  },

  // =========================================================================
  {
    id: 'bhangarh',
    name: 'Bhangarh Fort',
    nameHi: 'भानगढ़ किला',
    city: 'Alwar',
    state: 'Rajasthan',
    lat: 27.0957,
    lng: 76.2884,
    built: '1573 CE',
    builder: 'Raja Bhagwant Das for his son Madho Singh (Kachwaha)',
    style: 'Rajput fort-town with palace, temples and bazaar',
    status: 'destroyed',
    emoji: '🏰',
    accent: '#a2683b',
    summary:
      'A fortified town at the foot of the Aravalli hills, with a seven-storey royal palace, a bazaar street, havelis and beautifully carved temples. Abandoned in the 18th century, it is India\'s most famous "haunted" ruin — entry is forbidden after sunset.',
    summaryHi:
      'अरावली की तलहटी में बसा किलेबंद नगर, जिसमें सात मंज़िला राजमहल, बाज़ार, हवेलियाँ और नक्काशीदार मंदिर थे। 18वीं सदी में उजड़ा यह भारत का सबसे प्रसिद्ध "भुतहा" खंडहर है — सूर्यास्त के बाद प्रवेश वर्जित है।',
    whatHappened:
      'Historically, Bhangarh declined after the 1783 famine and the rise of nearby Ajabgarh and Jaipur; its population drifted away and the roofs of the palace collapsed, leaving four of seven storeys. Legend blames a curse by the ascetic Guru Balu Nath — or the tantrik Singhia — for the town turning to ruins overnight.',
    whatHappenedHi:
      'ऐतिहासिक रूप से 1783 के अकाल और पास के अजबगढ़-जयपुर के उभार के बाद भानगढ़ उजड़ गया; महल की छतें ढह गईं और सात में से चार मंज़िलें बचीं। किंवदंती के अनुसार गुरु बालू नाथ — या तांत्रिक सिंघिया — के शाप से नगर रातोंरात खंडहर बन गया।',
    timeline: [
      { year: '1573', event: 'Bhagwant Das founds Bhangarh; his son Madho Singh makes it his seat.', kind: 'build' },
      { year: '1613–1720', event: 'Town flourishes with ~10,000 residents, temples and a thriving market.', kind: 'other' },
      { year: '1720', event: 'Jai Singh II annexes Bhangarh to Jaipur; its importance fades.', kind: 'other' },
      { year: '1783', event: 'Devastating famine; town is abandoned.', kind: 'destroy' },
      { year: 'Today', event: 'ASI-protected site; a signboard bans entry between sunset and sunrise.', kind: 'other' },
    ],
    facts: [
      'The Gopinath, Someshwar and Keshav Rai temples still stand almost intact among the ruins.',
      'Local folklore says that any house built with a roof in Bhangarh collapses.',
      'Bhangarh lies near Sariska Tiger Reserve.',
    ],
    thenLabel: 'c. 1650 CE — seven-storey palace and living bazaar',
    thenYear: '1650',
    nowLabel: 'Today — four storeys remain; roofless bazaar',
    footprint: 60,
    keywords: ['ruined palace on hill', 'roofless shops', 'Rajasthan', 'haunted fort', 'stone temples'],
    then: [
      { type: 'plinth', w: 120, d: 70, h: 1, steps: 1, color: SANDSTONE },
      { type: 'wall', w: 120, h: 6, d: 2, crenels: true, p: [0, 1, -35], color: SANDSTONE },
      { type: 'wall', w: 2, h: 6, d: 70, crenels: true, p: [-60, 1, 0], color: SANDSTONE },
      { type: 'wall', w: 2, h: 6, d: 70, crenels: true, p: [60, 1, 0], color: SANDSTONE },
      ...bastions(120, 70, 4, 8, SANDSTONE),
      // palace (7 storeys)
      { type: 'plinth', w: 36, d: 26, h: 6, steps: 3, p: [0, 1, -18], color: SANDSTONE },
      { type: 'box', w: 30, h: 8, d: 20, p: [0, 7, -18], color: SANDSTONE },
      { type: 'box', w: 26, h: 8, d: 16, p: [0, 15, -18], color: SANDSTONE },
      { type: 'box', w: 20, h: 8, d: 12, p: [0, 23, -18], color: SANDSTONE, label: 'Royal palace — 7 storeys' },
      { type: 'box', w: 12, h: 6, d: 8, p: [0, 31, -18], color: SANDSTONE },
      { type: 'chhatri', r: 2, h: 3, p: [-10, 31, -24], color: SANDSTONE },
      { type: 'chhatri', r: 2, h: 3, p: [10, 31, -24], color: SANDSTONE },
      { type: 'chhatri', r: 2.5, h: 3.5, p: [0, 37, -18], color: SANDSTONE },
      // bazaar street
      { type: 'colonnade', length: 90, h: 4, count: 24, roof: true, p: [0, 1, 6], color: SANDSTONE, label: 'Johari Bazaar' },
      { type: 'colonnade', length: 90, h: 4, count: 24, roof: true, p: [0, 1, 18], color: SANDSTONE },
      // temples
      { type: 'plinth', w: 12, d: 12, h: 3, steps: 3, p: [-40, 1, 28], color: SANDSTONE },
      { type: 'box', w: 6, h: 6, d: 6, p: [-40, 4, 28], color: SANDSTONE },
      { type: 'shikhara', r: 3.2, h: 12, p: [-40, 10, 28], color: SANDSTONE, label: 'Gopinath temple' },
      { type: 'plinth', w: 10, d: 10, h: 2, steps: 2, p: [40, 1, 28], color: SANDSTONE },
      { type: 'box', w: 5, h: 5, d: 5, p: [40, 3, 28], color: SANDSTONE },
      { type: 'shikhara', r: 2.6, h: 10, p: [40, 8, 28], color: SANDSTONE },
    ],
    now: [
      { type: 'plinth', w: 120, d: 70, h: 1, steps: 1, color: SANDSTONE },
      { type: 'wall', w: 120, h: 5, d: 2, crenels: false, p: [0, 1, -35], color: SANDSTONE },
      { type: 'wall', w: 2, h: 5, d: 70, crenels: false, p: [-60, 1, 0], color: SANDSTONE },
      { type: 'wall', w: 2, h: 5, d: 70, crenels: false, p: [60, 1, 0], color: SANDSTONE },
      ...bastions(120, 70, 4, 6, SANDSTONE, false),
      { type: 'plinth', w: 36, d: 26, h: 6, steps: 3, p: [0, 1, -18], color: SANDSTONE },
      { type: 'box', w: 30, h: 8, d: 20, p: [0, 7, -18], color: SANDSTONE },
      { type: 'box', w: 26, h: 8, d: 16, p: [0, 15, -18], color: SANDSTONE },
      { type: 'archwall', w: 20, h: 8, d: 1.5, arches: 3, p: [0, 23, -12], color: SANDSTONE, label: 'Upper storeys collapsed' },
      { type: 'rubble', r: 10, count: 26, seed: 15, size: 1.2, p: [0, 23, -18], color: RUBBLE },
      { type: 'colonnade', length: 90, h: 3.5, count: 24, roof: false, broken: 0.4, seed: 16, p: [0, 1, 6], color: SANDSTONE },
      { type: 'colonnade', length: 90, h: 3.5, count: 24, roof: false, broken: 0.5, seed: 17, p: [0, 1, 18], color: SANDSTONE },
      { type: 'plinth', w: 12, d: 12, h: 3, steps: 3, p: [-40, 1, 28], color: SANDSTONE },
      { type: 'box', w: 6, h: 6, d: 6, p: [-40, 4, 28], color: SANDSTONE },
      { type: 'shikhara', r: 3.2, h: 12, p: [-40, 10, 28], color: SANDSTONE, label: 'Gopinath temple (intact)' },
      { type: 'plinth', w: 10, d: 10, h: 2, steps: 2, p: [40, 1, 28], color: SANDSTONE },
      { type: 'box', w: 5, h: 5, d: 5, p: [40, 3, 28], color: SANDSTONE },
      { type: 'shikhara', r: 2.6, h: 10, p: [40, 8, 28], color: SANDSTONE },
    ],
  },

  // =========================================================================
  {
    id: 'redfort',
    name: 'Red Fort (Lal Qila)',
    nameHi: 'लाल क़िला',
    city: 'Delhi',
    state: 'Delhi',
    lat: 28.6562,
    lng: 77.241,
    built: '1639–1648 CE',
    builder: 'Emperor Shah Jahan (architect Ustad Ahmad Lahori)',
    style: 'Mughal — red sandstone ramparts, marble palaces, charbagh gardens',
    status: 'partially-destroyed',
    unesco: true,
    emoji: '🏯',
    accent: '#b23a2a',
    summary:
      "The palace-fortress of Shahjahanabad, seat of the Mughal emperors for 200 years and the place where India's Prime Minister hoists the flag every Independence Day. Behind the famous ramparts, most of the original palace city no longer exists.",
    summaryHi:
      'शाहजहाँनाबाद का महल-दुर्ग, 200 वर्षों तक मुग़ल बादशाहों की गद्दी, और वह स्थान जहाँ हर स्वतंत्रता दिवस पर प्रधानमंत्री झंडा फहराते हैं। प्रसिद्ध प्राचीरों के पीछे मूल महल-नगर का अधिकांश हिस्सा अब मौजूद नहीं है।',
    whatHappened:
      'After the Revolt of 1857 the British exiled Bahadur Shah Zafar and demolished roughly 80 % of the structures inside the fort — harem courts, gardens, pavilions and the bazaars — replacing them with stone barracks. Earlier, in 1739, Nadir Shah had carried away the Peacock Throne and the Koh-i-Noor.',
    whatHappenedHi:
      '1857 के विद्रोह के बाद अंग्रेज़ों ने बहादुर शाह ज़फ़र को निर्वासित किया और किले के भीतर की लगभग 80% इमारतें — हरम, बाग़, मंडप और बाज़ार — गिराकर पत्थर की बैरकें बनाईं। इससे पहले 1739 में नादिर शाह मयूर सिंहासन और कोहिनूर ले गया था।',
    timeline: [
      { year: '1639', event: 'Shah Jahan lays the foundation of his new capital Shahjahanabad.', kind: 'build' },
      { year: '1648', event: 'Fort completed; Peacock Throne installed in the Diwan-i-Khas.', kind: 'build' },
      { year: '1739', event: 'Nadir Shah sacks Delhi; Peacock Throne and Koh-i-Noor taken to Persia.', kind: 'destroy' },
      { year: '1857', event: 'Last Mughal, Bahadur Shah Zafar, tried in the Diwan-i-Khas and exiled to Rangoon.', kind: 'destroy' },
      { year: '1858–63', event: 'British demolish most palaces and gardens; barracks built.', kind: 'destroy' },
      { year: '1947', event: 'Nehru hoists the tricolour on 15 August.', kind: 'other' },
      { year: '2007', event: 'Inscribed as UNESCO World Heritage Site.', kind: 'restore' },
    ],
    facts: [
      'The Diwan-i-Khas carries the inscription "If there be a paradise on earth, it is this, it is this, it is this."',
      'The Nahr-i-Bihisht ("Stream of Paradise") once flowed through every palace pavilion.',
      "The fort's walls run 2.4 km and rise up to 33 m on the river side.",
    ],
    thenLabel: 'c. 1700 CE — complete Mughal palace city inside the walls',
    thenYear: '1700',
    nowLabel: 'Today — surviving pavilions among British barracks and lawns',
    footprint: 90,
    keywords: ['red sandstone ramparts', 'Lahori gate', 'marble pavilions', 'Delhi', 'Mughal fort'],
    then: [
      { type: 'plinth', w: 180, d: 110, h: 1, steps: 1, color: '#c7a070' },
      { type: 'wall', w: 180, h: 14, d: 4, crenels: true, p: [0, 1, -55], color: RED_SANDSTONE },
      { type: 'wall', w: 180, h: 14, d: 4, crenels: true, p: [0, 1, 55], color: RED_SANDSTONE },
      { type: 'wall', w: 4, h: 14, d: 110, crenels: true, p: [-90, 1, 0], color: RED_SANDSTONE },
      { type: 'wall', w: 4, h: 14, d: 110, crenels: true, p: [90, 1, 0], color: RED_SANDSTONE },
      ...bastions(180, 110, 6, 17, RED_SANDSTONE),
      // Lahori gate
      { type: 'box', w: 18, h: 20, d: 12, p: [-90, 1, 0], color: RED_SANDSTONE, label: 'Lahori Gate' },
      { type: 'tower', r: 3.5, h: 24, crenels: true, p: [-90, 1, -9], color: RED_SANDSTONE },
      { type: 'tower', r: 3.5, h: 24, crenels: true, p: [-90, 1, 9], color: RED_SANDSTONE },
      // Chhatta chowk bazaar
      { type: 'archwall', w: 50, h: 8, d: 6, arches: 8, p: [-55, 1, 0], color: RED_SANDSTONE, label: 'Chhatta Chowk bazaar' },
      // Naubat khana
      { type: 'box', w: 10, h: 12, d: 14, p: [-18, 1, 0], color: RED_SANDSTONE },
      // Diwan-i-Aam
      { type: 'hall', w: 30, d: 16, h: 7, cols: 9, rows: 4, roof: true, p: [10, 1, 0], color: RED_SANDSTONE, label: 'Diwan-i-Aam' },
      // river-front palaces (marble), with Nahr-i-Bihisht
      { type: 'water', w: 2, d: 100, p: [70, 1.1, 0] },
      { type: 'hall', w: 16, d: 12, h: 6, cols: 5, rows: 4, roof: true, p: [70, 1, -40], color: MARBLE, label: 'Moti Masjid' },
      { type: 'dome', r: 3, onion: true, p: [70, 7, -40], color: MARBLE },
      { type: 'hall', w: 18, d: 14, h: 7, cols: 5, rows: 4, roof: true, p: [70, 1, -22], color: MARBLE, label: 'Hammam' },
      { type: 'hall', w: 20, d: 14, h: 7, cols: 5, rows: 4, roof: true, p: [70, 1, -4], color: MARBLE, label: 'Diwan-i-Khas' },
      { type: 'chhatri', r: 1.5, h: 2.5, p: [62, 8, -10], color: MARBLE },
      { type: 'chhatri', r: 1.5, h: 2.5, p: [78, 8, -10], color: MARBLE },
      { type: 'chhatri', r: 1.5, h: 2.5, p: [62, 8, 2], color: MARBLE },
      { type: 'chhatri', r: 1.5, h: 2.5, p: [78, 8, 2], color: MARBLE },
      { type: 'hall', w: 18, d: 14, h: 7, cols: 5, rows: 4, roof: true, p: [70, 1, 14], color: MARBLE, label: 'Khas Mahal' },
      { type: 'hall', w: 24, d: 16, h: 7, cols: 6, rows: 4, roof: true, p: [70, 1, 34], color: MARBLE, label: 'Rang Mahal' },
      { type: 'hall', w: 16, d: 12, h: 6, cols: 5, rows: 4, roof: true, p: [70, 1, 50], color: MARBLE, label: 'Mumtaz Mahal' },
      // Harem courts & gardens (demolished later)
      ...range(3).map((i): Part => ({ type: 'box', w: 20, h: 6, d: 14, p: [40, 1, 24 + i * 14], color: RED_SANDSTONE, label: 'Harem courts (demolished 1858)' })),
      ...orchard(40, 30, 5, 4, 5, 2).map((t) => ({ ...t, p: [t.p![0] + 40, 1, t.p![2] - 32] as [number, number, number] })),
      { type: 'water', w: 10, d: 10, p: [40, 1.1, -32] },
      { type: 'chhatri', r: 2, h: 3, p: [40, 1, -32], color: MARBLE, label: 'Zafar Mahal in Hayat Bakhsh Bagh' },
    ],
    now: [
      { type: 'plinth', w: 180, d: 110, h: 1, steps: 1, color: '#9fb36a' },
      { type: 'wall', w: 180, h: 14, d: 4, crenels: true, p: [0, 1, -55], color: RED_SANDSTONE },
      { type: 'wall', w: 180, h: 14, d: 4, crenels: true, p: [0, 1, 55], color: RED_SANDSTONE },
      { type: 'wall', w: 4, h: 14, d: 110, crenels: true, p: [-90, 1, 0], color: RED_SANDSTONE },
      { type: 'wall', w: 4, h: 14, d: 110, crenels: true, p: [90, 1, 0], color: RED_SANDSTONE },
      ...bastions(180, 110, 6, 17, RED_SANDSTONE),
      { type: 'box', w: 18, h: 20, d: 12, p: [-90, 1, 0], color: RED_SANDSTONE, label: 'Lahori Gate' },
      { type: 'tower', r: 3.5, h: 24, crenels: true, p: [-90, 1, -9], color: RED_SANDSTONE },
      { type: 'tower', r: 3.5, h: 24, crenels: true, p: [-90, 1, 9], color: RED_SANDSTONE },
      { type: 'archwall', w: 50, h: 8, d: 6, arches: 8, p: [-55, 1, 0], color: RED_SANDSTONE, label: 'Chhatta Chowk' },
      { type: 'box', w: 10, h: 12, d: 14, p: [-18, 1, 0], color: RED_SANDSTONE },
      { type: 'hall', w: 30, d: 16, h: 7, cols: 9, rows: 4, roof: true, p: [10, 1, 0], color: RED_SANDSTONE, label: 'Diwan-i-Aam' },
      { type: 'hall', w: 16, d: 12, h: 6, cols: 5, rows: 4, roof: true, p: [70, 1, -40], color: MARBLE, label: 'Moti Masjid' },
      { type: 'dome', r: 3, onion: true, p: [70, 7, -40], color: MARBLE },
      { type: 'hall', w: 18, d: 14, h: 7, cols: 5, rows: 4, roof: true, p: [70, 1, -22], color: MARBLE, label: 'Hammam' },
      { type: 'hall', w: 20, d: 14, h: 7, cols: 5, rows: 4, roof: true, p: [70, 1, -4], color: MARBLE, label: 'Diwan-i-Khas' },
      { type: 'chhatri', r: 1.5, h: 2.5, p: [62, 8, -10], color: MARBLE },
      { type: 'chhatri', r: 1.5, h: 2.5, p: [78, 8, -10], color: MARBLE },
      { type: 'chhatri', r: 1.5, h: 2.5, p: [62, 8, 2], color: MARBLE },
      { type: 'chhatri', r: 1.5, h: 2.5, p: [78, 8, 2], color: MARBLE },
      { type: 'hall', w: 18, d: 14, h: 7, cols: 5, rows: 4, roof: true, p: [70, 1, 14], color: MARBLE, label: 'Khas Mahal' },
      { type: 'hall', w: 24, d: 16, h: 7, cols: 6, rows: 4, roof: true, p: [70, 1, 34], color: MARBLE, label: 'Rang Mahal' },
      { type: 'hall', w: 16, d: 12, h: 6, cols: 5, rows: 4, roof: true, p: [70, 1, 50], color: MARBLE, label: 'Mumtaz Mahal' },
      // British barracks
      ...range(3).map((i): Part => ({ type: 'box', w: 44, h: 10, d: 10, p: [30, 1, -36 + i * 14], color: '#b9b2a5', label: 'British barracks (1860s)' })),
      { type: 'box', w: 44, h: 10, d: 10, p: [30, 1, 30], color: '#b9b2a5', label: 'British barracks (1860s)' },
    ],
  },

  // =========================================================================
  {
    id: 'shoretemple',
    name: 'Shore Temple & the Seven Pagodas',
    nameHi: 'तट मंदिर और सात पगोडा, महाबलीपुरम',
    city: 'Mahabalipuram',
    state: 'Tamil Nadu',
    lat: 12.6165,
    lng: 80.1994,
    built: 'c. 700–728 CE',
    builder: 'Narasimhavarman II Rajasimha (Pallava dynasty)',
    style: 'Early Dravidian structural granite temple',
    status: 'lost',
    unesco: true,
    emoji: '⛵',
    accent: '#5b8d7f',
    summary:
      'One of the oldest structural stone temples of South India, standing on the Coromandel shore. European sailors called the coast "Seven Pagodas" — legend says six sister temples were swallowed by the sea, and the 2004 tsunami briefly exposed submerged walls and sculptures offshore.',
    summaryHi:
      'दक्षिण भारत के सबसे पुराने संरचनात्मक पत्थर मंदिरों में से एक, कोरोमंडल तट पर खड़ा। यूरोपीय नाविक इस तट को "सात पगोडा" कहते थे — किंवदंती है कि छह अन्य मंदिर समुद्र में समा गए, और 2004 की सुनामी ने समुद्र में डूबी दीवारें और मूर्तियाँ कुछ देर के लिए उजागर कीं।',
    whatHappened:
      'Coastal erosion, sea-level rise and storm surges over 1,300 years wore away the shoreline. Marine archaeology (NIO, 2002–2005) found man-made walls and steps up to 500 m offshore, suggesting that at least some of the lost "pagodas" were real. The surviving temple itself was half-buried in sand until the ASI cleared it in the 1990s.',
    whatHappenedHi:
      '1,300 वर्षों में तटीय कटाव, समुद्र-स्तर वृद्धि और तूफ़ानी लहरों ने तट को काट दिया। समुद्री पुरातत्व (NIO, 2002–2005) को तट से 500 मीटर दूर मानव-निर्मित दीवारें और सीढ़ियाँ मिलीं — यानी कुछ "खोए पगोडा" वास्तविक थे। बचा मंदिर भी 1990 के दशक तक आधा रेत में दबा था।',
    timeline: [
      { year: 'c. 700', event: 'Rajasimha builds the Shore Temple with twin Shiva shrines and a Vishnu shrine.', kind: 'build' },
      { year: '1275', event: 'Marco Polo mentions the "Seven Pagodas" on the Coromandel coast.', kind: 'other' },
      { year: '1798', event: 'British traveller Chambers records local tales of six temples lost to the sea.', kind: 'other' },
      { year: '1984', event: 'Group of Monuments at Mahabalipuram inscribed by UNESCO.', kind: 'restore' },
      { year: '2004', event: 'Tsunami exposes submerged structures and a granite lion offshore.', kind: 'other' },
    ],
    facts: [
      'A granite wall of Nandi bulls once ringed the temple compound.',
      'The temple\'s two towers face east and west so sunrise and sunset light both shrines.',
      'The Pallavas traded with Southeast Asia; their style influenced Angkor.',
    ],
    thenLabel: 'c. 800 CE — the "Seven Pagodas" along the shore',
    thenYear: '800',
    nowLabel: 'Today — a single temple at the edge of the sea',
    footprint: 60,
    keywords: ['granite shore temple', 'two pyramidal towers', 'sea behind', 'Nandi wall', 'Tamil Nadu coast'],
    then: [
      { type: 'water', w: 200, d: 60, p: [0, -0.4, 80] },
      { type: 'plinth', w: 30, d: 20, h: 1.5, steps: 2, color: GRANITE },
      { type: 'box', w: 8, h: 8, d: 8, p: [-6, 1.5, 0], color: GRANITE },
      { type: 'pyramid', w: 8, d: 8, h: 12, tiers: 4, p: [-6, 9.5, 0], color: GRANITE, label: 'Kshatriyasimhesvara (east shrine)' },
      { type: 'box', w: 6, h: 6, d: 6, p: [6, 1.5, 0], color: GRANITE },
      { type: 'pyramid', w: 6, d: 6, h: 8, tiers: 3, p: [6, 7.5, 0], color: GRANITE },
      ...range(6).map((i): Part => {
        const x = -70 + i * 28
        return { type: 'pyramid', w: 8, d: 8, h: 14, tiers: 4, p: [x, 1, 40 + (i % 2) * 10], color: GRANITE, label: 'Lost pagoda' }
      }),
      ...range(6).map((i): Part => ({ type: 'box', w: 8, h: 1, d: 8, p: [-70 + i * 28, 0, 40 + (i % 2) * 10], color: GRANITE })),
    ],
    now: [
      { type: 'water', w: 200, d: 60, p: [0, -0.4, 40] },
      { type: 'plinth', w: 30, d: 20, h: 1.5, steps: 2, color: GRANITE },
      { type: 'box', w: 8, h: 8, d: 8, p: [-6, 1.5, 0], color: GRANITE },
      { type: 'pyramid', w: 8, d: 8, h: 12, tiers: 4, p: [-6, 9.5, 0], color: GRANITE },
      { type: 'box', w: 6, h: 6, d: 6, p: [6, 1.5, 0], color: GRANITE },
      { type: 'pyramid', w: 6, d: 6, h: 8, tiers: 3, p: [6, 7.5, 0], color: GRANITE },
      { type: 'rubble', r: 30, count: 10, seed: 41, size: 1.2, p: [0, -0.3, 30], color: GRANITE, label: 'Submerged remains' },
    ],
  },

  // =========================================================================
  {
    id: 'qutub',
    name: 'Qutub Minar',
    nameHi: 'क़ुतुब मीनार',
    city: 'Mehrauli, Delhi',
    state: 'Delhi',
    lat: 28.5245,
    lng: 77.1855,
    built: '1199–1220 CE; top storeys 1368',
    builder: 'Qutb-ud-din Aibak, Iltutmish, Firoz Shah Tughlaq',
    style: 'Indo-Islamic (Mamluk) — fluted red sandstone & marble',
    status: 'intact',
    unesco: true,
    emoji: '🗼',
    accent: '#b5533c',
    summary:
      "At 72.5 m the tallest brick minaret in the world, built in five tapering storeys of fluted red sandstone and marble. It has survived lightning strikes and earthquakes — and even a short-lived British cupola, now standing on the lawn as 'Smith's Folly'.",
    summaryHi:
      '72.5 मीटर ऊँची, दुनिया की सबसे ऊँची ईंट की मीनार — लाल बलुआ पत्थर और संगमरमर की पाँच मंज़िलें। इसने बिजली और भूकंप झेले — और एक अल्पकालिक ब्रिटिश गुंबद भी, जो अब "स्मिथ्स फ़ॉली" के नाम से बग़ीचे में रखा है।',
    whatHappened:
      "The original cupola fell in the 1803 earthquake. In 1828 Major Robert Smith crowned the minar with a Bengali-style chhatri which was so disliked that Lord Hardinge had it removed in 1848. Beside it stands the Alai Minar, begun by Alauddin Khalji in 1311 to be twice as tall, abandoned after his death at 24.5 m.",
    whatHappenedHi:
      '1803 के भूकंप में मूल गुंबद गिर गया। 1828 में मेजर रॉबर्ट स्मिथ ने मीनार पर बंगाली शैली की छतरी लगाई, जो इतनी नापसंद हुई कि 1848 में लॉर्ड हार्डिंग ने हटवा दी। पास ही अलाई मीनार है, जिसे अलाउद्दीन ख़िलजी ने 1311 में दोगुनी ऊँचाई के लिए शुरू किया, पर यह 24.5 मीटर पर अधूरी रह गई।',
    timeline: [
      { year: '1199', event: 'Qutb-ud-din Aibak builds the first storey.', kind: 'build' },
      { year: '1220', event: 'Iltutmish adds three more storeys.', kind: 'build' },
      { year: '1311', event: 'Alauddin Khalji starts the Alai Minar; it is never finished.', kind: 'build' },
      { year: '1368', event: 'Lightning destroys the top; Firoz Shah Tughlaq rebuilds with two marble storeys.', kind: 'restore' },
      { year: '1803', event: 'Earthquake topples the cupola.', kind: 'destroy' },
      { year: '1828', event: "Major Smith's cupola added; removed in 1848.", kind: 'other' },
      { year: '1993', event: 'Qutb complex inscribed by UNESCO.', kind: 'restore' },
    ],
    facts: [
      'The Iron Pillar in the complex (4th century CE) has not rusted in 1,600 years.',
      'The minar leans about 65 cm from vertical.',
      'Public entry inside the minar was stopped after a 1981 stampede.',
    ],
    thenLabel: "1830s — with Smith's cupola on top",
    thenYear: '1835',
    nowLabel: 'Today — minar without cupola; Alai Minar stump beside it',
    footprint: 50,
    keywords: ['tall fluted red minaret', 'five storeys with balconies', 'Delhi', 'ruined mosque arches'],
    then: [
      { type: 'plinth', w: 90, d: 60, h: 1, steps: 1, color: '#9fb36a' },
      { type: 'minaret', r: 7.2, h: 68, balconies: 4, taper: 0.2, cupola: true, p: [0, 1, 10], color: RED_SANDSTONE, label: "Qutub Minar with Smith's cupola" },
      // Quwwat-ul-Islam mosque screen
      { type: 'archwall', w: 36, h: 14, d: 2.5, arches: 5, p: [-10, 1, -14], color: RED_SANDSTONE, label: 'Quwwat-ul-Islam arched screen' },
      { type: 'colonnade', length: 36, h: 4, count: 12, roof: true, p: [-10, 1, -22], color: GREY_STONE },
      { type: 'pillar', r: 0.25, h: 7.2, p: [-10, 1, -8], color: '#4b4a48', label: 'Iron Pillar' },
      // Alai Minar stump
      { type: 'cylinder', r: 12, h: 24, rTop: 10, p: [-30, 1, 16], color: RUBBLE, label: 'Alai Minar (unfinished)' },
      // Alai Darwaza
      { type: 'box', w: 12, h: 10, d: 12, p: [24, 1, -4], color: RED_SANDSTONE },
      { type: 'dome', r: 5, p: [24, 11, -4], color: RED_SANDSTONE },
    ],
    now: [
      { type: 'plinth', w: 90, d: 60, h: 1, steps: 1, color: '#9fb36a' },
      { type: 'minaret', r: 7.2, h: 68, balconies: 4, taper: 0.2, cupola: false, p: [0, 1, 10], color: RED_SANDSTONE, label: 'Qutub Minar (72.5 m)' },
      { type: 'archwall', w: 36, h: 14, d: 2.5, arches: 5, p: [-10, 1, -14], color: RED_SANDSTONE },
      { type: 'colonnade', length: 36, h: 4, count: 12, roof: false, broken: 0.3, seed: 3, p: [-10, 1, -22], color: GREY_STONE },
      { type: 'pillar', r: 0.25, h: 7.2, p: [-10, 1, -8], color: '#4b4a48', label: 'Iron Pillar' },
      { type: 'cylinder', r: 12, h: 24, rTop: 10, p: [-30, 1, 16], color: RUBBLE, label: 'Alai Minar (unfinished)' },
      { type: 'box', w: 12, h: 10, d: 12, p: [24, 1, -4], color: RED_SANDSTONE },
      { type: 'dome', r: 5, p: [24, 11, -4], color: RED_SANDSTONE },
      { type: 'chhatri', r: 2.2, h: 3, p: [20, 1, 20], color: RED_SANDSTONE, label: "Smith's Folly on the lawn" },
    ],
  },

  // =========================================================================
  {
    id: 'taj',
    name: 'Taj Mahal',
    nameHi: 'ताज महल',
    city: 'Agra',
    state: 'Uttar Pradesh',
    lat: 27.1751,
    lng: 78.0421,
    built: '1632–1653 CE',
    builder: 'Emperor Shah Jahan (architect Ustad Ahmad Lahori)',
    style: 'Mughal — white Makrana marble with pietra dura inlay',
    status: 'intact',
    unesco: true,
    emoji: '🕌',
    accent: '#c8b7a0',
    summary:
      'A mausoleum built by Shah Jahan for his wife Mumtaz Mahal, universally admired for its symmetry and its changing colours through the day. The building is intact, but the garden you see today is not the one the Mughals planted.',
    summaryHi:
      'शाहजहाँ द्वारा अपनी पत्नी मुमताज़ महल के लिए बनवाया गया मक़बरा, अपनी समरूपता और दिन भर बदलते रंगों के लिए विश्व-प्रसिद्ध। इमारत सुरक्षित है, पर जो बाग़ आज दिखता है वह मुग़लों का लगाया बाग़ नहीं है।',
    whatHappened:
      'The original charbagh was a dense paradise garden of fruit trees, cypresses and flowers. Around 1900 Viceroy Lord Curzon re-landscaped it into open English lawns to give the famous unobstructed view. The marble itself faces threats from air pollution and Yamuna pollution, now managed with mud-pack cleaning.',
    whatHappenedHi:
      'मूल चारबाग़ फलदार पेड़ों, सरो और फूलों का घना "जन्नत का बाग़" था। लगभग 1900 में वायसराय लॉर्ड कर्ज़न ने इसे खुले अंग्रेज़ी लॉन में बदल दिया ताकि प्रसिद्ध निर्बाध दृश्य मिले। संगमरमर को वायु और यमुना प्रदूषण से खतरा है, जिसके लिए मिट्टी-लेप सफ़ाई की जाती है।',
    timeline: [
      { year: '1631', event: 'Mumtaz Mahal dies at Burhanpur giving birth to her 14th child.', kind: 'other' },
      { year: '1632', event: 'Construction begins; 20,000 workers and 1,000 elephants.', kind: 'build' },
      { year: '1653', event: 'Complex completed including mosque, guest house and gardens.', kind: 'build' },
      { year: '1666', event: 'Shah Jahan, deposed by Aurangzeb, is buried beside Mumtaz.', kind: 'other' },
      { year: 'c. 1900', event: 'Lord Curzon restores the building and replaces the orchard with lawns.', kind: 'restore' },
      { year: '1983', event: 'Inscribed by UNESCO; later named one of the New Seven Wonders.', kind: 'restore' },
    ],
    facts: [
      'The four minarets lean slightly outward so they would fall away from the tomb in an earthquake.',
      'The calligraphy grows larger higher up so it appears uniform from the ground.',
      'During WWII the dome was hidden under bamboo scaffolding to confuse bombers.',
    ],
    thenLabel: 'c. 1660 CE — the original Mughal orchard charbagh',
    thenYear: '1660',
    nowLabel: "Today — Curzon's lawns with the reflecting pool",
    footprint: 90,
    keywords: ['white marble dome', 'four minarets', 'reflecting pool', 'Agra', 'symmetry'],
    then: [
      { type: 'plinth', w: 190, d: 190, h: 0.6, steps: 1, p: [0, 0, 60], color: '#8e9c5f' },
      { type: 'plinth', w: 96, d: 96, h: 7, steps: 2, p: [0, 0, -40], color: MARBLE },
      { type: 'box', w: 56, h: 26, d: 56, p: [0, 7, -40], color: MARBLE },
      { type: 'dome', r: 17, onion: true, p: [0, 33, -40], color: MARBLE, label: 'Main dome (73 m)' },
      { type: 'chhatri', r: 4, h: 6, p: [-20, 33, -60], color: MARBLE },
      { type: 'chhatri', r: 4, h: 6, p: [20, 33, -60], color: MARBLE },
      { type: 'chhatri', r: 4, h: 6, p: [-20, 33, -20], color: MARBLE },
      { type: 'chhatri', r: 4, h: 6, p: [20, 33, -20], color: MARBLE },
      { type: 'minaret', r: 3, h: 40, balconies: 2, taper: 0.8, cupola: true, p: [-44, 7, -84], color: MARBLE },
      { type: 'minaret', r: 3, h: 40, balconies: 2, taper: 0.8, cupola: true, p: [44, 7, -84], color: MARBLE },
      { type: 'minaret', r: 3, h: 40, balconies: 2, taper: 0.8, cupola: true, p: [-44, 7, 4], color: MARBLE },
      { type: 'minaret', r: 3, h: 40, balconies: 2, taper: 0.8, cupola: true, p: [44, 7, 4], color: MARBLE },
      // mosque & jawab
      { type: 'archwall', w: 50, h: 16, d: 20, arches: 3, p: [-80, 0, -50], ry: 90, color: RED_SANDSTONE, label: 'Mosque' },
      { type: 'dome', r: 6, onion: true, p: [-80, 16, -50], color: MARBLE },
      { type: 'archwall', w: 50, h: 16, d: 20, arches: 3, p: [80, 0, -50], ry: 90, color: RED_SANDSTONE, label: 'Mehman Khana (guest house)' },
      { type: 'dome', r: 6, onion: true, p: [80, 16, -50], color: MARBLE },
      // charbagh with orchard
      { type: 'water', w: 6, d: 170, p: [0, 0.7, 60] },
      { type: 'water', w: 170, d: 6, p: [0, 0.7, 60] },
      ...orchard(70, 70, 5, 5, 8, 3.5).map((t) => ({ ...t, p: [t.p![0] - 48, 0.6, t.p![2] + 60] as [number, number, number] })),
      ...orchard(70, 70, 5, 5, 8, 3.5).map((t) => ({ ...t, p: [t.p![0] + 48, 0.6, t.p![2] + 60] as [number, number, number] })),
      // great gate
      { type: 'archwall', w: 40, h: 22, d: 16, arches: 1, p: [0, 0, 150], color: RED_SANDSTONE, label: 'Darwaza-i-Rauza' },
    ],
    now: [
      { type: 'plinth', w: 190, d: 190, h: 0.6, steps: 1, p: [0, 0, 60], color: '#8ea860' },
      { type: 'plinth', w: 96, d: 96, h: 7, steps: 2, p: [0, 0, -40], color: MARBLE },
      { type: 'box', w: 56, h: 26, d: 56, p: [0, 7, -40], color: MARBLE },
      { type: 'dome', r: 17, onion: true, p: [0, 33, -40], color: MARBLE, label: 'Main dome (73 m)' },
      { type: 'chhatri', r: 4, h: 6, p: [-20, 33, -60], color: MARBLE },
      { type: 'chhatri', r: 4, h: 6, p: [20, 33, -60], color: MARBLE },
      { type: 'chhatri', r: 4, h: 6, p: [-20, 33, -20], color: MARBLE },
      { type: 'chhatri', r: 4, h: 6, p: [20, 33, -20], color: MARBLE },
      { type: 'minaret', r: 3, h: 40, balconies: 2, taper: 0.8, cupola: true, p: [-44, 7, -84], color: MARBLE },
      { type: 'minaret', r: 3, h: 40, balconies: 2, taper: 0.8, cupola: true, p: [44, 7, -84], color: MARBLE },
      { type: 'minaret', r: 3, h: 40, balconies: 2, taper: 0.8, cupola: true, p: [-44, 7, 4], color: MARBLE },
      { type: 'minaret', r: 3, h: 40, balconies: 2, taper: 0.8, cupola: true, p: [44, 7, 4], color: MARBLE },
      { type: 'archwall', w: 50, h: 16, d: 20, arches: 3, p: [-80, 0, -50], ry: 90, color: RED_SANDSTONE, label: 'Mosque' },
      { type: 'dome', r: 6, onion: true, p: [-80, 16, -50], color: MARBLE },
      { type: 'archwall', w: 50, h: 16, d: 20, arches: 3, p: [80, 0, -50], ry: 90, color: RED_SANDSTONE, label: 'Mehman Khana' },
      { type: 'dome', r: 6, onion: true, p: [80, 16, -50], color: MARBLE },
      { type: 'water', w: 6, d: 170, p: [0, 0.7, 60] },
      { type: 'water', w: 170, d: 6, p: [0, 0.7, 60] },
      { type: 'plinth', w: 20, d: 20, h: 1, steps: 1, p: [0, 0.6, 60], color: MARBLE },
      { type: 'water', w: 10, d: 10, p: [0, 1.7, 60] },
      ...range(8).map((i): Part => ({ type: 'tree', h: 9, r: 1.2, p: [-10 - (i % 4) * 14 - 20, 0.6, 20 + Math.floor(i / 4) * 80], color: '#2f5d3a' })),
      ...range(8).map((i): Part => ({ type: 'tree', h: 9, r: 1.2, p: [10 + (i % 4) * 14 + 20, 0.6, 20 + Math.floor(i / 4) * 80], color: '#2f5d3a' })),
      { type: 'archwall', w: 40, h: 22, d: 16, arches: 1, p: [0, 0, 150], color: RED_SANDSTONE, label: 'Darwaza-i-Rauza' },
    ],
  },

  // =========================================================================
  {
    id: 'sanchi',
    name: 'Great Stupa, Sanchi',
    nameHi: 'साँची का महान स्तूप',
    city: 'Sanchi, Raisen',
    state: 'Madhya Pradesh',
    lat: 23.4794,
    lng: 77.7398,
    built: '3rd century BCE; enlarged 1st century BCE',
    builder: 'Emperor Ashoka (Maurya); gateways under the Satavahanas',
    style: 'Buddhist stupa with stone vedika and four carved toranas',
    status: 'rebuilt',
    unesco: true,
    emoji: '☸️',
    accent: '#8a6d3b',
    summary:
      'The oldest stone structure in India, a hemispherical relic mound raised by Ashoka and later encased in stone and crowned with a triple umbrella. Its four gateways carry the finest early Buddhist narrative sculpture.',
    summaryHi:
      'भारत की सबसे पुरानी पत्थर की संरचना — सम्राट अशोक द्वारा बनवाया गया अर्धगोलाकार अवशेष-टीला, जिसे बाद में पत्थर से ढँककर त्रि-छत्र से सजाया गया। इसके चार तोरण प्रारंभिक बौद्ध कथा-शिल्प के सर्वोत्तम उदाहरण हैं।',
    whatHappened:
      'Forgotten after the 13th century, the stupa was rediscovered in 1818. In 1822 Captain Johnson cut a huge breach through the dome in search of treasure, collapsing part of it; later amateur digs did more harm, and the Ashokan pillar was broken up by a local landlord for a sugarcane press. John Marshall rebuilt the dome and re-erected the gateways in 1912–19.',
    whatHappenedHi:
      '13वीं सदी के बाद भुला दिया गया स्तूप 1818 में फिर खोजा गया। 1822 में कैप्टन जॉनसन ने खज़ाने की तलाश में गुंबद में बड़ा छेद किया जिससे वह आंशिक रूप से ढह गया; बाद की खुदाइयों ने और नुकसान किया, और अशोक स्तंभ को एक ज़मींदार ने गन्ने की चरखी के लिए तोड़ डाला। 1912–19 में जॉन मार्शल ने गुंबद फिर बनाया और तोरण खड़े किए।',
    timeline: [
      { year: 'c. 260 BCE', event: 'Ashoka builds a brick stupa over relics of the Buddha and raises a pillar.', kind: 'build' },
      { year: 'c. 150 BCE', event: 'Shunga period: stupa doubled in size and faced with stone; railing added.', kind: 'build' },
      { year: 'c. 50 BCE', event: 'Satavahana artisans carve the four toranas.', kind: 'build' },
      { year: '1818', event: 'General Taylor rediscovers the overgrown site.', kind: 'other' },
      { year: '1822', event: 'Johnson and Maddock breach the dome hunting for treasure.', kind: 'destroy' },
      { year: '1912–19', event: 'John Marshall restores the stupa and gateways.', kind: 'restore' },
      { year: '1989', event: 'Inscribed by UNESCO.', kind: 'restore' },
    ],
    facts: [
      'The toranas show the Buddha only through symbols — footprints, an empty throne, the Bodhi tree.',
      'The Sanchi stupa appears on the reverse of the ₹200 banknote.',
      'Ashoka\'s wife Devi came from nearby Vidisha.',
    ],
    thenLabel: 'c. 100 CE — plastered stupa, Ashokan pillar standing',
    thenYear: '100',
    nowLabel: 'Today — restored stone dome, pillar stump',
    footprint: 30,
    keywords: ['hemispherical stone dome', 'carved gateways', 'stone railing', 'Madhya Pradesh', 'Buddhist'],
    then: [
      { type: 'plinth', w: 50, d: 50, h: 0.5, steps: 1, color: '#9fa671' },
      { type: 'stupa', r: 18, railing: true, chhatra: true, p: [0, 0.5, 0], color: '#e8dcc4', label: 'Great Stupa (with original lime plaster)' },
      { type: 'torana', w: 7, h: 10, p: [0, 0.5, 24] },
      { type: 'torana', w: 7, h: 10, p: [0, 0.5, -24], ry: 180 },
      { type: 'torana', w: 7, h: 10, p: [24, 0.5, 0], ry: 90 },
      { type: 'torana', w: 7, h: 10, p: [-24, 0.5, 0], ry: 270 },
      { type: 'pillar', r: 0.6, h: 12, capital: true, p: [6, 0.5, 26], color: '#b7a58a', label: 'Ashokan pillar with lion capital' },
    ],
    now: [
      { type: 'plinth', w: 50, d: 50, h: 0.5, steps: 1, color: '#9fa671' },
      { type: 'stupa', r: 18, railing: true, chhatra: true, p: [0, 0.5, 0], color: SANDSTONE, label: 'Great Stupa (restored 1919)' },
      { type: 'torana', w: 7, h: 10, p: [0, 0.5, 24] },
      { type: 'torana', w: 7, h: 10, p: [0, 0.5, -24], ry: 180 },
      { type: 'torana', w: 7, h: 10, p: [24, 0.5, 0], ry: 90 },
      { type: 'torana', w: 7, h: 10, p: [-24, 0.5, 0], ry: 270 },
      { type: 'pillar', r: 0.6, h: 12, broken: true, p: [6, 0.5, 26], color: '#b7a58a', label: 'Ashokan pillar stump' },
    ],
  },

  // =========================================================================
  {
    id: 'hawamahal',
    name: 'Hawa Mahal',
    nameHi: 'हवा महल',
    city: 'Jaipur',
    state: 'Rajasthan',
    lat: 26.9239,
    lng: 75.8267,
    built: '1799 CE',
    builder: 'Maharaja Sawai Pratap Singh (architect Lal Chand Ustad)',
    style: 'Rajput with Mughal influence — pink sandstone honeycomb façade',
    status: 'intact',
    emoji: '🪟',
    accent: '#d9846a',
    summary:
      'The "Palace of Winds" — a five-storey screen of 953 small jharokha windows, built so royal women could watch street processions unseen. Shaped like the crown of Krishna, it is only one room deep at the top.',
    summaryHi:
      '"हवाओं का महल" — 953 छोटे झरोखों की पाँच मंज़िला जाली, जिससे राजघराने की स्त्रियाँ बिना दिखे सड़क के जुलूस देख सकें। कृष्ण के मुकुट के आकार का यह महल ऊपर केवल एक कमरे जितना गहरा है।',
    whatHappened:
      'Hawa Mahal survives intact, though its façade required major restoration in 2005–06 after decades of weathering and traffic pollution turned its pink sandstone grey.',
    whatHappenedHi:
      'हवा महल सुरक्षित है, पर दशकों के मौसम और यातायात प्रदूषण से गुलाबी पत्थर धूसर पड़ने के बाद 2005–06 में इसके अग्रभाग की बड़ी मरम्मत करनी पड़ी।',
    timeline: [
      { year: '1727', event: 'Jai Singh II founds Jaipur.', kind: 'other' },
      { year: '1799', event: 'Sawai Pratap Singh builds Hawa Mahal as an extension of the City Palace zenana.', kind: 'build' },
      { year: '1876', event: 'City painted pink to welcome the Prince of Wales; the colour is retained.', kind: 'other' },
      { year: '2005–06', event: 'Façade restored at a cost of ₹45 million.', kind: 'restore' },
    ],
    facts: [
      'The building has no stairs — ramps connect the floors.',
      'The lattice creates a Venturi effect that cools the interior in summer.',
      'It is 15 m tall at the façade but only 1 room deep on upper floors.',
    ],
    thenLabel: '1800 — freshly built honeycomb façade',
    thenYear: '1800',
    nowLabel: 'Today — restored façade on busy Johari Bazaar',
    footprint: 25,
    keywords: ['pink honeycomb facade', 'tiny windows', 'five storeys', 'Jaipur', 'crown shape'],
    then: [
      { type: 'plinth', w: 40, d: 20, h: 1, steps: 1, color: PINK },
      { type: 'box', w: 38, h: 6, d: 14, p: [0, 1, 0], color: PINK },
      { type: 'archwall', w: 38, h: 5, d: 5, arches: 9, p: [0, 7, 4.5], color: PINK },
      { type: 'archwall', w: 30, h: 5, d: 5, arches: 7, p: [0, 12, 4.5], color: PINK },
      { type: 'archwall', w: 20, h: 5, d: 5, arches: 5, p: [0, 17, 4.5], color: PINK },
      { type: 'archwall', w: 10, h: 4, d: 5, arches: 3, p: [0, 22, 4.5], color: PINK, label: 'Crown-shaped top' },
      { type: 'dome', r: 2.2, p: [0, 26, 4.5], color: PINK },
      { type: 'dome', r: 1.4, p: [-7, 22, 4.5], color: PINK },
      { type: 'dome', r: 1.4, p: [7, 22, 4.5], color: PINK },
      { type: 'dome', r: 1.2, p: [-13, 17, 4.5], color: PINK },
      { type: 'dome', r: 1.2, p: [13, 17, 4.5], color: PINK },
      { type: 'box', w: 20, h: 10, d: 10, p: [0, 7, -3], color: PINK },
    ],
    now: [
      { type: 'plinth', w: 40, d: 20, h: 1, steps: 1, color: '#8b8b8b' },
      { type: 'box', w: 38, h: 6, d: 14, p: [0, 1, 0], color: PINK },
      { type: 'archwall', w: 38, h: 5, d: 5, arches: 9, p: [0, 7, 4.5], color: PINK },
      { type: 'archwall', w: 30, h: 5, d: 5, arches: 7, p: [0, 12, 4.5], color: PINK },
      { type: 'archwall', w: 20, h: 5, d: 5, arches: 5, p: [0, 17, 4.5], color: PINK },
      { type: 'archwall', w: 10, h: 4, d: 5, arches: 3, p: [0, 22, 4.5], color: PINK },
      { type: 'dome', r: 2.2, p: [0, 26, 4.5], color: PINK },
      { type: 'dome', r: 1.4, p: [-7, 22, 4.5], color: PINK },
      { type: 'dome', r: 1.4, p: [7, 22, 4.5], color: PINK },
      { type: 'dome', r: 1.2, p: [-13, 17, 4.5], color: PINK },
      { type: 'dome', r: 1.2, p: [13, 17, 4.5], color: PINK },
      { type: 'box', w: 20, h: 10, d: 10, p: [0, 7, -3], color: PINK },
      ...range(6).map((i): Part => ({ type: 'box', w: 3, h: 1.4, d: 1.6, p: [-15 + i * 6, 1, 12], color: ['#2b6cb0', '#c53030', '#f6e05e', '#2f855a', '#dd6b20', '#805ad5'][i] })),
    ],
  },

  // =========================================================================
  {
    id: 'charminar',
    name: 'Charminar',
    nameHi: 'चारमीनार',
    city: 'Hyderabad',
    state: 'Telangana',
    lat: 17.3616,
    lng: 78.4747,
    built: '1591 CE',
    builder: 'Sultan Muhammad Quli Qutb Shah',
    style: 'Indo-Islamic (Qutb Shahi) — granite & lime mortar with stucco',
    status: 'intact',
    emoji: '🕌',
    accent: '#8f6b4a',
    summary:
      'The square "four minarets" monument marks the heart of Hyderabad, built — tradition says — to commemorate the end of a plague. Each minaret rises 56 m above the bazaars that still crowd its four arches.',
    summaryHi:
      'चार मीनारों वाला यह वर्गाकार स्मारक हैदराबाद का हृदय है, जो — परंपरा के अनुसार — प्लेग के अंत की स्मृति में बना। प्रत्येक मीनार 56 मीटर ऊँची है और इसके चारों मेहराबों के चारों ओर आज भी बाज़ार भरे रहते हैं।',
    whatHappened:
      'Charminar stands intact but has lost much of its original stucco ornament to monsoons, pollution and traffic vibration; a 2019 collapse of a chunk of lime plaster from one minaret led to new conservation work by the ASI.',
    whatHappenedHi:
      'चारमीनार सुरक्षित है, पर मानसून, प्रदूषण और यातायात के कंपन से इसकी मूल पलस्तर-सज्जा का बड़ा हिस्सा नष्ट हो गया; 2019 में एक मीनार से चूने के पलस्तर का टुकड़ा गिरने पर ASI ने नया संरक्षण कार्य शुरू किया।',
    timeline: [
      { year: '1591', event: 'Built as the centrepiece of the new city of Hyderabad.', kind: 'build' },
      { year: '1670s', event: 'Original stucco work decays and is repaired by the Nizams.', kind: 'restore' },
      { year: '1889', event: 'Four clocks added on each face.', kind: 'other' },
      { year: '2019', event: 'Plaster falls from the south-west minaret; ASI restoration begins.', kind: 'restore' },
    ],
    facts: [
      'A mosque occupies the top floor of the monument.',
      'Legend tells of a secret tunnel linking Charminar to Golconda Fort.',
      'The Laad Bazaar beside it is famous for lacquer bangles.',
    ],
    thenLabel: '1600 — freshly stuccoed, new city around it',
    thenYear: '1600',
    nowLabel: 'Today — at the centre of a crowded bazaar',
    footprint: 30,
    keywords: ['four minarets', 'square arched monument', 'Hyderabad', 'bazaar', 'granite with stucco'],
    then: [
      { type: 'plinth', w: 50, d: 50, h: 0.5, steps: 1, color: '#c7a070' },
      { type: 'archwall', w: 20, h: 16, d: 20, arches: 1, p: [0, 0.5, 0], color: LIMESTONE, label: 'Four arches, 11 m wide' },
      { type: 'box', w: 20, h: 6, d: 20, p: [0, 16.5, 0], color: LIMESTONE },
      { type: 'minaret', r: 2.6, h: 32, balconies: 2, taper: 0.75, cupola: true, p: [-10, 0.5, -10], color: LIMESTONE },
      { type: 'minaret', r: 2.6, h: 32, balconies: 2, taper: 0.75, cupola: true, p: [10, 0.5, -10], color: LIMESTONE },
      { type: 'minaret', r: 2.6, h: 32, balconies: 2, taper: 0.75, cupola: true, p: [-10, 0.5, 10], color: LIMESTONE },
      { type: 'minaret', r: 2.6, h: 32, balconies: 2, taper: 0.75, cupola: true, p: [10, 0.5, 10], color: LIMESTONE },
    ],
    now: [
      { type: 'plinth', w: 50, d: 50, h: 0.5, steps: 1, color: '#8b8b8b' },
      { type: 'archwall', w: 20, h: 16, d: 20, arches: 1, p: [0, 0.5, 0], color: '#d8cdb6' },
      { type: 'box', w: 20, h: 6, d: 20, p: [0, 16.5, 0], color: '#d8cdb6' },
      { type: 'minaret', r: 2.6, h: 32, balconies: 2, taper: 0.75, cupola: true, p: [-10, 0.5, -10], color: '#d8cdb6' },
      { type: 'minaret', r: 2.6, h: 32, balconies: 2, taper: 0.75, cupola: true, p: [10, 0.5, -10], color: '#d8cdb6' },
      { type: 'minaret', r: 2.6, h: 32, balconies: 2, taper: 0.75, cupola: true, p: [-10, 0.5, 10], color: '#d8cdb6' },
      { type: 'minaret', r: 2.6, h: 32, balconies: 2, taper: 0.75, cupola: true, p: [10, 0.5, 10], color: '#d8cdb6' },
      ...range(8).map((i): Part => ({ type: 'box', w: 6, h: 5 + (i % 3), d: 6, p: [-21 + (i % 4) * 14, 0.5, i < 4 ? -21 : 21], color: ['#c9b48f', '#b8a07a', '#d4c3a3'][i % 3] })),
    ],
  },

  // =========================================================================
  {
    id: 'brihadeeswara',
    name: 'Brihadeeswara Temple',
    nameHi: 'बृहदेश्वर मंदिर',
    nameTa: 'பெரிய கோவில் (பிரகதீஸ்வரர்)',
    nameBn: 'বৃহদেশ্বর মন্দির',
    city: 'Thanjavur',
    state: 'Tamil Nadu',
    lat: 10.7828,
    lng: 79.1318,
    built: '1003–1010 CE',
    builder: 'Emperor Raja Raja Chola I',
    style: 'Dravidian — Chola (Peruvudaiyar Kovil)',
    status: 'intact',
    unesco: true,
    emoji: '🛕',
    accent: '#b56a2a',
    summary:
      'The first complete granite temple in the world, its 66-metre vimana (tower) is still the tallest in India. Built in just seven years under the iron-willed Raja Raja Chola I, it established a canon of Dravidian architecture that influenced temples across Southeast Asia.',
    summaryHi:
      'दुनिया का पहला पूर्ण ग्रेनाइट मंदिर, जिसका 66 मीटर ऊँचा विमान (शिखर) आज भी भारत में सबसे ऊँचा है। राजा राजा चोल प्रथम ने केवल सात वर्षों में इसे बनवाया था।',
    whatHappened:
      'The temple itself was never destroyed, but several of its bronze processional idols — among the finest Chola bronzes ever cast — were looted in the 18th century by Maratha forces and by colonial-era smugglers. Many are still missing from international collections.',
    whatHappenedHi:
      'मंदिर स्वयं कभी नष्ट नहीं हुआ, परंतु इसकी कई अमूल्य चोल कांस्य प्रतिमाएँ — जो अब तक ढाली गई सर्वश्रेष्ठ मूर्तियों में हैं — 18वीं सदी में मराठा सेनाओं और बाद में तस्करों द्वारा लूट ली गईं। कई अभी भी विदेशी संग्रहों में बंद हैं।',
    timeline: [
      { year: '1003', event: 'Emperor Raja Raja Chola I begins construction; completed by 1010 CE.', kind: 'build' },
      { year: '1010', event: 'Consecration of the Shivalinga (Peruvudaiyar); 66-metre vimana complete.', kind: 'build' },
      { year: '1300s', event: 'Pandya invasions damage the outer prakara; murals in the cloister damaged.', kind: 'destroy' },
      { year: '1987', event: 'Inscribed in the UNESCO World Heritage "Great Living Chola Temples" group.', kind: 'restore' },
    ],
    facts: [
      'The 80-tonne granite capstone (stupi) at the top was raised without ramps — scholars debate the exact method.',
      'The shadow of the vimana never falls outside the temple compound during noon.',
      'Over 81 Bharatanatyam dance poses (karanas) are carved on the outer walls, the earliest known visual dance manual.',
    ],
    thenLabel: 'c. 1010 CE — Temple at consecration under Raja Raja Chola I',
    thenYear: '1010',
    nowLabel: 'Present — Living temple with active worship',
    footprint: 55,
    keywords: ['thanjavur', 'brihadeeswara', 'chola', 'vimana', 'granite', 'dravidian', 'tamil'],
    then: [
      { type: 'plinth', w: 70, d: 52, h: 2, steps: 2, color: GRANITE },
      { type: 'gopuram', w: 18, d: 10, h: 28, tiers: 7, p: [34, 2, 0], color: SANDSTONE, label: 'Rajarajantiruvasal (outer gopuram)' },
      { type: 'gopuram', w: 14, d: 8, h: 20, tiers: 5, p: [22, 2, 0], color: SANDSTONE },
      { type: 'hall', w: 22, d: 18, h: 7, cols: 6, rows: 5, roof: true, p: [4, 2, 0], color: GRANITE, label: 'Mukhamandapa' },
      { type: 'pyramid', w: 22, d: 18, h: 8, tiers: 3, p: [4, 9, 0], color: GRANITE },
      { type: 'box', w: 14, h: 10, d: 14, p: [-14, 2, 0], color: GRANITE },
      { type: 'shikhara', r: 8, h: 54, ribs: 12, p: [-14, 12, 0], color: SANDSTONE, label: 'Vimana — 66 m' },
      { type: 'dome', r: 2.2, finial: true, p: [-14, 66, 0], color: '#d4af37' },
      { type: 'water', w: 18, d: 18, p: [-14, 2.1, -26] },
    ],
    now: [
      { type: 'plinth', w: 70, d: 52, h: 2, steps: 2, color: GRANITE },
      { type: 'gopuram', w: 18, d: 10, h: 28, tiers: 7, p: [34, 2, 0], color: SANDSTONE },
      { type: 'gopuram', w: 14, d: 8, h: 20, tiers: 5, p: [22, 2, 0], color: SANDSTONE },
      { type: 'hall', w: 22, d: 18, h: 7, cols: 6, rows: 5, roof: true, p: [4, 2, 0], color: GRANITE },
      { type: 'pyramid', w: 22, d: 18, h: 8, tiers: 3, p: [4, 9, 0], color: GRANITE },
      { type: 'box', w: 14, h: 10, d: 14, p: [-14, 2, 0], color: GRANITE },
      { type: 'shikhara', r: 8, h: 54, ribs: 12, p: [-14, 12, 0], color: SANDSTONE },
      { type: 'dome', r: 2.2, finial: true, p: [-14, 66, 0], color: '#d4af37' },
      { type: 'water', w: 18, d: 18, p: [-14, 2.1, -26] },
    ],
  },

  // =========================================================================
  {
    id: 'golkonda',
    name: 'Golkonda Fort',
    nameHi: 'गोलकोंडा किला',
    nameTa: 'கோல்கொண்டா கோட்டை',
    nameBn: 'গোলকোণ্ডা দুর্গ',
    city: 'Hyderabad',
    state: 'Telangana',
    lat: 17.3833,
    lng: 78.4011,
    built: '13th century (expanded 1518–1687)',
    builder: 'Kakatiya dynasty; expanded by Qutb Shahi sultans',
    style: 'Deccani sultanate fort with Persian acoustic engineering',
    status: 'partially-destroyed',
    emoji: '🏰',
    accent: '#7a6b4a',
    summary:
      'A hilltop diamond-trading fortress whose acoustic engineering is astonishing — a hand-clap at the entrance gate can be heard 1 km away at the summit. Once the capital of the Qutb Shahi dynasty and source of some of the world\'s most famous diamonds including the Koh-i-Noor.',
    summaryHi:
      'हीरा-व्यापार के लिए मशहूर पहाड़ी दुर्ग जिसकी ध्वनिक तकनीक अद्भुत है — प्रवेश द्वार पर ताली बजाने की आवाज़ 1 किमी दूर शिखर तक सुनाई देती है। कोहिनूर हीरे का मूल स्थान।',
    whatHappened:
      'After a legendary eight-month siege (1687), Aurangzeb\'s Mughal army breached the fort through treachery. The Qutb Shahi palaces and zenanas were looted; many buildings fell into disrepair after the Mughals shifted the capital to Aurangabad. The outer ramparts and Balahisar gateway survive; inner palaces are ruined.',
    whatHappenedHi:
      'आठ महीने की महान घेराबंदी (1687) के बाद औरंगज़ेब की सेना ने विश्वासघात से किला जीता। क़ुतुब शाही महल और ज़नाने लूटे गए; राजधानी औरंगाबाद स्थानांतरित होने के बाद अंदरूनी महल खंडहर हो गए।',
    timeline: [
      { year: 'c. 1143', event: 'Kakatiya earthwork fort on the granite hill; later given to the Bahmanis.', kind: 'build' },
      { year: '1518', event: 'Sultan Quli Qutb Shah breaks from Bahmani; Golkonda becomes capital of the new dynasty.', kind: 'build' },
      { year: '1550–1600', event: 'Fortification expanded to 11 km of granite walls, 87 bastions and 8 gateways.', kind: 'build' },
      { year: '1687', event: 'Mughal emperor Aurangzeb takes the fort after an 8-month siege; Qutb Shahi line ends.', kind: 'destroy' },
      { year: 'Today', event: 'ASI-protected monument; famed sound-and-light show recreates the siege.', kind: 'restore' },
    ],
    facts: [
      'The acoustic clapping system used in the gatehouse (Fateh Darwaza) could transmit alerts across the entire fort.',
      'The Kollur mines south of Hyderabad yielded the Koh-i-Noor, Hope Diamond and Regent Diamond — all from Golkonda territory.',
      'The fort has 87 semi-circular bastions and 4 drawbridges, with a secret escape tunnel.',
    ],
    thenLabel: 'c. 1650 CE — Fort at Qutb Shahi zenith',
    thenYear: '1650',
    nowLabel: 'Present — outer walls intact, inner palaces ruined',
    footprint: 70,
    keywords: ['golkonda', 'hyderabad', 'qutb shahi', 'fort', 'diamond', 'kohinoor', 'deccani'],
    then: [
      { type: 'plinth', w: 90, d: 60, h: 3, steps: 2, color: GRANITE },
      ...bastions(80, 52, 3.5, 14, GRANITE),
      { type: 'wall', w: 90, h: 10, d: 2, p: [0, 3, -30], color: GRANITE },
      { type: 'wall', w: 90, h: 10, d: 2, p: [0, 3, 30], color: GRANITE },
      { type: 'wall', w: 2, h: 10, d: 60, p: [-45, 3, 0], color: GRANITE },
      { type: 'wall', w: 2, h: 10, d: 60, p: [45, 3, 0], color: GRANITE },
      { type: 'gopuram', w: 12, d: 8, h: 16, tiers: 3, p: [45, 3, 0], color: SANDSTONE, label: 'Fateh Darwaza (Victory Gate)' },
      { type: 'box', w: 24, h: 16, d: 18, p: [-10, 3, 0], color: SANDSTONE, label: 'Bala Hisar — citadel palace complex' },
      { type: 'dome', r: 5, p: [-10, 19, 0], color: '#5a8a6a' },
      { type: 'box', w: 14, h: 10, d: 12, p: [18, 3, -14], color: SANDSTONE, label: 'Rani Mahal' },
      { type: 'dome', r: 3.5, p: [18, 13, -14], color: '#5a8a6a' },
      { type: 'box', w: 10, h: 8, d: 10, p: [18, 3, 14], color: SANDSTONE, label: 'Taramati Mosque' },
      { type: 'dome', r: 2.8, p: [18, 11, 14], color: '#5a8a6a' },
    ],
    now: [
      { type: 'plinth', w: 90, d: 60, h: 3, steps: 2, color: GRANITE },
      ...bastions(80, 52, 3.5, 14, GRANITE),
      { type: 'wall', w: 90, h: 10, d: 2, p: [0, 3, -30], color: GRANITE },
      { type: 'wall', w: 90, h: 10, d: 2, p: [0, 3, 30], color: GRANITE },
      { type: 'wall', w: 2, h: 10, d: 60, p: [-45, 3, 0], color: GRANITE },
      { type: 'wall', w: 2, h: 10, d: 60, p: [45, 3, 0], color: GRANITE },
      { type: 'gopuram', w: 12, d: 8, h: 16, tiers: 3, p: [45, 3, 0], color: SANDSTONE },
      { type: 'box', w: 24, h: 8, d: 18, p: [-10, 3, 0], color: GRANITE, label: 'Bala Hisar base (roof lost)' },
      { type: 'rubble', r: 10, count: 22, seed: 7, size: 1.2, p: [-10, 11, 0], color: RUBBLE },
      { type: 'wall', w: 14, h: 5, d: 2, p: [18, 3, -14], color: SANDSTONE },
      { type: 'rubble', r: 5, count: 10, seed: 11, size: 0.9, p: [18, 8, -14], color: RUBBLE },
      { type: 'box', w: 10, h: 7, d: 10, p: [18, 3, 14], color: SANDSTONE },
    ],
  },

  // =========================================================================
  {
    id: 'rani-ki-vav',
    name: 'Rani ki Vav (Queen\'s Stepwell)',
    nameHi: 'रानी की वाव',
    nameTa: 'ராணி கி வாவ்',
    nameBn: 'রাণী কি ভাভ',
    city: 'Patan',
    state: 'Gujarat',
    lat: 23.858,
    lng: 72.1013,
    built: 'c. 1063 CE',
    builder: 'Queen Udaymati in memory of King Bhimdev I (Chaulukya dynasty)',
    style: 'Māru-Gurjara inverted temple stepwell (vav)',
    status: 'partially-destroyed',
    unesco: true,
    emoji: '🪷',
    accent: '#a87850',
    summary:
      'Conceived as an inverted temple — a seven-storey subterranean palace built around a sacred well. Its 500+ sculptures across seven tiers depict Vishnu in all ten avatars. Buried under Saraswati river silt for 700 years, it was excavated in the 1980s.',
    summaryHi:
      'एक उलटे मंदिर की संकल्पना — एक पवित्र कुएँ के इर्द-गिर्द बना सात मंज़िला भूमिगत महल। इसकी 500 से अधिक मूर्तियाँ विष्णु के सभी दस अवतार दर्शाती हैं। 700 वर्षों तक सरस्वती नदी की गाद में दबा रहा, 1980 के दशक में खोदा गया।',
    whatHappened:
      'The Saraswati River flooded and silted over the stepwell around 1300 CE, preserving its sculptures in near-perfect condition. It was forgotten for 700 years until the Archaeological Survey of India began systematic excavations between 1958 and 1985. The topmost gallery remains partially buried.',
    whatHappenedHi:
      'लगभग 1300 ई. में सरस्वती नदी की बाढ़ ने वाव को गाद में दफ़न कर दिया, जिससे इसकी मूर्तियाँ लगभग अक्षुण्ण रह गईं। 700 वर्षों तक अज्ञात रहा; ASI ने 1958-1985 के बीच व्यवस्थित खुदाई की।',
    timeline: [
      { year: 'c. 1063', event: 'Queen Udaymati commissions the stepwell as a memorial to Bhimdev I.', kind: 'build' },
      { year: 'c. 1300', event: 'Saraswati River floods and silts over the entire structure.', kind: 'destroy' },
      { year: '1958–85', event: 'ASI excavates and reveals 500+ sculptures across seven galleries.', kind: 'restore' },
      { year: '2014', event: 'Inscribed as a UNESCO World Heritage Site.', kind: 'restore' },
      { year: '2016', event: 'Featured on the reverse side of the Indian ₹100 banknote.', kind: 'other' },
    ],
    facts: [
      'The stepwell descends 28 metres in seven storeys — one of the deepest in the world.',
      'A secret side-tunnel at the fourth level leads to a chamber believed to have been used by the queen.',
      'Appears on the ₹100 note reverse — making it India\'s most widely "seen" heritage site.',
    ],
    thenLabel: 'c. 1100 CE — Seven-tier stepwell at full glory',
    thenYear: '1100',
    nowLabel: 'Present — excavated; topmost tier still partially buried',
    footprint: 35,
    keywords: ['patan', 'stepwell', 'vav', 'vishnu avatars', 'gujarat', 'chaulukya', 'underground'],
    then: [
      { type: 'plinth', w: 20, d: 65, h: 1.5, steps: 1, color: SANDSTONE },
      { type: 'stairs', w: 18, h: 2, d: 10, steps: 8, p: [0, 1.5, -24], color: SANDSTONE },
      { type: 'hall', w: 18, d: 8, h: 6, cols: 5, rows: 3, roof: true, p: [0, 1.5, -12], color: SANDSTONE, label: 'Gallery 1 (top)' },
      { type: 'stairs', w: 14, h: 2, d: 8, steps: 8, p: [0, -0.5, -4], color: SANDSTONE },
      { type: 'hall', w: 16, d: 8, h: 6, cols: 5, rows: 3, roof: true, p: [0, -2.5, 6], color: SANDSTONE, label: 'Gallery 3' },
      { type: 'stairs', w: 12, h: 2, d: 8, steps: 8, p: [0, -4.5, 16], color: SANDSTONE },
      { type: 'hall', w: 14, d: 8, h: 6, cols: 4, rows: 3, roof: true, p: [0, -6.5, 26], color: SANDSTONE, label: 'Gallery 5 — Vishnu avatars' },
      { type: 'box', w: 6, h: 14, d: 6, p: [0, -13, 34], color: SANDSTONE, label: 'Sacred well shaft' },
      { type: 'water', w: 4, d: 4, p: [0, -20, 34] },
    ],
    now: [
      { type: 'plinth', w: 20, d: 65, h: 1.5, steps: 1, color: SANDSTONE },
      { type: 'rubble', r: 5, count: 8, seed: 3, size: 0.8, p: [0, 1.5, -16], color: SANDSTONE },
      { type: 'hall', w: 16, d: 8, h: 5, cols: 5, rows: 3, roof: true, p: [0, -2.5, 6], color: SANDSTONE },
      { type: 'stairs', w: 12, h: 2, d: 8, steps: 8, p: [0, -4.5, 16], color: SANDSTONE },
      { type: 'hall', w: 14, d: 8, h: 6, cols: 4, rows: 3, roof: true, p: [0, -6.5, 26], color: SANDSTONE },
      { type: 'box', w: 6, h: 14, d: 6, p: [0, -13, 34], color: SANDSTONE },
      { type: 'water', w: 4, d: 4, p: [0, -20, 34] },
    ],
  },

  // =========================================================================
  {
    id: 'ajanta',
    name: 'Ajanta Caves',
    nameHi: 'अजंता की गुफाएँ',
    nameTa: 'அஜந்தா குகைகள்',
    nameBn: 'অজন্তা গুহা',
    city: 'Aurangabad',
    state: 'Maharashtra',
    lat: 20.5519,
    lng: 75.7033,
    built: '2nd century BCE – 5th century CE',
    builder: 'Satavahana, Vakataka & early Gupta-era Buddhist monks and donors',
    style: 'Rock-cut Buddhist viharas and chaityas (Satavahana and Gupta periods)',
    status: 'partially-destroyed',
    unesco: true,
    emoji: '🖼️',
    accent: '#9b6b3e',
    summary:
      'Thirty rock-cut cave monasteries carved into a horseshoe cliff above the Waghora River over 700 years. The cave murals — depicting Jataka tales and the life of the Buddha — are the finest surviving examples of ancient Indian painting. Abandoned and overgrown by 650 CE, rediscovered by a British hunting party in 1819.',
    summaryHi:
      'वाघोरा नदी के ऊपर घोड़े की नाल के आकार की चट्टान में 700 वर्षों में खोदी गई 30 बौद्ध गुफाएँ। जातक कथाओं और बुद्ध जीवन को दर्शाने वाले भित्तिचित्र प्राचीन भारतीय चित्रकला के सर्वश्रेष्ठ नमूने हैं। 650 ई. में परित्यक्त; 1819 में एक ब्रिटिश शिकार दल ने पुनः खोजा।',
    whatHappened:
      'The caves were never destroyed — they were abandoned when the Vakataka kingdom fell and Buddhist patronage shifted south. Jungle grew over the entrances for over 1,000 years. When rediscovered, many murals were exposed to light and began to fade; early copying attempts with lime wash damaged several panels irreparably.',
    whatHappenedHi:
      'गुफाएँ कभी नष्ट नहीं हुईं — वाकाटक राज्य के पतन और बौद्ध संरक्षण के दक्षिण में स्थानांतरित होने पर छोड़ दी गईं। 1,000 वर्षों से अधिक जंगल ने प्रवेश-द्वारों को ढक लिया था। पुनः खोज के बाद रोशनी से कई भित्तिचित्र मुरझाने लगे।',
    timeline: [
      { year: 'c. 200 BCE', event: 'First caves (9, 10, 12, 13, 15A) carved under Satavahana patronage.', kind: 'build' },
      { year: 'c. 460–480', event: 'Flourishing Vakataka era: caves 1–7, 16–17, 19 carved with their famous murals.', kind: 'build' },
      { year: 'c. 650', event: 'Vakataka kingdom collapses; patronage ends; caves gradually abandoned.', kind: 'other' },
      { year: '1819', event: 'Captain John Smith of the Madras Army rediscovers the caves while tiger-hunting.', kind: 'restore' },
      { year: '1983', event: 'UNESCO World Heritage Site inscription.', kind: 'restore' },
    ],
    facts: [
      'Cave 1 murals contain what is considered the world\'s first painted portrait — the "Bodhisattva Padmapani".',
      'The paintings were made using a dry-fresco technique on lime plaster, using lapis lazuli imported from Afghanistan.',
      'Captain Smith carved his name into Cave 10 in 1819 — the graffiti is still visible.',
    ],
    thenLabel: 'c. 480 CE — Caves at their Vakataka pinnacle',
    thenYear: '480',
    nowLabel: 'Present — conserved caves, faded but surviving murals',
    footprint: 60,
    keywords: ['ajanta', 'buddhist caves', 'murals', 'rock-cut', 'vakataka', 'jataka', 'maharashtra'],
    then: [
      { type: 'plinth', w: 120, d: 22, h: 4, steps: 1, color: SANDSTONE },
      ...range(6).map((i): Part => ({ type: 'box', w: 10, h: 12, d: 18, p: [-50 + i * 20, 4, 0], color: '#8b6b47' })),
      ...range(6).map((i): Part => ({ type: 'arch', w: 7, h: 10, d: 1.2, p: [-50 + i * 20, 4, -9], color: '#7a5c3a' })),
      { type: 'stupa', r: 3.5, chhatra: true, p: [-30, 4, -6], color: LIMESTONE, label: 'Chaitya hall stupa (Cave 9)' },
      { type: 'stupa', r: 3.5, chhatra: true, p: [10, 4, -6], color: LIMESTONE, label: 'Chaitya hall stupa (Cave 19)' },
      { type: 'water', w: 14, d: 8, p: [0, 0, 18] },
    ],
    now: [
      { type: 'plinth', w: 120, d: 22, h: 4, steps: 1, color: SANDSTONE },
      ...range(6).map((i): Part => ({ type: 'box', w: 10, h: 11, d: 18, p: [-50 + i * 20, 4, 0], color: '#7a5c3a' })),
      ...range(6).map((i): Part => ({ type: 'arch', w: 7, h: 9, d: 1.2, broken: 0.2, p: [-50 + i * 20, 4, -9], color: '#6a4e35' })),
      { type: 'stupa', r: 3.5, chhatra: true, p: [-30, 4, -6], color: LIMESTONE },
      { type: 'stupa', r: 3.5, chhatra: true, p: [10, 4, -6], color: LIMESTONE },
      { type: 'water', w: 14, d: 8, p: [0, 0, 18] },
    ],
  },

  // =========================================================================
  {
    id: 'hampi-queens-bath',
    name: 'Queen\'s Bath, Hampi',
    nameHi: 'रानी का स्नानघर, हम्पी',
    nameTa: 'ஹம்பி ராணி குளியல்',
    nameBn: "রানীর স্নানকক্ষ হাম্পি",
    city: 'Hampi',
    state: 'Karnataka',
    lat: 15.316,
    lng: 76.471,
    built: 'c. 1500 CE',
    builder: 'Vijayanagara Royal Court (Tuluva dynasty)',
    style: 'Indo-Islamic royal bathing pavilion',
    status: 'ruined',
    emoji: '🛁',
    accent: '#6a8a72',
    summary:
      'A royal bathing enclosure open to the sky, surrounded by a deep moat with lotus-shaped overhanging balconies and scalloped arches. Channels once brought perfumed water through the walls. Though now dry and missing its interior decoration, the outer shell with its 24 corbelled arches stands remarkably complete.',
    summaryHi:
      'खुले आकाश के नीचे बना शाही स्नानकक्ष, जिसके चारों ओर गहरी खाई थी और कमल के आकार के झरोखे और तरंगित मेहराब थे। दीवारों में बने नलों से सुगंधित जल आता था। अब सूखा और आंतरिक सज्जा विहीन, लेकिन 24 मेहराबों वाला बाहरी ढाँचा अभी भी उल्लेखनीय रूप से अक्षुण्ण है।',
    whatHappened:
      'After the 1565 sacking of Hampi, the royal enclosures were systematically stripped of decorative plasterwork, metal fittings, and hydraulic infrastructure. The moat dried up, the perfume channels silted, and the interior lotus fountains were dismantled for scrap metal.',
    whatHappenedHi:
      '1565 में हम्पी की बर्बादी के बाद शाही बाड़ों से सजावटी प्लास्टर, धातु फिटिंग और जलापूर्ति व्यवस्था व्यवस्थित रूप से हटाई गई। खाई सूख गई, सुगंध-नलिकाएँ अवरुद्ध हो गईं और अंदरूनी फव्वारे धातु के लिए तोड़ डाले गए।',
    timeline: [
      { year: 'c. 1500', event: 'Constructed within the Royal Centre as a private pavilion for the royal household.', kind: 'build' },
      { year: '1565', event: 'Vijayanagara sacked; hydraulic and decorative fittings stripped.', kind: 'destroy' },
      { year: '1800s', event: 'Colin Mackenzie surveys and documents the enclosure.', kind: 'restore' },
      { year: '1986', event: 'Listed as part of UNESCO World Heritage Group of Monuments at Hampi.', kind: 'restore' },
    ],
    facts: [
      'The open central pool is 15 × 15 m; twelve lotus-shaped fountains once projected jets from below the water surface.',
      'The interior walls retain traces of lime plasterwork carved with geometric Islamic patterns.',
      'The surrounding moat was not for security but for aesthetics and thermal cooling of the bath water.',
    ],
    thenLabel: 'c. 1530 CE — Pavilion with fountains and moat',
    thenYear: '1530',
    nowLabel: 'Present — shell with arches, moat dry',
    footprint: 22,
    keywords: ['hampi', 'queens bath', 'royal enclosure', 'vijayanagara', 'bathing pavilion', 'arches', 'karnataka'],
    then: [
      { type: 'plinth', w: 40, d: 40, h: 1.2, steps: 1, color: LIMESTONE },
      { type: 'wall', w: 40, h: 8, d: 1.5, p: [0, 1.2, -20], color: LIMESTONE },
      { type: 'wall', w: 40, h: 8, d: 1.5, p: [0, 1.2, 20], color: LIMESTONE },
      { type: 'wall', w: 1.5, h: 8, d: 40, p: [-20, 1.2, 0], color: LIMESTONE },
      { type: 'wall', w: 1.5, h: 8, d: 40, p: [20, 1.2, 0], color: LIMESTONE },
      { type: 'water', w: 16, d: 16, p: [0, 1.3, 0] },
      { type: 'water', w: 44, d: 8, p: [0, 1, -28] },
      { type: 'water', w: 44, d: 8, p: [0, 1, 28] },
      { type: 'water', w: 8, d: 28, p: [-28, 1, 0] },
      { type: 'water', w: 8, d: 28, p: [28, 1, 0] },
      { type: 'dome', r: 3, p: [0, 9.2, 0], color: '#7a9a82' },
    ],
    now: [
      { type: 'plinth', w: 40, d: 40, h: 1.2, steps: 1, color: LIMESTONE },
      { type: 'wall', w: 40, h: 7, d: 1.5, p: [0, 1.2, -20], color: GREY_STONE },
      { type: 'wall', w: 40, h: 7, d: 1.5, p: [0, 1.2, 20], color: GREY_STONE },
      { type: 'wall', w: 1.5, h: 7, d: 40, p: [-20, 1.2, 0], color: GREY_STONE },
      { type: 'wall', w: 1.5, h: 7, d: 40, p: [20, 1.2, 0], color: GREY_STONE },
      { type: 'rubble', r: 4, count: 8, seed: 2, size: 0.7, p: [0, 1.2, 0], color: RUBBLE },
    ],
  },

  // =========================================================================
  {
    id: 'mandu-hindola',
    name: 'Hindola Mahal, Mandu',
    nameHi: 'हिंडोला महल, माण्डू',
    nameTa: 'ஹிண்டோலா மஹால்',
    nameBn: 'হিন্দোলা মহল মান্ডু',
    city: 'Mandu (Mandavgad)',
    state: 'Madhya Pradesh',
    lat: 22.3584,
    lng: 75.3968,
    built: 'c. 1425 CE',
    builder: 'Sultan Hoshang Shah (Ghuri dynasty of Malwa)',
    style: 'Malwa Sultanate — Afghan-influenced sandstone palace',
    status: 'partially-destroyed',
    emoji: '🏯',
    accent: '#7a5c3e',
    summary:
      'The "Swinging Palace" — named for its dramatically inclined outer walls (77°) that give the illusion of swaying. Part of Mandu\'s royal citadel perched on a 600m plateau above the Narmada valley. Its soaring T-shaped audience hall once received ambassadors from Delhi and the Deccan.',
    summaryHi:
      '"झूलता महल" — अपनी नाटकीय ढलवाँ दीवारों (77°) के लिए नामित जो झूलने का भ्रम देती हैं। नर्मदा घाटी के ऊपर 600 मीटर की पठारी राजधानी माण्डू के शाही परिसर का हिस्सा। इसके विशाल T-आकार के दरबार हॉल में दिल्ली और दक्कन के राजदूत आते थे।',
    whatHappened:
      'Mandu fell successively to the Mughals (1561) and the Marathas (1732). The interior plastered decoration was stripped, the wooden roof elements decayed, and several secondary palaces collapsed. Hindola Mahal\'s main walls survive due to their extraordinary structural design — the tilt acts like a buttress.',
    whatHappenedHi:
      'माण्डू मुगलों (1561) और मराठाओं (1732) के हाथों बारी-बारी से हारा। अंदरूनी प्लास्टर सजावट उतर गई, लकड़ी की छतें सड़ गईं और कई महल ढह गए। हिंडोला महल की मुख्य दीवारें अपनी असाधारण संरचनात्मक बनावट के कारण बची हैं।',
    timeline: [
      { year: 'c. 1425', event: 'Built by Hoshang Shah as the royal audience hall (diwan-i-am).', kind: 'build' },
      { year: '1436', event: 'Mahmud Khilji expands the Mandu citadel; Hindola Mahal used for royal gatherings.', kind: 'build' },
      { year: '1561', event: 'Akbar captures Mandu; Malwa Sultanate ends.', kind: 'destroy' },
      { year: '1732', event: 'Marathas take Mandu; city gradually depopulates.', kind: 'destroy' },
      { year: 'Today', event: 'ASI monument; part of UNESCO tentative list.', kind: 'restore' },
    ],
    facts: [
      'The side walls lean at an angle of 77°, giving the palace its "swinging" appearance and adding passive structural strength.',
      'A single enclosed garden complex once connected Hindola Mahal to the Jahaz Mahal (Ship Palace) 200m to the north.',
      'The red sandstone is sourced from the Malwa plateau and gets a golden hue at sunset.',
    ],
    thenLabel: 'c. 1450 CE — Audience hall at Mandu court',
    thenYear: '1450',
    nowLabel: 'Present — walls standing, roof and interiors missing',
    footprint: 30,
    keywords: ['mandu', 'hindola', 'malwa', 'madhya pradesh', 'tilted walls', 'afghan', 'sandstone'],
    then: [
      { type: 'plinth', w: 50, d: 18, h: 1.5, steps: 2, color: RED_SANDSTONE },
      { type: 'box', w: 46, h: 14, d: 14, p: [0, 1.5, 0], color: RED_SANDSTONE, label: 'T-shaped Hindola Mahal hall' },
      { type: 'box', w: 14, h: 14, d: 26, p: [0, 1.5, 0], color: RED_SANDSTONE },
      { type: 'pyramid', w: 46, d: 14, h: 4, tiers: 2, p: [0, 15.5, 0], color: RED_SANDSTONE },
      ...bastions(42, 12, 1.8, 14, RED_SANDSTONE, false),
    ],
    now: [
      { type: 'plinth', w: 50, d: 18, h: 1.5, steps: 2, color: RED_SANDSTONE },
      { type: 'wall', w: 46, h: 13, d: 1.8, p: [0, 1.5, -7.5], color: RED_SANDSTONE },
      { type: 'wall', w: 46, h: 13, d: 1.8, p: [0, 1.5, 7.5], color: RED_SANDSTONE },
      { type: 'wall', w: 1.8, h: 13, d: 16, p: [-24, 1.5, 0], color: RED_SANDSTONE },
      { type: 'wall', w: 1.8, h: 13, d: 16, p: [24, 1.5, 0], color: RED_SANDSTONE },
      { type: 'rubble', r: 5, count: 12, seed: 5, size: 0.9, p: [0, 1.5, 0], color: RUBBLE },
    ],
  },

  // =========================================================================
  {
    id: 'avantipur',
    name: 'Avantiswami Temple, Avantipur',
    nameHi: 'अवंतिस्वामी मंदिर, अवंतिपुर',
    nameTa: 'அவந்திஸ்வாமி கோவில்',
    nameBn: 'অবন্তিস্বামী মন্দির',
    city: 'Avantipur',
    state: 'Jammu & Kashmir',
    lat: 33.924,
    lng: 75.0235,
    built: 'c. 855–883 CE',
    builder: 'King Avantivarman (Utpala dynasty)',
    style: 'Kashmiri Hindu — peristyle courtyard with projecting mandapa',
    status: 'destroyed',
    emoji: '🌿',
    accent: '#6e7d5a',
    summary:
      'Twin temples in the Kashmir Valley built by King Avantivarman: one dedicated to Vishnu (Avantiswami) and one to Shiva (Avantisvara). Kalhana\'s 12th-century Rajatarangini describes them as the glory of the Utpala dynasty. Both now lie in roofless ruin.',
    summaryHi:
      'कश्मीर घाटी में राजा अवंतिवर्मन द्वारा निर्मित दो जुड़वाँ मंदिर: एक विष्णु (अवंतिस्वामी) और एक शिव (अवंतिस्वर) को समर्पित। कल्हण की 12वीं सदी की राजतरंगिणी इन्हें उत्पल वंश की शान बताती है। दोनों अब छत-विहीन खंडहर हैं।',
    whatHappened:
      'Sultan Sikandar Shah Miri\'s iconoclasm (c. 1389–1413) targeted both temples. Roof slabs were toppled and columns thrown down. Subsequent earthquakes (notably 1885) completed the destruction. The ASI excavated and consolidated the ruins in the early 20th century.',
    whatHappenedHi:
      'सुल्तान सिकंदर शाह मीरी की मूर्तिभंजक नीति (लगभग 1389–1413) ने दोनों मंदिरों को निशाना बनाया। छत के पत्थर गिराए गए, स्तंभ तोड़े गए। बाद के भूकंपों (विशेषकर 1885) ने विध्वंस पूरा किया।',
    timeline: [
      { year: 'c. 855', event: 'King Avantivarman begins the Avantiswami (Vishnu) temple; completed c. 883 CE.', kind: 'build' },
      { year: '1148', event: 'Kalhana writes the Rajatarangini, praising both Avantipur temples.', kind: 'other' },
      { year: 'c. 1389', event: 'Sikandar Shah Miri orders demolition; columns toppled, roofs destroyed.', kind: 'destroy' },
      { year: '1885', event: 'Earthquake damages surviving walls further.', kind: 'destroy' },
      { year: '1904', event: 'ASI excavates and consolidates ruins; carvings documented.', kind: 'restore' },
    ],
    facts: [
      'The temple complex is built on a raised platform similar to Martand but on a smaller scale — likely the same workshop tradition.',
      'Avantiswami and the nearby Avantisvara temple represent the earliest known "twin temple" plan in Kashmir.',
      'Many of the carved doorway panels were transported to Srinagar Museum in the 1960s.',
    ],
    thenLabel: 'c. 900 CE — Twin temples at their height',
    thenYear: '900',
    nowLabel: 'Present — roofless colonnade and broken walls',
    footprint: 35,
    keywords: ['avantipur', 'kashmir', 'utpala dynasty', 'vishnu', 'shiva', 'kashmiri architecture'],
    then: [
      { type: 'plinth', w: 52, d: 38, h: 2, steps: 2, color: GREY_STONE },
      { type: 'colonnade', length: 48, h: 5, count: 18, roof: true, p: [0, 2, -17], color: GREY_STONE },
      { type: 'colonnade', length: 48, h: 5, count: 18, roof: true, p: [0, 2, 17], color: GREY_STONE },
      { type: 'colonnade', length: 34, h: 5, count: 14, roof: true, p: [-25, 2, 0], ry: 90, color: GREY_STONE },
      { type: 'colonnade', length: 34, h: 5, count: 14, roof: true, p: [25, 2, 0], ry: 90, color: GREY_STONE },
      { type: 'water', w: 38, d: 22, p: [0, 2.05, 0] },
      { type: 'box', w: 10, h: 8, d: 10, p: [4, 2, 0], color: GREY_STONE },
      { type: 'pyramid', w: 10, d: 10, h: 9, tiers: 2, p: [4, 10, 0], color: GREY_STONE, label: 'Kashmiri pyramidal roof' },
      { type: 'box', w: 6, h: 6, d: 6, p: [-6, 2, 0], color: GREY_STONE },
      { type: 'pyramid', w: 6, d: 6, h: 5, tiers: 1, p: [-6, 8, 0], color: GREY_STONE },
    ],
    now: [
      { type: 'plinth', w: 52, d: 38, h: 2, steps: 2, color: GREY_STONE },
      { type: 'colonnade', length: 48, h: 5, count: 18, roof: false, broken: 0.6, seed: 4, p: [0, 2, -17], color: GREY_STONE },
      { type: 'colonnade', length: 48, h: 5, count: 18, roof: false, broken: 0.65, seed: 7, p: [0, 2, 17], color: GREY_STONE },
      { type: 'colonnade', length: 34, h: 5, count: 14, roof: false, broken: 0.55, seed: 9, p: [-25, 2, 0], ry: 90, color: GREY_STONE },
      { type: 'colonnade', length: 34, h: 5, count: 14, roof: false, broken: 0.7, seed: 12, p: [25, 2, 0], ry: 90, color: GREY_STONE },
      { type: 'box', w: 10, h: 5, d: 10, p: [4, 2, 0], color: GREY_STONE },
      { type: 'rubble', r: 7, count: 18, seed: 3, size: 1.1, p: [4, 7, 0], color: RUBBLE },
    ],
  },
]

const METADATA_PATCH: Record<string, Partial<Monument>> = {
  konark: {
    confidence: 'documented',
    confidenceRationale: 'Sanctum tower (deul) proportions documented from surviving base plinth measurements, 1848 Markham Kittoe sketches, and 16th-century palm-leaf manuscripts (Baya Chakada).',
    sources: [
      { title: 'Baya Chakada (Temple Building Chronicle)', institution: 'Palm-leaf manuscript archives, Puri', year: 'c. 1250-1300' },
      { title: 'History of Indian and Eastern Architecture', institution: 'James Fergusson', year: '1876' },
      { title: 'ASI Archaeological Survey of Konarak', institution: 'Archaeological Survey of India', year: '1903-1984' },
    ],
    fileSizeMb: 3.8,
    nameTa: 'கொனார்க் சூரியன் கோயில்',
    nameBn: 'কোণার্ক সূর্য মন্দির',
  },
  nalanda: {
    confidence: 'documented',
    confidenceRationale: 'Temple No. 3 and monastery vihara multi-storey layout documented by ASI excavations under Spooner (1915) and 7th-century travel records of Xuanzang.',
    sources: [
      { title: 'Great Tang Records on the Western Regions', institution: 'Xuanzang', year: '646 CE' },
      { title: 'Excavations at Nalanda', institution: 'ASI Memoir No. 66', year: '1938' },
    ],
    fileSizeMb: 4.2,
    nameTa: 'நாலந்தா பல்கலைக்கழகம்',
    nameBn: 'নালন্দা মহাবিহার',
  },
  martand: {
    confidence: 'inferred',
    confidenceRationale: 'Peristyle colonnade and trefoil arches survive; pyramidal sanctum roof is inferred from contemporary temples at Avantipur and Pandrethan.',
    sources: [
      { title: 'An Essay on the Arian Order of Architecture in Kashmir', institution: 'Alexander Cunningham', year: '1848' },
      { title: 'Rajatarangini (Chronicle of the Kings of Kashmir)', institution: 'Kalhana', year: '1148 CE' },
    ],
    fileSizeMb: 3.5,
    nameTa: 'மார்த்தாண்ட சூரியன் கோயில்',
    nameBn: 'মার্তণ্ড সূর্য মন্দির',
  },
  'hampi-vittala': {
    confidence: 'documented',
    confidenceRationale: 'Stone chariot and musical pillar mandapa intact; missing gopuram tower inferred from contemporary Dravidian superstructures at Virupaksha and Lepakshi.',
    sources: [
      { title: 'Hampi Ruins Described and Illustrated', institution: 'A.H. Longhurst (ASI)', year: '1917' },
      { title: 'Chronicles of Fernao Nuniz and Domingo Paes', institution: 'Vijayanagara Court Annals', year: '1520-1537' },
    ],
    fileSizeMb: 4.6,
    nameTa: 'விஜய விட்டலர் கோயில், ஹம்பி',
    nameBn: 'বিজয়া বিট্টল মন্দির, হাম্পি',
  },
  somnath: {
    confidence: 'documented',
    confidenceRationale: 'Chaulukya / Solanki style reconstructed from archaeological foundations excavated in 1950 and historical accounts of Kumarapala 12th-century stone temple.',
    sources: [
      { title: 'The Somnath Excavation Report', institution: 'ASI & Saurashtra Archeology', year: '1951' },
      { title: 'Tarikh-i Firishta', institution: 'Muhammad Qasim Firishta', year: 'c. 1606' },
    ],
    fileSizeMb: 3.9,
    nameTa: 'சோமநாதர் கோயில்',
    nameBn: 'সোমনাথ মন্দির',
  },
  modhera: {
    confidence: 'documented',
    confidenceRationale: 'Surviving Surya Kund stepwell and Sabhamandapa halls preserve original ground plan; shikhara reconstruction inferred from Gudhamandapa plinth and Solanki canons.',
    sources: [
      { title: 'The Architectural Antiquities of Northern Gujarat', institution: 'James Burgess & Henry Cousens', year: '1903' },
    ],
    fileSizeMb: 3.4,
    nameTa: 'மொதேரா சூரியன் கோயில்',
    nameBn: 'মোধেরা সূর্য মন্দির',
  },
  dhanushkodi: {
    confidence: 'documented',
    confidenceRationale: '1964 pre-cyclone town, railway terminus, and church elevation verified by Southern Railway archives and Indian survey maps.',
    sources: [
      { title: 'Rameswaram & Dhanushkodi Tidal Wave Survey', institution: 'Survey of India / IMD', year: '1964' },
    ],
    fileSizeMb: 2.9,
    nameTa: 'தனுஷ்கோடி புயல் நகரம்',
    nameBn: 'ধনুশকোডি ধ্বংসাবশেষ',
  },
  bhangarh: {
    confidence: 'inferred',
    confidenceRationale: 'Fort ramparts, royal palace levels, and marketplace ruins survive; upper wooden jharokhas inferred from 17th-century Amber architectural patterns.',
    sources: [
      { title: 'Antiquities of Rajasthan', institution: 'James Tod', year: '1829' },
      { title: 'ASI Archaeological Survey Jaipur Circle', institution: 'ASI', year: '1955' },
    ],
    fileSizeMb: 4.5,
    nameTa: 'பாங்கர் கோட்டை',
    nameBn: 'ভাঙড় দুর্গ',
  },
  'red-fort': {
    confidence: 'documented',
    confidenceRationale: 'Pre-1857 British demolition layout verified by 1857 Felice Beato photographs and Mughal court plan drawings in the British Library.',
    sources: [
      { title: 'Amal-i Salih (Shah Jahan Nama)', institution: 'Muhammad Salih Kambo', year: '1660' },
      { title: 'The Pre-1857 Architecture of the Red Fort', institution: 'ASI & British Library Archives', year: '1857-1911' },
    ],
    fileSizeMb: 5.1,
    nameTa: 'செங்கோட்டை தில்லி',
    nameBn: 'লালকেল্লা দিল্লি',
  },
  'shore-temple': {
    confidence: 'inferred',
    confidenceRationale: 'Surviving granite temples documented by ASI; the underwater "Seven Pagodas" submerged structures inferred from 2004-2005 sonar expeditions and British naval charts.',
    sources: [
      { title: 'Mamallapuram and the Underwater Structural Search', institution: 'ASI Marine Archaeology & NIO', year: '2005' },
      { title: 'Account of the Sculptures and Ruins at Mavalipuram', institution: 'J. Goldingham (Asiatic Researches)', year: '1798' },
    ],
    fileSizeMb: 3.7,
    nameTa: 'மாமல்லபுரம் கடற்கரைக் கோயில்',
    nameBn: 'মমল্লপুরম তট মন্দির',
  },
  'qutub-minar': {
    confidence: 'documented',
    confidenceRationale: 'Surviving five-storey minaret with Nagari & Persian epigraphs recording restorations after 1368 lightning by Firoz Shah Tughlaq.',
    sources: [
      { title: 'The Qutb Minar, Delhi: Architectural Study', institution: 'J.A. Page (ASI Memoir No. 22)', year: '1926' },
    ],
    fileSizeMb: 3.2,
    nameTa: 'குதுப் மினார்',
    nameBn: 'কুতুব মিনার',
  },
  'taj-mahal': {
    confidence: 'documented',
    confidenceRationale: 'Original white Makrana marble complex, charbagh layout, and minarets fully documented by official Mughal court texts and ASI preservation records.',
    sources: [
      { title: 'Padshahnama (Official Court Chronicle)', institution: 'Abdul Hamid Lahori', year: 'c. 1648' },
      { title: 'The Complete Taj Mahal and the Riverfront Gardens', institution: 'Ebba Koch', year: '2006' },
    ],
    fileSizeMb: 4.8,
    nameTa: 'தாஜ் மஹால்',
    nameBn: 'তাজমহল',
  },
  sanchi: {
    confidence: 'documented',
    confidenceRationale: 'Great Stupa drum, harmika, and four carved toranas documented and restored by Sir John Marshall between 1912 and 1919.',
    sources: [
      { title: 'The Monuments of Sanchi (3 Vols)', institution: 'Sir John Marshall & Alfred Foucher', year: '1940' },
    ],
    fileSizeMb: 4.0,
    nameTa: 'சாஞ்சி பெரிய தூபி',
    nameBn: 'সাঁচি স্তূপ',
  },
  'hawa-mahal': {
    confidence: 'documented',
    confidenceRationale: 'Five-storey crowned facade with 953 jharokhas documented in Jaipur Royal Court construction registers under Maharaja Sawai Pratap Singh.',
    sources: [
      { title: 'Jaipur: The Making of an Indian City', institution: 'Vibhuti Sachdev & Giles Tillotson', year: '2002' },
    ],
    fileSizeMb: 3.6,
    nameTa: 'ஹவா மஹால் ஜெய்ப்பூர்',
    nameBn: 'হাওয়া মহল জয়পুর',
  },
  charminar: {
    confidence: 'documented',
    confidenceRationale: 'Surviving 1591 square plan, four 56-metre minarets, and mosque level verified by Qutb Shahi royal records and ASI Hyderabad Circle.',
    sources: [
      { title: 'Landmarks of the Deccan', institution: 'Syed Ali Asgar Bilgrami', year: '1927' },
      { title: 'ASI Monograph on Charminar Restoration', institution: 'ASI Hyderabad', year: '1986' },
    ],
    fileSizeMb: 3.5,
    nameTa: 'சார்மினார் ஹைதராபாத்',
    nameBn: 'চারமিনার হায়দ্রাবাদ',
  },
}

// Apply metadata enrichment
monuments.forEach((m) => {
  const patch = METADATA_PATCH[m.id]
  if (patch) {
    Object.assign(m, patch)
  } else {
    m.confidence = m.status === 'intact' ? 'documented' : 'inferred'
    m.fileSizeMb = 3.5
  }
})

export const monumentById = (id: string | undefined): Monument | undefined =>
  monuments.find((m) => m.id === id)

export const statusLabel: Record<Monument['status'], { en: string; hi: string; tone: string }> = {
  intact: { en: 'Standing', hi: 'सुरक्षित', tone: '#2fa364' },
  ruined: { en: 'Ruined', hi: 'खंडहर', tone: '#e09f3e' },
  'partially-destroyed': { en: 'Partly destroyed', hi: 'आंशिक रूप से नष्ट', tone: '#c85a32' },
  destroyed: { en: 'Destroyed', hi: 'नष्ट', tone: '#c0392b' },
  rebuilt: { en: 'Destroyed & rebuilt', hi: 'नष्ट होकर पुनर्निर्मित', tone: '#3b7ea1' },
  lost: { en: 'Lost to the sea', hi: 'समुद्र में विलीन', tone: '#1ba198' },
}
