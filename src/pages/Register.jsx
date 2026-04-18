import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight, faEnvelope, faLock, faUser } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../context/AuthContext.jsx'
import { Alert, Button, Divider } from '../components/ui.jsx'

function Field({ label, icon, ...props }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: 'var(--c-slate-dk)' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {icon && (
          <FontAwesomeIcon
            icon={icon}
            style={{
              position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
              color: focused ? 'var(--c-blue)' : 'var(--text-muted)', fontSize: 13,
              transition: 'color var(--duration)', pointerEvents: 'none',
            }}
          />
        )}
        <input
          {...props}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e) }}
          onBlur={(e)  => { setFocused(false); props.onBlur?.(e) }}
          style={{
            width: '100%', boxSizing: 'border-box',
            borderRadius: 'var(--radius-sm)',
            border: `1.5px solid ${focused ? 'var(--c-blue)' : 'var(--border)'}`,
            background: focused ? '#fafeff' : '#fff',
            padding: icon ? '10px 13px 10px 38px' : '10px 13px',
            fontSize: 14, color: 'var(--text-primary)', outline: 'none',
            boxShadow: focused ? 'var(--shadow-glow)' : 'none',
            transition: 'border-color var(--duration) var(--ease), box-shadow var(--duration) var(--ease)',
          }}
        />
      </div>
    </div>
  )
}

export default function Register() {
  const { register } = useAuth()
  const nav = useNavigate()

  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await register({ email, firstName, lastName, password })
      nav('/dashboard', { replace: true })
    } catch (err) {
      setError(err?.message || 'Registration failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        minHeight: 'calc(100vh - 60px)',
        padding: '24px 16px',
        background: 'linear-gradient(145deg,#f0f4f8 0%,#e8eef8 60%,#dde8f7 100%)',
      }}
    >
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '5%', right: '-5%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle,rgba(249,191,59,.09) 0%,transparent 70%)' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-5%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle,rgba(0,145,255,.09) 0%,transparent 70%)' }} />
      </div>

      <div className="animate-fade-up" style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }}>
        {/* Brand hero */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 56, height: 56, borderRadius: 16,
            background: 'linear-gradient(135deg,var(--c-navy),var(--c-navy-80))',
            marginBottom: 14, boxShadow: '0 8px 24px rgb(0 32 91/.25)',
          }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 18, fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: '-0.5px' }}>SC</span>
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 800, color: 'var(--c-navy)', fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: '-0.4px' }}>
            Create your account
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)' }}>
            Join Smart Campus — your university portal
          </p>
        </div>

        {/* Glassmorphism card */}
        <div style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid rgba(255,255,255,0.7)',
          boxShadow: 'var(--shadow-lg)',
          padding: '32px 30px',
        }}>
          <form onSubmit={onSubmit} style={{ display: 'grid', gap: 14 }}>
            {error ? <Alert tone="error">{error}</Alert> : null}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="First name" icon={faUser} value={firstName} onChange={(e) => setFirstName(e.target.value)} required placeholder="Jane" />
              <Field label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} required placeholder="Doe" />
            </div>

            <Field label="Email address" icon={faEnvelope} type="email" autoComplete="email"
              placeholder="you@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} required />

            <Field label="Password (min 8 chars)" icon={faLock} type="password" autoComplete="new-password"
              placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)}
              required minLength={8} />

            {/* Password strength hint */}
            {password.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {[...Array(4)].map((_, i) => {
                  const score = Math.min(Math.floor(password.length / 3), 4)
                  const colors = ['#ef4444','#f59e0b','#10b981','#0091FF']
                  return (
                    <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, background: i < score ? colors[score - 1] : 'var(--border)', transition: 'background 0.3s' }} />
                  )
                })}
              </div>
            )}

            <Button type="submit" disabled={busy} style={{ width: '100%', padding: '11px 18px', justifyContent: 'center', marginTop: 4 }}>
              {busy ? 'Creating account…' : (
                <>Create account <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: 12 }} /></>
              )}
            </Button>
          </form>

          <Divider />

          <p style={{ margin: 0, textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--c-blue)', fontWeight: 600, textDecoration: 'none' }}>
              Sign in
            </Link>
          </p>
        </div>

        <p style={{ marginTop: 14, textAlign: 'center', fontSize: 12, color: 'var(--text-muted)' }}>
          New accounts are created with <strong>USER</strong> role. Admins can upgrade roles later.
        </p>
      </div>
    </div>
  )
}
