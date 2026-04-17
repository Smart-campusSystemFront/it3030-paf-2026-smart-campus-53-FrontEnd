import { useCallback, useEffect, useRef, useState } from "react";
import { checkAvailability as checkAvailabilityApi } from "../api/bookingApi";

export function useAvailability() {
  const [available, setAvailable] = useState(null); // null | boolean
  const [checking, setChecking] = useState(false);
  const [conflictStart, setConflictStart] = useState(null);
  const [conflictEnd, setConflictEnd] = useState(null);
  const [message, setMessage] = useState("");

  const timerRef = useRef(null);
  const reqIdRef = useRef(0);

  const reset = useCallback(() => {
    setAvailable(null);
    setChecking(false);
    setConflictStart(null);
    setConflictEnd(null);
    setMessage("");
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const checkAvailability = useCallback(
    (resourceId, startTime, endTime) => {
      if (timerRef.current) clearTimeout(timerRef.current);

      const rid = Number(resourceId);
      if (!Number.isFinite(rid) || rid <= 0 || !startTime || !endTime) {
        reset();
        return;
      }

      timerRef.current = setTimeout(async () => {
        const myReqId = ++reqIdRef.current;
        setChecking(true);
        setMessage("Checking availability...");
        try {
          const res = await checkAvailabilityApi(rid, startTime, endTime);
          if (reqIdRef.current !== myReqId) return;

          setAvailable(!!res?.available);
          setConflictStart(res?.conflictingBookingStart || null);
          setConflictEnd(res?.conflictingBookingEnd || null);
          setMessage(res?.message || (res?.available ? "Available" : "Not Available"));
        } catch (e) {
          if (reqIdRef.current !== myReqId) return;
          setAvailable(null);
          setConflictStart(null);
          setConflictEnd(null);
          setMessage(e?.response?.data?.message || "Unable to check availability.");
        } finally {
          if (reqIdRef.current === myReqId) setChecking(false);
        }
      }, 500);
    },
    [reset]
  );

  useEffect(() => () => timerRef.current && clearTimeout(timerRef.current), []);

  return {
    available,
    checking,
    conflictStart,
    conflictEnd,
    message,
    checkAvailability,
    reset,
  };
}

