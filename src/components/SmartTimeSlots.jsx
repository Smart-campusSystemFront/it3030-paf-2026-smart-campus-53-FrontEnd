import React, { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
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
        if (!cancelled) setSlots([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    run();
    return () => {
      cancelled = true;
    };
  }, [rid, selectedDate]);

  if (!Number.isFinite(rid) || rid <= 0 || !selectedDate) return null;

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 shadow-sm p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">Quick Select</p>
        <p className="text-xs text-slate-500">
          {availabilityStart}–{availabilityEnd} · 1h slots · unavailable disabled
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
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
            const disabled = !s.available || past;
            const title = past
              ? "This time has already passed"
              : !s.available
                ? "This time is not available (already booked)"
                : `Select ${label}`;

            return (
              <button
                key={s.startLocal}
                type="button"
                disabled={disabled}
                title={title}
                onClick={() => {
                  if (disabled) return;
                  onSelectSlot?.(s.startLocal, s.endLocal);
                }}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all border ${
                  disabled
                    ? "cursor-not-allowed border-slate-200 bg-slate-100/90 text-slate-400 opacity-70"
                    : "border-emerald-200 text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100 hover:shadow-sm"
                }`}
                aria-label={disabled ? `${label} (not selectable)` : `Select slot ${label}`}
                aria-disabled={disabled}
              >
                {label}
              </button>
            );
          })}
      </div>
    </div>
  );
}
