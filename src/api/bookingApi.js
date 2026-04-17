import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

function getToken() {
  return localStorage.getItem("token");
}

function redirectToLogin() {
  try {
    window.location.assign("/login");
  } catch {
    window.location.href = "/login";
  }
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
      // UI-only mode: do not force navigation to /login.
      // Let pages render their error states instead.
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

export async function getMyBookings() {
  const res = await api.get("/bookings/my");
  return unwrap(res);
}

export async function getAllBookings(filters = {}) {
  const params = {};
  if (filters.status) params.status = filters.status;
  if (filters.date) params.date = filters.date; // YYYY-MM-DD

  const res = await api.get("/bookings", { params });
  const list = unwrap(res) ?? [];

  const search = (filters.search || "").trim().toLowerCase();
  if (!search) return list;

  return list.filter((b) => {
    const hay = `${b.userName || ""} ${b.userEmail || ""}`.toLowerCase();
    return hay.includes(search);
  });
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

export async function checkAvailability(resourceId, startTime, endTime) {
  // Avoid sending "undefined"/NaN query params to the backend.
  const rid = Number(resourceId);
  if (!Number.isFinite(rid) || rid <= 0 || !startTime || !endTime) {
    return {
      available: false,
      message: "Select a resource and time range",
      conflictingBookingStart: null,
      conflictingBookingEnd: null,
    };
  }
  const res = await api.get("/bookings/availability", {
    params: { resourceId: rid, startTime, endTime },
  });
  return unwrap(res);
}

export async function getBookingStats() {
  const res = await api.get("/bookings/stats");
  return unwrap(res);
}

export async function getActiveResources() {
  const res = await api.get("/resources/active");
  return unwrap(res) ?? [];
}

