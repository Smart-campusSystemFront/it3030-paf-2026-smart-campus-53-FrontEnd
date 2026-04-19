import React, { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { getDayAvailability } from "../api/bookingApi";

function toLocalDateTimeInputValue(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

/** Build 06:00–22:00 hourly slots for `selectedDate` when API has no `daySlots` (older server). */
function slotsFromAvailableOnly(selectedDate, availableSlots) {
  const free = new Set(
    (availableSlots || []).map((s) => toLocalDateTimeInputValue(s.startTime).slice(0, 16))
  );
  const out = [];
  for (let h = 6; h <= 21; h++) {
    const startLocal = `${selectedDate}T${pad2(h)}:00`;
    const endLocal = `${selectedDate}T${pad2(h + 1)}:00`;
    out.push({ startLocal, endLocal, available: free.has(startLocal) });
  }
  return out;
}

function normalizeDaySlots(selectedDate, res) {
  const raw = Array.isArray(res?.daySlots) ? res.daySlots : [];
  if (raw.length > 0) {
    return raw.map((s) => ({
      startLocal: toLocalDateTimeInputValue(s.startTime),
      endLocal: toLocalDateTimeInputValue(s.endTime),
      available: s.available !== false && s.available !== "false",
    }));
  }
  const avail = Array.isArray(res?.availableSlots) ? res.availableSlots : [];
  return slotsFromAvailableOnly(selectedDate, avail);
}

function rangeLabel(startLocal) {
  const h = Number(startLocal.slice(11, 13));
  if (!Number.isFinite(h)) return startLocal.slice(11, 16);
  return `${h}–${h + 1}`;
}

export default function SmartTimeSlots({
  resourceId,
  selectedDate,
  availabilityStart,
  availabilityEnd,
  onSelectSlot,
  /** Match /bookings hub: #FEFEFE panels + #F9BF3B slot buttons */
  bookingsHub = false,
}) {
  const rid = useMemo(() => Number(resourceId), [resourceId]);
  const [loading, setLoading] = useState(false);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!Number.isFinite(rid) || rid <= 0 || !selectedDate) {
        setSlots([]);
        return;
      }
      setLoading(true);
      try {
        const res = await getDayAvailability(rid, selectedDate);
        if (cancelled) return;
        setSlots(normalizeDaySlots(selectedDate, res));
      } catch {
        if (!cancelled) {
          setSlots([]);
          toast.error("Could not load time slots for this date. Try again.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [rid, selectedDate]);

  const needsResource = !Number.isFinite(rid) || rid <= 0;
  const needsDate = !selectedDate;

  if (needsResource || needsDate) {
    return (
      <div
        className={
          bookingsHub
            ? "rounded-2xl border border-dashed border-[#00205B]/20 bookings-card p-5"
            : "rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 p-5"
        }
      >
        <p className={`text-sm font-semibold ${bookingsHub ? "text-[#00205B]" : "text-slate-800"}`}>Time slots</p>
        <p className={`mt-2 text-sm ${bookingsHub ? "text-slate-600" : "text-slate-600"}`}>
          {needsResource
            ? "Select a resource first. Then choose a date — hourly slots will appear below for that day."
            : "Choose a booking date — available slots load as soon as the date is selected."}
        </p>
      </div>
    );
  }

  return (
    <div
      className={
        bookingsHub
          ? "rounded-2xl border shadow-sm p-5 bookings-card"
          : "rounded-2xl border border-slate-100 bg-slate-50 shadow-sm p-5"
      }
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">Quick Select</p>
        <p className="text-xs text-slate-500">
          {availabilityStart}–{availabilityEnd} · 1h slots · booked / past: not available
        </p>
      </div>

      <div className="mt-4 flex max-w-full flex-nowrap gap-2 overflow-x-auto overflow-y-visible pb-1 [scrollbar-gutter:stable]">
        {loading &&
          Array.from({ length: 16 }).map((_, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 animate-pulse"
            >
              <Loader2 size={14} className="animate-spin" />
              …
            </span>
          ))}

        {!loading && slots.length === 0 && (
          <p className="text-sm text-slate-600">Could not load slots for this date. Try again or adjust the start date.</p>
        )}

        {!loading &&
          slots.map((s) => {
            const label = rangeLabel(s.startLocal);
            const endMs = new Date(s.endLocal).getTime();
            const past = Number.isFinite(endMs) && endMs <= Date.now();
            const unavailable = !s.available || past;
            const title = past
              ? "This time has already passed"
              : !s.available
                ? "Not available (already booked)"
                : `Select ${label}`;

            return (
              <button
                key={s.startLocal}
                type="button"
                title={title}
                tabIndex={unavailable ? -1 : 0}
                aria-disabled={unavailable}
                onClick={() => {
                  if (unavailable) {
                    toast.error(
                      past
                        ? "Not available — this time has already passed."
                        : "Not available — this time slot is already booked."
                    );
                    return;
                  }
                  onSelectSlot?.(s.startLocal, s.endLocal);
                }}
                className={
                  unavailable
                    ? "cursor-not-allowed rounded-full border border-slate-200 bg-slate-100/90 px-3 py-1.5 text-xs font-semibold text-slate-400 opacity-80 transition-all"
                    : bookingsHub
                      ? "rounded-full border border-[#00205B]/15 bg-[#F9BF3B] px-3 py-1.5 text-xs font-semibold text-[#00205B] shadow-sm transition-all hover:brightness-105 hover:shadow"
                      : "rounded-full border border-emerald-200 bg-emerald-50/80 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-all hover:bg-emerald-100 hover:shadow-sm"
                }
                aria-label={unavailable ? `${label}, not available` : `Select slot ${label}`}
              >
                {label}
              </button>
            );
          })}
      </div>
    </div>
  );
}
