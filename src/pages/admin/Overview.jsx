import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faTicket, faArrowRight, faCalendarCheck } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'

const MODULE_CARDS = [
  {
    to: '/admin/users',
    icon: faUsers,
    color: 'var(--c-blue)',
    bg: 'var(--c-blue-light)',
    border: '#bae6fd',
    title: 'User Management',
    description: 'Create accounts, update roles (USER / ADMIN / TECHNICIAN), toggle active status, and remove users.',
    stat: 'Full CRUD',
    statColor: 'var(--c-blue)',
  },
  {
    to: '/admin/bookings',
    icon: faCalendarCheck,
    color: '#0091FF',
    bg: 'var(--c-blue-light)',
    border: '#bae6fd',
    title: 'Booking Management',
    description: 'Review booking requests, approve or reject with reasons, export CSV, and monitor peak usage.',
    stat: 'Operations',
    statColor: 'var(--c-blue)',
  },
  {
    to: '/admin/tickets',
    icon: faTicket,
    color: '#F9BF3B',
    bg: '#fffbeb',
    border: '#fcd34d',
    title: 'Tickets',
    description: 'Operational queue for campus support tickets. Assign to TECHNICIAN staff and track resolution status.',
    stat: 'In Progress',
    statColor: '#f59e0b',
  },
]

export default function AdminOverview() {
  const { user } = useAuth()
  const visibleCards = user?.role === 'ADMIN' ? MODULE_CARDS : MODULE_CARDS.filter(c => c.to !== '/admin/users')

  return (
    <div style={{ display: 'grid', gap: 24 }}>

      {/* Hero banner */}
      <div style={{
        borderRadius: 'var(--radius-lg)',
        background: 'linear-gradient(130deg,var(--c-navy) 0%,#1a3a6e 50%,#2d548a 100%)',
        padding: '28px 32px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-md)',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.035'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }} />
        {/* Radial amber glow */}
        <div style={{
          position: 'absolute', right: -60, bottom: -60,
          width: 240, height: 240, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(249,191,59,.16) 0%,transparent 70%)',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(249,191,59,.15)', border: '1px solid rgba(249,191,59,.3)',
            borderRadius: 6, padding: '3px 10px', marginBottom: 12,
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--c-amber)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              {user?.role === 'ADMIN' ? 'Admin Control Panel' : 'Tech Control Panel'}
            </span>
          </div>
          <h2 style={{ margin: '0 0 6px', fontSize: 26, fontWeight: 800, color: '#fff', fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: '-0.4px' }}>
            {user?.role === 'ADMIN' ? 'Admin Overview' : 'Tech Overview'}
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: 'rgba(201,206,220,0.75)' }}>
            Manage campus operations — {user?.role === 'ADMIN' ? 'users, resources, tickets, and system settings' : 'tickets and related tasks'}
          </p>
        </div>
      </div>

      {/* Module cards */}
      <div>
        <h3 style={{ margin: '0 0 14px', fontSize: 13, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.8px', textTransform: 'uppercase' }}>
          Modules
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
          {visibleCards.map(({ to, icon, color, bg, border, title, description, stat, statColor }) => (
            <Link
              key={to}
              to={to}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  background: '#fff', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
                  padding: '22px',
                  transition: 'box-shadow var(--duration) var(--ease), transform var(--duration) var(--ease)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = border }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, border: `1px solid ${border}`, display: 'grid', placeItems: 'center' }}>
                    <FontAwesomeIcon icon={icon} style={{ color, fontSize: 20 }} />
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.4px',
                    textTransform: 'uppercase', color: statColor,
                    background: `${statColor}12`, border: `1px solid ${statColor}30`,
                    borderRadius: 6, padding: '3px 8px',
                  }}>
                    {stat}
                  </span>
                </div>
                <h4 style={{ margin: '0 0 6px', fontSize: 16, fontWeight: 700, color: 'var(--c-navy)', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                  {title}
                </h4>
                <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {description}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 600, color }}>
                  Go to {title} <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: 11 }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
