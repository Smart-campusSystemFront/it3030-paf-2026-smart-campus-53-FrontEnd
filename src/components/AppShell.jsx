import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import {
  CalendarDays,
  LayoutDashboard,
  PlusCircle,
  QrCode,
  Shield,
} from "lucide-react";

const itemBase =
  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors border border-transparent";

function navItemClass({ isActive }) {
  return `${itemBase} ${
    isActive
      ? "bg-indigo-50 text-indigo-800 border-indigo-100 shadow-sm"
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
  }`;
}

export default function AppShell() {
  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed left-0 top-0 z-30 flex h-screen w-56 flex-col border-r border-slate-200 bg-white overflow-y-auto overscroll-contain">
        <div className="p-5 border-b border-slate-100">
          <Link to="/" className="block">
            <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Smart Campus</p>
            <p className="text-base font-bold text-slate-900 leading-snug mt-0.5">Bookings</p>
            <p className="text-xs text-slate-500 mt-1">Operations hub</p>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <NavLink to="/" end className={navItemClass}>
            <LayoutDashboard size={18} className="text-indigo-600 shrink-0" />
            Dashboard
          </NavLink>
          <NavLink to="/my-bookings" className={navItemClass}>
            <CalendarDays size={18} className="text-indigo-600 shrink-0" />
            My Bookings
          </NavLink>
          <NavLink to="/booking/new" className={navItemClass}>
            <PlusCircle size={18} className="text-indigo-600 shrink-0" />
            New Booking
          </NavLink>
          <NavLink to="/booking/scanner" className={navItemClass}>
            <QrCode size={18} className="text-indigo-600 shrink-0" />
            QR Scanner
          </NavLink>
        </nav>

        <div className="p-3 border-t border-slate-100">
          <NavLink to="/admin/bookings" className={navItemClass}>
            <Shield size={18} className="text-slate-500 shrink-0" />
            Admin
          </NavLink>
        </div>
      </aside>

      <main className="min-h-screen min-w-0 bg-slate-50 pl-56">
        <Outlet />
      </main>
    </div>
  );
}
