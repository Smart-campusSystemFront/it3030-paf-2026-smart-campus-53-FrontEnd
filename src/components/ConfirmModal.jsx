import React, { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
  confirmText = "Confirm",
  confirmColor = "indigo",
  loading = false,
}) {
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === "Escape") onCancel?.();
    }
    if (isOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const confirmCls =
    confirmColor === "rose"
      ? "bg-rose-600 hover:bg-rose-700 focus:ring-rose-500"
      : "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onCancel?.();
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title || "Confirm dialog"}
    >
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl border border-slate-100 transition-all duration-200">
        <div className="p-6 space-y-3">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-600">{message}</p>
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
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2 font-medium text-white transition-all focus:outline-none focus:ring-2 ${confirmCls} disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2`}
            disabled={loading}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

