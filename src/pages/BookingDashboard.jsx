import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowRight,
  BarChart3,
  CalendarPlus,
  CheckCircle2,
  Clock,
  Layers,
  QrCode,
  Sparkles,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { getBookingStats, getBookings } from "../api/bookingApi";
import BookingStatusBadge from "../components/BookingStatusBadge";
import HourlyBookingChart from "../components/HourlyBookingChart";
import { format } from "date-fns";

function countBy(list) {
  const c = { PENDING: 0, APPROVED: 0, REJECTED: 0, CANCELLED: 0 };
  for (const b of list) {
    if (b?.status && c[b.status] != null) c[b.status] += 1;
  }
  return c;
}

function StatCard({ icon: Icon, label, value, hint, accent }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-5 flex gap-4 transition-shadow hover:shadow-md">
      <div
        className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${accent}`}
      >
        <Icon size={22} className="text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
        <p className="mt-1 text-2xl font-bold text-slate-900 tabular-nums">{value}</p>
        {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
      </div>
    </div>
  );
}

export default function BookingDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adminStats, setAdminStats] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const mine = await getBookings({});
        if (!mounted) return;
        setBookings(Array.isArray(mine) ? mine : []);
        try {
          const s = await getBookingStats();
          if (mounted) setAdminStats(s);
        } catch {
          if (mounted) setAdminStats(null);
        }
      } catch (e) {
        if (!mounted) return;
        toast.error(e?.response?.data?.message || "Could not load dashboard");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const mineCounts = useMemo(() => countBy(bookings), [bookings]);
  const totalMine = bookings.length;
  const recent = useMemo(() => bookings.slice(0, 8), [bookings]);

  const totalAll = adminStats?.totalBookings ?? totalMine;
  const pending = adminStats?.pendingCount ?? mineCounts.PENDING;
  const approved = adminStats?.approvedCount ?? mineCounts.APPROVED;
  const rejected = adminStats?.rejectedCount ?? mineCounts.REJECTED;

  const cancelled = adminStats?.cancelledCount ?? mineCounts.CANCELLED;
  const statusTotal = Math.max(1, pending + approved + rejected + cancelled);
  const mix = useMemo(
    () => [
      { key: "PENDING", label: "Pending", count: pending, color: "bg-amber-500" },
      { key: "APPROVED", label: "Approved", count: approved, color: "bg-emerald-500" },
      { key: "REJECTED", label: "Rejected", count: rejected, color: "bg-rose-500" },
      { key: "CANCELLED", label: "Cancelled", count: cancelled, color: "bg-slate-400" },
    ],
    [pending, approved, rejected, cancelled]
  );

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
      <header className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6 lg:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 text-indigo-700 px-3 py-1 text-xs font-semibold border border-indigo-100">
            <Sparkles size={14} />
            Live overview
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
            Booking operations dashboard
          </h1>
          <p className="text-slate-600 text-sm max-w-xl leading-relaxed">
            Track requests, approvals, and room usage in one place. Use the sidebar to jump between booking tools.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <Link
            to="/booking/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors"
          >
            <CalendarPlus size={18} />
            New booking
            <ArrowRight size={16} />
          </Link>
          <Link
            to="/booking/scanner"
            className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-50 transition-colors"
          >
            <QrCode size={18} />
            QR scanner
          </Link>
        </div>
      </header>

      <section>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">Key metrics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard
            icon={Layers}
            label={adminStats ? "Total bookings" : "In your list"}
            value={loading ? "—" : totalAll}
            hint={adminStats ? "All time (system)" : "From current dataset"}
            accent="bg-indigo-600"
          />
          <StatCard
            icon={Clock}
            label="Pending"
            value={loading ? "—" : pending}
            hint="Awaiting review"
            accent="bg-amber-500"
          />
          <StatCard
            icon={CheckCircle2}
            label="Approved"
            value={loading ? "—" : approved}
            hint="Confirmed reservations"
            accent="bg-emerald-600"
          />
          <StatCard
            icon={XCircle}
            label="Rejected"
            value={loading ? "—" : rejected}
            hint="Declined requests"
            accent="bg-rose-600"
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-2 text-slate-900 font-semibold">
            <BarChart3 size={18} className="text-indigo-600" />
            Status mix
          </div>
          <p className="text-sm text-slate-600 mt-1">Share of bookings by status.</p>
          <ul className="mt-5 space-y-4">
            {mix.map((row) => {
              const pct = Math.round((row.count / statusTotal) * 100);
              return (
                <li key={row.key}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">{row.label}</span>
                    <span className="text-slate-500 tabular-nums">
                      {row.count} <span className="text-slate-400">({pct}%)</span>
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${row.color}`}
                      style={{ width: `${Math.max(row.count ? 4 : 0, pct)}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="lg:col-span-3 rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-2 text-slate-900 font-semibold">
            <TrendingUp size={18} className="text-indigo-600" />
            Booking hours
          </div>
          <p className="text-sm text-slate-600 mt-1">
            Every hour in the window is shown; peak hours (busiest) are highlighted in violet.
          </p>
          <div className="mt-4">
            <HourlyBookingChart bookings={bookings} peakHours={adminStats?.peakHours ?? null} />
          </div>
        </div>
      </div>

      <section className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Recent bookings</h2>
            <p className="text-sm text-slate-600 mt-0.5">Latest updates across your dataset.</p>
          </div>
          <Link
            to="/my-bookings"
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1"
          >
            View all
            <ArrowRight size={16} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs font-semibold text-slate-600 uppercase tracking-wide">
                <th className="px-6 py-3">Resource</th>
                <th className="px-6 py-3">Schedule</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={3} className="px-6 py-4">
                      <div className="h-4 bg-slate-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))}
              {!loading &&
                recent.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-900">{b.resourceName}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{b.resourceLocation}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-700 whitespace-nowrap">
                      {(() => {
                        try {
                          return format(new Date(b.startTime), "EEE d MMM yyyy · p");
                        } catch {
                          return "—";
                        }
                      })()}
                    </td>
                    <td className="px-6 py-4">
                      <BookingStatusBadge status={b.status} size="sm" />
                    </td>
                  </tr>
                ))}
              {!loading && recent.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-slate-600">
                    No bookings yet.{" "}
                    <Link to="/booking/new" className="font-semibold text-indigo-600 hover:underline">
                      Create one
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
