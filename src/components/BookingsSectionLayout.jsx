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

/** Site header (60px) + `Layout` main padding for `/bookings` (8 + 12). */
const BOOKINGS_VIEWPORT_OFFSET = 80

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
      style={{
        height: shellH,
        minHeight: shellH,
        maxHeight: shellH,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        width: '100%',
        overflow: 'hidden',
        background: 'var(--bg-page)',
      }}
    >
      {/* Left nav — same width as workspace Sider, fixed height, no scroll */}
      <aside
        style={{
          width: 230,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          background: 'var(--bg-sidebar, #001845)',
          position: 'relative',
          overflowX: 'hidden',
          overflowY: 'auto',
        }}
      >
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
            padding: '10px 10px 12px',
            marginTop: 4,
            borderTop: '1px solid rgba(255,255,255,.12)',
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

      <div
        style={{
          flex: 1,
          minWidth: 0,
          minHeight: 0,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          overflowX: 'hidden',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          paddingLeft: 12,
        }}
        className="animate-fade-up"
      >
        <Outlet />
      </div>
    </div>
  )
}
