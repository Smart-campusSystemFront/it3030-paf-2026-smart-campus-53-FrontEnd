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
    if (err) {
      setError(err)
      return
    }
    if (!token) {
      setError('Missing token')
      return
    }
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
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader title="Signing you in..." subtitle="Finishing Google OAuth login" />
        <CardBody className="grid gap-3">
          {error ? (
            <>
              <Alert tone="error">{error}</Alert>
              <Link className="text-sm font-semibold text-indigo-600 hover:text-indigo-700" to="/login">
                Back to login
              </Link>
            </>
          ) : (
            <p className="text-sm text-slate-600">Please wait.</p>
          )}
        </CardBody>
      </Card>
    </div>
  )
}

