import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createBooking, getActiveResources } from "../api/bookingApi";
import AvailabilityBadge from "../components/AvailabilityBadge";
import SmartTimeSlots from "../components/SmartTimeSlots";
import { useAvailability } from "../hooks/useAvailability";

const schema = z
  .object({
    resourceId: z.string().min(1, "Resource is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    purpose: z.string().min(1, "Purpose is required").max(500, "Max 500 characters"),
    expectedAttendees: z
      .string()
      .min(1, "Expected attendees is required")
      .refine((v) => Number(v) >= 1, "Minimum 1 attendee")
      .refine((v) => Number(v) <= 500, "Maximum 500 attendees"),
  })
  .refine((val) => new Date(val.startTime) > new Date(), {
    message: "Start time must be in the future",
    path: ["startTime"],
  })
  .refine((val) => new Date(val.endTime) > new Date(val.startTime), {
    message: "End time must be after start time",
    path: ["endTime"],
  });

function toApiDateTime(datetimeLocal) {
  return datetimeLocal?.length === 16 ? `${datetimeLocal}:00` : datetimeLocal;
}

function fmtDate(dt) {
  try {
    return format(new Date(dt), "EEE, dd MMM yyyy");
  } catch {
    return "—";
  }
}

function fmtTime(dt) {
  try {
    return format(new Date(dt), "p");
  } catch {
    return "—";
  }
}

function minutesBetween(a, b) {
  try {
    return Math.max(0, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 60000));
  } catch {
    return 0;
  }
}

function fmtDuration(mins) {
  if (!mins) return "—";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h && m) return `${h} hrs ${m} mins`;
  if (h) return `${h} hrs`;
  return `${m} mins`;
}

