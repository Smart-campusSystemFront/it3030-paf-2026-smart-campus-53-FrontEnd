import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
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

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  )
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import AppShell from "./components/AppShell.jsx";
import BookingForm from "./pages/BookingForm.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import AdminBookings from "./pages/AdminBookings.jsx";
import BookingDashboard from "./pages/BookingDashboard.jsx";
import BookingScanner from "./pages/BookingScanner.jsx";

export default function App() {
  return (
    <ErrorBoundary>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3500,
          style: { borderRadius: "12px" },
        }}
      />
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<BookingDashboard />} />
          <Route path="/booking/new" element={<BookingForm />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/booking/scanner" element={<BookingScanner />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
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
