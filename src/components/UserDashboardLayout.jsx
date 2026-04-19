import { Layout, Menu } from 'antd'
import {
  CalendarOutlined,
  DashboardOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, FileText } from 'lucide-react'

const { Sider, Content } = Layout

/** Site header 60px; `Layout` main has no vertical padding for `/dashboard/*`. */
const SHELL_H = 'calc(100vh - 60px)'

export default function UserDashboardLayout() {
  const { pathname } = useLocation()
  const selectedKeys = (() => {
    if (pathname.startsWith('/dashboard/tickets')) return ['tickets']
    return ['overview']
  })()

  return (
    <Layout
      style={{
        height: SHELL_H,
        minHeight: SHELL_H,
        maxHeight: SHELL_H,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        overflow: 'hidden',
        background: 'transparent',
        border: 'none',
        boxShadow: 'none',
        borderRadius: 0,
      }}
    >
      {/* ── Sidebar (fixed height, no scroll) ── */}
      <Sider
        width={230}
        style={{
          height: '100%',
          maxHeight: '100%',
          background: 'var(--bg-sidebar, #001845)',
          border: 'none',
          borderRight: 'none',
          outline: 'none',
          boxShadow: 'none',
          position: 'relative',
          overflow: 'hidden',
          overflowY: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* Sidebar header */}
        <div
          style={{
            padding: '20px 20px 12px',
            borderBottom: '1px solid rgba(255,255,255,.07)',
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: 'rgba(201,206,220,.5)',
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
function NavItem({ to, icon: Icon, children }) {
  const { pathname } = useLocation()
  const active =
    to === '/dashboard'
      ? pathname === '/dashboard' || pathname === '/dashboard/'
      : pathname.startsWith(to)

  return (
    <Link
      to={to}
      className={[
        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200',
        active
          ? 'bg-sky-500/15 text-sky-300 ring-1 ring-sky-400/25'
          : 'text-slate-300 hover:bg-white/[0.06] hover:text-white',
      ].join(' ')}
    >
      <Icon className="size-[18px] shrink-0 opacity-90" strokeWidth={2} />
      {children}
    </Link>
  )
}

export default function UserDashboardLayout() {
  return (
    <div className="flex min-h-[calc(100vh-124px)] overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_8px_30px_rgb(15_23_42/0.08)]">
      <aside className="relative w-[230px] shrink-0 bg-[#001845] text-slate-300">
        <div className="border-b border-white/[0.07] px-5 pb-3 pt-5">
          <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
            Navigation
          </div>
          <div className="font-['Plus_Jakarta_Sans',system-ui,sans-serif] text-[15px] font-bold tracking-tight text-white">
            My Workspace
          </div>
        </div>
        <div className="mb-2 h-[3px] bg-gradient-to-r from-sky-500 to-amber-400" />
        <nav className="flex flex-col gap-1 px-2.5 pb-8">
          <NavItem to="/dashboard" icon={LayoutDashboard}>
            Overview
          </NavItem>
          <NavItem to="/dashboard/tickets" icon={FileText}>
            My Tickets
          </NavItem>
        </nav>
        <div
          className="pointer-events-none absolute -bottom-14 -left-8 size-[180px] rounded-full bg-[radial-gradient(circle,rgba(0,145,255,0.14)_0%,transparent_70%)]"
          aria-hidden
        />

        {/* Menu */}
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={selectedKeys}
          style={{ background: 'transparent', border: 'none', padding: '4px 10px', overflow: 'hidden' }}
          items={[
            {
              key: 'overview',
              icon: <DashboardOutlined />,
              label: <Link to="/dashboard" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>Overview</Link>,
            },
            {
              key: 'bookings',
              icon: <CalendarOutlined />,
              label: <Link to="/bookings" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>Bookings</Link>,
            },
            {
              key: 'tickets',
              icon: <FileTextOutlined />,
              label: <Link to="/dashboard/tickets" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>My Tickets</Link>,
            },
          ]}
        />

        {/* Sidebar bottom decorative glow */}
        <div
          style={{
            position: 'absolute',
            bottom: -60,
            left: -30,
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(0,145,255,.12) 0%,transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      </Sider>

      {/* ── Content (only this pane scrolls) ── */}
      <Content
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          height: '100%',
          background: 'var(--bg-page)',
          padding: 28,
          overflowX: 'hidden',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
      </aside>
      <main className="min-h-[420px] flex-1 bg-slate-50/90 p-6 md:p-8 lg:p-10">
        <div className="animate-fade-up">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
