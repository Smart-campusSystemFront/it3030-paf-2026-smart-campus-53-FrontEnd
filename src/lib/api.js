import { API_BASE_URL } from './config.js'
import { getToken } from './storage.js'

function joinUrl(base, path) {
  if (!path) return base
  if (base.endsWith('/') && path.startsWith('/')) return base + path.slice(1)
  if (!base.endsWith('/') && !path.startsWith('/')) return base + '/' + path
  return base + path
}

async function parseJsonSafe(res) {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return { message: text }
  }
}

export async function apiRequest(path, { method, body, headers } = {}) {
  const token = getToken()
  const res = await fetch(joinUrl(API_BASE_URL, path), {
    method: method || (body ? 'POST' : 'GET'),
    headers: {
      ...(body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers || {}),
    },
    body: body
      ? body instanceof FormData
        ? body
        : JSON.stringify(body)
      : undefined,
    credentials: 'include',
  })

  if (!res.ok) {
    const data = await parseJsonSafe(res)
    const msg =
      data?.message ||
      data?.error ||
      (typeof data === 'string' ? data : null) ||
      `Request failed (${res.status})`
    const err = new Error(msg)
    err.status = res.status
    err.data = data
    throw err
  }

  return parseJsonSafe(res)
}

