import { Layout, Menu } from 'antd'
import {
  CalendarOutlined,
  DashboardOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import { Link, Outlet, useLocation } from 'react-router-dom'

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
            Navigation
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
            My Workspace
          </div>
        </div>

        {/* Accent line */}
        <div
          style={{
            height: 3,
            background: 'linear-gradient(90deg,var(--c-blue),var(--c-amber))',
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
        <div className="animate-fade-up">
          <Outlet />
        </div>
      </Content>
    </Layout>
  )
}
