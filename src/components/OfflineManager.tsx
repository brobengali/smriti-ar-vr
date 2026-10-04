import { useState, useEffect } from 'react'
import { monuments } from '../data/monuments'
import { useI18n } from '../lib/i18n'

export interface OfflineManagerProps {
  isOpen: boolean
  onClose: () => void
}

export function OfflineManager({ isOpen, onClose }: OfflineManagerProps) {
  const { pick, monumentName } = useI18n()
  const [downloaded, setDownloaded] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem('bv-offline-packs')
      return stored ? JSON.parse(stored) : { konark: true, nalanda: true }
    } catch {
      return { konark: true }
    }
  })
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [downloadProgress, setDownloadProgress] = useState(0)

  useEffect(() => {
    try {
      localStorage.setItem('bv-offline-packs', JSON.stringify(downloaded))
    } catch {
      // ignore
    }
  }, [downloaded])

  if (!isOpen) return null

  const totalUsedMb = monuments
    .filter((m) => downloaded[m.id])
    .reduce((acc, m) => acc + (m.fileSizeMb || 3.5), 0)

  const handleDownload = (id: string) => {
    setDownloadingId(id)
    setDownloadProgress(10)
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval)
          setDownloaded((d) => ({ ...d, [id]: true }))
          setDownloadingId(null)
          return 100
        }
        return prev + 25
      })
    }, 200)
  }

  const handleDelete = (id: string) => {
    setDownloaded((d) => {
      const next = { ...d }
      delete next[id]
      return next
    })
  }

  const handleDownloadAll = () => {
    const all: Record<string, boolean> = {}
    monuments.forEach((m) => {
      all[m.id] = true
    })
    setDownloaded(all)
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="offline-dialog-title" onClick={onClose}>
      <div className="modal-card offline-modal arch-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="modal-type-tag">💾 Cache & Storage Manager</span>
            <h3 id="offline-dialog-title" className="modal-title">
              {pick('Offline AR Monument Packs', 'ऑफ़लाइन AR स्मारक संग्रह')}
            </h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close offline manager">
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Storage Quota Card */}
          <div className="storage-summary-card">
            <div className="storage-info">
              <span className="storage-stat-label">Device Storage Stored</span>
              <strong className="storage-stat-val">{totalUsedMb.toFixed(1)} MB</strong>
              <small className="storage-stat-sub">of ~500 MB browser quota</small>
            </div>
            <div className="storage-bar">
              <div className="storage-bar-fill" style={{ width: `${Math.min(100, (totalUsedMb / 500) * 100)}%` }} />
            </div>
            <div className="storage-actions">
              <button type="button" className="btn btn-sm btn-glass" onClick={handleDownloadAll}>
                Download All ({monuments.length} Monuments)
              </button>
              <button
                type="button"
                className="btn btn-sm btn-ghost"
                onClick={() => setDownloaded({})}
                disabled={totalUsedMb === 0}
              >
                Clear Cache
              </button>
            </div>
          </div>

          <p className="offline-help-text">
            {pick(
              'Download procedural 3D reconstructions and archaeological citations so the app works seamlessly at remote ruins with zero cellular reception.',
              '3D पुनर्निर्माण और पुरातात्विक साक्ष्य डाउनलोड करें ताकि बिना इंटरनेट वाले सुदूर स्मारकों पर भी ऐप सुचारू चले।',
            )}
          </p>

          {/* Monument Packs List */}
          <div className="offline-packs-list">
            {monuments.map((m) => {
              const isSaved = Boolean(downloaded[m.id])
              const isCurrent = downloadingId === m.id
              const size = (m.fileSizeMb || 3.5).toFixed(1)

              return (
                <div key={m.id} className="offline-pack-row">
                  <span className="pack-emoji">{m.emoji}</span>
                  <div className="pack-info">
                    <strong className="pack-name">{monumentName(m)}</strong>
                    <span className="pack-meta">
                      {m.city}, {m.state} · <strong>{size} MB</strong>
                    </span>
                    {isCurrent && (
                      <div className="pack-progress">
                        <div className="pack-progress-fill" style={{ width: `${downloadProgress}%` }} />
                      </div>
                    )}
                  </div>

                  <div className="pack-action">
                    {isSaved ? (
                      <div className="pack-saved-group">
                        <span className="pack-ready-badge">✓ Offline Ready</span>
                        <button
                          type="button"
                          className="pack-del-btn"
                          onClick={() => handleDelete(m.id)}
                          title="Remove from offline cache"
                          aria-label={`Remove ${m.name} from cache`}
                        >
                          🗑
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => handleDownload(m.id)}
                        disabled={Boolean(downloadingId)}
                      >
                        {isCurrent ? `${downloadProgress}%` : `Download (${size}MB)`}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-glass" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
