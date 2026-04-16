import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { useAuth } from '../context/AuthContext.jsx'
import { API_BASE_URL } from '../lib/config.js'
import { Alert, Button, Card, CardBody, CardHeader, Input } from '../components/ui.jsx'

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
    <div className="mx-auto grid max-w-md gap-6">
      <Card>
        <CardHeader
          title="Sign in"
          subtitle="Use email/password or Google OAuth"
          right={
            <Link className="text-sm font-semibold text-indigo-600 hover:text-indigo-700" to="/register">
              Create account
            </Link>
          }
        />
        <CardBody className="grid gap-4">
          {error ? <Alert tone="error">{error}</Alert> : null}

          <form className="grid gap-3" onSubmit={onSubmit}>
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" disabled={busy}>
              <FontAwesomeIcon icon={faEnvelope} className="hidden" />
              <FontAwesomeIcon icon={faLock} className="hidden" />
              Sign in
            </Button>
          </form>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs font-medium uppercase tracking-wider text-slate-500">or</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <a
            href={oauthUrl}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
          >
            <FontAwesomeIcon icon={faGoogle} className="text-rose-600" />
            Continue with Google
          </a>

          <p className="text-xs text-slate-500">
            Backend CORS allows <code className="rounded bg-slate-100 px-1">http://localhost:5173</code>. If your API is
            not running on <code className="rounded bg-slate-100 px-1">http://localhost:8080</code>, set{' '}
            <code className="rounded bg-slate-100 px-1">VITE_API_BASE_URL</code>.
          </p>
        </CardBody>
      </Card>
    </div>
  )
}

