import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProtectedRoute({ children, requireRole, allowedRoles }) {
  const { user, loading } = useAuth()
  const loc = useLocation()

  if (loading) {
    return (
      <div
        style={{
          minHeight: '40vh',
          display: 'grid',
          placeItems: 'center',
          flexDirection: 'column',
          gap: 16,
          background: 'var(--bg-page, #f0f4f8)',
          color: 'var(--text-primary, #0d1b2a)',
          borderRadius: 'var(--radius-md, 12px)',
        }}
      >
        <div className="sc-spinner" />
        <p style={{ marginTop: 8, fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>
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

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}
