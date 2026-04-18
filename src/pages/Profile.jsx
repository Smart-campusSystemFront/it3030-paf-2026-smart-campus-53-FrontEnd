import { useEffect, useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera, faSave, faShieldHalved, faEnvelope, faCircleCheck } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../context/AuthContext.jsx'
import { apiRequest } from '../lib/api.js'
import { Alert, Badge, Button } from '../components/ui.jsx'

function Field({ label, ...props }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{ display: 'block', marginBottom: 6, fontSize: 13, fontWeight: 600, color: 'var(--c-slate-dk)' }}>
        {label}
      </label>
      <input
        {...props}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e) }}
        onBlur={(e)  => { setFocused(false); props.onBlur?.(e) }}
        style={{
          width: '100%', boxSizing: 'border-box',
          borderRadius: 'var(--radius-sm)',
          border: `1.5px solid ${focused ? 'var(--c-blue)' : 'var(--border)'}`,
          background: focused ? '#fafeff' : '#fff',
          padding: '10px 13px',
          fontSize: 14, color: 'var(--text-primary)', outline: 'none',
          boxShadow: focused ? 'var(--shadow-glow)' : 'none',
          transition: 'border-color var(--duration) var(--ease), box-shadow var(--duration) var(--ease)',
          ...props.style,
        }}
      />
    </div>
  )
}

const ROLE_COLORS = { ADMIN: 'red', TECHNICIAN: 'amber', USER: 'blue' }

export default function Profile() {
  const { user, refreshMe } = useAuth()

  const [firstName, setFirstName] = useState(user.firstName || '')
  const [lastName,  setLastName]  = useState(user.lastName  || '')
  const [email,     setEmail]     = useState(user.email     || '')
  const [password,  setPassword]  = useState('')
  const [status,    setStatus]    = useState(null)
  const [busy,      setBusy]      = useState(false)

  useEffect(() => {
    setFirstName(user.firstName || '')
    setLastName(user.lastName   || '')
    setEmail(user.email         || '')
  }, [user.firstName, user.lastName, user.email])

  const avatar = useMemo(() => {
    if (user.profileImageUrl) return user.profileImageUrl
    const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'U'
    return { initials }
  }, [user.firstName, user.lastName, user.profileImageUrl])

  async function onSave(e) {
    e.preventDefault()
    setStatus(null)
    setBusy(true)
    try {
      await apiRequest('/api/users/me', {
        method: 'PUT',
        body: { email, firstName, lastName, password: password || undefined },
      })
      setPassword('')
      await refreshMe()
      setStatus({ tone: 'success', msg: 'Profile updated successfully!' })
    } catch (err) {
      setStatus({ tone: 'error', msg: err?.message || 'Update failed' })
    } finally {
      setBusy(false)
    }
  }

  async function onUpload(file) {
    if (!file) return
    setStatus(null)
    setBusy(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      await apiRequest('/api/users/me/profile-image', { method: 'POST', body: fd })
      await refreshMe()
      setStatus({ tone: 'success', msg: 'Profile image updated!' })
    } catch (err) {
      setStatus({ tone: 'error', msg: err?.message || 'Upload failed' })
    } finally {
      setBusy(false)
    }
  }

  const roleColor = ROLE_COLORS[user.role] || 'blue'

  return (
    <div style={{ display: 'grid', gap: 24, maxWidth: 700 }}>

      {/* ── Profile card ── */}
      <div style={{
        background: '#fff', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)', overflow: 'hidden',
      }}>
        {/* Hero banner */}
        <div style={{
          height: 96,
          background: 'linear-gradient(135deg,var(--c-navy) 0%,var(--c-navy-60) 50%,var(--c-blue) 100%)',
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }} />
        </div>

        <div style={{ padding: '0 28px 24px' }}>
          {/* Avatar row */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: -36, marginBottom: 16 }}>
            <div style={{ position: 'relative' }}>
              {typeof avatar === 'string' ? (
                <img
                  src={avatar} alt="Profile"
                  style={{ width: 80, height: 80, borderRadius: 20, border: '3px solid #fff', objectFit: 'cover', boxShadow: 'var(--shadow-md)' }}
                />
              ) : (
                <div style={{
                  width: 80, height: 80, borderRadius: 20, border: '3px solid #fff',
                  background: 'linear-gradient(135deg,var(--c-navy),var(--c-blue))',
                  display: 'grid', placeItems: 'center',
                  fontSize: 26, fontWeight: 800, color: '#fff',
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  boxShadow: 'var(--shadow-md)',
                }}>
                  {avatar.initials}
                </div>
              )}
              <label style={{
                position: 'absolute', bottom: -4, right: -4,
                display: 'grid', placeItems: 'center',
                width: 28, height: 28, borderRadius: 8,
                background: 'var(--c-blue)', border: '2px solid #fff',
                cursor: 'pointer', boxShadow: 'var(--shadow-sm)',
                transition: 'transform var(--duration) var(--ease)',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)' }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
              >
                <FontAwesomeIcon icon={faCamera} style={{ color: '#fff', fontSize: 11 }} />
                <input type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={(e) => onUpload(e.target.files?.[0])} />
              </label>
            </div>
            <Badge color={roleColor}>
              <FontAwesomeIcon icon={faShieldHalved} style={{ fontSize: 9 }} />
              {user.role}
            </Badge>
          </div>

          {/* Name / email */}
          <div>
            <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 700, color: 'var(--c-navy)', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
              {user.firstName} {user.lastName}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
              <FontAwesomeIcon icon={faEnvelope} style={{ fontSize: 11 }} />
              {user.email}
              {user.active && (
                <FontAwesomeIcon icon={faCircleCheck} style={{ color: '#10b981', fontSize: 12, marginLeft: 4 }} />
              )}
            </div>
            <div style={{ marginTop: 4, fontSize: 12, color: 'var(--text-muted)' }}>
              Provider: <strong>{user.provider || 'LOCAL'}</strong> · ID: <strong>{user.id}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* ── Edit form card ── */}
      <div style={{
        background: '#fff', borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '18px 24px', borderBottom: '1px solid var(--border)',
          background: 'linear-gradient(180deg,#fafbfd,#fff)',
        }}>
          <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: 'var(--c-navy)', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
            Edit Profile
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)' }}>
            Update your personal information
          </p>
        </div>

        <form onSubmit={onSave} style={{ padding: 24, display: 'grid', gap: 16 }}>
          {status ? <Alert tone={status.tone}>{status.msg}</Alert> : null}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Jane" />
            <Field label="Last name"  value={lastName}  onChange={(e) => setLastName(e.target.value)}  placeholder="Doe" />
          </div>

          <Field label="Email address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

          <Field
            label="New password (optional)"
            type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Leave blank to keep current password"
          />

          <Button type="submit" disabled={busy} style={{ width: 'fit-content' }}>
            <FontAwesomeIcon icon={faSave} />
            {busy ? 'Saving…' : 'Save changes'}
          </Button>
        </form>
      </div>
    </div>
  )
}
