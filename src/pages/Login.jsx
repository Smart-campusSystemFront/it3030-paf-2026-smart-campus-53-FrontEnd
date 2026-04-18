import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { useAuth } from '../context/AuthContext.jsx'
import { API_BASE_URL } from '../lib/config.js'
import { Alert, Button, Divider } from '../components/ui.jsx'

function Field({ label, icon, ...props }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label
        style={{
          display: 'block',
          marginBottom: 6,
          fontSize: 13,
          fontWeight: 600,
          color: 'var(--c-slate-dk)',
          letterSpacing: '0.1px',
        }}
      >
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        {icon && (
          <FontAwesomeIcon
            icon={icon}
            style={{
              position: 'absolute',
              left: 13,
              top: '50%',
              transform: 'translateY(-50%)',
              color: focused ? 'var(--c-blue)' : 'var(--text-muted)',
              fontSize: 13,
              transition: 'color var(--duration)',
              pointerEvents: 'none',
            }}
          />
        )}
        <input
          {...props}
          onFocus={(e) => { setFocused(true); props.onFocus?.(e) }}
          onBlur={(e)  => { setFocused(false); props.onBlur?.(e) }}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            borderRadius: 'var(--radius-sm)',
            border: `1.5px solid ${focused ? 'var(--c-blue)' : 'var(--border)'}`,
            background: focused ? '#fafeff' : '#fff',
            padding: icon ? '10px 13px 10px 38px' : '10px 13px',
            fontSize: 14,
            color: 'var(--text-primary)',
            outline: 'none',
            boxShadow: focused ? 'var(--shadow-glow)' : 'none',
            transition: 'border-color var(--duration) var(--ease), box-shadow var(--duration) var(--ease), background var(--duration)',
          }}
        />
      </div>
    </div>
  )
}

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const from = loc.state?.from || '/dashboard'

  const oauthUrl = useMemo(() => {
    const base = API_BASE_URL.replace(/\/+$/, '')
    return `${base}/oauth2/authorization/google`
  }, [])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login({ email, password })
      nav(from, { replace: true })
    } catch (err) {
      setError(err?.message || 'Login failed')
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
      {/* Background decorative blobs */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', top: '10%', left: '-5%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(0,145,255,.10) 0%,transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '15%', right: '-5%',
          width: 350, height: 350, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(0,32,91,.07) 0%,transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', top: '45%', right: '20%',
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(249,191,59,.08) 0%,transparent 70%)',
        }} />
      </div>

      <div
        className="animate-fade-up"
        style={{ width: '100%', maxWidth: 420, position: 'relative', zIndex: 1 }}
      >
        {/* Brand hero */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: 16,
              background: 'linear-gradient(135deg,var(--c-navy),var(--c-navy-80))',
              marginBottom: 14,
              boxShadow: '0 8px 24px rgb(0 32 91/.25)',
            }}
          >
            <span style={{ color: '#fff', fontWeight: 800, fontSize: 18, fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: '-0.5px' }}>
              SC
            </span>
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: 24, fontWeight: 800, color: 'var(--c-navy)', fontFamily: "'Plus Jakarta Sans',sans-serif", letterSpacing: '-0.4px' }}>
            Welcome back
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)' }}>
            Sign in to Smart Campus to continue
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid rgba(255,255,255,0.7)',
            boxShadow: 'var(--shadow-lg)',
            padding: '32px 30px',
          }}
        >
          {/* Google OAuth */}
          <a
            href={oauthUrl}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              width: '100%',
              padding: '10px 16px',
              borderRadius: 'var(--radius-sm)',
              border: '1.5px solid var(--border)',
              background: '#fff',
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--text-primary)',
              textDecoration: 'none',
              boxShadow: 'var(--shadow-sm)',
              transition: 'all var(--duration) var(--ease)',
              marginBottom: 20,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--c-blue)'
              e.currentTarget.style.boxShadow = 'var(--shadow-glow)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <FontAwesomeIcon icon={faGoogle} style={{ color: '#ea4335', fontSize: 16 }} />
            Continue with Google
          </a>

          <Divider label="or sign in with email" />

          <form onSubmit={onSubmit} style={{ display: 'grid', gap: 14, marginTop: 20 }}>
            {error ? <Alert tone="error">{error}</Alert> : null}

            <Field
              label="Email address"
              icon={faEnvelope}
              type="email"
              autoComplete="email"
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Field
              label="Password"
              icon={faLock}
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              disabled={busy}
              style={{ width: '100%', padding: '11px 18px', marginTop: 4, justifyContent: 'center' }}
            >
              {busy ? 'Signing in…' : (
                <>Sign in <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: 12 }} /></>
              )}
            </Button>
          </form>

          <p style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              style={{ color: 'var(--c-blue)', fontWeight: 600, textDecoration: 'none' }}
            >
              Create one free
            </Link>
          </p>
        </div>

        <p style={{ marginTop: 16, textAlign: 'center', fontSize: 11, color: 'var(--text-muted)' }}>
          API running on{' '}
          <code style={{ background: 'rgba(0,0,0,.06)', padding: '1px 5px', borderRadius: 4 }}>
            localhost:8080
          </code>
          {' '}· Set{' '}
          <code style={{ background: 'rgba(0,0,0,.06)', padding: '1px 5px', borderRadius: 4 }}>
            VITE_API_BASE_URL
          </code>{' '}
          to override
        </p>
      </div>
    </div>
  )
}
