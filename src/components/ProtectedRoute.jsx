import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children, requireRole }) {
  const { user, loading } = useAuth()
  const loc = useLocation()

  if (loading) {
    return (
      <div
        style={{
          minHeight: '50vh',
          display: 'grid',
          placeItems: 'center',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <div className="sc-spinner" />
        <p style={{ marginTop: 16, fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
          Verifying your session…
        </p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />
  }

  if (requireRole && user.role !== requireRole) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
