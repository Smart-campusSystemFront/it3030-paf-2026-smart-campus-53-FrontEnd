import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import UserDashboardLayout from './components/UserDashboardLayout.jsx'
import AdminDashboardLayout from './components/AdminDashboardLayout.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import OAuthCallback from './pages/OAuthCallback.jsx'
import UserDashboardOverview from './pages/dashboard/Overview.jsx'
import UserTickets from './pages/dashboard/Tickets.jsx'
import MyBookings from './pages/MyBookings.jsx'
import BookingForm from './pages/BookingForm.jsx'
import BookingDashboard from './pages/BookingDashboard.jsx'
import BookingScanner from './pages/BookingScanner.jsx'
import AdminBookings from './pages/AdminBookings.jsx'
import BookingsSectionLayout from './components/BookingsSectionLayout.jsx'
import AdminOverview from './pages/admin/Overview.jsx'
import AdminTickets from './pages/admin/Tickets.jsx'
import AdminNotifications from './pages/admin/Notifications.jsx'
import Profile from './pages/Profile.jsx'
import AdminUsers from './pages/AdminUsers.jsx'
import LandingPage from './pages/LandingPage.jsx'

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
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
            <Route path="/dashboard/bookings/dashboard" element={<Navigate to="/bookings" replace />} />
            <Route path="/dashboard/bookings/my" element={<Navigate to="/bookings/my" replace />} />
            <Route path="/dashboard/bookings/new" element={<Navigate to="/bookings/new" replace />} />
            <Route path="/dashboard/bookings/scanner" element={<Navigate to="/bookings/scanner" replace />} />
            <Route path="/dashboard/bookings" element={<Navigate to="/bookings" replace />} />
            <Route
              path="/bookings"
              element={
                <ProtectedRoute>
                  <BookingsSectionLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<BookingDashboard />} />
              <Route path="my" element={<MyBookings />} />
              <Route path="new" element={<BookingForm />} />
              <Route path="scanner" element={<BookingScanner />} />
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
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="tickets" element={<AdminTickets />} />
              <Route path="notifications" element={<AdminNotifications />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </NotificationProvider>
    </AuthProvider>
  )
}
