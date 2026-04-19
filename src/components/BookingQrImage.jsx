import React, { useEffect, useState } from "react";
import { Loader2, QrCode } from "lucide-react";
import { fetchBookingQrBlob } from "../api/bookingApi";

/** Matches compact QR footer height on `BookingCard` placeholders so rows align. */
export const COMPACT_QR_SHELL_MIN_CLASS = "min-h-[11.25rem]";

export default function BookingQrImage({ bookingId, className = "", compact = false }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let cancelled = false;
    let objectUrl = "";
    (async () => {
      if (!bookingId) return;
      setUrl("");
      setLoading(true);
      setErr("");
      try {
        const blob = await fetchBookingQrBlob(bookingId);
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      } catch (e) {
        if (!cancelled) {
          setErr(e?.response?.data?.message || "Could not load QR code");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [bookingId]);

  const pad = compact ? "p-3" : "p-4";
  const imgCls = compact ? "h-28 w-28" : "h-44 w-44";
  const headText = compact ? "text-xs mb-2" : "text-sm mb-3";
  const iconSz = compact ? 15 : 18;
  /** Keeps compact QR block height stable while loading so this card alone doesn’t jump. */
  const compactShellMin = compact ? COMPACT_QR_SHELL_MIN_CLASS : "min-h-[15.5rem]";

  if (loading) {
    return (
      <div
        className={`rounded-xl border border-indigo-100 bg-white flex items-center justify-center gap-2 text-xs text-slate-600 ${compactShellMin} ${className}`}
      >
        <Loader2 className="animate-spin" size={compact ? 16 : 18} />
        Loading QR…
      </div>
    );
  }

  if (err) {
    return (
      <div
        className={`rounded-xl border border-rose-100 bg-rose-50 text-xs text-rose-700 p-3 flex items-center ${compactShellMin} ${className}`}
      >
        {err}
      </div>
    );
  }

  return (
    <div className={`rounded-xl border border-indigo-100 bg-white ${pad} shadow-sm ${compact ? compactShellMin : ""} ${className}`}>
      <div className={`flex items-center gap-2 font-semibold text-slate-800 ${headText}`}>
        <QrCode size={iconSz} className="text-indigo-600 shrink-0" />
        Check-in QR
      </div>
      {url ? (
        <img src={url} alt="Booking QR code" className={`mx-auto ${imgCls} object-contain rounded-lg`} />
      ) : null}
    </div>
  );
}
