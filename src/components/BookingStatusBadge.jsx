import React from "react";
import { CheckCircle, Clock, MinusCircle, XCircle } from "lucide-react";

const STYLES = {
  PENDING: { cls: "bg-amber-100 text-amber-700", Icon: Clock, label: "Pending" },
  APPROVED: {
    cls: "bg-emerald-100 text-emerald-700",
    Icon: CheckCircle,
    label: "Approved",
  },
  REJECTED: { cls: "bg-rose-100 text-rose-700", Icon: XCircle, label: "Rejected" },
  CANCELLED: {
    cls: "bg-slate-100 text-slate-500",
    Icon: MinusCircle,
    label: "Cancelled",
  },
};

export default function BookingStatusBadge({ status, size = "md" }) {
  const s = STYLES[status] || STYLES.PENDING;
  const pad = size === "sm" ? "px-2.5 py-1" : "px-3 py-1.5";
  const iconSize = size === "sm" ? 14 : 16;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full ${pad} text-xs font-semibold ${s.cls}`}
      aria-label={`Status: ${s.label}`}
    >
      <s.Icon size={iconSize} className="shrink-0" />
      <span>{s.label}</span>
    </span>
  );
}

