import { STATUSES, TYPES } from './resourceConstants.js'

/**
 * Shared create/edit fields for campus resources.
 */
export default function ResourceFormFields({ form, setForm, loading, editingId, onCancelEdit }) {
  const capacityDisabled = form.type === 'EQUIPMENT'

  return (
    <>
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
          onChange={(e) => setForm((f) => ({ ...f, availability: e.target.value }))}
          placeholder="e.g. 08:00 AM - 08:00 PM (optional; defaults to N/A if empty)"
        />
      </label>

      <label>
        <span>Status</span>
        <select value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}>
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
        {editingId && onCancelEdit ? (
          <button className="btn" type="button" onClick={onCancelEdit}>
            Cancel edit
          </button>
        ) : null}
      </div>
    </>
  )
}
