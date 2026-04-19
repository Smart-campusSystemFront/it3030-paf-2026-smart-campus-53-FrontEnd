import { useState, useRef, useEffect, useMemo } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faArrowRightFromBracket,
  faGauge,
  faUser,
  faUsers,
  faChevronDown,
  faCalendarCheck,
  faChartLine,
  faClipboardList,
} from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../context/AuthContext.jsx'
import { Button } from './ui.jsx'
import NotificationBell from './NotificationBell.jsx'

function ProfileDropdownMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setIsOpen(false)
    await logout()
    navigate('/login')
  }

  const avatarInitial = useMemo(() => {
    return `${user?.firstName?.[0] || ''}`.toUpperCase() || 'U'
  }, [user])

  return (
    <div style={{ position: 'relative' }} ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          background: 'transparent',
          border: 'none',
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          cursor: 'pointer',
          borderRadius: 'var(--radius-sm)',
          transition: 'background var(--duration) var(--ease)',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,145,255,0.06)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
      >
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: 'linear-gradient(135deg,var(--c-blue),#0070d1)',
          color: '#fff', display: 'grid', placeItems: 'center',
          fontWeight: 700, fontSize: 13,
          boxShadow: 'var(--shadow-sm)',
        }}>
          {avatarInitial}
        </div>
        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-navy)', lineHeight: 1.1 }}>
            {user?.firstName}
          </span>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            {user?.role}
          </span>
        </div>
        <FontAwesomeIcon
          icon={faChevronDown}
          style={{
            fontSize: 10, color: 'var(--text-muted)',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
            transition: 'transform var(--duration) var(--ease)'
          }}
        />
      </button>

      {/* Dropdown Pane */}
      {isOpen && (
        <div
          className="animate-fade-in"
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: 240,
            background: '#fff',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
            zIndex: 100,
          }}
        >
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: '#fafbfd' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--c-navy)' }}>
              {user?.firstName} {user?.lastName}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              {user?.email}
            </div>
          </div>

          <div style={{ padding: 8, display: 'grid', gap: 2 }}>
            <Link
              to="/profile"
              onClick={() => setIsOpen(false)}
              style={menuItemStyle}
              onMouseEnter={menuItemHoverStyle}
              onMouseLeave={menuItemLeaveStyle}
            >
              <FontAwesomeIcon icon={faUser} style={{ width: 16 }} /> My Profile
            </Link>
            <Link
              to="/dashboard"
              onClick={() => setIsOpen(false)}
              style={menuItemStyle}
              onMouseEnter={menuItemHoverStyle}
              onMouseLeave={menuItemLeaveStyle}
            >
              <FontAwesomeIcon icon={faGauge} style={{ width: 16 }} /> User Dashboard
            </Link>
            <Link
              to="/bookings"
              onClick={() => setIsOpen(false)}
              style={menuItemStyle}
              onMouseEnter={menuItemHoverStyle}
              onMouseLeave={menuItemLeaveStyle}
            >
              <FontAwesomeIcon icon={faChartLine} style={{ width: 16 }} /> Bookings
            </Link>
            <Link
              to="/bookings/my"
              onClick={() => setIsOpen(false)}
              style={menuItemStyle}
              onMouseEnter={menuItemHoverStyle}
              onMouseLeave={menuItemLeaveStyle}
            >
              <FontAwesomeIcon icon={faCalendarCheck} style={{ width: 16 }} /> My Booking
            </Link>
            {['ADMIN', 'TECHNICIAN'].includes(user?.role) && (
              <Link
                to="/admin/bookings"
                onClick={() => setIsOpen(false)}
                style={{ ...menuItemStyle, color: 'var(--c-amber)', fontWeight: 600 }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(249,191,59,0.08)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <FontAwesomeIcon icon={faClipboardList} style={{ width: 16, color: 'var(--c-amber)' }} />
                Booking Management
              </Link>
            )}
            {['ADMIN', 'TECHNICIAN'].includes(user?.role) && (
              <Link
                to="/admin/overview"
                onClick={() => setIsOpen(false)}
                style={{ ...menuItemStyle, color: 'var(--c-amber)', fontWeight: 600 }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(249,191,59,0.08)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
              >
                <FontAwesomeIcon icon={faUsers} style={{ width: 16, color: 'var(--c-amber)' }} />
                {user?.role === 'ADMIN' ? 'Admin Dashboard' : 'Tech Dashboard'}
              </Link>
            )}
          </div>

          <div style={{ padding: 8, borderTop: '1px solid var(--border)' }}>
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 12px', borderRadius: 'var(--radius-sm)',
                fontSize: 13, fontWeight: 600, color: '#ef4444',
                background: 'transparent', border: 'none', cursor: 'pointer',
                textAlign: 'left',
                transition: 'background var(--duration) var(--ease)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#fff1f2' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              <FontAwesomeIcon icon={faArrowRightFromBracket} style={{ width: 16 }} /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const menuItemStyle = {
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '8px 12px', borderRadius: 'var(--radius-sm)',
  fontSize: 13, fontWeight: 500, color: 'var(--text-primary)',
  textDecoration: 'none', background: 'transparent',
  transition: 'background var(--duration) var(--ease)',
}

const menuItemHoverStyle = (e) => {
  e.currentTarget.style.background = 'var(--c-blue-light)'
  e.currentTarget.style.color = 'var(--c-blue)'
}

const menuItemLeaveStyle = (e) => {
  e.currentTarget.style.background = 'transparent'
  e.currentTarget.style.color = 'var(--text-primary)'
}

export default function Layout() {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const shellWide =
    pathname.startsWith('/dashboard')
    || pathname.startsWith('/bookings')
    || pathname.startsWith('/resources')
    || pathname.startsWith('/admin')
  const isBookings = pathname.startsWith('/bookings')
  const isAdmin = pathname.startsWith('/admin')
  const isDashboard = pathname.startsWith('/dashboard')
  const tightBelowHeader = isBookings || isAdmin || isDashboard
  /** Full-height shells (admin / dashboard / bookings): no vertical gap under header — only horizontal gutter. */
  const mainPadding = tightBelowHeader ? '0 12px 0' : '32px 24px'

  return (
    <div
      className={shellWide ? 'min-h-full bg-slate-100 text-slate-900' : 'min-h-full'}
      style={
        shellWide
          ? undefined
          : { minHeight: '100%', background: 'var(--bg-page)', color: 'var(--text-primary)' }
      }
    >

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

          {/* Navigation Area */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {user && <NotificationBell />}
            {user ? (
              <ProfileDropdownMenu />
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Link to="/login" style={{ textDecoration: 'none' }}>
                  <Button variant="ghost" style={{ padding: '6px 14px', fontSize: 13, borderRadius: 6 }}>
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  <Button variant="primary" style={{ padding: '6px 14px', fontSize: 13, borderRadius: 6 }}>
                    Create Account
                  </Button>
                </Link>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* ── Main Content ── */}
      <main
        style={{
          maxWidth: tightBelowHeader ? '100%' : shellWide ? 1600 : 1280,
          margin: '0 auto',
          padding: mainPadding,
        }}
      >
        <div className="animate-fade-up">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
