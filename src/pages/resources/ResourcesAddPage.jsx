import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createResource } from '../../api/resources.js'
import { emptyForm, isBackendUnreachableMessage } from './resourceConstants.js'
import ResourceFormFields from './ResourceFormFields.jsx'
import '../../resources.css'

export default function ResourcesAddPage() {
  const nav = useNavigate()
  const [form, setForm] = useState(emptyForm())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

    setLoading(true)
    try {
      await createResource(payload)
      setForm(emptyForm())
      nav('/resources/browse')
    } catch (e2) {
      setError(e2?.message || 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1>Add resource</h1>
          <p className="muted" style={{ margin: '6px 0 0', fontSize: 13 }}>
            Create a new room, lab, or equipment record. After saving you will return to the browse list.
          </p>
        </div>
      </header>

      {error && isBackendUnreachableMessage(error) ? (
        <div className="backendOffline" role="status">
          <h2 className="backendOfflineTitle">Cannot reach the API</h2>
          <p className="backendOfflineLead">Start Spring Boot on port 8080 and try again.</p>
        </div>
      ) : error ? (
        <div className="alert">{error}</div>
      ) : null}

      <section className="card">
        <h2>Create resource</h2>
        <form className="form" onSubmit={onSubmit}>
          <ResourceFormFields form={form} setForm={setForm} loading={loading} editingId={null} />
        </form>
      </section>
    </div>
  )
}
