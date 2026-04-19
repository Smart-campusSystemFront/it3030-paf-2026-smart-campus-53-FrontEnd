import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { TicketForm } from '../../components/tickets/TicketForm.jsx'

export default function CreateTicketPage() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <Link
          to="/dashboard/tickets"
          className="inline-flex items-center gap-2 text-sm font-semibold text-sky-600 underline-offset-2 hover:text-sky-700 hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back to My Tickets
        </Link>
      </div>

      <header>
        <h1 className="font-['Plus_Jakarta_Sans',system-ui,sans-serif] text-2xl font-extrabold tracking-tight text-slate-900 md:text-[1.75rem] md:leading-tight">
          Create ticket
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-[15px] md:leading-7">
          Submit a facility, IT, or maintenance request. Your ticket will appear in My Tickets after you save.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm md:p-8">
        <TicketForm
          hideIntro={false}
          onCancel={() => navigate('/dashboard/tickets')}
          onSuccess={() => navigate('/dashboard/tickets', { replace: true })}
        />
      </section>
    </div>
  )
}
