import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIdBadge, faShieldHalved, faUserCheck, faCalendarCheck, faTicket, faBell } from '@fortawesome/free-solid-svg-icons'
import { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

const STAT_CARDS = [
  {
    key: 'name',
    icon: faIdBadge,
    color: 'var(--c-blue)',
    bg: 'var(--c-blue-light)',
    label: 'Account',
    getValue: (user) => `${user.firstName} ${user.lastName}`,
    getSub: (user) => user.email,
  },
  {
    key: 'role',
    icon: faShieldHalved,
    color: '#F9BF3B',
    bg: '#fffbeb',
    label: 'Role',
    getValue: (user) => user.role,
    getSub: (user) => `Provider: ${user.provider || 'LOCAL'}`,
  },
  {
    key: 'status',
    icon: faUserCheck,
    color: '#10b981',
    bg: '#f0fdf4',
    label: 'Status',
    getValue: (user) => user.active ? 'Active' : 'Disabled',
    getSub: (user) => `ID: ${user.id}`,
  },
]

const SHORTCUT_LINKS = [
  { to: '/profile', label: 'Manage Profile', primary: true },
  { to: '/bookings', label: 'Bookings', primary: false },
  { to: '/bookings/my', label: 'My Booking', primary: false },
  { to: '/dashboard/tickets', label: 'My Tickets', primary: false },
]

const FEATURE_CARDS = [
  {
    icon: faCalendarCheck,
    color: 'var(--c-blue)',
    bg: 'var(--c-blue-light)',
    title: 'Bookings',
    description: 'Reserve campus rooms, labs, and equipment. Check availability and manage your upcoming bookings.',
    badge: 'Coming Soon',
    badgeColor: '#0091FF',
  },
  {
    icon: faTicket,
    color: '#F9BF3B',
    bg: '#fffbeb',
    title: 'Support Tickets',
    description: 'Submit facility requests, IT issues, or maintenance reports. Track status in real time.',
    badge: 'In Progress',
    badgeColor: '#F9BF3B',
    to: '/dashboard/tickets',
  },
  {
    icon: faBell,
    color: '#10b981',
    bg: '#f0fdf4',
    title: 'Notifications',
    description: 'Stay updated with booking confirmations, ticket responses, and campus announcements.',
    badge: 'Coming Soon',
    badgeColor: '#10b981',
  },
]

export default function UserDashboardOverview() {
  const { user } = useAuth()

  return (
    <div style={{ display: 'grid', gap: 24 }}>

      {/* Welcome banner */}
      <div style={{
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(135deg,var(--c-navy) 0%,var(--c-navy-60) 55%,var(--c-blue) 100%)',
        padding: '28px 32px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
      }}>
        {/* Pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }} />
        {/* Amber glow circle */}
        <div style={{
          position: 'absolute', right: -40, top: -40,
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(249,191,59,.18) 0%,transparent 70%)',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ margin: '0 0 4px', fontSize: 13, color: 'rgba(201,206,220,0.8)', fontWeight: 500, letterSpacing: '0.3px' }}>
            Good day,
          </p>
          <h2 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 800, color: '#fff', fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: '-0.4px' }}>
            {user.firstName} {user.lastName} 👋
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: 'rgba(201,206,220,0.75)' }}>
            Your Smart Campus dashboard — manage bookings, tickets & more
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 16 }}>
        {STAT_CARDS.map(({ key, icon, color, bg, label, getValue, getSub }) => (
          <div
            key={key}
            style={{
              background: '#fff', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
              padding: '18px 20px',
              transition: 'box-shadow var(--duration) var(--ease), transform var(--duration) var(--ease)',
              cursor: 'default',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: 'grid', placeItems: 'center' }}>
                <FontAwesomeIcon icon={icon} style={{ color, fontSize: 15 }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                {label}
              </span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--c-navy)', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              {getValue(user)}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              {getSub(user)}
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{
        background: '#fff', borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
        padding: '18px 20px',
      }}>
        <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--c-navy)', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
          Quick Actions
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {SHORTCUT_LINKS.map(({ to, label, primary }) => (
            <Link
              key={to}
              to={to}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                borderRadius: 'var(--radius-sm)', padding: '8px 16px',
                fontSize: 13, fontWeight: 600, textDecoration: 'none',
                transition: 'all var(--duration) var(--ease)',
                ...(primary
                  ? { background: 'linear-gradient(135deg,var(--c-blue),#0070d1)', color: '#fff', boxShadow: '0 4px 10px rgb(0 145 255/.25)' }
                  : { background: '#fff', color: 'var(--c-navy)', border: '1.5px solid var(--border)' }),
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.filter = 'brightness(1.05)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.filter = 'none' }}
            >
              {label}
            </Link>
          ))}
          {['ADMIN', 'TECHNICIAN'].includes(user.role) && (
            <>
              <Link
                to="/admin/bookings"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  borderRadius: 'var(--radius-sm)', padding: '8px 16px',
                  fontSize: 13, fontWeight: 600, textDecoration: 'none',
                  background: '#fff', color: 'var(--c-navy)', border: '1.5px solid var(--c-amber)',
                  transition: 'all var(--duration) var(--ease)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
              >
                Booking Management
              </Link>
              <Link
                to="/admin/overview"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  borderRadius: 'var(--radius-sm)', padding: '8px 16px',
                  fontSize: 13, fontWeight: 600, textDecoration: 'none',
                  background: 'linear-gradient(135deg,var(--c-amber),#f59e0b)',
                  color: 'var(--c-navy)', border: 'none',
                  boxShadow: '0 4px 10px rgb(249 191 59/.25)',
                  transition: 'all var(--duration) var(--ease)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
              >
                {user.role === 'ADMIN' ? 'Admin Dashboard' : 'Tech Dashboard'}
              </Link>
            <Link
              to="/admin/tickets"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                borderRadius: 'var(--radius-sm)', padding: '8px 16px',
                fontSize: 13, fontWeight: 600, textDecoration: 'none',
                background: 'linear-gradient(135deg,var(--c-amber),#f59e0b)',
                color: 'var(--c-navy)', border: 'none',
                boxShadow: '0 4px 10px rgb(249 191 59/.25)',
                transition: 'all var(--duration) var(--ease)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)' }}
            >
              Admin Dashboard
            </Link>
            </>
          )}
        </div>
      </div>

      {/* Feature cards */}
      <div>
        <h3 style={{ margin: '0 0 14px', fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)' }}>
          Available Features
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
          {FEATURE_CARDS.map(({ icon, color, bg, title, description, badge, badgeColor, to }) => {
            const cardStyle = {
              background: '#fff', borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
              padding: '20px', overflow: 'hidden', position: 'relative',
              transition: 'box-shadow var(--duration) var(--ease), transform var(--duration) var(--ease)',
            }
            const inner = (
              <div
                style={cardStyle}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                {/* Badge */}
                <span style={{
                  position: 'absolute', top: 14, right: 14,
                  fontSize: 10, fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase',
                  background: `${badgeColor}15`, color: badgeColor,
                  border: `1px solid ${badgeColor}40`,
                  borderRadius: 6, padding: '2px 8px',
                }}>
                  {badge}
                </span>

                <div style={{ width: 40, height: 40, borderRadius: 12, background: bg, display: 'grid', placeItems: 'center', marginBottom: 14 }}>
                  <FontAwesomeIcon icon={icon} style={{ color, fontSize: 18 }} />
                </div>
                <h4 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 700, color: 'var(--c-navy)', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                  {title}
                </h4>
                <p style={{ margin: 0, fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {description}
                </p>
              </div>
            )
            if (to) {
              return (
                <Link
                  key={title}
                  to={to}
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  {inner}
                </Link>
              )
            }
            return <Fragment key={title}>{inner}</Fragment>
          })}
        </div>
      </div>
    </div>
  )
}
