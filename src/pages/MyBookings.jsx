import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { CalendarDays, Plus } from "lucide-react";
import { cancelBookingWithReason } from "../api/bookingApi";
import { useBookings } from "../hooks/useBookings";
import BookingCard from "../components/BookingCard";
import SkeletonCard from "../components/SkeletonCard";
import CancelReasonModal from "../components/CancelReasonModal";
import BookingCalendar from "../components/BookingCalendar";

const TABS = ["All", "PENDING", "APPROVED", "REJECTED", "CANCELLED"];

function tabLabel(t) {
  if (t === "All") return "All";
  return t[0] + t.slice(1).toLowerCase();
}

function countByStatus(list) {
  const counts = { All: list.length, PENDING: 0, APPROVED: 0, REJECTED: 0, CANCELLED: 0 };
  for (const b of list) {
    if (b?.status && counts[b.status] != null) counts[b.status] += 1;
  }
  return counts;
}

export default function MyBookings() {
  const navigate = useNavigate();
  const baseFilters = useMemo(() => ({}), []);
  const { bookings, loading, error, fetchBookings, updateInList } = useBookings(baseFilters);
  const [activeTab, setActiveTab] = useState("All");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const counts = useMemo(() => countByStatus(bookings), [bookings]);

  const filtered = useMemo(() => {
    if (activeTab === "All") return bookings;
    return bookings.filter((b) => b?.status === activeTab);
  }, [bookings, activeTab]);

  async function doCancel(reason) {
    if (!selectedBooking?.id) return;
    setActionLoading(true);
    try {
      const updated = await cancelBookingWithReason(selectedBooking.id, reason);
      updateInList(selectedBooking.id, updated);
      toast.success("Booking cancelled");
      setConfirmOpen(false);
      setSelectedBooking(null);
    } catch (e) {
      toast.error(e?.response?.data?.message || "Failed to cancel booking");
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">My Bookings</h1>
            <p className="mt-1 text-sm text-slate-600">Track your requests and manage bookings.</p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/booking/new")}
            className="rounded-xl px-4 py-2 font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all inline-flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} />
            New Booking
          </button>
        </div>

        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-4">
          <div className="flex flex-wrap items-center gap-4">
            {TABS.map((t) => {
              const isActive = activeTab === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setActiveTab(t)}
                  className={`relative px-3 py-2 text-sm font-semibold transition-all ${
                    isActive ? "text-indigo-700" : "text-slate-600 hover:text-slate-800"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    {tabLabel(t)}
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                        isActive ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {counts[t] ?? 0}
                    </span>
                  </span>
                  {isActive && (
                    <span className="absolute left-3 right-3 -bottom-1 h-0.5 bg-indigo-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {error && !loading && (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-6">
            <p className="text-sm font-semibold text-rose-700">Couldn’t load bookings</p>
            <p className="mt-1 text-sm text-rose-700/90">{error}</p>
            <button
              type="button"
              onClick={() => fetchBookings({})}
              className="mt-4 rounded-xl px-4 py-2 font-medium text-white bg-rose-600 hover:bg-rose-700 transition-all"
            >
              Try Again
            </button>
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">
            {activeTab === "All" ? "All Bookings" : `${tabLabel(activeTab)} Bookings`}
          </h2>
          {!loading && !error && (
            <span className="text-sm font-semibold text-slate-600">{filtered.length} shown</span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {loading && Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}

          {!loading &&
            !error &&
            filtered.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                onCancel={(booking) => {
                  setSelectedBooking(booking);
                  setConfirmOpen(true);
                }}
              />
            ))}
        </div>

        {!loading && !error && filtered.length === 0 && (
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-10 text-center">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-indigo-50 flex items-center justify-center">
              <CalendarDays size={30} className="text-indigo-600" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              {activeTab === "All"
                ? "You haven't made any bookings yet."
                : `No ${tabLabel(activeTab)} bookings`}
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              {activeTab === "All"
                ? "Book a resource to get started."
                : "Try switching filters or create a new booking."}
            </p>
            <button
              type="button"
              onClick={() => navigate("/booking/new")}
              className="mt-6 rounded-xl px-4 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all"
            >
              Book a Resource
            </button>
          </div>
        )}

        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-2 text-slate-900 font-semibold">
            <CalendarDays size={18} className="text-indigo-600" />
            Booking Calendar
          </div>
          <p className="mt-1 text-sm text-slate-600">Click a date to start a booking.</p>
          <div className="mt-4">
            <BookingCalendar
              bookings={bookings}
              onDateClick={(date) => {
                const ymd = date.toISOString().slice(0, 10);
                navigate(`/booking/new?date=${ymd}`);
              }}
            />
          </div>
        </div>
      </div>

      <CancelReasonModal
        isOpen={confirmOpen}
        title="Cancel booking?"
        subtitle="Please tell us why you are cancelling (10–500 characters)."
        confirmText="Cancel booking"
        loading={actionLoading}
        onClose={() => {
          if (actionLoading) return;
          setConfirmOpen(false);
          setSelectedBooking(null);
        }}
        onConfirm={doCancel}
      />
    </div>
  );
}
