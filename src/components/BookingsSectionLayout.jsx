import { Menu } from 'antd'
import {
  BarChartOutlined,
  CalendarOutlined,
  PlusCircleOutlined,
  QrcodeOutlined,
} from '@ant-design/icons'
import { Link, Outlet, useLocation } from 'react-router-dom'

/** Site header (60px); `Layout` main has no vertical padding for `/bookings`. */
const BOOKINGS_VIEWPORT_OFFSET = 60

export default function BookingsSectionLayout() {
  const { pathname } = useLocation()
  const shellH = `calc(100vh - ${BOOKINGS_VIEWPORT_OFFSET}px)`

  const selectedKeys = (() => {
    if (pathname === '/bookings' || pathname === '/bookings/') return ['dash']
    if (pathname.startsWith('/bookings/my')) return ['my']
    if (pathname.startsWith('/bookings/new')) return ['new']
    if (pathname.startsWith('/bookings/scanner')) return ['scanner']
    return ['dash']
  })()

  return (
    <div
      className="bookings-section bookings-shell"
      style={{
        height: shellH,
        minHeight: shellH,
        maxHeight: shellH,
        width: '100%',
      }}
    >
      {/* Left nav — card panel, visually separated from outer frame */}
      <aside className="bookings-sidebar-nav bookings-sidebar-panel">
        <div
          style={{
            padding: '16px 18px 10px',
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
            Bookings
          </div>
        </div>
        <div
          style={{
            height: 3,
            background: 'linear-gradient(90deg,var(--c-blue),var(--c-amber))',
            marginBottom: 8,
          }}
        />
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={selectedKeys}
          style={{ background: 'transparent', border: 'none', padding: '4px 10px', overflow: 'hidden' }}
          items={[
            {
              key: 'dash',
              icon: <BarChartOutlined />,
              label: (
                <Link to="/bookings" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>
                  Booking dashboard
                </Link>
              ),
            },
            {
              key: 'my',
              icon: <CalendarOutlined />,
              label: (
                <Link to="/bookings/my" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>
                  My Booking
                </Link>
              ),
            },
            {
              key: 'new',
              icon: <PlusCircleOutlined />,
              label: (
                <Link to="/bookings/new" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>
                  New Booking
                </Link>
              ),
            },
            {
              key: 'scanner',
              icon: <QrcodeOutlined />,
              label: (
                <Link to="/bookings/scanner" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>
                  QR Scanner
                </Link>
              ),
            },
          ]}
        />
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
      </aside>

      <div className="bookings-main-panel animate-fade-up flex min-h-0 flex-1 flex-col bg-transparent">
        <Outlet />
      </div>
    </div>
  )
}
