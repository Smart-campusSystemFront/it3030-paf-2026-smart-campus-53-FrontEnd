const DEFAULT_BASE_URL = 'http://localhost:8080'

function getBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL
}

async function request(path, options = {}) {
  const res = await fetch(`${getBaseUrl()}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  })

  if (res.status === 204) return null

  const contentType = res.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const body = isJson ? await res.json().catch(() => null) : await res.text()

  if (!res.ok) {
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

