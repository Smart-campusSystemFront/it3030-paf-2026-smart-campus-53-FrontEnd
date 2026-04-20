import React from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'

/** Primary action — navigates to the full-page create ticket flow. */
export function CreateTicketLink() {
  return (
    <Link
      to="/dashboard/tickets/new"
      className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/40 sm:px-5"
    >
      <Plus className="size-4" strokeWidth={2.5} aria-hidden />
      Create Ticket
    </Link>
  )
}
