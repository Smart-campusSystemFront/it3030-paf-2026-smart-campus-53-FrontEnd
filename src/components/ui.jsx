/* ──────────────────────────────────────────
   Shared UI Kit — Smart Campus Design System
   Primary:  #00205B (navy)
   Accent:   #0091FF (electric blue)
   Highlight:#F9BF3B (amber)
   Muted:    #C9CEDC (light slate)
─────────────────────────────────────────── */

/* ── Card ── */
export function Card({ children, className = '' }) {
  return (
    <div
      className={className}
      style={{
        background: '#ffffff',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-sm)',
        transition: 'box-shadow var(--duration) var(--ease), transform var(--duration) var(--ease)',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
        e.currentTarget.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {children}
    </div>
  )
}

/* ── CardHeader ── */
export function CardHeader({ title, subtitle, right }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 16,
        padding: '18px 24px',
        borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(180deg,#fafbfd 0%,#ffffff 100%)',
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            fontSize: 17,
            fontWeight: 700,
            color: 'var(--c-navy)',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            letterSpacing: '-0.3px',
          }}
        >
          {title}
        </h2>
        {subtitle ? (
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {subtitle}
          </p>
        ) : null}
      </div>
      {right ? <div style={{ flexShrink: 0 }}>{right}</div> : null}
    </div>
  )
}

/* ── CardBody ── */
export function CardBody({ children, className = '' }) {
  return (
    <div className={className} style={{ padding: '20px 24px' }}>
      {children}
    </div>
  )
}

/* ── Input ── */
export function Input({ label, ...props }) {
  return (
    <label style={{ display: 'block' }}>
      {label ? (
        <span
          style={{
            display: 'block',
            marginBottom: 6,
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--c-slate-dk)',
            letterSpacing: '0.1px',
          }}
        >
          {label}
        </span>
      ) : null}
      <input
        {...props}
        style={{
          width: '100%',
          borderRadius: 'var(--radius-sm)',
          border: '1.5px solid var(--border)',
          background: '#fff',
          padding: '9px 13px',
          fontSize: 14,
          color: 'var(--text-primary)',
          outline: 'none',
          transition: 'border-color var(--duration) var(--ease), box-shadow var(--duration) var(--ease)',
          ...props.style,
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--c-blue)'
          e.target.style.boxShadow = 'var(--shadow-glow)'
          props.onFocus?.(e)
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--border)'
          e.target.style.boxShadow = 'none'
          props.onBlur?.(e)
        }}
        className={props.className || ''}
      />
    </label>
  )
}

/* ── Select ── */
export function Select({ label, children, ...props }) {
  return (
    <label style={{ display: 'block' }}>
      {label ? (
        <span
          style={{
            display: 'block',
            marginBottom: 6,
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--c-slate-dk)',
          }}
        >
          {label}
        </span>
      ) : null}
      <select
        {...props}
        style={{
          width: '100%',
          borderRadius: 'var(--radius-sm)',
          border: '1.5px solid var(--border)',
          background: '#fff',
          padding: '9px 13px',
          fontSize: 14,
          color: 'var(--text-primary)',
          outline: 'none',
          appearance: 'none',
          cursor: 'pointer',
          ...props.style,
        }}
      >
        {children}
      </select>
    </label>
  )
}

/* ── Button ── */
const BTN_VARIANTS = {
  primary: {
    background: 'linear-gradient(135deg,#0091FF,#0070d1)',
    color: '#ffffff',
    border: 'none',
    boxShadow: '0 4px 12px rgb(0 145 255/.30)',
  },
  secondary: {
    background: '#ffffff',
    color: 'var(--c-navy)',
    border: '1.5px solid var(--border)',
    boxShadow: 'var(--shadow-sm)',
  },
  danger: {
    background: 'linear-gradient(135deg,#ef4444,#dc2626)',
    color: '#ffffff',
    border: 'none',
    boxShadow: '0 4px 12px rgb(239 68 68/.30)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--c-blue)',
    border: '1.5px solid var(--c-blue)',
    boxShadow: 'none',
  },
  amber: {
    background: 'linear-gradient(135deg,#F9BF3B,#f59e0b)',
    color: 'var(--c-navy)',
    border: 'none',
    boxShadow: '0 4px 12px rgb(249 191 59/.30)',
  },
}

export function Button({ variant = 'primary', className = '', style: styleProp = {}, ...props }) {
  const v = BTN_VARIANTS[variant] ?? BTN_VARIANTS.primary
  return (
    <button
      {...props}
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        borderRadius: 'var(--radius-sm)',
        padding: '9px 18px',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'transform var(--duration) var(--ease), box-shadow var(--duration) var(--ease), opacity var(--duration)',
        letterSpacing: '0.1px',
        fontFamily: "'Inter', sans-serif",
        ...v,
        ...styleProp,
        ...(props.disabled ? { opacity: 0.55, cursor: 'not-allowed', transform: 'none' } : {}),
      }}
      onMouseEnter={(e) => {
        if (!props.disabled) {
          e.currentTarget.style.transform = 'translateY(-1px)'
          e.currentTarget.style.filter = 'brightness(1.08)'
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.filter = 'none'
      }}
    />
  )
}

/* ── Alert ── */
const ALERT_TONES = {
  error:   { bg: '#fff1f2', border: '#fca5a5', text: '#991b1b', icon: '✕' },
  success: { bg: '#f0fdf4', border: '#86efac', text: '#166534', icon: '✓' },
  warning: { bg: '#fffbeb', border: '#fcd34d', text: '#92400e', icon: '⚠' },
  info:    { bg: 'var(--c-blue-light)', border: '#93c5fd', text: '#1e40af', icon: 'ℹ' },
}

export function Alert({ tone = 'info', children }) {
  const t = ALERT_TONES[tone] ?? ALERT_TONES.info
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        borderRadius: 'var(--radius-sm)',
        border: `1.5px solid ${t.border}`,
        background: t.bg,
        padding: '10px 14px',
        fontSize: 13,
        color: t.text,
        fontWeight: 500,
        animation: 'fadeUp .25s var(--ease) both',
      }}
    >
      <span style={{ fontWeight: 700, flexShrink: 0, lineHeight: 1.6 }}>{t.icon}</span>
      <span style={{ lineHeight: 1.6 }}>{children}</span>
    </div>
  )
}

/* ── Badge ── */
const BADGE_COLORS = {
  blue:  { bg: 'var(--c-blue-light)',  text: 'var(--c-blue)',  border: '#bae6fd' },
  navy:  { bg: '#eff6ff',              text: 'var(--c-navy)',  border: '#bfdbfe' },
  amber: { bg: 'var(--c-amber-light)', text: '#92400e',        border: '#fcd34d' },
  green: { bg: '#f0fdf4',              text: '#166534',        border: '#86efac' },
  red:   { bg: '#fff1f2',              text: '#991b1b',        border: '#fca5a5' },
  gray:  { bg: '#f8fafc',              text: '#4a5568',        border: 'var(--border)' },
}

export function Badge({ color = 'blue', children }) {
  const c = BADGE_COLORS[color] ?? BADGE_COLORS.gray
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        background: c.bg,
        color: c.text,
        border: `1px solid ${c.border}`,
        borderRadius: 6,
        padding: '2px 8px',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.4px',
        textTransform: 'uppercase',
      }}
    >
      {children}
    </span>
  )
}

/* ── Divider ── */
export function Divider({ label } = {}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' }}>
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
      {label ? (
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          {label}
        </span>
      ) : null}
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  )
}
