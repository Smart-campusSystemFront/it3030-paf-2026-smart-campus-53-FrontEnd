import React, { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";

const MIN = 10;
const MAX = 500;

export default function CancelReasonModal({
  isOpen,
  title = "Cancel booking",
  subtitle = "Please provide a cancellation reason (required).",
  confirmText = "Confirm cancellation",
  loading = false,
  onClose,
  onConfirm,
}) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (isOpen) setReason("");
  }, [isOpen]);

  if (!isOpen) return null;

  const len = reason.trim().length;
  const valid = len >= MIN && len <= MAX;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close modal"
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => {
          if (!loading) onClose?.();
        }}
      />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-100 p-6 transition-all">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
          </div>
          <button
            type="button"
            className="rounded-xl p-2 text-slate-500 hover:bg-slate-50 transition-all disabled:opacity-50"
            onClick={() => {
              if (!loading) onClose?.();
            }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <label className="mt-5 block text-sm font-medium text-slate-700" htmlFor="cancelReason">
          Reason
        </label>
        <textarea
          id="cancelReason"
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          maxLength={MAX}
          className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          placeholder={`At least ${MIN} characters…`}
        />
        <div className="mt-1 flex justify-between text-xs text-slate-500">
          <span>{len < MIN ? `${MIN - len} more characters needed` : "Looks good"}</span>
          <span>
            {len}/{MAX}
          </span>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          <button
            type="button"
            className="rounded-xl px-4 py-2 font-medium text-slate-700 border border-slate-200 hover:bg-slate-50 transition-all disabled:opacity-50"
            onClick={() => {
              if (!loading) onClose?.();
            }}
          >
            Back
          </button>
          <button
            type="button"
            disabled={!valid || loading}
            onClick={() => onConfirm?.(reason.trim())}
            className="rounded-xl px-4 py-2 font-medium text-white bg-rose-600 hover:bg-rose-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {loading && <Loader2 size={18} className="animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
