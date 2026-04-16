import { useEffect, useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCamera, faSave } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../context/AuthContext.jsx'
import { apiRequest } from '../lib/api.js'
import { Alert, Button, Card, CardBody, CardHeader, Input } from '../components/ui.jsx'

export default function Profile() {
  const { user, refreshMe } = useAuth()

  const [firstName, setFirstName] = useState(user.firstName || '')
  const [lastName, setLastName] = useState(user.lastName || '')
  const [email, setEmail] = useState(user.email || '')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    setFirstName(user.firstName || '')
    setLastName(user.lastName || '')
    setEmail(user.email || '')
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
        body: {
          email,
          firstName,
          lastName,
          password: password || undefined,
        },
      })
      setPassword('')
      await refreshMe()
      setStatus({ tone: 'success', msg: 'Profile updated' })
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
      setStatus({ tone: 'success', msg: 'Profile image uploaded' })
    } catch (err) {
      setStatus({ tone: 'error', msg: err?.message || 'Upload failed' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader title="Profile" subtitle="Update your personal info and image" />
        <CardBody className="grid gap-5">
          {status ? <Alert tone={status.tone}>{status.msg}</Alert> : null}

          <div className="flex items-center gap-4">
            <div className="relative">
              {typeof avatar === 'string' ? (
                <img
                  src={avatar}
                  alt="Profile"
                  className="h-20 w-20 rounded-2xl border border-slate-200 object-cover"
                />
              ) : (
                <div className="grid h-20 w-20 place-items-center rounded-2xl bg-indigo-600 text-xl font-bold text-white">
                  {avatar.initials}
                </div>
              )}
              <label className="absolute -bottom-2 -right-2 grid h-9 w-9 cursor-pointer place-items-center rounded-xl border border-slate-200 bg-white shadow-sm hover:bg-slate-50">
                <FontAwesomeIcon icon={faCamera} className="text-slate-700" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => onUpload(e.target.files?.[0])}
                />
              </label>
            </div>

            <div className="grid gap-1">
              <div className="text-sm font-semibold">
                {user.firstName} {user.lastName}
              </div>
              <div className="text-sm text-slate-600">{user.email}</div>
              <div className="text-xs text-slate-500">
                Role: <span className="font-semibold">{user.role}</span> • Provider:{' '}
                <span className="font-semibold">{user.provider || '—'}</span>
              </div>
            </div>
          </div>

          <form className="grid gap-4" onSubmit={onSave}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <Input label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Input
              label="New password (optional)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Leave blank to keep current"
            />
            <Button type="submit" disabled={busy}>
              <FontAwesomeIcon icon={faSave} />
              Save changes
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}

