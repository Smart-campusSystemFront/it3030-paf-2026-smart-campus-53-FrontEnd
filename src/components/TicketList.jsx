import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { listTickets } from '../api.js'
import { useToast } from '../context/ToastContext.jsx'

export function TicketList() {
  const { push } = useToast()
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await listTickets()
        if (!cancelled) {
          setRows(data)
        }
      } catch (e) {
        if (!cancelled) {
          push(e.message || 'Could not load tickets')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [push])

  if (loading) {
    return <p className="muted">Loading tickets…</p>
  }

  return (
    <section className="panel">
      <h1>Tickets</h1>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Reporter</th>
              <th>Technician</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((t) => (
              <tr key={t.id}>
                <td>
                  <Link to={`/tickets/${t.id}`}>#{t.id}</Link>
                </td>
                <td>{t.category}</td>
                <td>
                  <span className={`pill status-${t.status}`}>{t.status}</span>
                </td>
                <td>{t.priority}</td>
                <td>{t.contactName}</td>
                <td>{t.assignedTechnician?.username || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
