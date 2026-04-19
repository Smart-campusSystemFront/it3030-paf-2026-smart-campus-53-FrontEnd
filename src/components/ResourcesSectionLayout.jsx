import { Menu } from 'antd'
import { AppstoreOutlined, FilterOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { Link, Outlet, useLocation } from 'react-router-dom'

const VIEWPORT_OFFSET = 80

export default function ResourcesSectionLayout() {
  const { pathname, hash } = useLocation()
  const shellH = `calc(100vh - ${VIEWPORT_OFFSET}px)`

  const selectedKeys = (() => {
    if (pathname.startsWith('/resources/add')) return ['add']
    if (pathname.startsWith('/resources/browse')) return hash === '#filter' ? ['filter'] : ['browse']
    return ['browse']
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
            Resources
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
              key: 'browse',
              icon: <AppstoreOutlined />,
              label: (
                <Link to="/resources/browse" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>
                  Browse &amp; edit
                </Link>
              ),
            },
            {
              key: 'filter',
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
              key: 'add',
              icon: <PlusCircleOutlined />,
              label: (
                <Link to="/resources/add" style={{ color: 'inherit', textDecoration: 'none', fontWeight: 500 }}>
                  Add resource
                </Link>
              ),
            },
          ]}
        />
        <div style={{ marginTop: 'auto', padding: '10px 14px', borderTop: '1px solid rgba(255,255,255,.1)' }}>
          <Link
            to="/bookings"
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'rgba(201,206,220,.85)',
              textDecoration: 'none',
            }}
          >
            ← Bookings
          </Link>
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
