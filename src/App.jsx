import React, { useMemo, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import BookingForm from "./pages/BookingForm.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import AdminBookings from "./pages/AdminBookings.jsx";

function parseJwt(token) {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

function getAuth() {
  const token = localStorage.getItem("token");
  if (!token) return { token: null, role: null };
  const claims = parseJwt(token);
  const role = claims?.role || null;
  return { token, role };
}

function Login() {
  const navigate = useNavigate();
  const [token, setToken] = useState("");

  const claims = useMemo(() => (token ? parseJwt(token) : null), [token]);
  const role = String(claims?.role || "").toUpperCase();
  const email = claims?.sub || claims?.email || "";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-2xl bg-white border border-slate-100 shadow-sm p-8 space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Login</h1>
          <p className="mt-1 text-sm text-slate-600">
            Paste your JWT token to enter the Booking UI.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700" htmlFor="jwt">
            JWT Token
          </label>
          <textarea
            id="jwt"
            aria-label="JWT token"
            value={token}
            onChange={(e) => setToken(e.target.value.trim())}
            className="w-full min-h-[140px] rounded-xl border border-slate-200 p-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            placeholder="Paste JWT here..."
          />
        </div>

        <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 text-sm">
          <p className="text-slate-600">
            <span className="font-semibold text-slate-700">Detected email:</span>{" "}
            {email || "—"}
          </p>
          <p className="text-slate-600 mt-1">
            <span className="font-semibold text-slate-700">Detected role:</span>{" "}
            {role || "—"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            localStorage.setItem("token", token);
            if (role === "ADMIN") navigate("/admin/bookings", { replace: true });
            else navigate("/my-bookings", { replace: true });
          }}
          disabled={!token || !role}
          className="w-full rounded-xl px-4 py-2 font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          Enter App
        </button>
      </div>
    </div>
  );
}

function Unauthorized() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white border border-slate-100 shadow-sm p-8 text-center">
        <h1 className="text-2xl font-semibold text-slate-900">Unauthorized</h1>
        <p className="mt-2 text-sm text-slate-600">
          You don’t have permission to access this page.
        </p>
        <button
          type="button"
          onClick={() => window.location.assign("/")}
          className="mt-6 rounded-xl px-4 py-2 font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
      <Routes>
        {/* UI-only mode: no authentication required */}
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        <Route path="/booking/new" element={<BookingForm />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />

        <Route path="/" element={<Navigate to="/my-bookings" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}
