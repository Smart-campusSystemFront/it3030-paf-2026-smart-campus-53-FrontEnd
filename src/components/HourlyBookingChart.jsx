import React, { useMemo } from "react";

const HOURLY_CHART_START = 6;
const HOURLY_CHART_END = 21;

function getStartHour(iso) {
  try {
    return new Date(iso).getHours();
  } catch {
    return -1;
  }
}

/**
 * Full day strip: one bar per hour, counts = APPROVED bookings whose startTime hour matches.
 * `peakHours` from API lists busiest hours — those bars are highlighted. If omitted, top 5 local hours by count are highlighted.
 */
export default function HourlyBookingChart({ bookings = [], peakHours = null }) {
  const { rows } = useMemo(() => {
    const hours = [];
    for (let h = HOURLY_CHART_START; h <= HOURLY_CHART_END; h++) hours.push(h);

    const approved = (bookings || []).filter((b) => b?.status === "APPROVED");
    const counts = hours.map((h) =>
      approved.filter((b) => getStartHour(b.startTime) === h).length
    );
    const max = Math.max(1, ...counts);

    const peakSet = new Set();
    if (Array.isArray(peakHours) && peakHours.length > 0) {
      peakHours.forEach((p) => {
        const hr = Number(p.hourOfDay);
        if (Number.isFinite(hr)) peakSet.add(hr);
      });
    } else {
      const ranked = hours
        .map((h, i) => ({ h, c: counts[i] }))
        .filter((x) => x.c > 0)
        .sort((a, b) => b.c - a.c);
      ranked.slice(0, 5).forEach((x) => peakSet.add(x.h));
    }

    const rowsOut = hours.map((hour, i) => {
      const count = counts[i];
      const heightPct = Math.round((count / max) * 100);
      const nextHour = hour + 1;
      const label = `${hour}–${nextHour}`;
      return {
        hour,
        nextHour,
        label,
        count,
        heightPct,
        isPeak: peakSet.has(hour),
      };
    });
    return { rows: rowsOut, max };
  }, [bookings, peakHours]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-slate-500 mb-3">
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-indigo-400 shrink-0" />
          All slots (approved starts / hour)
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-violet-600 shrink-0 shadow-sm ring-2 ring-violet-200 ring-offset-1" />
          Peak hours
        </span>
      </div>
      <div className="flex items-end gap-0.5 sm:gap-1 min-h-[7.5rem]">
        {rows.map((b) => (
          <div key={b.hour} className="flex-1 flex flex-col items-center gap-1 min-w-0">
            <div className="w-full rounded-md bg-slate-100 h-24 flex items-end overflow-hidden border border-slate-100/80">
              <div
                className={`w-full rounded-sm transition-all duration-300 ${
                  b.isPeak
                    ? "bg-violet-600 shadow-[inset_0_-2px_0_0_rgba(0,0,0,0.08)]"
                    : "bg-indigo-400/90 hover:bg-indigo-500"
                }`}
                style={{ height: `${Math.max(b.count ? 8 : 3, b.heightPct)}%` }}
                title={`${b.label} (${b.hour}:00–${b.nextHour}:00) — ${b.count} approved`}
              />
            </div>
            <span
              className={`text-[9px] sm:text-[10px] font-semibold tabular-nums leading-tight text-center max-w-full truncate px-0.5 ${
                b.isPeak ? "text-violet-800" : "text-slate-500"
              }`}
            >
              {b.label}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Labels are local hour ranges ({HOURLY_CHART_START}–{HOURLY_CHART_START + 1} … {HOURLY_CHART_END}–
        {HOURLY_CHART_END + 1}). Peak = busiest hours (server list when available).
      </p>
    </div>
  );
}
