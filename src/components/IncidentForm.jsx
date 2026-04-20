import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createTicket } from '../api.js'
import { useToast } from '../context/ToastContext.jsx'

const CATEGORIES = [
  'Equipment malfunction',
  'Room issue',
  'Network / IT',
  'Safety concern',
  'Other',
]

export function IncidentForm() {
  const navigate = useNavigate()
  const { push } = useToast()
  const [category, setCategory] = useState(CATEGORIES[0])
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('MEDIUM')
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [images, setImages] = useState([])
  const [submitting, setSubmitting] = useState(false)

  function onFilesChange(e) {
    const files = Array.from(e.target.files || [])
    if (files.length > 3) {
      push('You can attach at most 3 images.')
      e.target.value = ''
      return
    }
    setImages(files)
  }

  async function onSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('category', category)
      fd.append('description', description)
      fd.append('priority', priority)
      fd.append('contactName', contactName)
      fd.append('contactEmail', contactEmail)
      fd.append('contactPhone', contactPhone)
      images.forEach((file) => fd.append('images', file))
      const ticket = await createTicket(fd)
      push(`Ticket #${ticket.id} submitted successfully.`)
      navigate(`/tickets/${ticket.id}`)
    } catch (err) {
      push(err.message || 'Could not submit ticket')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="panel">
      <h1>Report an incident</h1>
      <p className="muted">
        Describe the problem, set priority, and optionally attach up to three photos as evidence.
      </p>
      <form className="form" onSubmit={onSubmit}>
        <label>
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label>
          Description
          <textarea
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What happened? Where? Any immediate risks?"
          />
        </label>
        <label>
          Priority
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
        </label>
        <fieldset className="grid-3">
          <legend>Contact details</legend>
          <label>
            Name
            <input required value={contactName} onChange={(e) => setContactName(e.target.value)} />
          </label>
          <label>
            Email
            <input
              required
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
            />
          </label>
          <label>
            Phone
            <input required value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
          </label>
        </fieldset>
        <label>
          Evidence images (max 3)
          <input type="file" accept="image/*" multiple onChange={onFilesChange} />
        </label>
        {images.length > 0 && (
          <p className="muted small">{images.length} file(s) selected</p>
        )}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting…' : 'Submit ticket'}
        </button>
      </form>
    </section>
  )
}
