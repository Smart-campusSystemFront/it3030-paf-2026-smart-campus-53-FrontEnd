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
}
