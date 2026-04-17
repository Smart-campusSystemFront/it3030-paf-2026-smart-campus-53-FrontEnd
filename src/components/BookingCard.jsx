import React, { useMemo, useState } from "react";
import { Calendar, Clock, MapPin, Tag, Users } from "lucide-react";
import { format, formatDuration, intervalToDuration } from "date-fns";
import BookingStatusBadge from "./BookingStatusBadge";

function statusAccent(status) {
  if (status === "APPROVED") return "bg-emerald-500";
  if (status === "PENDING") return "bg-amber-500";
  if (status === "REJECTED") return "bg-rose-500";
  return "bg-slate-400";
}

function fmtDate(dt) {
  try {
    return format(new Date(dt), "EEE, dd MMM yyyy");
  } catch {
    return "";
  }
}

function fmtTimeRange(start, end) {
  try {
    return `${format(new Date(start), "p")} – ${format(new Date(end), "p")}`;
  } catch {
    return "";
  }
}

function fmtDurationMinutes(start, end, durationMinutes) {
  if (typeof durationMinutes === "number" && durationMinutes > 0) {
    const hours = Math.floor(durationMinutes / 60);
    const mins = durationMinutes % 60;
    if (hours && mins) return `${hours} hrs ${mins} mins`;
    if (hours) return `${hours} hrs`;
    return `${mins} mins`;
  }
  try {
    const d = intervalToDuration({ start: new Date(start), end: new Date(end) });
    const text = formatDuration(d, { format: ["hours", "minutes"] });
    return text || "—";
  } catch {
    return "—";
  }
}

export default function BookingCard({ booking, onCancel }) {
  const [expanded, setExpanded] = useState(false);

  const canCancel =
    booking?.canCancel && (booking?.status === "PENDING" || booking?.status === "APPROVED");

  const purpose = booking?.purpose || "";
  const displayPurpose = expanded ? purpose : purpose.slice(0, 140);

  const durationText = useMemo(
    () =>
      fmtDurationMinutes(
        booking?.startTime,
        booking?.endTime,
        booking?.durationMinutes
      ),
    [booking?.startTime, booking?.endTime, booking?.durationMinutes]
  );

  return (
    <div className="relative rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${statusAccent(booking?.status)}`} />
      <div className="p-6 pl-7 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-base font-semibold text-slate-900">
            {booking?.resourceName || "Resource"}
          </h3>
          <BookingStatusBadge status={booking?.status} />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2">
            <MapPin size={16} className="text-slate-400" />
            {booking?.resourceLocation || "—"}
          </span>
          <span className="inline-flex items-center gap-2">
            <Tag size={16} className="text-slate-400" />
            {booking?.resourceType || "—"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
          <span className="inline-flex items-center gap-2">
            <Calendar size={16} className="text-slate-400" />
            {fmtDate(booking?.startTime)}
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock size={16} className="text-slate-400" />
            {fmtTimeRange(booking?.startTime, booking?.endTime)}
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="text-slate-400">⏱️</span>
            {durationText}
          </span>
        </div>

        <div className="text-sm text-slate-700 leading-relaxed">
          <p className={expanded ? "" : "line-clamp-2"}>{displayPurpose}</p>
          {purpose.length > 140 && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-all"
              aria-label={expanded ? "Collapse purpose" : "Expand purpose"}
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-sm text-slate-600">
            <Users size={16} className="text-slate-400" />
            {booking?.expectedAttendees ?? "—"} attendees
          </span>

          {canCancel ? (
            <button
              type="button"
              onClick={() => onCancel?.(booking)}
              className="rounded-xl px-4 py-2 font-medium text-rose-700 border border-rose-200 hover:bg-rose-50 transition-all"
              aria-label="Cancel booking"
            >
              Cancel
            </button>
          ) : (
            <span className="text-sm text-slate-400"> </span>
          )}
        </div>

        {booking?.status === "REJECTED" && booking?.rejectionReason && (
          <div className="rounded-xl bg-rose-50 border border-rose-100 p-4">
            <p className="text-sm font-semibold text-rose-700">Rejection Reason</p>
            <p className="mt-1 text-sm text-rose-700/90">{booking.rejectionReason}</p>
          </div>
        )}
      </div>
    </div>
  );
}

