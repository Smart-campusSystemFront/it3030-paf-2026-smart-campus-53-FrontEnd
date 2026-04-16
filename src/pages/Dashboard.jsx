import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIdBadge, faShieldHalved, faUserCheck } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Card, CardBody, CardHeader } from '../components/ui.jsx'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader title="Dashboard" subtitle="Connected to backend JWT/OAuth" />
        <CardBody className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">User</div>
              <div className="mt-2 flex items-center gap-2">
                <FontAwesomeIcon icon={faIdBadge} className="text-indigo-600" />
                <div className="font-semibold">
                  {user.firstName} {user.lastName}
                </div>
              </div>
              <div className="mt-1 text-sm text-slate-600">{user.email}</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Role</div>
              <div className="mt-2 flex items-center gap-2">
                <FontAwesomeIcon icon={faShieldHalved} className="text-indigo-600" />
                <div className="font-semibold">{user.role}</div>
              </div>
              <div className="mt-1 text-sm text-slate-600">Provider: {user.provider || '—'}</div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Status</div>
              <div className="mt-2 flex items-center gap-2">
                <FontAwesomeIcon icon={faUserCheck} className="text-indigo-600" />
                <div className="font-semibold">{user.active ? 'Active' : 'Disabled'}</div>
              </div>
              <div className="mt-1 text-sm text-slate-600">ID: {user.id}</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/profile"
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Manage profile
            </Link>
            {user.role === 'ADMIN' ? (
              <Link
                to="/admin/users"
                className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              >
                Admin: user management
              </Link>
            ) : null}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Next modules" subtitle="Backend controllers currently stubbed" />
        <CardBody>
          <p className="text-sm text-slate-600">
            Your backend has empty controller stubs for Resources/Bookings/Tickets/Notifications. Once those endpoints are
            implemented, we can add matching UI pages the same way as Users.
          </p>
        </CardBody>
      </Card>
    </div>
  )
}

