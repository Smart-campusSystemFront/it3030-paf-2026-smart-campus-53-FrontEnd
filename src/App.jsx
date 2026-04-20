import React, { useCallback, useState } from 'react'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { IncidentForm } from './components/IncidentForm.jsx'
import { LoginBar } from './components/LoginBar.jsx'
import { NotificationPanel } from './components/NotificationPanel.jsx'
import { TicketDetail } from './components/TicketDetail.jsx'
import { TicketList } from './components/TicketList.jsx'
import { getSession } from './api.js'

function PrivateRoute({ children }) {
  const session = getSession()
  if (!session.token) {
    return <Navigate to="/" replace />
  }
  return children
}

export default function App() {
  const [, bump] = useState(0)
  const refresh = useCallback(() => bump((n) => n + 1), [])

  return (
    <div className="layout">
      <header className="topbar">
        <div className="brand">
          <Link to="/">Smart Campus</Link>
          <span className="muted small">Incident desk</span>
        </div>
        <nav className="nav">
          <Link to="/">New ticket</Link>
          <Link to="/tickets">All tickets</Link>
        </nav>
        <LoginBar onAuthChange={refresh} />
      </header>
      <main className="main">
        <Routes>
          <Route path="/" element={<IncidentForm />} />
          <Route
            path="/tickets"
            element={
              <PrivateRoute>
                <TicketList />
              </PrivateRoute>
            }
          />
          <Route path="/tickets/:id" element={<TicketDetail />} />
        </Routes>
      </main>
      <NotificationPanel />
    </div>
  )
}
