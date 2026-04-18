import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRightFromBracket,
  faGauge,
  faUser,
  faUsers,
  faBuilding,
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../context/AuthContext.jsx'

function NavItem({ to, icon, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      style={({ isActive }) => ({
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        borderRadius: 'var(--radius-sm)',
        padding: '7px 13px',
        fontSize: 13.5,
        fontWeight: isActive ? 700 : 500,
        textDecoration: 'none',
        transition: 'all var(--duration) var(--ease)',
        color: isActive ? '#0091FF' : 'var(--text-secondary)',
        background: isActive ? 'var(--c-blue-light)' : 'transparent',
        border: isActive ? '1px solid #bae6fd' : '1px solid transparent',
      })}
    >
      <FontAwesomeIcon icon={icon} style={{ fontSize: 13 }} />
      <span>{label}</span>
    </NavLink>
  )
}

export default function Layout() {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  const shellWide = pathname.startsWith('/dashboard') || pathname.startsWith('/admin')

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg-page)', color: 'var(--text-primary)' }}>

      {/* ── Top Navigation Bar ── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div
          style={{
            maxWidth: 1600,
            margin: '0 auto',
            padding: '0 24px',
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              textDecoration: 'none',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            <span
              style={{
                display: 'grid',
                placeItems: 'center',
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg,var(--c-navy),var(--c-navy-80))',
                color: '#fff',
                fontSize: 13,
                fontWeight: 800,
                letterSpacing: '-0.5px',
                boxShadow: '0 2px 8px rgb(0 32 91/.25)',
                flexShrink: 0,
              }}
            >
              SC
            </span>
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: 'var(--c-navy)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.3px',
                }}
              >
                Smart Campus
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.5px', fontWeight: 500 }}>
                MANAGEMENT SYSTEM
              </div>
            </div>
          </Link>

          {/* Nav Links */}
          {user ? (
            <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <NavItem to="/dashboard" icon={faGauge}   label="Dashboard" end={false} />
              <NavItem to="/profile"   icon={faUser}    label="Profile" />
              {user.role === 'ADMIN' ? (
                <NavItem to="/admin" icon={faUsers} label="Admin" end={false} />
              ) : null}
              <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 4px' }} />
              <button
                type="button"
                onClick={logout}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '7px 13px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 13.5,
                  fontWeight: 500,
                  color: '#ef4444',
                  background: 'transparent',
                  border: '1px solid transparent',
                  cursor: 'pointer',
                  transition: 'all var(--duration) var(--ease)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#fff1f2'
                  e.currentTarget.style.borderColor = '#fca5a5'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.borderColor = 'transparent'
                }}
              >
                <FontAwesomeIcon icon={faArrowRightFromBracket} style={{ fontSize: 13 }} />
                <span>Logout</span>
              </button>
            </nav>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-muted)' }}>
              <FontAwesomeIcon icon={faBuilding} style={{ color: 'var(--c-blue)' }} />
              <span>Secured with JWT · Google OAuth</span>
            </div>
          )}
        </div>
      </header>

      {/* ── Main Content ── */}
      <main
        style={{
          maxWidth: shellWide ? 1600 : 1280,
          margin: '0 auto',
          padding: '32px 24px',
        }}
      >
        <div className="animate-fade-up">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
