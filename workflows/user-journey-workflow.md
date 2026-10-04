# Bharat Virasat XR — High-Level User Journey Workflow

This document illustrates the end-to-end user navigation journey across the application's core feature areas: preferences/onboarding, in-situ AR scanning, monument research dossiers, and remote virtual immersion.

## Workflow Diagram

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

## Key Touchpoints

1. **Dashboard Entry**:
   - Geolocation auto-detects nearest monuments (`formatKm`).
   - Catalog filtering by historical status (`All`, `Ruined`, `Submerged`, `Destroyed`).
   - Multi-script support: English, Hindi (हिन्दी), Tamil (தமிழ்), and Bengali (বাংলা).

2. **In-Situ Camera Flow**:
   - 48px+ thumb-friendly shutter button.
   - Dual-mode: Camera live stream or zero-webcam preset carousel fallback.
   - Signature Time Slider: dynamic crossfade between ruin geometry and 3D reconstructed superstructure.

3. **Curatorial Dossier Flow**:
   - 3D interactive viewer with orbit/zoom controls.
   - Audio narration player with playback speed selector and live read-along closed captions.
   - Verified bibliography of ASI survey reports and colonial architectural drawings.
   - Interactive museum archivist console (`GuideChat`).

4. **Walkable VR Immersion**:
   - WebXR immersive session on headsets (Meta Quest, Apple Vision Pro).
   - Touch joystick and keyboard WASD orbit controls for desktop/mobile browsers.
