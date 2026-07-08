import { getToken } from './lib/storage.js'
import { API_BASE_URL } from './lib/config.js'

let authToken = null
let authUser = null

export function setSession(token, user) {
  authToken = token
  authUser = user
}

export function clearSession() {
  authToken = null
  authUser = null
}

/** Token prefers in-memory LoginBar session, then JWT from AuthContext/localStorage. */
export function getSession() {
  return { token: authToken || getToken() || null, user: authUser }
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {})
  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }
  const bearer = authToken || getToken()
  if (bearer) {
    headers.set('Authorization', `Bearer ${bearer}`)
  }
  const normalizedPath =
    API_BASE_URL.toLowerCase().endsWith('/api') && path.startsWith('/api/')
      ? path.slice(4)
      : path
  const url =
    API_BASE_URL.endsWith('/') && normalizedPath.startsWith('/')
      ? `${API_BASE_URL}${normalizedPath.slice(1)}`
      : `${API_BASE_URL}${normalizedPath}`
  const res = await fetch(url, { ...options, headers, credentials: 'include' })
  if (res.status === 204) {
    return null
  }
  const text = await res.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = { message: text.slice(0, 300) }
    }
  }
  if (!res.ok) {
    const msg = data?.message || data?.error || res.statusText
    throw new Error(msg)
  }
  return data
}

export async function login(username, password) {
  return request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
}

export async function createTicket(formData) {
  return request('/api/tickets', {
    method: 'POST',
    body: formData,
  })
}

export async function listTickets() {
  return request('/api/tickets')
}

/** Tickets submitted by the signed-in user (see GET /api/tickets/me). */
export async function listMyTickets() {
  return request('/api/tickets/me')
}

export async function getTicket(id) {
  return request(`/api/tickets/${id}`)
}

export async function deleteTicket(id) {
  return request(`/api/tickets/${id}`, { method: 'DELETE' })
}

export async function updateTicketStatus(id, status) {
  return request(`/api/tickets/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  })
}

export async function assignTechnician(id, technicianId) {
  return request(`/api/tickets/${id}/assign`, {
    method: 'PUT',
    body: JSON.stringify({ technicianId }),
  })
}

export async function addComment(ticketId, text) {
  return request(`/api/tickets/${ticketId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ text }),
  })
}

export async function updateComment(ticketId, commentId, text) {
  return request(`/api/tickets/${ticketId}/comments/${commentId}`, {
    method: 'PUT',
    body: JSON.stringify({ text }),
  })
}

export async function deleteComment(ticketId, commentId) {
  return request(`/api/tickets/${ticketId}/comments/${commentId}`, {
    method: 'DELETE',
  })
}

export async function listTechnicians() {
  return request('/api/technicians')
}

export async function listNotifications() {
  return request('/api/notifications')
}
