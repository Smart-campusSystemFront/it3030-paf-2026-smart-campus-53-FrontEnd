import React from "react";

export default function SkeletonCard() {
  return (
    <div className="rounded-2xl bookings-card border shadow-sm p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3 flex-1">
          <div className="h-5 w-2/3 bg-slate-200 animate-pulse rounded-lg" />
          <div className="h-4 w-1/2 bg-slate-200 animate-pulse rounded-lg" />
        </div>
        <div className="h-7 w-24 bg-slate-200 animate-pulse rounded-full" />
      </div>

      <div className="mt-4 space-y-3">
        <div className="h-4 w-3/4 bg-slate-200 animate-pulse rounded-lg" />
        <div className="h-4 w-2/3 bg-slate-200 animate-pulse rounded-lg" />
        <div className="h-10 w-full bg-slate-200 animate-pulse rounded-xl" />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="h-4 w-24 bg-slate-200 animate-pulse rounded-lg" />
        <div className="h-9 w-28 bg-slate-200 animate-pulse rounded-xl" />
      </div>
    </div>
  );
}

