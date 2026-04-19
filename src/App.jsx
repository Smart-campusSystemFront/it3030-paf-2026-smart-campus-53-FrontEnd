import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import UserDashboardLayout from './components/UserDashboardLayout.jsx'
import AdminDashboardLayout from './components/AdminDashboardLayout.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import OAuthCallback from './pages/OAuthCallback.jsx'
import UserDashboardOverview from './pages/dashboard/Overview.jsx'
import UserTickets from './pages/dashboard/Tickets.jsx'
import AdminOverview from './pages/admin/Overview.jsx'
import AdminTickets from './pages/admin/Tickets.jsx'
import Profile from './pages/Profile.jsx'
import AdminUsers from './pages/AdminUsers.jsx'
import LandingPage from './pages/LandingPage.jsx'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
          <Route element={<Layout />}>
            <Route index element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/callback" element={<OAuthCallback />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserDashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<UserDashboardOverview />} />
              <Route path="tickets" element={<UserTickets />} />
            </Route>
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'TECHNICIAN']}>
                  <AdminDashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<AdminOverview />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="tickets" element={<AdminTickets />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
      </Routes>
    </AuthProvider>
  )
}
