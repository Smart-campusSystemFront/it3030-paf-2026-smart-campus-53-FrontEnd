import React, { useEffect, useRef, useState } from 'react'
import { listNotifications } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export function NotificationPanel() {
  const { push } = useToast()
  const { token } = useAuth()
  const [items, setItems] = useState([])
  const seen = useRef(new Set())
  const initialPoll = useRef(true)

  useEffect(() => {
    if (!token) {
      setItems([])
      seen.current = new Set()
      initialPoll.current = true
      return undefined
    }
    let cancelled = false
    const tick = async () => {
      try {
        const data = await listNotifications()
        if (cancelled) {
          return
        }
        setItems(data)
        for (const n of data) {
          if (!seen.current.has(n.id)) {
            seen.current.add(n.id)
            if (!initialPoll.current) {
              push(n.message)
            }
          }
        }
        initialPoll.current = false
      } catch {
        /* ignore polling errors */
      }
    }
    tick()
    const id = setInterval(tick, 20000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
  }, [token, push])

  if (!token) {
    return null
  }

  return (
    <aside className="panel notifications">
      <h2>In-app notifications</h2>
      {items.length === 0 ? (
        <p className="muted small">No notifications yet.</p>
      ) : (
        <ul>
          {items.map((n) => (
            <li key={n.id} className={n.read ? 'read' : ''}>
              <div className="small muted">{new Date(n.createdAt).toLocaleString()}</div>
              <div>{n.message}</div>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}
