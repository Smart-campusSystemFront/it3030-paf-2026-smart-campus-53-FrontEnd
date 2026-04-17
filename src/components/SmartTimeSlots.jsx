import React, { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { checkAvailability } from "../api/bookingApi";

function toLocalDateTimeInputValue(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

function buildSlots(selectedDate, startHHMM, endHHMM) {
  if (!selectedDate) return [];
  const start = new Date(`${selectedDate}T${startHHMM}:00`);
  const end = new Date(`${selectedDate}T${endHHMM}:00`);

  const slots = [];
  let cur = new Date(start);
  while (cur.getTime() + 60 * 60000 <= end.getTime()) {
    const next = new Date(cur.getTime() + 60 * 60000);
    slots.push({
      // Must be LOCAL time for <input type="datetime-local"> and backend LocalDateTime.
      // Using toISOString() shifts to UTC and causes validation errors.
      startLocal: toLocalDateTimeInputValue(cur),
      endLocal: toLocalDateTimeInputValue(next),
    });
    cur = next;
  }
  return slots;
}

function toApiDateTime(datetimeLocal) {
  return datetimeLocal?.length === 16 ? `${datetimeLocal}:00` : datetimeLocal;
}

export default function SmartTimeSlots({
  resourceId,
  selectedDate,
  availabilityStart,
  availabilityEnd,
  onSelectSlot,
}) {
  const rid = useMemo(() => Number(resourceId), [resourceId]);
  const slots = useMemo(
    () => buildSlots(selectedDate, availabilityStart, availabilityEnd),
    [selectedDate, availabilityStart, availabilityEnd]
  );

  const [state, setState] = useState({});

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!Number.isFinite(rid) || rid <= 0 || !selectedDate || slots.length === 0) {
        setState({});
        return;
      }

      const initial = {};
      for (const s of slots) initial[s.startLocal] = { loading: true, available: null };
      setState(initial);

      await Promise.all(
        slots.map(async (s) => {
          try {
            const res = await checkAvailability(
              rid,
              toApiDateTime(s.startLocal),
              toApiDateTime(s.endLocal)
            );
            if (cancelled) return;
            setState((prev) => ({
              ...prev,
              [s.startLocal]: { loading: false, available: !!res?.available },
            }));
          } catch {
            if (cancelled) return;
            setState((prev) => ({
              ...prev,
              [s.startLocal]: { loading: false, available: null },
            }));
          }
        })
      );
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [rid, selectedDate, slots]);

  if (!Number.isFinite(rid) || rid <= 0 || !selectedDate) return null;

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-slate-900">Quick Select — Available Slots</p>
        <p className="text-xs text-slate-500">1-hour slots</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {slots.map((s) => {
          const st = state[s.startLocal] || { loading: true, available: null };
          const label = `${s.startLocal.slice(11, 16)}–${s.endLocal.slice(11, 16)}`;

          if (st.loading) {
            return (
              <span
                key={s.startLocal}
                className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 animate-pulse"
              >
                <Loader2 size={14} className="animate-spin" />
                {label}
              </span>
            );
          }

          const isAvail = st.available === true;
          return (
            <button
              key={s.startLocal}
              type="button"
              onClick={() => onSelectSlot?.(s.startLocal, s.endLocal)}
              disabled={!isAvail}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all border ${
                isAvail
                  ? "border-emerald-200 text-emerald-700 bg-white hover:bg-emerald-50"
                  : "border-slate-200 text-slate-400 bg-white line-through cursor-not-allowed"
              }`}
              aria-label={`Select slot ${label}`}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

