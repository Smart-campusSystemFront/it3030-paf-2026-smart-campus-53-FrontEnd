import { Layout, Menu } from 'antd'
import {
  DashboardOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import { Link, Outlet, useLocation } from 'react-router-dom'

const { Sider, Content } = Layout

export default function UserDashboardLayout() {
  const { pathname } = useLocation()
  const selectedKeys = pathname.startsWith('/dashboard/tickets') ? ['tickets'] : ['overview']

  return (
    <Layout
      style={{
        minHeight: 'calc(100vh - 124px)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {/* ── Sidebar ── */}
      <Sider
        width={230}
        style={{
          background: 'var(--bg-sidebar)',
          borderRight: 'none',
          position: 'relative',
          overflow: 'hidden',
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
          style={{ background: 'transparent', border: 'none', padding: '4px 10px' }}
          items={[
            {
              key: 'overview',
              icon: <DashboardOutlined />,
              label: <Link to="/dashboard" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>Overview</Link>,
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

      {/* ── Content ── */}
      <Content
        style={{
          background: 'var(--bg-page)',
          padding: 28,
          minHeight: 420,
        }}
      >
        <div className="animate-fade-up">
          <Outlet />
        </div>
      </Content>
    </Layout>
  )
}
