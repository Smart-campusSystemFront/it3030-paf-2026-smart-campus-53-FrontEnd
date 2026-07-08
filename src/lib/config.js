function normalizeApiBase(raw) {
  if (raw == null || String(raw).trim() === '') return '/api'
  const value = String(raw).trim().replace(/\/+$/, '')
  if (value.startsWith('/')) return value || '/api'
  if (/^https?:\/\//i.test(value)) {
    return value.toLowerCase().endsWith('/api') ? value : `${value}/api`
  }
  return '/api'
}

export const API_BASE_URL = normalizeApiBase(import.meta.env.VITE_API_BASE_URL)

