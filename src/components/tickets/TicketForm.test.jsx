import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import * as api from '../../api.js'
import { ToastProvider } from '../../context/ToastContext.jsx'
import { TicketForm } from './TicketForm.jsx'

vi.mock('../../api.js', async () => {
  const actual = await vi.importActual('../../api.js')
  return { ...actual, createTicket: vi.fn() }
})

function renderForm() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <ToastProvider>
        <Routes>
          <Route path="/" element={<TicketForm />} />
        </Routes>
      </ToastProvider>
    </MemoryRouter>,
  )
}

describe('TicketForm', () => {
  it('creates a ticket and calls onSuccess', async () => {
    const user = userEvent.setup()
    const onSuccess = vi.fn()
    api.createTicket.mockResolvedValue({ id: 42 })

    render(
      <MemoryRouter initialEntries={['/']}>
        <ToastProvider>
          <TicketForm onSuccess={onSuccess} />
        </ToastProvider>
      </MemoryRouter>,
    )

    await user.type(screen.getByPlaceholderText(/What happened/i), 'Broken projector in hall A')
    await user.type(screen.getByLabelText(/^Name/i), 'Jamie')
    await user.type(screen.getByLabelText(/^Email/i), 'jamie@example.com')
    await user.type(screen.getByLabelText(/^Phone/i), '555-1212')

    await user.click(screen.getByRole('button', { name: /submit ticket/i }))

    await waitFor(() => {
      expect(api.createTicket).toHaveBeenCalled()
    })
    const fd = api.createTicket.mock.calls[0][0]
    expect(fd.get('category')).toBeTruthy()
    expect(fd.get('description')).toContain('Broken projector')
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith(expect.objectContaining({ id: 42 }))
    })
  })

  it('blocks more than three images', async () => {
    const user = userEvent.setup()
    const fileInput = () => screen.getByLabelText(/Evidence images/i)
    const f1 = new File(['a'], 'a.png', { type: 'image/png' })
    const f2 = new File(['b'], 'b.png', { type: 'image/png' })
    const f3 = new File(['c'], 'c.png', { type: 'image/png' })
    const f4 = new File(['d'], 'd.png', { type: 'image/png' })

    renderForm()

    await user.upload(fileInput(), [f1, f2, f3, f4])
    expect(await screen.findByText(/at most 3 images/i)).toBeInTheDocument()
  })
})
