import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

function getToken() {
  return localStorage.getItem("token");
}

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      // Let pages show errors; do not redirect automatically.
    }
    return Promise.reject(error);
  }
);

function unwrap(res) {
  return res?.data?.data;
}

export async function createBooking(data) {
  const res = await api.post("/bookings", data);
  return unwrap(res);
}

/**
 * Unified listing: backend returns the caller's bookings for USER, all for ADMIN.
 */
export async function getBookings(filters = {}) {
  const params = {};
  if (filters.status) params.status = filters.status;
  if (filters.from) params.from = filters.from;
  if (filters.to) params.to = filters.to;
  if (filters.date) params.date = filters.date;
  if (filters.resourceId != null && filters.resourceId !== "") {
    const n = Number(filters.resourceId);
    if (Number.isFinite(n) && n > 0) params.resourceId = n;
  }

  const res = await api.get("/bookings", { params });
  let list = unwrap(res) ?? [];

  const search = (filters.search || "").trim().toLowerCase();
  if (search) {
    list = list.filter((b) => {
      const hay = `${b.userName || ""} ${b.userEmail || ""} ${b.resourceName || ""}`.toLowerCase();
      return hay.includes(search);
    });
  }
  return list;
}

export async function getMyBookings() {
  return getBookings({});
}

export async function getBookingById(id) {
  const res = await api.get(`/bookings/${id}`);
  return unwrap(res);
}

export async function approveBooking(id) {
  const res = await api.put(`/bookings/${id}/approve`);
  return unwrap(res);
}

export async function rejectBooking(id, reason) {
  const res = await api.put(`/bookings/${id}/reject`, { reason });
  return unwrap(res);
}

export async function cancelBooking(id) {
  const res = await api.put(`/bookings/${id}/cancel`);
  return unwrap(res);
}

export async function cancelBookingWithReason(id, reason) {
  const res = await api.patch(`/bookings/${id}/cancel`, { reason });
  return unwrap(res);
}

export async function checkAvailability(resourceId, startTime, endTime) {
  const rid = Number(resourceId);
  if (!Number.isFinite(rid) || rid <= 0 || !startTime || !endTime) {
    return {
      available: false,
      message: "Select a resource and time range",
      conflictingBookingStart: null,
      conflictingBookingEnd: null,
      availableSlots: [],
    };
  }
  const res = await api.get("/bookings/availability", {
    params: { resourceId: rid, startTime, endTime },
  });
  return unwrap(res);
}

/** Free slots for a calendar day (1-hour increments, server-side). */
export async function getDayAvailability(resourceId, date) {
  const rid = Number(resourceId);
  if (!Number.isFinite(rid) || rid <= 0 || !date) {
    return {
      availableSlots: [],
      message: "Select a resource and date",
      date: null,
    };
  }
  const res = await api.get("/bookings/availability", {
    params: { resourceId: rid, date },
  });
  return unwrap(res);
}

export async function getBookingStats() {
  const res = await api.get("/bookings/stats");
  return unwrap(res);
}

export async function fetchBookingQrBlob(id) {
  const res = await api.get(`/bookings/${id}/qr`, { responseType: "blob" });
  return res.data;
}

export async function getActiveResources() {
  const res = await api.get("/resources/active");
  return unwrap(res) ?? [];
}

export function exportBookingsCsv(bookings, filename = "bookings-export.csv") {
  const rows = Array.isArray(bookings) ? bookings : [];
  const headers = [
    "id",
    "status",
    "resourceName",
    "userEmail",
    "userName",
    "startTime",
    "endTime",
    "purpose",
    "expectedAttendees",
  ];
  const escape = (v) => {
    const s = v == null ? "" : String(v);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const lines = [headers.join(",")];
  for (const b of rows) {
    lines.push(
      headers.map((h) => escape(b[h])).join(",")
    );
  }
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
