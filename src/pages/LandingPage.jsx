import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faCalendarCheck, faTicket, faShieldHalved } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../context/AuthContext.jsx'
import { Button } from '../components/ui.jsx'

function Feature({ icon, title, description }) {
  return (
    <div style={{
      background: '#fff',
      padding: '32px 24px',
      borderRadius: 'var(--radius-lg)',
      border: '1px solid var(--border)',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      textAlign: 'center',
      transition: 'transform var(--duration) var(--ease), box-shadow var(--duration) var(--ease)',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)'
      e.currentTarget.style.boxShadow = 'var(--shadow-md)'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)'
      e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: '16px',
        background: 'var(--c-blue-light)',
        color: 'var(--c-blue)',
        display: 'grid', placeItems: 'center', fontSize: 24,
        marginBottom: 16,
      }}>
        <FontAwesomeIcon icon={icon} />
      </div>
      <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700, color: 'var(--c-navy)' }}>
        {title}
      </h3>
      <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        {description}
      </p>
    </div>
  )
}

export default function LandingPage() {
  const { user, loading } = useAuth()

  return (
    <div className="animate-fade-up">
      {/* ── Hero Section ── */}
      <section style={{
        padding: '60px 20px',
        textAlign: 'center',
        background: 'linear-gradient(135deg,var(--c-navy) 0%,var(--c-navy-60) 100%)',
        borderRadius: 'var(--radius-xl)',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)',
        marginBottom: 40,
      }}>
        {/* Glow Effects */}
        <div style={{
          position: 'absolute', top: -100, right: -100, width: 300, height: 300,
          background: 'radial-gradient(circle,rgba(0,145,255,0.3) 0%,transparent 70%)', borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', bottom: -100, left: -100, width: 300, height: 300,
          background: 'radial-gradient(circle,rgba(249,191,59,0.2) 0%,transparent 70%)', borderRadius: '50%',
        }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 99, padding: '4px 16px', fontSize: 12, fontWeight: 600,
            letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 24,
          }}>
            Smart Campus Portal
          </div>
          <h1 style={{ margin: '0 0 20px', fontSize: 'clamps(36px, 5vw, 52px)', fontWeight: 800, fontFamily: "'Plus Jakarta Sans',sans-serif", lineHeight: 1.1 }}>
            Manage campus life with absolute ease
          </h1>
          <p style={{ margin: '0 0 32px', fontSize: 18, color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
            The unified interface for students, staff, and technicians. Access bookings, file support tickets, and stay connected with live campus operations.
          </p>

          {!loading && (
             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
               {user ? (
                 <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                   <Button variant="amber" style={{ fontSize: 16, padding: '12px 28px' }}>
                     Go to Dashboard
                     <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: 13 }} />
                   </Button>
                 </Link>
               ) : (
                 <>
                   <Link to="/register" style={{ textDecoration: 'none' }}>
                     <Button variant="amber" style={{ fontSize: 16, padding: '12px 28px' }}>
                       Get Started
                       <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: 13 }} />
                     </Button>
                   </Link>
                   <Link to="/login" style={{ textDecoration: 'none' }}>
                     <Button variant="secondary" style={{ fontSize: 16, padding: '12px 28px' }}>
                       Sign In
                     </Button>
                   </Link>
                 </>
               )}
             </div>
          )}
        </div>
      </section>

      {/* ── Features Section ── */}
      <section style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24 }}>
        <Feature
          icon={faCalendarCheck}
          title="Facility Bookings"
          description="Easily browse available labs, lecture halls, and meeting spaces. Submit reservation requests in seconds and manage conflicts."
        />
        <Feature
          icon={faTicket}
          title="Support Tickets"
          description="Raise maintenance or IT requests to campus operations. Follow real-time progress and collaborate with technical staff."
        />
        <Feature
          icon={faShieldHalved}
          title="Secure Access"
          description="JWT authentication secured under role-based access control. With robust separation of duties for all departments."
        />
      </section>
    </div>
  )
}
