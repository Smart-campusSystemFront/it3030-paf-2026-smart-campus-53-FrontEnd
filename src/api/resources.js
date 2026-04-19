/**
 * In dev, use same-origin `/api` so Vite's proxy (see vite.config.js) forwards to Spring Boot.
 * Override with VITE_API_BASE_URL when the API is on another host (e.g. deployed backend).
 */
const DEFAULT_BASE_URL = ''

function getBaseUrl() {
  const fromEnv = import.meta.env.VITE_API_BASE_URL
  if (fromEnv !== undefined && fromEnv !== null && String(fromEnv).trim() !== '') {
    return String(fromEnv).replace(/\/$/, '')
  }
  return DEFAULT_BASE_URL
}

async function request(path, options = {}) {
  const url = `${getBaseUrl()}${path}`
  let res
  try {
    res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    })
  } catch (e) {
    const isDevProxy = !getBaseUrl()
    const hint = isDevProxy
      ? ' Start the Spring Boot backend on http://127.0.0.1:8080, then refresh. In dev, Vite proxies /api to that address.'
      : ' Check VITE_API_BASE_URL and that the API server is running.'
    throw new Error(
      (e && e.message === 'Failed to fetch'
        ? 'Cannot reach the API (network error).'
        : `Cannot reach the API: ${e?.message || 'unknown error'}`) + hint
    )
  }

  if (res.status === 204) return null

  const contentType = res.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const body = isJson ? await res.json().catch(() => null) : await res.text()

  if (!res.ok) {
    const devProxy = !getBaseUrl()
    if (
      devProxy &&
      (res.status === 502 || res.status === 503 || res.status === 504)
    ) {
      throw new Error(
        `Request failed: ${res.status} (Bad Gateway / upstream unavailable). ` +
          'Start Spring Boot on port 8080 and ensure MySQL is running, then refresh.'
      )
    }
    const message =
      body?.message ||
      (typeof body === 'string' && body.trim()) ||
      `Request failed: ${res.status}`
    throw new Error(message)
  }

  return body
}

export async function listResources({ type, location, minCapacity } = {}) {
  const params = new URLSearchParams()
  if (type) params.set('type', type)
  if (location) params.set('location', location)
  if (minCapacity !== '' && minCapacity !== null && minCapacity !== undefined) {
    params.set('minCapacity', String(minCapacity))
  }
  const q = params.toString()
  return request(`/api/resources${q ? `?${q}` : ''}`)
}

export async function createResource(payload) {
  return request('/api/resources', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export async function updateResource(id, patch) {
  return request(`/api/resources/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
}

export async function deleteResource(id) {
  return request(`/api/resources/${id}`, { method: 'DELETE' })
}

