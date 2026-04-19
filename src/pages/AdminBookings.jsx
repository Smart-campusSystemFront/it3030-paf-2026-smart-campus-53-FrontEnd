import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  approveBooking,
  exportBookingsCsv,
  getActiveResources,
  getBookingStats,
  rejectBooking,
} from "../api/bookingApi";
import { useBookings } from "../hooks/useBookings";
import BookingStatusBadge from "../components/BookingStatusBadge";
import HourlyBookingChart from "../components/HourlyBookingChart";
import ConfirmModal from "../components/ConfirmModal";
import RejectModal from "../components/RejectModal";
import { format } from "date-fns";

const PAGE_SIZE = 10;

function fmtDate(dt) {
  try {
    return format(new Date(dt), "EEE, dd MMM yyyy");
  } catch {
    return "—";
  }
}
function fmtTimeRange(start, end) {
  try {
    return `${format(new Date(start), "p")} – ${format(new Date(end), "p")}`;
  } catch {
    return "—";
  }
}
function initials(nameOrEmail) {
  const s = (nameOrEmail || "").trim();
  if (!s) return "?";
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function SkeletonRow() {
  return (
    <tr className="border-t border-slate-100">
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="p-4">
          <div className="h-4 w-full bg-slate-200 animate-pulse rounded-lg" />
        </td>
      ))}
    </tr>
  );
}

