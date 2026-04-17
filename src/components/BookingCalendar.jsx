import React, { useMemo, useState } from "react";
import {
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
  eachDayOfInterval,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";

function statusDotsForDay(bookingsForDay) {
  const hasPending = bookingsForDay.some((b) => b.status === "PENDING");
  const hasApproved = bookingsForDay.some((b) => b.status === "APPROVED");
  const dots = [];
  if (hasPending) dots.push({ cls: "bg-amber-500", key: "pending" });
  if (hasApproved) dots.push({ cls: "bg-emerald-500", key: "approved" });
  return dots.slice(0, 3);
}

export default function BookingCalendar({ bookings = [], onDateClick }) {
  const [month, setMonth] = useState(() => new Date());

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(month), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(month), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  }, [month]);

  const byDay = useMemo(() => {
    const map = new Map();
    for (const b of bookings) {
      if (!b?.startTime) continue;
      const d = new Date(b.startTime);
      const key = format(d, "yyyy-MM-dd");
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(b);
    }
    return map;
  }, [bookings]);

  const weekdayHeaders = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="rounded-2xl border border-slate-100 bg-white">
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => setMonth((m) => subMonths(m, 1))}
          className="h-10 w-10 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all inline-flex items-center justify-center"
        >
          <ChevronLeft size={18} className="text-slate-700" />
        </button>
        <div className="text-sm font-semibold text-slate-900">{format(month, "MMMM yyyy")}</div>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setMonth((m) => addMonths(m, 1))}
          className="h-10 w-10 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all inline-flex items-center justify-center"
        >
          <ChevronRight size={18} className="text-slate-700" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-px bg-slate-100">
        {weekdayHeaders.map((d) => (
          <div key={d} className="bg-white p-3 text-xs font-semibold text-slate-600">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px bg-slate-100">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const list = byDay.get(key) || [];
          const dots = statusDotsForDay(list);
          const inMonth = isSameMonth(day, month);

          return (
            <button
              key={key}
              type="button"
              onClick={() => onDateClick?.(day)}
              className={`bg-white p-3 text-left hover:bg-indigo-50 transition-all min-h-[88px] ${
                isToday(day) ? "ring-2 ring-indigo-500 ring-inset" : ""
              }`}
              aria-label={`Select ${format(day, "PPP")}`}
            >
              <div className="flex items-start justify-between">
                <span className={`text-sm font-semibold ${inMonth ? "text-slate-900" : "text-slate-400"}`}>
                  {format(day, "d")}
                </span>
                {list.length > 0 && (
                  <span className="text-xs font-semibold text-slate-500">{list.length}</span>
                )}
              </div>

              <div className="mt-3 flex items-center gap-1">
                {dots.map((d) => (
                  <span key={d.key} className={`h-2 w-2 rounded-full ${d.cls}`} aria-hidden="true" />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-600">
        <span className="font-semibold text-slate-700">Legend:</span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          Pending
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Approved
        </span>
      </div>
    </div>
  );
}

