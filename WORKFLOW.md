# Bharat Virasat XR — Architecture & User Workflow Diagrams

This document outlines the end-to-end user workflows, runtime data pipelines, and system architecture for **Bharat Virasat XR** — an open-source archaeological AR/VR progressive web application reconstructing India's ruined and destroyed monuments.

### Standalone Workflow Files
Each diagram and specification is also maintained in its own dedicated file:
1. 🧭 [**High-Level User Journey Workflow**](file:///c:/Users/rahul/OneDrive/Desktop/hackoctober%202026/workflows/user-journey-workflow.md)
2. 🏛️ [**System Architecture & Component Hierarchy**](file:///c:/Users/rahul/OneDrive/Desktop/hackoctober%202026/workflows/system-architecture.md)
3. 🏷️ [**Architectural Confidence Rating Logic**](file:///c:/Users/rahul/OneDrive/Desktop/hackoctober%202026/workflows/confidence-rating-logic.md)
4. 📷 [**AR Scanning & Reconstruction Pipeline**](file:///c:/Users/rahul/OneDrive/Desktop/hackoctober%202026/workflows/ar-scanning-pipeline.md)
5. 💾 [**Offline Packs & Storage Management State Flow**](file:///c:/Users/rahul/OneDrive/Desktop/hackoctober%202026/workflows/offline-storage-flow.md)

---

## 1. High-Level User Journey Workflow

```mermaid
flowchart TD
    Start([User Opens App]) --> Home[Home Dashboard / Catalog]
    
    %% Preferences & Settings
    Home --> Lang[Language Selection<br/>EN / HI / TA / BN]
    Home --> Theme[Theme Selection<br/>Dark AR Default / Sandstone Light]
    Home --> Offline[Offline Packs Manager<br/>Download 3D Models & Dossiers]

    %% Main Branches
    Home -->|Point & Discover| CameraFlow[AR Camera Viewport<br/>/scan]
    Home -->|Select Monument Card| DossierFlow[Monument Dossier<br/>/monument/:id]
    Home -->|Remote Explorer| VRFlow[Walkable VR Mode<br/>/xr/:id?mode=vr]

    %% AR Scanning Flow
    subgraph AR_Workflow ["AR Camera & Reconstruction Flow"]
        CameraFlow --> CamCheck{Camera Allowed?}
        CamCheck -->|Yes| Stream[Live Environment Stream]
        CamCheck -->|No / Desktop| Presets[Sample Presets Carousel]
        
        Stream --> Capture[Point Phone & Capture Shutter]
        Presets --> SelectPreset[Select Target Monument]
        
        Capture --> APIIdentify[Gemini 2.5 Flash Vision API<br/>Identify Monument]
        APIIdentify --> MatchSuccess{Match Found?}
        MatchSuccess -->|Yes| Superimpose[Load 3D Reconstruction]
        MatchSuccess -->|No| Retry[Suggest Nearby Monuments]
        SelectPreset --> Superimpose

        Superimpose --> TimeSlider["Signature Time Slider<br/>Today (Ruin) ◄──► Reconstructed"]
        Superimpose --> ConfChip["Confidence Rating Chip<br/>Documented / Inferred / Speculative"]
        Superimpose --> BottomSheet[Expandable Bottom Sheet]
        
        BottomSheet --> AudioPlayer["Audio Narration Player<br/>SpeechSynthesis + Live Captions"]
        BottomSheet --> HistSummary[Historical Context & Destruction Event]
        BottomSheet --> DeepLink[Open Full Dossier / WebXR AR]
    end

    %% Monument Dossier Flow
    subgraph Dossier_Workflow ["Monument Dossier & Research Flow"]
        DossierFlow --> View3D[Interactive 3D Ruin/Reconstruction Viewer]
        DossierFlow --> Specs[Architectural Specifications & Lat/Lng]
        DossierFlow --> Timeline[Chronological Archaeological Timeline]
        DossierFlow --> SourcesList[ASI & Archival Bibliography]
        DossierFlow --> ArchivistChat["AI Museum Historian Chat<br/>Royal Archivist via Gemini API"]
    end

    %% VR Flow
    subgraph VR_Workflow ["Remote Virtual Immersion Flow"]
        VRFlow --> LoadScene[Initialize 3D Sacred Space & Ground]
        LoadScene --> Navigation[WASD / Touch Joystick / Orbit Controls]
        Navigation --> WebXRSession{WebXR Available?}
        WebXRSession -->|Yes| HeadsetImmersion[Immersive VR Session<br/>Meta Quest / Apple Vision Pro]
        WebXRSession -->|No| EmulatorOrDesktop[Desktop 3D Walkaround / Emulator]
    end
```

---

## 2. AR Scanning & Reconstruction Pipeline (Sequence Diagram)

```mermaid
sequenceDiagram
    autonumber
    actor User as Field Visitor
    participant UI as AR Viewport (ScanPage)
    participant Media as Device Camera (MediaDevices API)
    participant Proxy as Local API Proxy (Port 8787)
    participant Gemini as Google Gemini 2.5 Flash
    participant DB as Monument Archival Database
    participant Three as Three.js / R3F Engine

    User->>UI: Taps "Point & Discover"
    UI->>Media: Request getUserMedia({ video: environment })
    Media-->>UI: Live Video Stream Attached
    User->>UI: Points camera at ruin and presses Shutter
    UI->>UI: Capture canvas frame (max 1024px JPEG)
    
    rect rgb(20, 26, 42)
        Note over UI,Gemini: AI Identification Step
        UI->>Proxy: POST /api/identify (base64 image + GPS lat/lng)
        Proxy->>Gemini: Multimodal Vision Prompt + Candidate IDs
        Gemini-->>Proxy: { monumentId, confidence, rationale }
        Proxy-->>UI: IdentifyResult JSON
    end

    UI->>DB: Fetch Monument Metadata & Confidence Ratings
    DB-->>UI: Complete Record (Confidence, Rationale, Sources, Timeline)
    
    UI->>Three: Mount 3D Scene overlaid on camera stream
    Three->>Three: Render Procedural Ruin Base
    Three->>Three: Render Reconstructed Superstructure (Initial Alpha: 0.0)

    rect rgb(35, 24, 18)
        Note over User,Three: Signature Time-Travel Interaction
        User->>UI: Drags Time Slider (0% Today -> 100% Past)
        UI->>Three: Interpolate opacity (lerp ruin -> intact golden era)
        Three-->>User: Smooth visual crossfade of destroyed architectural elements
    end

    User->>UI: Taps Confidence Chip (e.g. "Documented")
    UI-->>User: Opens Popover showing ASI excavation citations & rationale
    User->>UI: Slides up Bottom Sheet
    UI->>User: Audio narration plays with synchronized closed captions
```

---

## 3. System Architecture & Component Hierarchy

```mermaid
graph LR
    subgraph Client_App ["Client Progressive Web App (React 19 + TypeScript + Vite)"]
        direction TB
        Main[main.tsx] --> Providers[Global Providers]
        
        subgraph Providers ["Context & State Layer"]
            ThemeP[ThemeProvider<br/>dark / light]
            I18nP[I18nProvider<br/>EN, HI, TA, BN]
            GeoP[useGeolocation<br/>GPS Distance Sorting]
        end

        subgraph Core_Components ["Reusable Component Library"]
            ConfChipComp[ConfidenceChip<br/>Accessible Modal]
            TimeSliderComp[TimeSlider<br/>Crossfade Control]
            AudioPlayerComp[AudioNarrationPlayer<br/>SpeechSynthesis + CC]
            OfflineComp[OfflineManager<br/>Storage Quota & Caching]
            CardComp[MonumentCard<br/>Arch Mask Geometry]
            ChatComp[GuideChat<br/>Archivist Console]
        end

        subgraph 3D_Engine ["3D Rendering Layer"]
            Viewer3DComp[Viewer3D<br/>Orbit + Time Blend]
            XRViewComp[XRPage<br/>WebXR AR/VR Store]
            ThreeParts[Procedural Shikhara / Pillars / Stupas]
        end

        subgraph Styling_System ["Museum Design System (styles.css)"]
            CSSVars[Sandstone / Terracotta / Indigo / Gold Tokens]
            JaliPattern[Subtle Jali Lattice SVG]
            ArchCards[Arch Mask Geometry]
            TouchTargets[>=48px Thumb Targets]
        end
    end

    subgraph Backend_Services ["Local / Cloud Services"]
        NodeProxy[Node Express / Proxy Server<br/>port 8787]
        GeminiAPI[Google Gemini API<br/>gemini-2.5-flash]
        BrowserSpeech[Browser Native SpeechSynthesis]
        LocalStorage[Client Storage & Cache Quota]
    end

    Client_App <-->|REST API / JSON| NodeProxy
    NodeProxy <-->|SDK / API Key| GeminiAPI
    AudioPlayerComp --> BrowserSpeech
    OfflineComp <--> LocalStorage
```

---

## 4. Offline Packs & Storage Management State Flow

```mermaid
stateDiagram-v2
    [*] --> CheckCache: User opens Offline Manager
    
    state CheckCache {
        [*] --> ReadStorage
        ReadStorage --> CalculateQuota: Measure cached MBs vs 500 MB limit
        CalculateQuota --> RenderList: Display per-monument status
    }

    RenderList --> DownloadPack: User clicks "Download Pack"
    
    state DownloadPack {
        [*] --> FetchGeometry: Download 3D Procedural Specs
        FetchGeometry --> FetchDossier: Cache Historical Dossier & Citations
        FetchDossier --> UpdateStorageBar: Increment Used Storage
        UpdateStorageBar --> MarkReady: Display "Saved Offline" Green Pill
    }

    MarkReady --> RenderList
    
    RenderList --> DeletePack: User clicks "Remove Pack"
    state DeletePack {
        [*] --> PurgeKeys: Remove items from storage
        PurgeKeys --> Recalculate: Free space in 500 MB quota
    }
    
    DeletePack --> RenderList
```

---

## 5. Architectural Confidence Rating Logic

```mermaid
flowchart TD
    Assess[Reconstruction Element Assessment] --> CheckPhysical{Surviving Foundations / Inscriptions?}
    
    CheckPhysical -->|Yes: Ground plans, ASI drawings, early photos| Doc[🟢 DOCUMENTED]
    CheckPhysical -->|No| CheckDynasty{Contemporary temples of same dynasty exist?}
    
    CheckDynasty -->|Yes: Stylistic analogy, e.g. Kalinga / Chola canons| Inf[🟡 INFERRED]
    CheckDynasty -->|No: Exclusively literary or oral poetry| Spec[⚪ SPECULATIVE]
    
    Doc --> UIChip[Render Green Chip + Epigraph Citations Popover]
    Inf --> UIChip[Render Amber Chip + Architectural Analogy Popover]
    Spec --> UIChip[Render Grey Chip + Textual Sources Popover]
```

---

*Bharat Virasat XR is maintained as an open-source archaeological education initiative under the Hack October 2026 project.*
