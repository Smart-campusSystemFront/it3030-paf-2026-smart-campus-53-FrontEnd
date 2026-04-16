import { Link, NavLink, Outlet } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket, faBell, faGauge, faUser, faUsers } from '@fortawesome/free-solid-svg-icons'
import { useAuth } from '../context/AuthContext.jsx'

function NavItem({ to, icon, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        [
          'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition',
          isActive ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100',
        ].join(' ')
      }
    >
      <FontAwesomeIcon icon={icon} />
      <span>{label}</span>
    </NavLink>
  )
}

export default function Layout() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-full bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white">
              SC
            </span>
            <span>Smart Campus</span>
          </Link>

          {user ? (
            <nav className="flex items-center gap-2">
              <NavItem to="/dashboard" icon={faGauge} label="Dashboard" end />
              <NavItem to="/profile" icon={faUser} label="Profile" />
              {user.role === 'ADMIN' ? <NavItem to="/admin/users" icon={faUsers} label="Users" /> : null}
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                onClick={logout}
              >
                <FontAwesomeIcon icon={faArrowRightFromBracket} />
                Logout
              </button>
            </nav>
          ) : (
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <FontAwesomeIcon icon={faBell} className="text-indigo-600" />
              <span>Secure login with JWT / Google OAuth</span>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}

