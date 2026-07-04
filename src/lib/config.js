export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.toString() ??
  (import.meta.env.PROD ? '' : 'http://localhost:8080')

