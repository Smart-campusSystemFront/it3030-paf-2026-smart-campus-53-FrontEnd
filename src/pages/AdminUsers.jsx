import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  App,
  Breadcrumb,
  Button,
  Card,
  Flex,
  Form,
  Input,
  Modal,
  Popconfirm,
  Select,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
} from 'antd'
import {
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { apiRequest } from '../lib/api.js'

const ROLES = ['USER', 'ADMIN', 'TECHNICIAN']

const roleTagColor = {
  ADMIN: 'red',
  USER: 'blue',
  TECHNICIAN: 'green',
}

function fmtDate(s) {
  if (!s) return '—'
  const d = new Date(s)
  if (Number.isNaN(d.getTime())) return s
  return d.toLocaleString()
}

export default function AdminUsers() {
  const { message } = App.useApp()
  const [form] = Form.useForm()

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [q, setQ] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const list = await apiRequest('/api/users')
      setUsers(Array.isArray(list) ? list : [])
    } catch (err) {
      message.error(err?.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [message])

  useEffect(() => {
    load()
  }, [load])

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return users
    return users.filter((u) => {
      const hay = `${u.id} ${u.email} ${u.firstName} ${u.lastName} ${u.role} ${u.provider}`.toLowerCase()
      return hay.includes(s)
    })
  }, [q, users])

  const onUpdate = useCallback(
    async (u, patch) => {
      setBusy(true)
      try {
        await apiRequest(`/api/users/${u.id}`, { method: 'PUT', body: patch })
        await load()
        message.success('User updated')
      } catch (err) {
        message.error(err?.message || 'Update failed')
      } finally {
        setBusy(false)
      }
    },
    [load, message],
  )

  const onDelete = useCallback(
    async (u) => {
      setBusy(true)
      try {
        await apiRequest(`/api/users/${u.id}`, { method: 'DELETE' })
        await load()
        message.success('User deleted')
      } catch (err) {
        message.error(err?.message || 'Delete failed')
      } finally {
        setBusy(false)
      }
    },
    [load, message],
  )

  const openCreate = () => {
    form.resetFields()
    setModalOpen(true)
  }

  const submitCreate = async () => {
    try {
      const values = await form.validateFields()
      setBusy(true)
      await apiRequest('/api/users', {
        method: 'POST',
        body: {
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
          password: values.password,
          role: values.role,
        },
      })
      message.success('User created')
      setModalOpen(false)
      form.resetFields()
      await load()
    } catch (err) {
      if (err?.errorFields) return
      message.error(err?.message || 'Create failed')
    } finally {
      setBusy(false)
    }
  }

  const columns = useMemo(
    () => [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 72,
        fixed: 'left',
      },
      {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        ellipsis: true,
      },
      {
        title: 'Name',
        key: 'name',
        ellipsis: true,
        render: (_, u) => (
          <span>
            {u.firstName} {u.lastName}
          </span>
        ),
      },
      {
        title: 'Role',
        dataIndex: 'role',
        key: 'role',
        width: 160,
        render: (role, u) => (
          <Select
            value={role}
            disabled={busy}
            style={{ width: '100%', minWidth: 120 }}
            options={ROLES.map((r) => ({ label: r, value: r }))}
            onChange={(value) => onUpdate(u, { role: value })}
            popupMatchSelectWidth={false}
            labelRender={({ value: v }) => (
              <Tag color={roleTagColor[v] || 'default'} style={{ margin: 0 }}>
                {v}
              </Tag>
            )}
          />
        ),
      },
      {
        title: 'Active',
        dataIndex: 'active',
        key: 'active',
        width: 100,
        render: (active, u) => (
          <Switch
            checked={!!active}
            disabled={busy}
            onChange={(checked) => onUpdate(u, { active: checked })}
          />
        ),
      },
      {
        title: 'Provider',
        dataIndex: 'provider',
        key: 'provider',
        width: 110,
        ellipsis: true,
        render: (p) => p || '—',
      },
      {
        title: 'Created',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 180,
        render: (d) => <Typography.Text type="secondary">{fmtDate(d)}</Typography.Text>,
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 100,
        fixed: 'right',
        render: (_, u) => (
          <Popconfirm
            title="Delete user"
            description={`Remove ${u.email}? This cannot be undone.`}
            okText="Delete"
            okType="danger"
            okButtonProps={{ loading: busy }}
            onConfirm={() => onDelete(u)}
          >
            <Button danger type="link" size="small" icon={<DeleteOutlined />} disabled={busy}>
              Delete
            </Button>
          </Popconfirm>
        ),
      },
    ],
    [busy, onDelete, onUpdate],
  )

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <Breadcrumb
        items={[
          { title: <Link to="/admin/overview">Admin</Link> },
          { title: <><UserOutlined /> Users</> },
        ]}
      />

      <Flex justify="space-between" align="flex-start" wrap="wrap" gap={16}>
        <div>
          <Typography.Title level={3} style={{ margin: 0 }}>
            User management
          </Typography.Title>
          <Typography.Paragraph type="secondary" style={{ marginBottom: 0, maxWidth: 520 }}>
            List, create, and update accounts. Role and active status save immediately; delete is confirmed.
          </Typography.Paragraph>
        </div>
        <Space wrap>
          <Button icon={<ReloadOutlined />} onClick={load} loading={loading} disabled={busy}>
            Refresh
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate} disabled={busy}>
            New user
          </Button>
        </Space>
      </Flex>

      <Card styles={{ body: { padding: 0 } }}>
        <div style={{ padding: 16, borderBottom: '1px solid var(--ant-color-border-secondary, #f0f0f0)' }}>
          <Input
            allowClear
            size="large"
            placeholder="Search by id, name, email, role, or provider"
            prefix={<SearchOutlined style={{ color: 'rgba(0,0,0,.45)' }} />}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <Table
          rowKey="id"
          loading={loading}
          dataSource={filtered}
          columns={columns}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
          }}
          scroll={{ x: 1100 }}
          size="middle"
        />
      </Card>

      <Modal
        title="Create user"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={submitCreate}
        okText="Create"
        confirmLoading={busy}
        destroyOnHidden
        width={520}
      >
        <Form form={form} layout="vertical" requiredMark="optional" style={{ marginTop: 8 }}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Enter a valid email' },
            ]}
          >
            <Input placeholder="name@example.com" autoComplete="off" />
          </Form.Item>
          <Form.Item name="role" label="Role" initialValue="USER" rules={[{ required: true }]}>
            <Select options={ROLES.map((r) => ({ label: r, value: r }))} />
          </Form.Item>
          <Form.Item
            name="firstName"
            label="First name"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Last name"
            rules={[{ required: true, message: 'Required' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: 'Password is required' },
              { min: 8, message: 'At least 8 characters' },
            ]}
          >
            <Input.Password placeholder="Minimum 8 characters" autoComplete="new-password" />
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  )
}