export default function BookingForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefillDate = searchParams.get("date"); // YYYY-MM-DD

  const [resources, setResources] = useState([]);
  const [resourcesLoading, setResourcesLoading] = useState(true);
  const [resourcesError, setResourcesError] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [conflictInline, setConflictInline] = useState("");

  const { available, checking, conflictStart, conflictEnd, message, checkAvailability, reset } =
    useAvailability();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      resourceId: "",
      startTime: "",
      endTime: "",
      purpose: "",
      expectedAttendees: "1",
    },
    mode: "onChange",
  });

  const resourceId = form.watch("resourceId");
  const startTime = form.watch("startTime");
  const endTime = form.watch("endTime");
  const purpose = form.watch("purpose");
  const expectedAttendees = Number(form.watch("expectedAttendees") || 0);
  const resourceIdNum = useMemo(() => Number(resourceId), [resourceId]);
  const hasValidResource = Number.isFinite(resourceIdNum) && resourceIdNum > 0;

  const selectedResource = useMemo(() => {
    const rid = String(resourceId ?? "");
    return (
      resources.find((r) => String(r?.resourceId ?? r?.id ?? "") === rid) ||
      null
    );
  }, [resources, resourceId]);

  const durationMins = useMemo(() => minutesBetween(startTime, endTime), [startTime, endTime]);
  const attendeesExceed =
    selectedResource?.capacity != null && expectedAttendees > selectedResource.capacity;

  useEffect(() => {
    let mounted = true;
    (async () => {
      setResourcesLoading(true);
      setResourcesError("");
      try {
        const data = await getActiveResources();
        if (!mounted) return;
        setResources(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!mounted) return;
        setResourcesError(e?.response?.data?.message || "Failed to load resources");
      } finally {
        if (mounted) setResourcesLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!prefillDate) return;
    if (form.getValues("startTime")) return;

    // Pick a sensible default time that is in the future (schema requires startTime > now).
    // If the prefilled date is today and it's already past 09:00, choose the next full hour.
    try {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      const todayStr = `${yyyy}-${mm}-${dd}`;

      let start = `${prefillDate}T09:00`;
      if (prefillDate === todayStr) {
        const nextHour = new Date(today);
        nextHour.setMinutes(0, 0, 0);
        nextHour.setHours(nextHour.getHours() + 1);

        const hh = String(nextHour.getHours()).padStart(2, "0");
        const min = String(nextHour.getMinutes()).padStart(2, "0");
        start = `${prefillDate}T${hh}:${min}`;
      }

      // Clamp to availability window 06:00–22:00 (so endTime stays valid).
      const startHour = Number(start.slice(11, 13));
      if (Number.isFinite(startHour) && startHour < 6) start = `${prefillDate}T06:00`;
      if (Number.isFinite(startHour) && startHour > 21) {
        // Can't fit a 1-hour slot today; leave empty so user must choose.
        return;
      }

      const end = `${prefillDate}T${String(Number(start.slice(11, 13)) + 1).padStart(2, "0")}:00`;
      form.setValue("startTime", start, { shouldValidate: true });
      form.setValue("endTime", end, { shouldValidate: true });
    } catch {
      form.setValue("startTime", `${prefillDate}T09:00`, { shouldValidate: true });
      form.setValue("endTime", `${prefillDate}T10:00`, { shouldValidate: true });
    }
  }, [prefillDate, form]);

  useEffect(() => {
    setConflictInline("");
    if (!hasValidResource || !startTime || !endTime) {
      reset();
      return;
    }
    checkAvailability(resourceIdNum, toApiDateTime(startTime), toApiDateTime(endTime));
  }, [hasValidResource, resourceIdNum, startTime, endTime, checkAvailability, reset]);

  // Enable submit when form is valid and availability is not explicitly false.
  // (Availability can be null if not checked yet or temporarily unavailable.)
  const canSubmit =
    form.formState.isValid && available !== false && !checking && !submitting && hasValidResource;

  function onInvalid(errors) {
    const firstKey = errors ? Object.keys(errors)[0] : null;
    const firstMsg = firstKey ? errors?.[firstKey]?.message : null;
    toast.error(firstMsg || "Please fix the highlighted fields.");
  }

  async function onSubmit(values) {
    const rid = Number(values.resourceId);
    if (!Number.isFinite(rid) || rid <= 0) {
      form.setError("resourceId", { type: "manual", message: "Resource is required" });
      toast.error("Please select a resource.");
      return;
    }

    setSubmitting(true);
    setConflictInline("");
    try {
      await createBooking({
        resourceId: rid,
        startTime: toApiDateTime(values.startTime),
        endTime: toApiDateTime(values.endTime),
        purpose: values.purpose.trim(),
        expectedAttendees: Number(values.expectedAttendees),
      });
      toast.success("Booking request submitted!");
      navigate("/my-bookings");
    } catch (e) {
      if (e?.response?.status === 409) {
        setConflictInline("This time slot is already booked. Please choose a different time.");
      }
      const msg = e?.response?.data?.message || "Failed to submit booking request";
      const fieldErrors = e?.response?.data?.fieldErrors;
      if (fieldErrors && typeof fieldErrors === "object") {
        const details = Object.entries(fieldErrors)
          .map(([k, v]) => `${k}: ${v}`)
          .join(" | ");
        toast.error(`${msg}${details ? ` — ${details}` : ""}`);
      } else {
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">New Booking</h1>
          <p className="mt-1 text-sm text-slate-600">Request a resource booking.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Select Resource</h2>
                <p className="text-sm text-slate-600">Choose an ACTIVE resource.</p>
              </div>

              {resourcesError && (
                <div className="rounded-xl border border-rose-100 bg-rose-50 p-4">
                  <p className="text-sm font-semibold text-rose-700">Failed to load resources</p>
                  <p className="mt-1 text-sm text-rose-700/90">{resourcesError}</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="resourceId">
                  Resource
                </label>
                <select
                  id="resourceId"
                  aria-label="Select resource"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white disabled:bg-slate-50"
                  disabled={resourcesLoading}
                  {...form.register("resourceId")}
                >
                  <option value="">Select a resource...</option>
                  {resources.map((r) => (
                    <option key={r?.resourceId ?? r?.id} value={String(r?.resourceId ?? r?.id)}>
                      {r.name} · {r.location} · Cap: {r.capacity}
                    </option>
                  ))}
                </select>
                {form.formState.errors.resourceId && (
                  <p className="text-xs font-medium text-rose-600">
                    {form.formState.errors.resourceId.message}
                  </p>
                )}
              </div>

              {selectedResource && (
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{selectedResource.name}</p>
                      <p className="mt-1 text-sm text-slate-600">{selectedResource.location}</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 text-emerald-700 px-3 py-1 text-xs font-semibold">
                      ACTIVE
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</p>
                      <p className="mt-1 text-slate-800">{selectedResource.type}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Capacity</p>
                      <p className="mt-1 text-slate-800">{selectedResource.capacity}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        Availability Window
                      </p>
                      <p className="mt-1 text-slate-800">6:00 AM – 10:00 PM</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Date &amp; Time</h2>
                <p className="text-sm text-slate-600">Pick a time slot.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="startTime">
                    Start
                  </label>
                  <input
                    id="startTime"
                    type="datetime-local"
                    aria-label="Start date and time"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white"
                    {...form.register("startTime")}
                  />
                  {form.formState.errors.startTime && (
                    <p className="text-xs font-medium text-rose-600">
                      {form.formState.errors.startTime.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700" htmlFor="endTime">
                    End
                  </label>
                  <input
                    id="endTime"
                    type="datetime-local"
                    aria-label="End date and time"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white"
                    {...form.register("endTime")}
                  />
                  {form.formState.errors.endTime && (
                    <p className="text-xs font-medium text-rose-600">
                      {form.formState.errors.endTime.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <AvailabilityBadge
                  available={available}
                  checking={checking}
                  conflictStart={conflictStart}
                  conflictEnd={conflictEnd}
                  message={message}
                />
                {startTime && endTime && (
                  <span className="rounded-full bg-slate-100 text-slate-700 px-3 py-1.5 text-xs font-semibold">
                    Duration: {fmtDuration(durationMins)}
                  </span>
                )}
              </div>

              {attendeesExceed && (
                <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
                  <p className="text-sm font-semibold text-amber-800">⚠️ Attendees exceed room capacity</p>
                  <p className="mt-1 text-sm text-amber-800/90">
                    Capacity is {selectedResource?.capacity}, but you entered {expectedAttendees}.
                  </p>
                </div>
              )}

              <SmartTimeSlots
                resourceId={resourceId ? Number(resourceId) : null}
                selectedDate={startTime ? startTime.slice(0, 10) : null}
                availabilityStart="06:00"
                availabilityEnd="22:00"
                onSelectSlot={(s, e) => {
                  form.setValue("startTime", s, { shouldValidate: true });
                  form.setValue("endTime", e, { shouldValidate: true });
                }}
              />
            </div>

            <div className="rounded-2xl bg-white border border-slate-100 shadow-sm p-6 space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Booking Details</h2>
                <p className="text-sm text-slate-600">Provide purpose and attendees.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="purpose">
                  Purpose
                </label>
                <div className="relative">
                  <textarea
                    id="purpose"
                    aria-label="Booking purpose"
                    className="w-full min-h-[120px] resize-none rounded-xl border border-slate-200 p-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    maxLength={500}
                    placeholder="e.g., Project meeting..."
                    {...form.register("purpose")}
                  />
                  <div className="absolute bottom-2 right-3 text-xs text-slate-500">
                    {(purpose || "").length}/500
                  </div>
                </div>
                {form.formState.errors.purpose && (
                  <p className="text-xs font-medium text-rose-600">{form.formState.errors.purpose.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700" htmlFor="expectedAttendees">
                  Expected Attendees
                </label>
                <input
                  id="expectedAttendees"
                  type="number"
                  min={1}
                  max={500}
                  aria-label="Expected attendees"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  {...form.register("expectedAttendees")}
                />
                {form.formState.errors.expectedAttendees && (
                  <p className="text-xs font-medium text-rose-600">
                    {form.formState.errors.expectedAttendees.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-6 rounded-2xl bg-white border border-slate-100 shadow-sm p-6 space-y-4">
              <h2 className="text-lg font-semibold text-slate-900">Booking Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">Resource</span>
                  <span className="font-semibold text-slate-900 text-right">
                    {selectedResource?.name || "Not selected"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">Date</span>
                  <span className="font-medium text-slate-700 text-right">{startTime ? fmtDate(startTime) : "—"}</span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">Time</span>
                  <span className="font-medium text-slate-700 text-right">
                    {startTime && endTime ? `${fmtTime(startTime)} – ${fmtTime(endTime)}` : "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">Duration</span>
                  <span className="font-medium text-slate-700 text-right">
                    {startTime && endTime ? fmtDuration(durationMins) : "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">Purpose</span>
                  <span className="font-medium text-slate-700 text-right line-clamp-2 max-w-[220px]">
                    {purpose?.trim() ? purpose.trim() : "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-slate-500">Attendees</span>
                  <span className="font-medium text-slate-700 text-right">{expectedAttendees || "—"}</span>
                </div>
              </div>

              <div className="pt-1">
                <AvailabilityBadge
                  available={available}
                  checking={checking}
                  conflictStart={conflictStart}
                  conflictEnd={conflictEnd}
                  message={message}
                />
              </div>

              {conflictInline && (
                <div className="rounded-xl border border-rose-100 bg-rose-50 p-4">
                  <p className="text-sm font-semibold text-rose-700">Time slot conflict</p>
                  <p className="mt-1 text-sm text-rose-700/90">{conflictInline}</p>
                </div>
              )}

              <button
                type="button"
                onClick={form.handleSubmit(onSubmit, onInvalid)}
                disabled={submitting}
                className="w-full rounded-xl px-4 py-2 font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                aria-label="Request booking"
              >
                {submitting && <Loader2 size={18} className="animate-spin" />}
                Request Booking
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

