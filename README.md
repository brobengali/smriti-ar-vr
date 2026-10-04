# Bharat Virasat XR — भारत विरासत

**Point. Discover. Travel back in time.**

An AR / VR web app for the monuments of India — the ones still standing *and* the ones history took away.
Point your phone at a monument, let Gemini identify it, learn its story, and slide between **Then** (a 3D
reconstruction of how it looked before it was destroyed) and **Now** (its present state) — on a table in AR,
at walkable scale in VR, or in a plain 3D viewer on any device.

Built for HackOctober 2026.

---

## Features

| Feature | How it works |
| --- | --- |
| 📷 **Point & identify** | Camera frame (or uploaded photo) → `POST /api/identify` → Gemini vision picks the monument from the catalog, with GPS as a hint. Falls back to a "near you" list from geolocation. |
| 🕰️ **Then / Now time slider** | Every monument ships two declarative procedural 3D reconstructions (`then` / `now`) that crossfade as you drag the slider. |
| 💔 **Destruction stories** | Timeline (build / destroy / restore events), "what happened", lost features, facts — bilingual EN / हिंदी. |
| 🧭 **Ask the guide** | Grounded Gemini chat about the selected monument (`POST /api/ask`). |
| ✨ **AI vision of the past** | Optional Gemini image generation of the intact monument (`POST /api/reimagine`; needs an API key with image-model quota). |
| 📱 **AR mode** | WebXR `immersive-ar` with hit-testing: reticle on the real floor, tap to place, tabletop ↔ life-size scale, DOM overlay UI. |
| 🥽 **VR mode** | WebXR `immersive-vr`: the monument stands in front of you at adjustable scale. |
| 🖥️ **3D fallback** | Orbit viewer when WebXR is unavailable (desktop, iOS Safari). |

### Catalog (15 monuments)

Konark Sun Temple · Nalanda Mahavihara · Martand Sun Temple · Vijaya Vittala Temple (Hampi) · Somnath ·
Modhera Sun Temple · Dhanushkodi ghost town · Bhangarh Fort · Red Fort · Shore Temple & the Seven Pagodas ·
Qutub Minar · Taj Mahal · Great Stupa at Sanchi · Hawa Mahal · Charminar.

Each entry in `src/data/monuments.ts` has coordinates, bilingual text, a timeline and two part-lists
(`then`, `now`) rendered by the procedural kit in `src/three/parts.tsx` (shikhara, gopuram, stupa, minaret,
pillared hall, arch wall, rubble, …). Adding a monument = adding one object to that array.

---

## Quick start

```bash
npm install
cp .env.example .env        # then paste your Gemini key into .env
npm run dev                 # web on http://localhost:5173, API proxy on :8787
```

`.env`:

```
GEMINI_API_KEY=your_key_here
GEMINI_TEXT_MODEL=gemini-3.8-flash
GEMINI_IMAGE_MODEL=gemini-3.1-flash-image
PORT=8787
```

The key is only ever read by `server/index.mjs`; the browser talks to `/api/*`. `.env` is git-ignored.
If a model is overloaded or unavailable for your key the proxy automatically falls back to other Gemini
Flash models (see `server/gemini.mjs`).

### Try it on a phone (AR needs HTTPS)

WebXR and the camera require a secure context. On the same Wi-Fi:

```bash
npm run dev                            # note the "Network:" URL
npx localtunnel --port 5173            # or: ngrok http 5173
```

Open the https URL in **Chrome on Android (ARCore)** → any monument → **View in AR** → move the phone
until the gold reticle appears → tap to place → drag the time slider.
VR works in the Quest / Pico browser via **Enter VR**. iOS Safari has no WebXR, so it gets the 3D viewer.

### Test AR / VR on a desktop (no headset or phone)

Append `?emulate=1` to any XR URL, e.g. `http://localhost:5173/xr/konark?mode=ar&emulate=1`.
This installs the [IWER](https://github.com/meta-quest/immersive-web-emulation-runtime) WebXR emulator
with a synthetic room, so **View in AR** / **Enter VR** work in a normal browser. The emulated device is
exposed as `window.__xrdevice` in the dev console — e.g. tilt the head down and "tap" to place:

```js
const d = window.__xrdevice; const a = -0.45
d.quaternion.set(Math.sin(a / 2), 0, 0, Math.cos(a / 2))      // look at the floor
d.controllers.right.updateButtonValue('trigger', 1); d.controllers.right.updateButtonValue('trigger', 0)
```

### Production

```bash
npm run build     # typecheck + vite build → dist/
npm start         # express serves dist/ and /api on $PORT
```

---

## Project layout

```
server/            Express proxy for Gemini (identify / ask / reimagine, rate-limited)
src/data/          Monument catalog + types (declarative 3D part specs)
src/three/         Procedural geometry kit, MonumentModel (Then/Now crossfade), 3D viewer
src/pages/         Home (gallery, nearby), Scan (camera → identify), Monument (history, chat), XR (AR/VR)
src/components/    Header, cards, time slider, timeline, guide chat, reimagine
src/lib/           i18n (EN/HI), geo (haversine, nearby), API client
```

## Notes & limits

- The 3D models are **simplified procedural reconstructions** for education, not survey-accurate scans.
  They are honest about what is known (e.g. Konark's 70 m deul, Martand's 84-pillar peristyle) but not photoreal.
- Historical text is written from standard references (ASI, UNESCO, mainstream histories); legends are labelled as such.
- Image generation ("AI vision of the past") depends on image-model quota for your Gemini key; the app
  degrades gracefully when it is unavailable.
- Do not commit `.env`. If a key is ever exposed, rotate it in Google AI Studio.
