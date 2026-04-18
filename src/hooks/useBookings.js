import { useCallback, useEffect, useMemo, useState } from "react";
import { getBookings } from "../api/bookingApi";

export function useBookings(initialFilters = {}) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const defaultFilters = useMemo(() => initialFilters, [initialFilters]);

  const fetchBookings = useCallback(
    async (filters = defaultFilters) => {
      setLoading(true);
      setError("");
      try {
        const data = await getBookings(filters);
        setBookings(Array.isArray(data) ? data : []);
      } catch (e) {
        setError(
          e?.response?.data?.message ||
            e?.message ||
            "Failed to load bookings. Please try again."
        );
      } finally {
        setLoading(false);
      }
    },
    [defaultFilters]
  );

  const deleteFromList = useCallback((id) => {
    setBookings((prev) => prev.filter((b) => String(b.id) !== String(id)));
  }, []);

  const updateInList = useCallback((id, updatedBooking) => {
    setBookings((prev) =>
      prev.map((b) => (String(b.id) === String(id) ? updatedBooking : b))
    );
  }, []);

  useEffect(() => {
    fetchBookings(defaultFilters);
  }, [fetchBookings, defaultFilters]);

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    deleteFromList,
    updateInList,
    setBookings,
  };
}
