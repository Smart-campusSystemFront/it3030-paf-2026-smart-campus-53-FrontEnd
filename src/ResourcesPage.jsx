import { useEffect, useMemo, useState } from 'react'
import {
  createResource,
  deleteResource,
  listResources,
  updateResource,
} from './api/resources.js'
import './resources.css'

const TYPES = ['ROOM', 'LAB', 'EQUIPMENT']
const STATUSES = ['ACTIVE', 'OUT_OF_SERVICE']

function isBackendUnreachableMessage(msg) {
  if (!msg || typeof msg !== 'string') return false
  return (
    msg.includes('Cannot reach the API') ||
    msg.includes('Failed to fetch') ||
    msg.includes('network error') ||
    msg.includes('ECONNREFUSED') ||
    msg.includes('Request failed: 502') ||
    msg.includes('Request failed: 503') ||
    msg.includes('Request failed: 504') ||
    msg.includes('Bad Gateway')
  )
}

function emptyForm() {
  return {
    name: '',
    type: 'ROOM',
    capacity: '',
    location: '',
    availability: '',
    status: 'ACTIVE',
  }
}

export default function ResourcesPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [filters, setFilters] = useState({
    type: '',
    location: '',
    minCapacity: '',
  })

  const [form, setForm] = useState(emptyForm())
  const [editingId, setEditingId] = useState(null)

  const effectiveFilters = useMemo(() => {
    return {
      type: filters.type || undefined,
      location: filters.location || undefined,
      minCapacity: filters.minCapacity === '' ? undefined : Number(filters.minCapacity),
    }
  }, [filters])

  async function refresh() {
    setError('')
    setLoading(true)
    try {
      const data = await listResources(effectiveFilters)
      setItems(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e?.message || 'Failed to load resources')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
    setError('')

    const payload = {
      name: form.name.trim(),
      type: form.type,
      capacity:
        form.type === 'EQUIPMENT' || form.capacity === ''
          ? null
          : Number(form.capacity),
      location: form.location.trim(),
      availability: form.availability.trim(),
      status: form.status,
    }

    try {
      if (editingId) {
        await updateResource(editingId, payload)
      } else {
        await createResource(payload)
      }
      setForm(emptyForm())
      setEditingId(null)
      await refresh()
    } catch (e2) {
      setError(e2?.message || 'Save failed')
    }
  }

  function startEdit(r) {
    setEditingId(r.id)
    setForm({
      name: r.name ?? '',
      type: r.type ?? 'ROOM',
      capacity: r.capacity ?? '',
      location: r.location ?? '',
      availability: r.availability ?? '',
      status: r.status ?? 'ACTIVE',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function onDelete(id) {
    const ok = window.confirm('Delete this resource?')
    if (!ok) return

    setError('')
    try {
      await deleteResource(id)
      if (editingId === id) {
        setEditingId(null)
        setForm(emptyForm())
      }
      await refresh()
    } catch (e) {
      setError(e?.message || 'Delete failed')
    }
  }

  const capacityDisabled = form.type === 'EQUIPMENT'

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>Resources</h1>
          <p className="muted">
            Module A – Rooms, Labs, Equipment (CRUD + filtering)
          </p>
        </div>
        <button className="btn" onClick={refresh} disabled={loading}>
          Refresh
        </button>
      </header>

      {error && isBackendUnreachableMessage(error) ? (
        <div className="backendOffline" role="status">
          <h2 className="backendOfflineTitle">Cannot reach the API (502 / connection error)</h2>
          <p className="backendOfflineLead">
            In dev, Vite proxies <code>/api</code> to Spring Boot at{' '}
            <strong>http://127.0.0.1:8080</strong>. A <strong>502 Bad Gateway</strong> or
            connection error usually means the backend is not running, still starting, crashed
            on startup (check that terminal), or MySQL is not running.
          </p>
          <p className="backendOfflineLead">
            Open a <strong>second</strong> terminal, start the API, wait until you see
            &quot;Started DemoApplication&quot; and &quot;Tomcat started on port 8080&quot;, then
            click <strong>Refresh</strong> here.
          </p>
          <p className="backendOfflineWarn">
            <strong>Important:</strong> leave that backend terminal <strong>running</strong>. If
            you press <kbd>Ctrl+C</kbd> or close it, the server stops and you will see{' '}
            <code>ECONNREFUSED</code> / 502 again (same for Postman).
          </p>
          <pre className="backendOfflineCmd">
{`cd "D:\\PAF Project\\smart-campus-system-BackEnd"
$env:DB_PASSWORD="1234"
.\\mvnw.cmd spring-boot:run
# Do not press Ctrl+C while using the UI — keep this process running.`}
          </pre>
          <p className="backendOfflineHint muted">
            Optional: double-click <code>run-backend.cmd</code> in the BackEnd project folder
            (same rule — keep the window open).
          </p>
          <p className="backendOfflineHint muted">
            Quick check: open{' '}
            <a href="http://127.0.0.1:8080/api/resources" target="_blank" rel="noreferrer">
              http://127.0.0.1:8080/api/resources
            </a>{' '}
            in the browser. You should see JSON when the backend is up.
          </p>
        </div>
      ) : error ? (
        <div className="alert">{error}</div>
      ) : null}

      <section className="card">
        <h2>{editingId ? `Edit Resource #${editingId}` : 'Create Resource'}</h2>
        <form className="form" onSubmit={onSubmit}>
          <label>
            <span>Name</span>
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="Lab A / Projector X"
              required
            />
          </label>

          <label>
            <span>Type</span>
            <select
              value={form.type}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  type: e.target.value,
                  capacity: e.target.value === 'EQUIPMENT' ? '' : f.capacity,
                }))
              }
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Capacity</span>
            <input
              type="number"
              min="0"
              value={form.capacity}
              onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))}
              placeholder={capacityDisabled ? 'N/A for equipment' : 'e.g., 30'}
              disabled={capacityDisabled}
              required={!capacityDisabled}
            />
          </label>

          <label>
            <span>Location</span>
            <input
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              placeholder="Building A - Floor 4"
              required
            />
          </label>

          <label>
            <span>Availability</span>
            <input
              value={form.availability}
              onChange={(e) =>
                setForm((f) => ({ ...f, availability: e.target.value }))
              }
              placeholder="e.g. 08:00 AM - 08:00 PM (optional; defaults to N/A if empty)"
            />
          </label>

          <label>
            <span>Status</span>
            <select
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <div className="actions">
            <button className="btn primary" type="submit" disabled={loading}>
              {editingId ? 'Save changes' : 'Create'}
            </button>
            {editingId ? (
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setEditingId(null)
                  setForm(emptyForm())
                }}
              >
                Cancel edit
              </button>
            ) : null}
          </div>
        </form>
      </section>

      <section className="card">
        <h2>Search / Filter</h2>
        <div className="filters">
          <label>
            <span>Type</span>
            <select
              value={filters.type}
              onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
            >
              <option value="">All</option>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Location</span>
            <input
              value={filters.location}
              onChange={(e) =>
                setFilters((f) => ({ ...f, location: e.target.value }))
              }
              placeholder="Building A"
            />
          </label>
          <label>
            <span>Min capacity</span>
            <input
              type="number"
              min="0"
              value={filters.minCapacity}
              onChange={(e) =>
                setFilters((f) => ({ ...f, minCapacity: e.target.value }))
              }
              placeholder="e.g., 20"
            />
          </label>
          <div className="actions">
            <button
              className="btn primary"
              onClick={refresh}
              disabled={loading}
              type="button"
            >
              Apply
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => {
                setFilters({ type: '', location: '', minCapacity: '' })
              }}
            >
              Clear
            </button>
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Results</h2>
        <div className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Capacity</th>
                <th>Location</th>
                <th>Availability</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td className="muted" colSpan={8}>
                    {loading ? 'Loading…' : 'No resources found'}
                  </td>
                </tr>
              ) : (
                items.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.name}</td>
                    <td>{r.type}</td>
                    <td>{r.capacity ?? '-'}</td>
                    <td>{r.location}</td>
                    <td>{r.availability}</td>
                    <td>{r.status}</td>
                    <td className="rowActions">
                      <button className="btn small" onClick={() => startEdit(r)}>
                        Edit
                      </button>
                      <button
                        className="btn small danger"
                        onClick={() => onDelete(r.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

