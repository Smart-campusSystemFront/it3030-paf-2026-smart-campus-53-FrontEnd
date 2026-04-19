import React, { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

export default function RejectModal({ isOpen, onReject, onCancel, loading = false }) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!isOpen) setReason("");
  }, [isOpen]);

  const len = reason.trim().length;
  const tooShort = len > 0 && len < 10;
  const disabled = len < 10 || loading;

  const borderCls = useMemo(() => {
    if (len === 0) return "border-slate-200 focus:ring-indigo-500";
    return tooShort ? "border-rose-300 focus:ring-rose-500" : "border-slate-200 focus:ring-indigo-500";
  }, [len, tooShort]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel?.();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Reject booking dialog"
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-100">
        <div className="p-6 space-y-2">
          <h3 className="text-lg font-semibold text-slate-900">Reject Booking</h3>
          <p className="text-sm text-slate-600">Please provide a reason for rejection</p>

          <div className="pt-2 space-y-2">
            <div className="relative">
              <textarea
                aria-label="Rejection reason"
                value={reason}
                onChange={(e) => setReason(e.target.value.slice(0, 500))}
                className={`w-full min-h-[120px] resize-none rounded-xl border ${borderCls} p-3 text-sm text-slate-800 outline-none focus:ring-2 transition-all`}
                placeholder="Enter at least 10 characters..."
              />
              <div className="absolute bottom-2 right-3 text-xs text-slate-500">
                {reason.length}/500
              </div>
            </div>
            {tooShort && (
              <p className="text-xs font-medium text-rose-600">Reason must be at least 10 characters.</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 pb-6">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl px-4 py-2 font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onReject?.(reason.trim())}
            className="rounded-xl px-4 py-2 font-medium text-white bg-rose-600 hover:bg-rose-700 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
            disabled={disabled}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

