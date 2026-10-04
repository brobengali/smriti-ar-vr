# Bharat Virasat XR — Offline Packs & Storage Management State Flow

This document details the client-side cache and offline storage state machine, allowing users to download 3D geometry packs, historical dossiers, and audio text transcripts for field use in remote archaeological sites lacking cellular reception.

## State Diagram

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

## Storage Specifications

- **Quota Cap**: 500 MB max client-side quota to preserve device flash storage on budget mobile phones.
- **Pack Sizes**: Range from 12 MB to 28 MB per monument (includes 3D geometry definitions, historical summaries, multi-script names, and cited source bibliography).
- **Progress Tracking**: Real-time progress bar with per-monument download percentage.
- **Purge Management**: One-click "Clear All Offline Cache" and individual delete buttons (`pack-del-btn`) to free space.
