import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { deleteResource, listResources, updateResource } from '../../api/resources.js'
import { emptyForm, isBackendUnreachableMessage, TYPES } from './resourceConstants.js'
import ResourceFormFields from './ResourceFormFields.jsx'
import '../../resources.css'

export default function ResourcesBrowsePage() {
  const { hash } = useLocation()
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

  useEffect(() => {
    if (hash === '#filter') {
      document.getElementById('resource-filter')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [hash])

  async function onSubmit(e) {
    e.preventDefault()
    if (!editingId) return

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
      await updateResource(editingId, payload)
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

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>Resources</h1>
          <p className="muted" style={{ margin: '6px 0 0', fontSize: 13 }}>
            Filter, review, edit, or remove campus resources.
          </p>
        </div>
        <button className="btn" onClick={refresh} disabled={loading} type="button">
          Refresh
        </button>
      </header>

      {error && isBackendUnreachableMessage(error) ? (
        <div className="backendOffline" role="status">
          <h2 className="backendOfflineTitle">Cannot reach the API (502 / connection error)</h2>
          <p className="backendOfflineLead">
            In dev, Vite proxies <code>/api</code> to Spring Boot at <strong>http://127.0.0.1:8080</strong>. Start the
            backend, then click <strong>Refresh</strong>.
          </p>
          <p className="backendOfflineHint muted">
            Quick check:{' '}
            <a href="http://127.0.0.1:8080/api/resources" target="_blank" rel="noreferrer">
              http://127.0.0.1:8080/api/resources
            </a>
          </p>
        </div>
      ) : error ? (
        <div className="alert">{error}</div>
      ) : null}

      {editingId ? (
        <section className="card">
          <h2>Edit resource #{editingId}</h2>
          <form className="form" onSubmit={onSubmit}>
            <ResourceFormFields
              form={form}
              setForm={setForm}
              loading={loading}
              editingId={editingId}
              onCancelEdit={() => {
                setEditingId(null)
                setForm(emptyForm())
              }}
            />
          </form>
        </section>
      ) : null}

      <section id="resource-filter" className="card">
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
              onChange={(e) => setFilters((f) => ({ ...f, location: e.target.value }))}
              placeholder="Building A"
            />
          </label>
          <label>
            <span>Min capacity</span>
            <input
              type="number"
              min="0"
              value={filters.minCapacity}
              onChange={(e) => setFilters((f) => ({ ...f, minCapacity: e.target.value }))}
              placeholder="e.g., 20"
            />
          </label>
          <div className="actions">
            <button className="btn primary" onClick={refresh} disabled={loading} type="button">
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
                      <button className="btn small" type="button" onClick={() => startEdit(r)}>
                        Edit
                      </button>
                      <button className="btn small danger" type="button" onClick={() => onDelete(r.id)}>
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
