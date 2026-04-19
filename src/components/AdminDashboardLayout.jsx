import { Layout, Menu } from 'antd'
import {
  CalendarOutlined,
  DashboardOutlined,
  FileTextOutlined,
  TeamOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const { Sider, Content } = Layout

const SHELL_H = 'calc(100vh - 124px)'

export default function AdminDashboardLayout() {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const selectedKeys = (() => {
    if (pathname.startsWith('/admin/users')) return ['users']
    if (pathname.startsWith('/admin/bookings')) return ['bookings']
    if (pathname.startsWith('/admin/tickets')) return ['tickets']
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
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {/* ── Admin Sidebar (fixed height, no scroll) ── */}
      <Sider
        width={240}
        style={{
          height: '100%',
          maxHeight: '100%',
          background: 'var(--c-navy)',
          borderRight: 'none',
          position: 'relative',
          overflow: 'hidden',
          overflowY: 'hidden',
          flexShrink: 0,
        }}
      >
        {/* Sidebar header with amber accent badge */}
        <div
          style={{
            padding: '20px 20px 14px',
            borderBottom: '1px solid rgba(255,255,255,.07)',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(249,191,59,.15)',
              border: '1px solid rgba(249,191,59,.3)',
              borderRadius: 6,
              padding: '2px 8px',
              marginBottom: 8,
            }}
          >
            <SettingOutlined style={{ color: 'var(--c-amber)', fontSize: 10 }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--c-amber)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              {user?.role === 'ADMIN' ? 'ADMIN' : 'TECHNICIAN'}
            </span>
          </div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: '#ffffff',
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              letterSpacing: '-0.2px',
            }}
          >
            Administration
          </div>
          <div style={{ fontSize: 12, color: 'rgba(201,206,220,.6)', marginTop: 2 }}>
            Manage campus operations
          </div>
        </div>

        {/* Amber accent stripe */}
        <div
          style={{
            height: 3,
            background: 'linear-gradient(90deg,var(--c-amber),var(--c-blue))',
            marginBottom: 8,
          }}
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
              label: <Link to="/admin/overview" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>Overview</Link>,
            },
            ...(user?.role === 'ADMIN' ? [{
              key: 'users',
              icon: <TeamOutlined />,
              label: <Link to="/admin/users" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>User Management</Link>,
            }] : []),
            {
              key: 'bookings',
              icon: <CalendarOutlined />,
              label: <Link to="/admin/bookings" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>Booking Management</Link>,
            },
            {
              key: 'tickets',
              icon: <FileTextOutlined />,
              label: <Link to="/admin/tickets" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>Tickets</Link>,
            },
          ]}
        />

        {/* Decorative radial glows */}
        <div
          style={{
            position: 'absolute',
            bottom: -40,
            right: -40,
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(249,191,59,.10) 0%,transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: -60,
            width: 160,
            height: 160,
            borderRadius: '50%',
            background: 'radial-gradient(circle,rgba(0,145,255,.08) 0%,transparent 70%)',
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
        <div className="animate-fade-up">
          <Outlet />
        </div>
      </Content>
    </Layout>
  )
}
