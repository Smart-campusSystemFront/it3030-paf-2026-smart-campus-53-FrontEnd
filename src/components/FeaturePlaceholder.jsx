import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHourglassHalf } from '@fortawesome/free-solid-svg-icons'

/**
 * Reserved content region for a feature module until the API is wired.
 */
export default function FeaturePlaceholder({ title, description, children, extra }) {
  return (
    <div style={{
      background: '#fff',
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)',
      overflow: 'hidden',
    }}>
      {/* Card header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 20px', borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(180deg,#fafbfd,#fff)',
      }}>
        <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--c-navy)', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          {title}
        </h3>
        {extra || null}
      </div>

      {/* Body */}
      <div style={{ padding: 24, minHeight: 280 }}>
        {description ? (
          <p style={{ margin: '0 0 24px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: 540 }}>
            {description}
          </p>
        ) : null}

        {children ?? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: 200, gap: 14, textAlign: 'center',
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: 'linear-gradient(135deg,var(--c-blue-light),#e0edff)',
              border: '1px solid #bae6fd',
              display: 'grid', placeItems: 'center',
            }}>
              <FontAwesomeIcon icon={faHourglassHalf} style={{ color: 'var(--c-blue)', fontSize: 26 }} />
            </div>
            <div>
              <p style={{ margin: '0 0 4px', fontWeight: 700, color: 'var(--c-navy)', fontSize: 15, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                Coming Soon
              </p>
              <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)', maxWidth: 320 }}>
                Content will appear here once the backend endpoint is connected.
              </p>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 16px', borderRadius: 8,
              background: 'var(--c-blue-light)', border: '1px solid #bae6fd',
              fontSize: 12, fontWeight: 600, color: 'var(--c-blue)',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--c-blue)', display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }} />
              Backend endpoint pending
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
