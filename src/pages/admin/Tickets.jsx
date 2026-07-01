import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Alert,
  Button,
  Card,
  Empty,
  Input,
  Select,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from 'antd'
import { listTickets } from '../../api.js'

const { Title, Paragraph, Text } = Typography

const STATUS_OPTIONS = [
  { value: '', label: 'All statuses' },
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CLOSED', label: 'Closed' },
  { value: 'REJECTED', label: 'Rejected' },
]

const PRIORITY_OPTIONS = [
  { value: '', label: 'All priorities' },
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
]

function statusColor(status) {
  const s = String(status || '').toUpperCase()
  if (s === 'OPEN') return 'blue'
  if (s === 'IN_PROGRESS') return 'gold'
  if (s === 'RESOLVED') return 'green'
  if (s === 'CLOSED') return 'default'
  if (s === 'REJECTED') return 'red'
  return 'default'
}

function priorityColor(p) {
  const x = String(p || '').toUpperCase()
  if (x === 'HIGH') return 'red'
  if (x === 'MEDIUM') return 'orange'
  if (x === 'LOW') return 'cyan'
  return 'default'
}

function formatInstant(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch {
    return String(iso)
  }
}

function ticketSearchHaystack(t) {
  const parts = [
    String(t.id ?? ''),
    t.subject,
    t.description,
    t.contactName,
    t.contactEmail,
    t.submitter?.username,
    t.submitter?.email,
  ]
  return parts.filter(Boolean).join(' ').toLowerCase()
}

export default function AdminTickets() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await listTickets()
      setRows(Array.isArray(data) ? data : [])
    } catch (e) {
      setError(e?.message || 'Could not load tickets')
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const categoryOptions = useMemo(() => {
    const set = new Set()
    for (const t of rows) {
      if (t.category) set.add(t.category)
    }
    return [{ value: '', label: 'All categories' }, ...[...set].sort().map((c) => ({ value: c, label: c }))]
  }, [rows])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows
      .filter((t) => {
        if (statusFilter && String(t.status).toUpperCase() !== statusFilter) return false
        if (priorityFilter && String(t.priority).toUpperCase() !== priorityFilter) return false
        if (categoryFilter && t.category !== categoryFilter) return false
        if (q && !ticketSearchHaystack(t).includes(q)) return false
        return true
      })
      .slice()
      .sort((a, b) => {
        const ca = new Date(a.createdAt || 0).getTime()
        const cb = new Date(b.createdAt || 0).getTime()
        return cb - ca
      })
  }, [rows, search, statusFilter, priorityFilter, categoryFilter])

  const columns = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 88,
        fixed: 'left',
        render: (id) => (
          <Link to={`/dashboard/tickets/${id}`} style={{ fontWeight: 600 }}>
            #{id}
          </Link>
        ),
      },
      {
        title: 'Subject',
        dataIndex: 'subject',
        key: 'subject',
        width: 260,
        ellipsis: true,
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
        width: 280,
      },
      {
        title: 'Category',
        dataIndex: 'category',
        key: 'category',
        width: 150,
      },
      {
        title: 'Priority',
        dataIndex: 'priority',
        key: 'priority',
        width: 110,
        render: (p) => <Tag color={priorityColor(p)}>{p}</Tag>,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        width: 130,
        render: (s) => <Tag color={statusColor(s)}>{String(s || '').replace(/_/g, ' ')}</Tag>,
      },
      {
        title: 'Submitted by',
        key: 'submitter',
        width: 200,
        render: (_, t) => {
          if (t.submitter?.email) {
            return (
              <span>
                <Text strong>{t.submitter.username || '—'}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {t.submitter.email}
                </Text>
              </span>
            )
          }
          return (
            <span>
              <Text type="secondary">Reporter (no account)</Text>
              <br />
              <Text style={{ fontSize: 12 }}>
                {t.contactName} · {t.contactEmail}
              </Text>
            </span>
          )
        },
      },
      {
        title: 'Technician',
        key: 'tech',
        width: 160,
        render: (_, t) =>
          t.assignedTechnician?.username ? (
            <span>
              {t.assignedTechnician.username}
              <br />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {t.assignedTechnician.email}
              </Text>
            </span>
          ) : (
            <Text type="secondary">Unassigned</Text>
          ),
      },
      {
        title: 'Created',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 160,
        render: formatInstant,
      },
      {
        title: 'Updated',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        width: 160,
        render: formatInstant,
      },
    ],
    [],
  )

  return (
    <div style={{ display: 'grid', gap: 20 }}>
      <div>
        <Title level={3} style={{ marginTop: 0, marginBottom: 8, color: 'var(--c-navy)' }}>
          Ticket management
        </Title>
        <Paragraph type="secondary" style={{ marginBottom: 0, maxWidth: 720 }}>
          All campus support tickets from every user. Use filters and search to narrow the queue, then open a ticket to
          change status, assign a technician, or add comments.
        </Paragraph>
      </div>

      <Card
        variant="borderless"
        style={{
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
        }}
        styles={{ body: { padding: '16px 20px' } }}
      >
        <Space wrap size={[12, 12]} style={{ width: '100%' }}>
          <Input.Search
            allowClear
            placeholder="Search by ID, subject, description, name, or email"
            onChange={(e) => setSearch(e.target.value)}
            style={{ minWidth: 280, maxWidth: 420, flex: 1 }}
          />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={STATUS_OPTIONS}
            style={{ width: 160 }}
            popupMatchSelectWidth={false}
          />
          <Select
            value={priorityFilter}
            onChange={setPriorityFilter}
            options={PRIORITY_OPTIONS}
            style={{ width: 160 }}
            popupMatchSelectWidth={false}
          />
          <Select
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={categoryOptions}
            style={{ width: 200 }}
            popupMatchSelectWidth={false}
          />
        </Space>
      </Card>

      {error ? (
        <Alert
          type="error"
          title="Could not load tickets"
          description={error}
          showIcon
          action={
            <Button type="link" size="small" onClick={load}>
              Retry
            </Button>
          }
        />
      ) : null}

      <Card
        variant="borderless"
        style={{
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        {loading ? (
          <div style={{ padding: '48px 0', textAlign: 'center' }}>
            <Spin description="Loading tickets…" />
          </div>
        ) : filtered.length === 0 ? (
          <Empty
            description={
              rows.length === 0 ? 'No tickets in the system yet.' : 'No tickets match your filters or search.'
            }
          />
        ) : (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={filtered}
            pagination={{ pageSize: 15, showSizeChanger: true, pageSizeOptions: [10, 15, 25, 50] }}
            scroll={{ x: 1400 }}
            size="middle"
          />
        )}
      </Card>
    </div>
  )
}
