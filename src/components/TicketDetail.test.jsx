import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import * as api from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { ToastProvider } from '../context/ToastContext.jsx'
import { TicketDetail } from './TicketDetail.jsx'

vi.mock('../context/AuthContext.jsx', () => ({
  useAuth: vi.fn(),
}))

vi.mock('../api.js', async () => {
  const actual = await vi.importActual('../api.js')
  return {
    ...actual,
    getTicket: vi.fn(),
    addComment: vi.fn(),
    listTechnicians: vi.fn(),
  }
})

const sampleTicket = {
  id: 9,
  category: 'Room issue',
  description: 'Leak',
  priority: 'HIGH',
  status: 'OPEN',
  contactName: 'Pat',
  contactEmail: 'pat@example.com',
  contactPhone: '1',
  assignedTechnician: null,
  createdAt: new Date().toISOString(),
  attachments: [],
  comments: [],
}

function renderDetail() {
  return render(
    <MemoryRouter initialEntries={['/dashboard/tickets/9']}>
      <ToastProvider>
        <Routes>
          <Route path="/dashboard/tickets/:id" element={<TicketDetail />} />
        </Routes>
      </ToastProvider>
    </MemoryRouter>,
  )
}

describe('TicketDetail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    api.getTicket.mockResolvedValue(sampleTicket)
    useAuth.mockReturnValue({
      user: { id: 7, role: 'USER', username: 'student1' },
      token: 'token',
      loading: false,
    })
  })

  it('posts a comment when signed in', async () => {
    const user = userEvent.setup()
    api.addComment.mockResolvedValue({
      ...sampleTicket,
      comments: [
        {
          id: 1,
          text: 'hello',
          authorUsername: 'student1',
          authorId: 7,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    })

    renderDetail()

    await waitFor(() => expect(api.getTicket).toHaveBeenCalled())
    await user.type(screen.getByPlaceholderText(/Add an update/i), 'hello')
    await user.click(screen.getByRole('button', { name: /post comment/i }))

    await waitFor(() => {
      expect(api.addComment).toHaveBeenCalledWith('9', 'hello')
    })
  })
})
