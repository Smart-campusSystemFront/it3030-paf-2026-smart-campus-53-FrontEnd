import React, { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  addComment,
  assignTechnician,
  deleteComment,
  getSession,
  getTicket,
  listTechnicians,
  updateComment,
  updateTicketStatus,
} from '../api.js'
import { useToast } from '../context/ToastContext.jsx'

const STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED']

function statusBadgeClass(status) {
  const s = String(status || '').toUpperCase()
  const map = {
    OPEN: 'bg-sky-100 text-sky-800 ring-1 ring-sky-200/80',
    IN_PROGRESS: 'bg-amber-100 text-amber-900 ring-1 ring-amber-200/80',
    RESOLVED: 'bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200/80',
    CLOSED: 'bg-slate-100 text-slate-700 ring-1 ring-slate-200/80',
    REJECTED: 'bg-rose-100 text-rose-800 ring-1 ring-rose-200/80',
  }
  return map[s] || 'bg-slate-100 text-slate-700 ring-1 ring-slate-200/80'
}

export function TicketDetail() {
  const { id } = useParams()
  const { push } = useToast()
  const session = getSession()
  const [ticket, setTicket] = useState(null)
  const [technicians, setTechnicians] = useState([])
  const [status, setStatus] = useState('')
  const [assignId, setAssignId] = useState('')
  const [commentText, setCommentText] = useState('')
  const [editing, setEditing] = useState(null)
  const [editText, setEditText] = useState('')

  const role = session.user?.role
  const canStaff = role === 'ADMIN' || role === 'TECHNICIAN'
  const isAdmin = role === 'ADMIN'

  const load = useMemo(
    () => async () => {
      const t = await getTicket(id)
      setTicket(t)
      setStatus(t.status)
      setAssignId(t.assignedTechnician ? String(t.assignedTechnician.id) : '')
    },
    [id],
  )

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        await load()
        if (isAdmin && !cancelled) {
          try {
            const techs = await listTechnicians()
            if (!cancelled) {
              setTechnicians(techs)
            }
          } catch {
            /* ignore if not admin session */
          }
        }
      } catch (e) {
        if (!cancelled) {
          push(e.message || 'Could not load ticket')
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [load, isAdmin, push])

  async function onStatusSave() {
    try {
      const updated = await updateTicketStatus(id, status)
      setTicket(updated)
      push('Ticket status updated')
    } catch (e) {
      push(e.message || 'Could not update status')
    }
  }

  async function onAssignSave() {
    try {
      const updated = await assignTechnician(id, Number(assignId))
      setTicket(updated)
      push('Technician assigned')
    } catch (e) {
      push(e.message || 'Could not assign technician')
    }
  }

  async function onAddComment(e) {
    e.preventDefault()
    try {
      const updated = await addComment(id, commentText)
      setTicket(updated)
      setCommentText('')
      push('Comment added')
    } catch (err) {
      push(err.message || 'Could not add comment')
    }
  }

  async function onSaveEdit(commentId) {
    try {
      const updated = await updateComment(id, commentId, editText)
      setTicket(updated)
      setEditing(null)
      push('Comment updated')
    } catch (err) {
      push(err.message || 'Could not update comment')
    }
  }

  async function onDeleteComment(commentId) {
    try {
      await deleteComment(id, commentId)
      await load()
      push('Comment deleted')
    } catch (err) {
      push(err.message || 'Could not delete comment')
    }
  }

  if (!ticket) {
    return <p className="text-sm text-slate-500">Loading…</p>
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm md:p-8">
        <p className="mb-3">
          <Link
            to="/dashboard/tickets"
            className="text-sm font-semibold text-sky-600 underline-offset-2 hover:text-sky-700 hover:underline"
          >
            ← Maintenance &amp; Incident Ticketing
          </Link>
        </p>
        <h1 className="font-['Plus_Jakarta_Sans',system-ui,sans-serif] text-2xl font-bold tracking-tight text-slate-900">
          Ticket #{ticket.id}{' '}
          <span
            className={`ml-2 inline-flex align-middle text-sm font-semibold uppercase tracking-wide ${statusBadgeClass(ticket.status)} rounded-md px-2.5 py-0.5`}
          >
            {ticket.status}
          </span>
        </h1>
        <dl className="kv">
          <div>
            <dt>Category</dt>
            <dd>{ticket.category}</dd>
          </div>
          <div>
            <dt>Priority</dt>
            <dd>{ticket.priority}</dd>
          </div>
          <div>
            <dt>Reporter</dt>
            <dd>
              {ticket.contactName} · {ticket.contactEmail} · {ticket.contactPhone}
            </dd>
          </div>
          <div>
            <dt>Technician</dt>
            <dd>{ticket.assignedTechnician?.username || 'Unassigned'}</dd>
          </div>
        </dl>
        <h2>Description</h2>
        <p className="description">{ticket.description}</p>
        {ticket.attachments?.length > 0 && (
          <>
            <h2>Evidence</h2>
            <div className="thumbs">
              {ticket.attachments.map((a) => (
                <figure key={a.id}>
                  <img src={a.url} alt={a.originalFilename} />
                  <figcaption className="small muted">{a.originalFilename}</figcaption>
                </figure>
              ))}
            </div>
          </>
        )}
        {canStaff && (
          <div className="staff-actions">
            <h2>Workflow</h2>
            <div className="row">
              <label>
                Status
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" onClick={onStatusSave}>
                Update status
              </button>
            </div>
          </div>
        )}
        {isAdmin && (
          <div className="staff-actions">
            <h2>Assignment</h2>
            <div className="row">
              <label>
                Technician
                <select value={assignId} onChange={(e) => setAssignId(e.target.value)}>
                  <option value="">Select…</option>
                  {technicians.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.username} ({u.email})
                    </option>
                  ))}
                </select>
              </label>
              <button type="button" onClick={onAssignSave} disabled={!assignId}>
                Assign
              </button>
            </div>
          </div>
        )}
      </section>
      <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm md:p-8">
        <h2 className="font-['Plus_Jakarta_Sans',system-ui,sans-serif] text-lg font-bold text-slate-900">Comments</h2>
        {session.token ? (
          <form className="form inline" onSubmit={onAddComment}>
            <textarea
              rows={3}
              required
              placeholder="Add an update or question"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit">Post comment</button>
          </form>
        ) : (
          <p className="muted">Sign in to add comments.</p>
        )}
        <ul className="comments">
          {ticket.comments?.map((c) => {
            const mine = session.user && c.authorId === session.user.id
            const canModify = mine || role === 'ADMIN'
            return (
              <li key={c.id} className="comment">
                <div className="comment-head">
                  <strong>{c.authorUsername}</strong>
                  <span className="muted small">
                    {new Date(c.createdAt).toLocaleString()}
                  </span>
                </div>
                {editing === c.id ? (
                  <div className="stack">
                    <textarea
                      rows={3}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <div className="row">
                      <button type="button" onClick={() => onSaveEdit(c.id)}>
                        Save
                      </button>
                      <button type="button" className="ghost" onClick={() => setEditing(null)}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p>{c.text}</p>
                )}
                {canModify && editing !== c.id && (
                  <div className="row">
                    <button
                      type="button"
                      className="ghost"
                      onClick={() => {
                        setEditing(c.id)
                        setEditText(c.text)
                      }}
                    >
                      Edit
                    </button>
                    <button type="button" className="ghost danger" onClick={() => onDeleteComment(c.id)}>
                      Delete
                    </button>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </section>
    </div>
  )
}
