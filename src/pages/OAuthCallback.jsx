import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Alert, Card, CardBody, CardHeader } from '../components/ui.jsx'

function getParam(name) {
  const url = new URL(window.location.href)
  return url.searchParams.get(name)
}

export default function OAuthCallback() {
  const { acceptOAuthToken } = useAuth()
  const nav = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    const token = getParam('token')
    const err = getParam('error')
    if (err) { setError(err); return }
    if (!token) { setError('Missing token'); return }
    ;(async () => {
      try {
        await acceptOAuthToken(token)
        nav('/dashboard', { replace: true })
      } catch (e) {
        setError(e?.message || 'OAuth login failed')
      }
    })()
  }, [acceptOAuthToken, nav])

  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: 'calc(100vh - 60px)', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400 }} className="animate-fade-up">
        <Card>
          <CardHeader
            title="Signing you in…"
            subtitle="Completing Google OAuth login"
          />
          <CardBody>
            {error ? (
              <div style={{ display: 'grid', gap: 14 }}>
                <Alert tone="error">{error}</Alert>
                <Link
                  to="/login"
                  style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-blue)', textDecoration: 'none' }}
                >
                  ← Back to login
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="sc-spinner" style={{ width: 24, height: 24, borderWidth: 2 }} />
                <p style={{ margin: 0, fontSize: 14, color: 'var(--text-secondary)' }}>
                  Please wait, authenticating…
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