export default function AdminBookings() {
  const [filters, setFilters] = useState({
    status: "",
    date: "",
    from: "",
    to: "",
    resourceId: "",
    search: "",
  });
  const { bookings, loading, error, fetchBookings, updateInList, setBookings } =
    useBookings(filters);

  const [statsLoading, setStatsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBookingsToday: 0,
    totalBookings: 0,
    pendingCount: 0,
    approvedCount: 0,
    rejectedCount: 0,
    cancelledCount: 0,
    mostBookedResourceName: "—",
    peakHours: [],
  });

  const [resources, setResources] = useState([]);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [page, setPage] = useState(1);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const r = await getActiveResources();
        if (mounted) setResources(Array.isArray(r) ? r : []);
      } catch {
        if (mounted) setResources([]);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      setStatsLoading(true);
      try {
        const s = await getBookingStats();
        if (!mounted) return;
        setStats({
          totalBookingsToday: s?.totalBookingsToday ?? 0,
          totalBookings: s?.totalBookings ?? 0,
          pendingCount: s?.pendingCount ?? 0,
          approvedCount: s?.approvedCount ?? 0,
          rejectedCount: s?.rejectedCount ?? 0,
          cancelledCount: s?.cancelledCount ?? 0,
          mostBookedResourceName: s?.mostBookedResourceName || "—",
          peakHours: Array.isArray(s?.peakHours) ? s.peakHours : [],
        });
      } catch (e) {
        if (!mounted) return;
        toast.error(e?.response?.data?.message || "Failed to load stats");
      } finally {
        if (mounted) setStatsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredClient = useMemo(() => {
    const search = (filters.search || "").trim().toLowerCase();
    if (!search) return bookings;
    return bookings.filter((b) => {
      const hay = `${b.userName || ""} ${b.userEmail || ""}`.toLowerCase();
      return hay.includes(search);
    });
  }, [bookings, filters.search]);

  const total = filteredClient.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const endIdx = Math.min(total, startIdx + PAGE_SIZE);
  const pageItems = filteredClient.slice(startIdx, endIdx);

  React.useEffect(() => {
    setPage(1);
  }, [filters.status, filters.date, filters.from, filters.to, filters.resourceId, filters.search]);

  async function refresh() {
    await fetchBookings(filters);
  }

  async function doApprove() {
    if (!selected?.id) return;
    setActionLoading(true);
    try {
      const updated = await approveBooking(selected.id);
      updateInList(selected.id, updated);
      toast.success("Booking approved");
      setConfirmOpen(false);
      setSelected(null);
      setStats((s) => ({
        ...s,
        pendingCount: Math.max(0, (s.pendingCount || 0) - 1),
        approvedCount: (s.approvedCount || 0) + 1,
      }));
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to approve booking");
    } finally {
      setActionLoading(false);
    }
  }

  async function doReject(reason) {
    if (!selected?.id) return;
    setActionLoading(true);
    try {
      const updated = await rejectBooking(selected.id, reason);
      updateInList(selected.id, updated);
      toast.success("Booking rejected");
      setRejectOpen(false);
      setSelected(null);
      setStats((s) => ({
        ...s,
        pendingCount: Math.max(0, (s.pendingCount || 0) - 1),
      }));
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to reject booking");
    } finally {
      setActionLoading(false);
    }
  }

  const approvalRate = useMemo(() => {
    const pending = stats.pendingCount || 0;
    const approved = stats.approvedCount || 0;
    const denom = pending + approved;
    if (!denom) return 0;
    return Math.round((approved / denom) * 100);
  }, [stats.pendingCount, stats.approvedCount]);

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Admin Bookings</h1>
          <p className="mt-1 text-sm text-slate-600">Review booking requests and manage approvals.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">Total (all time)</p>
              <Calendar size={18} className="text-indigo-600" />
            </div>
            <p className="mt-3 text-3xl font-semibold text-slate-900">
              {statsLoading ? "—" : stats.totalBookings}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Today created:{" "}
              <span className="font-semibold text-slate-700">{statsLoading ? "—" : stats.totalBookingsToday}</span>
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">Pending Approval</p>
              <div className="flex items-center gap-2">
                {stats.pendingCount > 0 && <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />}
                <Clock size={18} className="text-amber-600" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-semibold text-slate-900">
              {statsLoading ? "—" : stats.pendingCount}
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">Approved</p>
              <CheckCircle size={18} className="text-emerald-600" />
            </div>
            <p className="mt-3 text-3xl font-semibold text-slate-900">
              {statsLoading ? "—" : stats.approvedCount}
            </p>
            <p className="mt-2 text-xs text-slate-500">
              Rejected:{" "}
              <span className="font-semibold text-slate-700">{statsLoading ? "—" : stats.rejectedCount}</span> ·
              Cancelled:{" "}
              <span className="font-semibold text-slate-700">{statsLoading ? "—" : stats.cancelledCount}</span>
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">Most Booked</p>
              <TrendingUp size={18} className="text-violet-600" />
            </div>
            <p className="mt-3 text-lg font-semibold text-slate-900 line-clamp-2">
              {statsLoading ? "—" : stats.mostBookedResourceName}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Approval rate: <span className="font-semibold text-slate-700">{approvalRate}%</span>
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-900">Peak booking hours</h2>
          <p className="text-sm text-slate-600 mt-1">
            All hourly slots in the window; violet highlights mark peak demand (from server stats when loaded).
          </p>
          <div className="mt-4">
            <HourlyBookingChart bookings={bookings} peakHours={stats.peakHours?.length ? stats.peakHours : null} />
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="statusFilter">
                Status
              </label>
              <select
                id="statusFilter"
                aria-label="Filter by status"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={filters.status}
                onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
              >
                <option value="">All</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="dateFilter">
                Single day
              </label>
              <input
                id="dateFilter"
                type="date"
                aria-label="Filter by single day"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={filters.date}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    date: e.target.value,
                    from: "",
                    to: "",
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="fromFilter">
                From
              </label>
              <input
                id="fromFilter"
                type="date"
                aria-label="Filter from date"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={filters.from}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    from: e.target.value,
                    date: "",
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="toFilter">
                To
              </label>
              <input
                id="toFilter"
                type="date"
                aria-label="Filter to date"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={filters.to}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    to: e.target.value,
                    date: "",
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="resourceFilter">
                Resource
              </label>
              <select
                id="resourceFilter"
                aria-label="Filter by resource"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={filters.resourceId}
                onChange={(e) => setFilters((f) => ({ ...f, resourceId: e.target.value }))}
              >
                <option value="">All resources</option>
                {resources.map((r) => (
                  <option key={r?.resourceId ?? r?.id} value={String(r?.resourceId ?? r?.id)}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="searchFilter">
                Search
              </label>
              <input
                id="searchFilter"
                type="text"
                placeholder="User name or email..."
                aria-label="Search by user name or email"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={filters.search}
                onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const cleared = { status: "", date: "", from: "", to: "", resourceId: "", search: "" };
                setFilters(cleared);
                setBookings([]);
                fetchBookings(cleared);
              }}
              className="rounded-xl px-4 py-2 font-medium text-slate-700 hover:bg-slate-50 transition-all border border-slate-200"
            >
              Clear Filters
            </button>
            <button
              type="button"
              onClick={refresh}
              className="rounded-xl px-4 py-2 font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={() => exportBookingsCsv(filteredClient, "admin-bookings.csv")}
              className="rounded-xl px-4 py-2 font-medium text-indigo-800 bg-indigo-50 hover:bg-indigo-100 transition-all border border-indigo-100"
            >
              Export CSV
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[1100px] w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="text-left text-xs font-semibold text-slate-600 px-4 py-3">Resource</th>
                  <th className="text-left text-xs font-semibold text-slate-600 px-4 py-3">User</th>
                  <th className="text-left text-xs font-semibold text-slate-600 px-4 py-3">Date &amp; Time</th>
                  <th className="text-left text-xs font-semibold text-slate-600 px-4 py-3">Purpose</th>
                  <th className="text-center text-xs font-semibold text-slate-600 px-4 py-3">Attendees</th>
                  <th className="text-left text-xs font-semibold text-slate-600 px-4 py-3">Status</th>
                  <th className="text-right text-xs font-semibold text-slate-600 px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading && Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

                {!loading && error && (
                  <tr>
                    <td colSpan={7} className="p-6">
                      <div className="rounded-xl border border-rose-100 bg-rose-50 p-4">
                        <p className="text-sm font-semibold text-rose-700">Couldn’t load bookings</p>
                        <p className="mt-1 text-sm text-rose-700/90">{error}</p>
                        <button
                          type="button"
                          onClick={() => fetchBookings(filters)}
                          className="mt-4 rounded-xl px-4 py-2 font-medium text-white bg-rose-600 hover:bg-rose-700 transition-all"
                        >
                          Try Again
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

                {!loading && !error && pageItems.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-10 text-center text-slate-600">
                      No bookings found
                    </td>
                  </tr>
                )}

                {!loading &&
                  !error &&
                  pageItems.map((b) => (
                    <tr key={b.id} className="border-t border-slate-100 hover:bg-slate-50/60 transition-all">
                      <td className="p-4">
                        <p className="text-sm font-semibold text-slate-900">{b.resourceName}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{b.resourceLocation}</p>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-semibold text-slate-700">
                            {initials(b.userName || b.userEmail)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">{b.userName || "—"}</p>
                            <p className="text-xs text-slate-500">{b.userEmail || "—"}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <p className="text-sm font-semibold text-slate-900">{fmtDate(b.startTime)}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{fmtTimeRange(b.startTime, b.endTime)}</p>
                      </td>

                      <td className="p-4">
                        <span className="text-sm text-slate-700" title={b.purpose}>
                          {(b.purpose || "").slice(0, 40)}
                          {(b.purpose || "").length > 40 ? "…" : ""}
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        <span className="text-sm font-semibold text-slate-900">{b.expectedAttendees ?? "—"}</span>
                      </td>

                      <td className="p-4">
                        <BookingStatusBadge status={b.status} size="sm" />
                      </td>

                      <td className="p-4 text-right">
                        {b.status === "PENDING" ? (
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              className="rounded-xl px-3 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition-all"
                              aria-label="Approve booking"
                              onClick={() => {
                                setSelected(b);
                                setConfirmOpen(true);
                              }}
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              className="rounded-xl px-3 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-all"
                              aria-label="Reject booking"
                              onClick={() => {
                                setSelected(b);
                                setRejectOpen(true);
                              }}
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {!loading && !error && total > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-t border-slate-100 bg-white">
              <p className="text-sm text-slate-600">
                Showing <span className="font-semibold text-slate-900">{startIdx + 1}</span>–
                <span className="font-semibold text-slate-900">{endIdx}</span> of{" "}
                <span className="font-semibold text-slate-900">{total}</span> bookings
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage <= 1}
                  className="rounded-xl px-3 py-2 text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                  Prev
                </button>

                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage >= totalPages}
                  className="rounded-xl px-3 py-2 text-sm font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
                  aria-label="Next page"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        <ConfirmModal
          isOpen={confirmOpen}
          title="Approve booking?"
          message="This will approve the booking request."
          confirmText="Approve"
          confirmColor="indigo"
          loading={actionLoading}
          onCancel={() => {
            if (actionLoading) return;
            setConfirmOpen(false);
            setSelected(null);
          }}
          onConfirm={doApprove}
        />

        <RejectModal
          isOpen={rejectOpen}
          loading={actionLoading}
          onCancel={() => {
            if (actionLoading) return;
            setRejectOpen(false);
            setSelected(null);
          }}
          onReject={doReject}
        />
      </div>
    </div>
  );
}

