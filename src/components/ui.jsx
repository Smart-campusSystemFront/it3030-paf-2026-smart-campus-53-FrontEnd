export function Card({ children, className = '' }) {
  return (
    <div className={['rounded-2xl border border-slate-200 bg-white shadow-sm', className].join(' ')}>
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, right }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
      <div>
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  )
}

export function CardBody({ children, className = '' }) {
  return <div className={['px-5 py-4', className].join(' ')}>{children}</div>
}

export function Input({ label, ...props }) {
  return (
    <label className="block">
      {label ? <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span> : null}
      <input
        {...props}
        className={[
          'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none',
          'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
          props.className || '',
        ].join(' ')}
      />
    </label>
  )
}

export function Select({ label, children, ...props }) {
  return (
    <label className="block">
      {label ? <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span> : null}
      <select
        {...props}
        className={[
          'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none',
          'focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20',
          props.className || '',
        ].join(' ')}
      >
        {children}
      </select>
    </label>
  )
}

export function Button({ variant = 'primary', className = '', ...props }) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition disabled:opacity-50'
  const styles =
    variant === 'primary'
      ? 'bg-indigo-600 text-white hover:bg-indigo-700'
      : variant === 'secondary'
        ? 'bg-slate-100 text-slate-900 hover:bg-slate-200'
        : variant === 'danger'
          ? 'bg-rose-600 text-white hover:bg-rose-700'
          : 'bg-white text-slate-900'
  return <button {...props} className={[base, styles, className].join(' ')} />
}

export function Alert({ tone = 'info', children }) {
  const cls =
    tone === 'error'
      ? 'border-rose-200 bg-rose-50 text-rose-800'
      : tone === 'success'
        ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
        : 'border-slate-200 bg-slate-50 text-slate-800'
  return <div className={['rounded-xl border px-4 py-3 text-sm', cls].join(' ')}>{children}</div>
}

