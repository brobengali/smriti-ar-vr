import type { TimelineEvent } from '../data/types'

export function Timeline({ events }: { events: TimelineEvent[] }) {
  const getEventIcon = (kind?: string) => {
    switch (kind) {
      case 'build':
        return '🛕'
      case 'destroy':
        return '⚔️'
      case 'restore':
        return '🛠️'
      default:
        return '📜'
    }
  }

  return (
    <ol className="timeline">
      {events.map((e, i) => (
        <li key={i} className={`timeline-item ${e.kind ?? 'other'}`}>
          <div className="timeline-node">
            <span className="timeline-icon" aria-hidden>{getEventIcon(e.kind)}</span>
          </div>
          <div className="timeline-content">
            <div className="timeline-header">
              <span className="timeline-year">{e.year}</span>
              <span className={`timeline-tag tag-${e.kind ?? 'other'}`}>
                {e.kind === 'build' ? 'Creation' : e.kind === 'destroy' ? 'Cataclysm' : e.kind === 'restore' ? 'Revival' : 'Milestone'}
              </span>
            </div>
            <div className="timeline-text">{e.event}</div>
          </div>
        </li>
      ))}
    </ol>
  )
}
