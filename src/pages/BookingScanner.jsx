import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Html5QrcodeScanner } from "html5-qrcode";
import { ScanLine } from "lucide-react";

export default function BookingScanner() {
  const [last, setLast] = useState("");
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 260, height: 260 }, aspectRatio: 1 },
      false
    );
    scannerRef.current = scanner;
    scanner.render(
      (decodedText) => {
        setLast(decodedText);
        toast.success("QR captured");
      },
      () => {}
    );
    return () => {
      const s = scannerRef.current;
      scannerRef.current = null;
      if (s) {
        s.clear().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="min-h-0 bg-slate-50">
      <div className="mx-auto max-w-3xl px-4 pt-2 pb-6 space-y-4">
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-8 space-y-2">
          <div className="inline-flex items-center gap-2 text-indigo-700 font-semibold text-sm uppercase tracking-wide">
            <ScanLine size={18} />
            Scanner
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">QR check-in</h1>
          <p className="text-sm text-slate-600">
            Point the camera at an approved booking QR. Decoded payload appears below for desk verification.
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6">
          <div id="qr-reader" className="rounded-xl overflow-hidden" />
        </div>

        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6 space-y-3">
          <h2 className="text-sm font-semibold text-slate-800">Last scan</h2>
          {last ? (
            <pre className="text-xs whitespace-pre-wrap break-all rounded-xl bg-slate-900 text-emerald-200 p-4 font-mono">
              {last}
            </pre>
          ) : (
            <p className="text-sm text-slate-500">No scan yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
