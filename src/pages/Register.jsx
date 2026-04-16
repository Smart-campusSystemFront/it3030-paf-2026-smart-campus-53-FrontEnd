import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Alert, Button, Card, CardBody, CardHeader, Input } from '../components/ui.jsx'

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
    <div className="mx-auto grid max-w-md gap-6">
      <Card>
        <CardHeader
          title="Create account"
          subtitle="Public registration creates a USER role"
          right={
            <Link className="text-sm font-semibold text-indigo-600 hover:text-indigo-700" to="/login">
              Sign in
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
              required
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input
                label="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
              <Input
                label="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
            <Input
              label="Password (min 8 chars)"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <Button type="submit" disabled={busy}>
              Create account
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}

