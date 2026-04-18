import React, { useMemo, useState } from "react";
import { Calendar, Clock, MapPin, QrCode, Tag, Users } from "lucide-react";
import { format, formatDuration, intervalToDuration } from "date-fns";
import BookingStatusBadge from "./BookingStatusBadge";
import BookingQrImage, { COMPACT_QR_SHELL_MIN_CLASS } from "./BookingQrImage";

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

const PURPOSE_PREVIEW = 96;

function QrFooterPlaceholder({ status, qrUnavailable }) {
  let msg = "Check-in QR is issued after your booking is approved.";
  if (status === "REJECTED") msg = "No check-in QR for rejected bookings.";
  else if (status === "CANCELLED") msg = "No check-in QR for cancelled bookings.";
  else if (status === "APPROVED" && qrUnavailable) msg = "Check-in QR is not available for this booking.";

  return (
    <div
      className={`rounded-xl border border-dashed border-slate-200/90 bg-slate-50/70 ${COMPACT_QR_SHELL_MIN_CLASS} flex flex-col items-center justify-center gap-2 px-3 text-center mt-0.5`}
      role="note"
    >
      <QrCode className="text-slate-300" size={22} strokeWidth={1.25} aria-hidden />
      <p className="text-[11px] text-slate-400 leading-snug max-w-[11rem]">{msg}</p>
    </div>
  );
}

export default function BookingCard({ booking, onCancel }) {
  const [expanded, setExpanded] = useState(false);

  const canCancel =
    booking?.canCancel && (booking?.status === "PENDING" || booking?.status === "APPROVED");

  const purpose = booking?.purpose || "";
  const displayPurpose = expanded ? purpose : purpose.slice(0, PURPOSE_PREVIEW);

  const durationText = useMemo(
    () =>
      fmtDurationMinutes(
        booking?.startTime,
        booking?.endTime,
        booking?.durationMinutes
      ),
    [booking?.startTime, booking?.endTime, booking?.durationMinutes]
  );

  const showRealQr = booking?.status === "APPROVED" && booking?.qrAvailable !== false;
  const qrUnavailable = booking?.status === "APPROVED" && booking?.qrAvailable === false;

  return (
    <div className="relative h-full flex flex-col w-full max-w-full rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow transition-all overflow-hidden">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusAccent(booking?.status)}`} />
      <div className="p-3.5 pl-4 flex flex-col flex-1 min-h-0 h-full">
        <div className="flex-1 flex flex-col gap-1.5 min-h-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold text-slate-900 leading-snug line-clamp-2 pr-1">
            {booking?.resourceName || "Resource"}
          </h3>
          <BookingStatusBadge status={booking?.status} size="sm" />
        </div>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1 min-w-0">
            <MapPin size={13} className="text-slate-400 shrink-0" />
            <span className="truncate">{booking?.resourceLocation || "—"}</span>
          </span>
          <span className="text-slate-300">·</span>
          <span className="inline-flex items-center gap-1">
            <Tag size={13} className="text-slate-400 shrink-0" />
            {booking?.resourceType || "—"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-600">
          <span className="inline-flex items-center gap-1">
            <Calendar size={13} className="text-slate-400 shrink-0" />
            {fmtDate(booking?.startTime)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock size={13} className="text-slate-400 shrink-0" />
            {fmtTimeRange(booking?.startTime, booking?.endTime)}
          </span>
          <span className="inline-flex items-center gap-1 text-slate-500">
            <span className="text-slate-400">⏱</span>
            {durationText}
          </span>
        </div>

        <div className="text-xs text-slate-700 leading-snug">
          <p className={expanded ? "" : "line-clamp-2"}>{displayPurpose}</p>
          {purpose.length > PURPOSE_PREVIEW && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="mt-0.5 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 transition-all"
              aria-label={expanded ? "Collapse purpose" : "Expand purpose"}
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 flex-wrap pt-0.5">
          <span className="inline-flex items-center gap-1 text-xs text-slate-600 min-w-0">
            <Users size={13} className="text-slate-400 shrink-0" />
            {booking?.expectedAttendees ?? "—"} attendees
          </span>
          {canCancel ? (
            <button
              type="button"
              onClick={() => onCancel?.(booking)}
              className="rounded-lg px-2.5 py-1 text-xs font-semibold text-rose-700 border border-rose-200 hover:bg-rose-50 transition-all shrink-0 ml-auto"
              aria-label="Cancel booking"
            >
              Cancel
            </button>
          ) : null}
        </div>

        {booking?.status === "REJECTED" && booking?.rejectionReason && (
          <div className="rounded-lg bg-rose-50 border border-rose-100 p-2.5">
            <p className="text-[11px] font-semibold text-rose-700">Rejection reason</p>
            <p className="mt-0.5 text-xs text-rose-700/90 line-clamp-3">{booking.rejectionReason}</p>
          </div>
        )}

        {booking?.status === "CANCELLED" && booking?.cancellationReason && (
          <div className="rounded-lg bg-slate-50 border border-slate-100 p-2.5">
            <p className="text-[11px] font-semibold text-slate-700">Cancellation</p>
            <p className="mt-0.5 text-xs text-slate-600 line-clamp-3">{booking.cancellationReason}</p>
          </div>
        )}
        </div>

        <div className="shrink-0 pt-1">
          {showRealQr ? (
            <BookingQrImage bookingId={booking.id} compact className="mt-0.5" />
          ) : (
            <QrFooterPlaceholder status={booking?.status} qrUnavailable={qrUnavailable} />
          )}
        </div>
      </div>
    </div>
  );
}
