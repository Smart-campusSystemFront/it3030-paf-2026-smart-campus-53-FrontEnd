import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listMyTickets, listTickets } from '../../api.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

function statusClass(status) {
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

function formatDate(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return String(iso)
  }
}

function truncate(text, max) {
  if (!text) return '—'
  const s = String(text).replace(/\s+/g, ' ').trim()
  if (s.length <= max) return s
  return `${s.slice(0, max - 1)}…`
}

/** Same labels as the Create Ticket priority dropdown. */
function formatPriority(p) {
  const key = String(p || '').toUpperCase()
  const map = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' }
  return map[key] || (p ? String(p) : '—')
}

/** Readable status text (Create Ticket defaults to Open after submit). */
function formatStatus(s) {
  const key = String(s || '').toUpperCase()
  const map = {
    OPEN: 'Open',
    IN_PROGRESS: 'In progress',
    RESOLVED: 'Resolved',
    CLOSED: 'Closed',
    REJECTED: 'Rejected',
  }
  return map[key] || (s ? String(s) : '—')
}

function staffRole(role) {
  return role === 'ADMIN' || role === 'TECHNICIAN'
}

/**
 * Users see only their submissions; admins and technicians see every ticket on campus.
 * @param {{ refreshToken?: number }} props Increment refreshToken to reload from API.
 */
export function TicketList({ refreshToken = 0 }) {
  const { push } = useToast()
  const { user, loading: authLoading } = useAuth()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [showReporter, setShowReporter] = useState(() => staffRole(user?.role))

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const isStaff = staffRole(user?.role)
      setShowReporter(isStaff)
      const data = isStaff ? await listTickets() : await listMyTickets()
      setRows(Array.isArray(data) ? data : [])
    } catch (e) {
      push(e.message || 'Could not load tickets')
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [push, user?.role])

  useEffect(() => {
    if (authLoading) {
      return
    }
    load()
  }, [load, refreshToken, authLoading])

  if (loading) {
    return (
      <p className="rounded-2xl border border-slate-200/90 bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-sm">
        Loading tickets…
      </p>
    )
  }

  return (
    <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm md:p-8">
      <h2 className="font-['Plus_Jakarta_Sans',system-ui,sans-serif] text-lg font-bold text-slate-900 md:text-xl">
        {showReporter ? 'All campus tickets' : 'Your tickets'}
      </h2>
      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="whitespace-nowrap px-3 py-3 text-xs font-bold uppercase tracking-wide text-slate-600 md:px-4">
                  ID
                </th>
                <th className="whitespace-nowrap px-3 py-3 text-xs font-bold uppercase tracking-wide text-slate-600 md:px-4">
                  Category
                </th>
                <th className="min-w-[140px] px-3 py-3 text-xs font-bold uppercase tracking-wide text-slate-600 md:px-4">
                  Description
                </th>
                <th className="min-w-[160px] px-3 py-3 text-xs font-bold uppercase tracking-wide text-slate-600 md:px-4">
                  Contact
                </th>
                <th className="whitespace-nowrap px-3 py-3 text-xs font-bold uppercase tracking-wide text-slate-600 md:px-4">
                  Priority
                </th>
                <th className="whitespace-nowrap px-3 py-3 text-xs font-bold uppercase tracking-wide text-slate-600 md:px-4">
                  Status
                </th>
                <th className="whitespace-nowrap px-3 py-3 text-xs font-bold uppercase tracking-wide text-slate-600 md:px-4">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-14 text-center text-sm text-slate-500">
                    {showReporter
                      ? 'No tickets in the system yet.'
                      : 'No tickets submitted yet.'}
                  </td>
                </tr>
              ) : (
                rows.map((t) => (
                  <tr key={t.id} className="transition-colors hover:bg-sky-50/60">
                    <td className="whitespace-nowrap px-3 py-3 font-medium md:px-4">
                      <Link
                        to={`/dashboard/tickets/${t.id}`}
                        className="text-sky-600 underline-offset-2 hover:text-sky-700 hover:underline"
                      >
                        #{t.id}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-800 md:px-4">{t.category}</td>
                    <td className="max-w-[280px] px-3 py-3 text-slate-700 md:px-4" title={t.description}>
                      {truncate(t.description, 120)}
                    </td>
                    <td
                      className="max-w-[220px] px-3 py-3 text-slate-700 md:max-w-[260px] md:px-4"
                      title={[t.contactName, t.contactEmail, t.contactPhone].filter(Boolean).join(' · ')}
                    >
                      <div className="font-medium text-slate-900">{t.contactName || '—'}</div>
                      <div className="mt-0.5 break-all text-xs leading-snug text-slate-500">
                        {t.contactEmail || '—'}
                      </div>
                      <div className="mt-0.5 text-xs text-slate-500">{t.contactPhone || '—'}</div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-700 md:px-4">{formatPriority(t.priority)}</td>
                    <td className="whitespace-nowrap px-3 py-3 md:px-4">
                      <span
                        className={`inline-flex rounded-md px-2.5 py-0.5 text-xs font-semibold tracking-wide ${statusClass(t.status)}`}
                      >
                        {formatStatus(t.status)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-slate-600 md:px-4">{formatDate(t.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
