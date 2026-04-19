import { useState, useEffect, useRef } from 'react'
import { Badge, Tooltip } from 'antd'
import { BellOutlined, CheckOutlined } from '@ant-design/icons'
import { useNotifications } from '../context/NotificationContext.jsx'

const TYPE_ICON = { INFO: 'ℹ️', WARNING: '⚠️', ALERT: '🔴' }

export default function NotificationBell() {
  const { notifications, unreadCount, refresh, markOneRead } = useNotifications()
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)

  // Close panel on outside click
  useEffect(() => {
    function handle(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const handleBellClick = () => {
    const nextOpen = !open
    setOpen(nextOpen)
    if (nextOpen) refresh() // Always refresh when opening
  }

  return (
    <div ref={panelRef} style={{ position: 'relative' }}>
      {/* Bell button */}
      <Tooltip title="Notifications">
        <button
          id="notification-bell-btn"
          onClick={handleBellClick}
          style={{
            background: open ? 'rgba(0,145,255,.10)' : 'transparent',
            border: 'none',
            borderRadius: 8,
            padding: '6px 8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.18s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,145,255,.08)'}
          onMouseLeave={e => e.currentTarget.style.background = open ? 'rgba(0,145,255,.10)' : 'transparent'}
        >
          <Badge
            count={unreadCount}
            size="small"
            style={{ boxShadow: 'none' }}
            offset={[-2, 2]}
          >
            <BellOutlined style={{
              fontSize: 18,
              color: unreadCount > 0 ? 'var(--c-blue)' : 'var(--c-navy)',
              transition: 'color 0.2s',
            }} />
          </Badge>
        </button>
      </Tooltip>

      {/* Notification panel */}
      {open && (
        <div
          className="animate-fade-in"
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            right: 0,
            width: 360,
            maxHeight: 480,
            background: '#fff',
            borderRadius: 12,
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
            zIndex: 200,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#fafbfd',
          }}>
            <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--c-navy)' }}>
              <BellOutlined style={{ marginRight: 6, color: 'var(--c-blue)' }} />
              Notifications
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {unreadCount > 0 && (
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  background: 'var(--c-blue)', color: '#fff',
                  borderRadius: 20, padding: '1px 8px',
                }}>
                  {unreadCount} unread
                </span>
              )}
              <button
                onClick={refresh}
                title="Refresh"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 13, color: 'var(--text-muted)', padding: '2px 4px',
                  borderRadius: 4,
                }}
              >
                ↻
              </button>
            </div>
          </div>

          {/* List */}
          <div style={{ overflowY: 'auto', flex: 1 }}>
            {notifications.length === 0 ? (
              <div style={{
                padding: 32, textAlign: 'center',
                color: 'var(--text-muted)', fontSize: 13,
              }}>
                🔔 No notifications yet
              </div>
            ) : (
              notifications.slice(0, 30).map((n, idx) => (
                <div
                  key={n.id ?? idx}
                  onClick={() => n.id && !n.read && markOneRead(n.id)}
                  style={{
                    padding: '11px 16px',
                    borderBottom: '1px solid #f1f5f9',
                    background: n.read ? '#fff' : 'rgba(0,145,255,.04)',
                    cursor: n.read ? 'default' : 'pointer',
                    display: 'flex',
                    gap: 10,
                    alignItems: 'flex-start',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => { if (!n.read) e.currentTarget.style.background = 'rgba(0,145,255,.08)' }}
                  onMouseLeave={e => { if (!n.read) e.currentTarget.style.background = 'rgba(0,145,255,.04)' }}
                >
                  <span style={{ fontSize: 16, marginTop: 1, flexShrink: 0 }}>
                    {TYPE_ICON[n.type] || 'ℹ️'}
                  </span>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 13, color: 'var(--text-primary)',
                      fontWeight: n.read ? 400 : 600,
                      lineHeight: 1.4,
                      wordBreak: 'break-word',
                    }}>
                      {n.message}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
                      {n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}
                    </div>
                  </div>

                  {n.read
                    ? <CheckOutlined style={{ fontSize: 11, color: '#10b981', flexShrink: 0, marginTop: 3 }} />
                    : <span style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: 'var(--c-blue)', flexShrink: 0, marginTop: 5,
                      }} />
                  }
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div style={{
              padding: '8px 16px',
              borderTop: '1px solid var(--border)',
              background: '#fafbfd',
              fontSize: 12, color: 'var(--text-muted)', textAlign: 'center',
            }}>
              {notifications.length} total · click unread item to mark as read
            </div>
          )}
        </div>
      )}
    </div>
  )
}
