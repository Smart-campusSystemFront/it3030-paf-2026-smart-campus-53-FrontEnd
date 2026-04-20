import React, { useState } from 'react'
import { login, setSession, clearSession, getSession } from '../api.js'
import { useToast } from '../context/ToastContext.jsx'

export function LoginBar({ onAuthChange }) {
  const { push } = useToast()
  const session = getSession()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  async function onLogin(e) {
    e.preventDefault()
    setBusy(true)
    try {
      const res = await login(username, password)
      setSession(res.token, {
        username: res.username,
        role: res.role,
        id: res.userId,
      })
      setUsername('')
      setPassword('')
      onAuthChange?.()
      push(`Signed in as ${res.username}`)
    } catch (err) {
      push(err.message || 'Login failed')
    } finally {
      setBusy(false)
    }
  }

  function onLogout() {
    clearSession()
    onAuthChange?.()
    push('Signed out')
  }

  if (session.token) {
    return (
      <div className="login-bar">
        <span className="muted">
          {session.user.username} ({session.user.role})
        </span>
        <button type="button" className="ghost" onClick={onLogout}>
          Sign out
        </button>
      </div>
    )
  }

  return (
    <form className="login-bar" onSubmit={onLogin}>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        autoComplete="username"
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />
      <button type="submit" disabled={busy}>
        {busy ? '…' : 'Sign in'}
      </button>
      <span className="muted small">Try admin / password</span>
    </form>
  )
}
