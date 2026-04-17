import React from "react";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { format } from "date-fns";

function fmtTime(dt) {
  try {
    return format(new Date(dt), "p");
  } catch {
    return "";
  }
}

export default function AvailabilityBadge({
  available,
  checking,
  conflictStart,
  conflictEnd,
  message,
}) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200";

  if (checking) {
    return (
      <span className={`${base} bg-slate-100 text-slate-600`}>
        <Loader2 size={16} className="animate-spin" />
        Checking availability...
      </span>
    );
  }

  if (available === true) {
    return (
      <span className={`${base} bg-emerald-100 text-emerald-700`}>
        <CheckCircle size={16} />
        Available
      </span>
    );
  }

  if (available === false) {
    const range =
      conflictStart && conflictEnd
        ? `${fmtTime(conflictStart)} – ${fmtTime(conflictEnd)}`
        : "";
    return (
      <span className={`${base} bg-rose-100 text-rose-700`}>
        <XCircle size={16} />
        Not Available{range ? ` · ${range}` : ""}
      </span>
    );
  }

  if (message) {
    return <span className={`${base} bg-slate-100 text-slate-600`}>{message}</span>;
  }

  return null;
}

