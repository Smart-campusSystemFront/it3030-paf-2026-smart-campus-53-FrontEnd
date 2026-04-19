export const TYPES = ['ROOM', 'LAB', 'EQUIPMENT']
export const STATUSES = ['ACTIVE', 'OUT_OF_SERVICE']

export function emptyForm() {
  return {
    name: '',
    type: 'ROOM',
    capacity: '',
    location: '',
    availability: '',
    status: 'ACTIVE',
  }
}

export function isBackendUnreachableMessage(msg) {
  if (!msg || typeof msg !== 'string') return false
  return (
    msg.includes('Cannot reach the API') ||
    msg.includes('Failed to fetch') ||
    msg.includes('network error') ||
    msg.includes('ECONNREFUSED') ||
    msg.includes('Request failed: 502') ||
    msg.includes('Request failed: 503') ||
    msg.includes('Request failed: 504') ||
    msg.includes('Bad Gateway')
  )
}
