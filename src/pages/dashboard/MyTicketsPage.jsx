import React from 'react'
import { getSession } from '../../api.js'
import { CreateTicketLink } from '../../components/tickets/CreateTicketLink.jsx'
import { TicketList } from '../../components/tickets/TicketList.jsx'

function isStaffRole(role) {
  return role === 'ADMIN' || role === 'TECHNICIAN'
}

export default function MyTicketsPage() {
  const staff = isStaffRole(getSession().user?.role)

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0 flex-1">
          <h1 className="font-['Plus_Jakarta_Sans',system-ui,sans-serif] text-2xl font-extrabold tracking-tight text-slate-900 md:text-[1.75rem] md:leading-tight">
            My Tickets
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-[15px] md:leading-7">
            {staff
              ? 'View every ticket submitted on campus. Use Create Ticket to log a new facility, IT, or maintenance issue.'
              : 'View tickets you have submitted. Use Create Ticket to open the full-page form for a new facility, IT, or maintenance issue.'}
          </p>
        </div>
        <div className="flex shrink-0 justify-end sm:pt-1">
          <CreateTicketLink />
        </div>
      </header>
      <TicketList />
    </div>
  )
}
