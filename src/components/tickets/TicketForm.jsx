import React, { useState } from 'react'
import { createTicket } from '../../api.js'
import { useToast } from '../../context/ToastContext.jsx'

const CATEGORIES = [
  'Equipment malfunction',
  'Room issue',
  'Network / IT',
  'Safety concern',
  'Other',
]

const inputClass =
  'mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20'

const labelClass = 'text-sm font-semibold text-slate-700'

/**
 * Ticket creation form (same fields as previous incident form).
 * @param {{ onSuccess?: (ticket: object) => void, onCancel?: () => void, hideIntro?: boolean }} props
 */
export function TicketForm({ onSuccess, onCancel, hideIntro = false }) {
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
      onSuccess?.(ticket)
    } catch (err) {
      push(err.message || 'Could not submit ticket')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      {!hideIntro && (
        <>
          <h2 className="font-['Plus_Jakarta_Sans',system-ui,sans-serif] text-lg font-bold text-slate-900 md:text-xl">
            Report an incident
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 md:text-[15px]">
            Describe the problem, set priority, and optionally attach up to three photos as evidence.
          </p>
        </>
      )}

      <form className={`space-y-6 ${hideIntro ? '' : 'mt-6'}`} onSubmit={onSubmit}>
        <div className="grid gap-5 md:grid-cols-12">
          <label className={`md:col-span-3 ${labelClass}`}>
            Category
            <select
              className={`${inputClass} cursor-pointer appearance-none bg-[length:1rem] bg-[right_0.65rem_center] bg-no-repeat pr-9`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
              }}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className={`md:col-span-6 ${labelClass}`}>
            Description
            <textarea
              required
              rows={5}
              className={`${inputClass} min-h-[120px] resize-y`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What happened? Where? Any immediate risks?"
            />
          </label>
          <label className={`md:col-span-3 ${labelClass}`}>
            Priority
            <select
              className={`${inputClass} cursor-pointer appearance-none bg-[length:1rem] bg-[right_0.65rem_center] bg-no-repeat pr-9`}
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`,
              }}
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>
          </label>
        </div>

        <fieldset className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 md:p-5">
          <legend className="px-1 text-sm font-bold text-slate-800">Contact details</legend>
          <div className="mt-3 grid gap-4 sm:grid-cols-3">
            <label className={labelClass}>
              Name
              <input
                required
                className={inputClass}
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
              />
            </label>
            <label className={labelClass}>
              Email
              <input
                required
                type="email"
                className={inputClass}
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </label>
            <label className={labelClass}>
              Phone
              <input
                required
                className={inputClass}
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </label>
          </div>
        </fieldset>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <label className={`flex-1 ${labelClass}`}>
            Evidence images (max 3)
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onFilesChange}
              className="mt-1.5 block w-full cursor-pointer text-sm text-slate-600 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
            />
            {images.length > 0 && (
              <span className="mt-1 block text-xs text-slate-500">{images.length} file(s) selected</span>
            )}
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 pt-5">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-11 items-center justify-center rounded-lg bg-slate-800 px-8 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Submitting…' : 'Submit ticket'}
          </button>
        </div>
      </form>
    </div>
  )
}
