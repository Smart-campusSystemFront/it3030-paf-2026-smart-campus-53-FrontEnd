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

export function getSession() {
  return { token: authToken, user: authUser }
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {})
  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }
  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`)
  }
  const res = await fetch(path, { ...options, headers })
  if (res.status === 204) {
    return null
  }
  const text = await res.text()
  const data = text ? JSON.parse(text) : null
  if (!res.ok) {
    const msg = data?.error || res.statusText
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

export async function getTicket(id) {
  return request(`/api/tickets/${id}`)
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
