import { Menu } from 'antd'
import {
  AppstoreOutlined,
  BarChartOutlined,
  CalendarOutlined,
  FilterOutlined,
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
            <CalendarOutlined style={{ color: '#e0f2fe', fontSize: 10 }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: '#f0f9ff', letterSpacing: '1px', textTransform: 'uppercase' }}>
              Bookings hub
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
            Bookings
          </div>
          <div style={{ fontSize: 12, color: 'rgba(201,206,220,.6)', marginTop: 2 }}>
            Reserve rooms, labs & equipment
          </div>
        </div>
        <div
          style={{
            height: 3,
            background: 'linear-gradient(90deg,#7dd3fc,#38bdf8,#0ea5e9)',
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
            padding: '10px 10px 12px',
            marginTop: 4,
            borderTop: '1px solid rgba(255,255,255,.1)',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: 'rgba(201,206,220,.5)',
              letterSpacing: '1.2px',
              textTransform: 'uppercase',
              marginBottom: 8,
              paddingLeft: 6,
            }}
          >
            Resources
          </div>
          <Menu
            mode="inline"
            theme="dark"
            selectable={false}
            style={{ background: 'transparent', border: 'none', padding: '0 4px' }}
            items={[
              {
                key: 'res-browse',
                icon: <AppstoreOutlined />,
                label: (
                  <Link to="/resources/browse" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>
                    Browse &amp; edit
                  </Link>
                ),
              },
              {
                key: 'res-filter',
                icon: <FilterOutlined />,
                label: (
                  <Link
                    to="/resources/browse#filter"
                    style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}
                  >
                    Filter &amp; search
                  </Link>
                ),
              },
              {
                key: 'res-add',
                icon: <PlusCircleOutlined />,
                label: (
                  <Link to="/resources/add" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>
                    Add resource
                  </Link>
                ),
              },
            ]}
          />
        </div>

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
      </aside>

      <div className="bookings-main-panel animate-fade-up flex min-h-0 flex-1 flex-col bg-transparent">
        <Outlet />
      </div>
    </div>
  )
}
