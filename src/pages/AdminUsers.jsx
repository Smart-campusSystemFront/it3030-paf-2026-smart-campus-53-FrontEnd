import { useEffect, useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faRotateRight, faTrash } from '@fortawesome/free-solid-svg-icons'
import { apiRequest } from '../lib/api.js'
import { Alert, Button, Card, CardBody, CardHeader, Input, Select } from '../components/ui.jsx'

const ROLES = ['USER', 'ADMIN', 'TECHNICIAN']

function fmtDate(s) {
  if (!s) return '—'
  const d = new Date(s)
  if (Number.isNaN(d.getTime())) return s
  return d.toLocaleString()
}

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState(null)

  const [q, setQ] = useState('')

  const [createOpen, setCreateOpen] = useState(false)
  const [cEmail, setCEmail] = useState('')
  const [cFirst, setCFirst] = useState('')
  const [cLast, setCLast] = useState('')
  const [cPassword, setCPassword] = useState('')
  const [cRole, setCRole] = useState('USER')
  const [busy, setBusy] = useState(false)

  async function load() {
    setStatus(null)
    setLoading(true)
    try {
      const list = await apiRequest('/api/users')
      setUsers(Array.isArray(list) ? list : [])
    } catch (err) {
      setStatus({ tone: 'error', msg: err?.message || 'Failed to load users' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return users
    return users.filter((u) => {
      const hay = `${u.id} ${u.email} ${u.firstName} ${u.lastName} ${u.role} ${u.provider}`.toLowerCase()
      return hay.includes(s)
    })
  }, [q, users])

  async function onCreate(e) {
    e.preventDefault()
    setStatus(null)
    setBusy(true)
    try {
      await apiRequest('/api/users', {
        method: 'POST',
        body: {
          email: cEmail,
          firstName: cFirst,
          lastName: cLast,
          password: cPassword,
          role: cRole,
        },
      })
      setCreateOpen(false)
      setCEmail('')
      setCFirst('')
      setCLast('')
      setCPassword('')
      setCRole('USER')
      await load()
      setStatus({ tone: 'success', msg: 'User created' })
    } catch (err) {
      setStatus({ tone: 'error', msg: err?.message || 'Create failed' })
    } finally {
      setBusy(false)
    }
  }

  async function onUpdate(u, patch) {
    setStatus(null)
    setBusy(true)
    try {
      await apiRequest(`/api/users/${u.id}`, { method: 'PUT', body: patch })
      await load()
      setStatus({ tone: 'success', msg: 'User updated' })
    } catch (err) {
      setStatus({ tone: 'error', msg: err?.message || 'Update failed' })
    } finally {
      setBusy(false)
    }
  }

  async function onDelete(u) {
    if (!confirm(`Delete user ${u.email}?`)) return
    setStatus(null)
    setBusy(true)
    try {
      await apiRequest(`/api/users/${u.id}`, { method: 'DELETE' })
      await load()
      setStatus({ tone: 'success', msg: 'User deleted' })
    } catch (err) {
      setStatus({ tone: 'error', msg: err?.message || 'Delete failed' })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader
          title="User management"
          subtitle="Admin-only endpoints: list, create, update role/active, delete"
          right={
            <div className="flex items-center gap-2">
              <Button variant="secondary" type="button" onClick={load} disabled={busy}>
                <FontAwesomeIcon icon={faRotateRight} />
                Refresh
              </Button>
              <Button type="button" onClick={() => setCreateOpen((v) => !v)} disabled={busy}>
                <FontAwesomeIcon icon={faPlus} />
                New user
              </Button>
            </div>
          }
        />
        <CardBody className="grid gap-4">
          {status ? <Alert tone={status.tone}>{status.msg}</Alert> : null}

          {createOpen ? (
            <form onSubmit={onCreate} className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input label="Email" type="email" value={cEmail} onChange={(e) => setCEmail(e.target.value)} required />
                <Select label="Role" value={cRole} onChange={(e) => setCRole(e.target.value)}>
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Input label="First name" value={cFirst} onChange={(e) => setCFirst(e.target.value)} required />
                <Input label="Last name" value={cLast} onChange={(e) => setCLast(e.target.value)} required />
              </div>
              <Input
                label="Password (required)"
                type="password"
                value={cPassword}
                onChange={(e) => setCPassword(e.target.value)}
                required
                minLength={8}
              />
              <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={busy}>
                  Create
                </Button>
                <Button type="button" variant="secondary" onClick={() => setCreateOpen(false)} disabled={busy}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : null}

          <div className="grid gap-3">
            <Input
              label="Search"
              placeholder="Search by name/email/role/provider"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="min-w-[900px] w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Active</th>
                  <th className="px-4 py-3">Provider</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td className="px-4 py-4 text-slate-600" colSpan={8}>
                      Loading...
                    </td>
                  </tr>
                ) : filtered.length ? (
                  filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium">{u.id}</td>
                      <td className="px-4 py-3">{u.email}</td>
                      <td className="px-4 py-3">
                        {u.firstName} {u.lastName}
                      </td>
                      <td className="px-4 py-3">
                        <Select
                          value={u.role}
                          onChange={(e) => onUpdate(u, { role: e.target.value })}
                          className="min-w-40"
                          disabled={busy}
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </Select>
                      </td>
                      <td className="px-4 py-3">
                        <label className="inline-flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={!!u.active}
                            onChange={(e) => onUpdate(u, { active: e.target.checked })}
                            disabled={busy}
                          />
                          <span className="text-slate-700">{u.active ? 'Yes' : 'No'}</span>
                        </label>
                      </td>
                      <td className="px-4 py-3">{u.provider || '—'}</td>
                      <td className="px-4 py-3 text-slate-600">{fmtDate(u.createdAt)}</td>
                      <td className="px-4 py-3">
                        <Button variant="danger" type="button" onClick={() => onDelete(u)} disabled={busy}>
                          <FontAwesomeIcon icon={faTrash} />
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-4 py-4 text-slate-600" colSpan={8}>
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}

