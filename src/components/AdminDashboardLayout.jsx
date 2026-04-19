import { Layout, Menu } from 'antd'
import {
  CalendarOutlined,
  DashboardOutlined,
  FileTextOutlined,
  TeamOutlined,
  SettingOutlined,
  BellOutlined,
} from '@ant-design/icons'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const { Sider, Content } = Layout

/** Site header 60px; `Layout` main has no vertical padding for `/admin/*`. */
const SHELL_H = 'calc(100vh - 60px)'

export default function AdminDashboardLayout() {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const selectedKeys = (() => {
    if (pathname.startsWith('/admin/users')) return ['users']
    if (pathname.startsWith('/admin/bookings')) return ['bookings']
    if (pathname.startsWith('/admin/tickets')) return ['tickets']
    if (pathname.startsWith('/admin/notifications')) return ['notifications']
    return ['overview']
  })()

  return (
    <Layout
      className="admin-dashboard-layout"
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
        outline: 'none',
      }}
    >
      {/* ── Admin Sidebar (fixed height, no scroll) ── */}
      <Sider
        width={240}
        style={{
          height: '100%',
          maxHeight: '100%',
          background: 'linear-gradient(180deg, #0d5cb8 0%, #084a9a 40%, #063a7d 100%)',
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
            padding: '20px 20px 14px',
            borderBottom: 'none',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(255,255,255,.14)',
              border: 'none',
              borderRadius: 6,
              padding: '2px 8px',
              marginBottom: 8,
            }}
          >
            <SettingOutlined style={{ color: '#e0f2fe', fontSize: 10 }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#f0f9ff', letterSpacing: '1px', textTransform: 'uppercase' }}>
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

        {/* Accent stripe */}
        <div
          style={{
            height: 3,
            background: 'linear-gradient(90deg,#7dd3fc,#38bdf8,#0ea5e9)',
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
            ...(user?.role === 'ADMIN' ? [{
              key: 'notifications',
              icon: <BellOutlined />,
              label: <Link to="/admin/notifications" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>Notifications</Link>,
            }] : []),
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
            background: 'radial-gradient(circle,rgba(56,189,248,.18) 0%,transparent 70%)',
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
            background: 'radial-gradient(circle,rgba(14,165,233,.14) 0%,transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      </Sider>

      {/* ── Content (only this pane scrolls) ── */}
      <Content
        className="admin-dashboard-content"
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
          border: 'none',
          outline: 'none',
          boxShadow: 'none',
        }}
      >
        <div className="animate-fade-up">
          <Outlet />
        </div>
      </Content>
    </Layout>
  )
}
