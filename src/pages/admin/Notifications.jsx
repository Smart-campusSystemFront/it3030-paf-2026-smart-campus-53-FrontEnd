import { useState, useEffect, useCallback } from 'react'
import { Table, Button, Modal, Form, Input, Select, Tag, Tooltip, Popconfirm, Badge, message } from 'antd'
import {
  BellOutlined, SendOutlined, EditOutlined, DeleteOutlined,
  UserOutlined, TeamOutlined, CheckCircleOutlined, PlayCircleOutlined
} from '@ant-design/icons'
import { apiRequest } from '../../lib/api.js'

const TYPE_COLORS = { INFO: 'blue', WARNING: 'orange', ALERT: 'red' }

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editRecord, setEditRecord] = useState(null)
  const [form] = Form.useForm()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await apiRequest('/api/notifications/admin/sent')
      setNotifications(data || [])
    } catch {
      message.error('Failed to load notifications')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const openSend = () => {
    setEditRecord(null)
    form.resetFields()
    form.setFieldsValue({ type: 'INFO' })
    setModalOpen(true)
  }

  const openEdit = (record) => {
    setEditRecord(record)
    form.setFieldsValue({ message: record.message, type: record.type, userEmail: record.userEmail })
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    try {
      if (editRecord) {
        await apiRequest(`/api/notifications/admin/${editRecord.id}`, {
          method: 'PUT', body: values,
        })
        message.success('Notification updated')
      } else {
        await apiRequest('/api/notifications/admin/send', {
          method: 'POST', body: values,
        })
        message.success(values.userEmail ? 'Notification sent to user' : '📢 Broadcast sent to all users')
      }
      setModalOpen(false)
      load()
    } catch {
      message.error('Operation failed')
    }
  }

  const handleDelete = async (id) => {
    try {
      await apiRequest(`/api/notifications/admin/${id}`, { method: 'DELETE' })
      message.success('Deleted')
      load()
    } catch {
      message.error('Delete failed')
    }
  }

  const handleGenerateDemoData = async () => {
    setLoading(true)
    message.loading({ content: 'Generating scenario notifications...', key: 'demo' })
    try {
      const demoScenarios = [
        {
          type: 'INFO',
          message: 'Booking Update: Your reservation for Lecture Hall 1 has been APPROVED.',
          userEmail: '', // broadcast
        },
        {
          type: 'WARNING',
          message: 'Ticket Status: Maintenance ticket #TCK-209 has been marked as PENDING from IN_PROGRESS.',
          userEmail: '', // broadcast
        },
        {
          type: 'INFO',
          message: 'New Comment: Technician replied: "Replacing the network switch now, should be up shortly."',
          userEmail: '', // broadcast
        },
        {
          type: 'ALERT',
          message: 'System Broadcast: Server maintenance starts in 10 minutes. Please save your work.',
          userEmail: '', // broadcast
        }
      ]

      for (const req of demoScenarios) {
        await apiRequest('/api/notifications/admin/send', {
          method: 'POST', body: req,
        })
        // 400ms delay to give a cascading real-time feel to connected UI
        await new Promise(res => setTimeout(res, 400))
      }
      
      message.success({ content: 'Demo notifications launched successfully!', key: 'demo' })
      load()
    } catch {
      message.error({ content: 'Failed to deploy demo data', key: 'demo' })
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      width: 90,
      render: (t) => <Tag color={TYPE_COLORS[t] || 'default'}>{t || 'INFO'}</Tag>,
    },
    {
      title: 'Message',
      dataIndex: 'message',
      ellipsis: true,
    },
    {
      title: 'Recipient',
      dataIndex: 'userEmail',
      width: 220,
      render: (email) => (
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          <UserOutlined style={{ marginRight: 4 }} />{email}
        </span>
      ),
    },
    {
      title: 'Sent',
      dataIndex: 'createdAt',
      width: 160,
      render: (v) => v ? new Date(v).toLocaleString() : '—',
    },
    {
      title: 'Read',
      dataIndex: 'read',
      width: 70,
      align: 'center',
      render: (r) => r
        ? <CheckCircleOutlined style={{ color: '#10b981' }} />
        : <span style={{ color: '#94a3b8', fontSize: 11 }}>No</span>,
    },
    {
      title: 'Actions',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <span style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
          <Tooltip title="Edit">
            <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(record)} />
          </Tooltip>
          <Popconfirm title="Delete this notification?" onConfirm={() => handleDelete(record.id)}>
            <Tooltip title="Delete">
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </span>
      ),
    },
  ]

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: 'var(--c-navy)' }}>
            <BellOutlined style={{ marginRight: 10, color: 'var(--c-amber)' }} />
            Notification Management
          </h2>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: 13 }}>
            Send, edit, or delete in-app notifications. Broadcasts reach all users instantly.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button
            icon={<PlayCircleOutlined />}
            onClick={handleGenerateDemoData}
            style={{ borderRadius: 8, fontWeight: 600, background: '#f8fafc', borderColor: 'var(--border)' }}
          >
            Auto Demo (All)
          </Button>
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={openSend}
            style={{ borderRadius: 8, fontWeight: 600 }}
          >
            Send Notification
          </Button>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Total Sent', value: notifications.length, color: 'var(--c-blue)' },
          {
            label: 'Broadcasts',
            value: notifications.filter(n => !n.userEmail || n.userEmail === '').length,
            color: 'var(--c-amber)',
          },
          {
            label: 'Targeted',
            value: notifications.filter(n => n.userEmail).length,
            color: '#10b981',
          },
        ].map(s => (
          <div key={s.label} style={{
            background: '#fff', borderRadius: 10, padding: '12px 20px',
            border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)',
            minWidth: 120, textAlign: 'center',
          }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ── Table ── */}
      <div style={{ background: '#fff', borderRadius: 12, border: '1px solid var(--border)', overflow: 'hidden' }}>
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={notifications}
          pagination={{ pageSize: 12, showTotal: (t) => `${t} notifications` }}
          size="middle"
        />
      </div>

      {/* ── Send / Edit Modal ── */}
      <Modal
        title={
          <span>
            {editRecord ? <EditOutlined style={{ marginRight: 8 }} /> : <SendOutlined style={{ marginRight: 8 }} />}
            {editRecord ? 'Edit Notification' : 'Send Notification'}
          </span>
        }
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText={editRecord ? 'Update' : 'Send'}
        width={520}
        destroyOnClose
      >
        {!editRecord && (
          <div style={{ marginBottom: 16, background: '#f8fafc', padding: 12, borderRadius: 8, border: '1px dashed var(--border)' }}>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 500 }}>
              Quick Fill Demo Scenarios:
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Button size="small" onClick={() => form.setFieldsValue({ type: 'INFO', message: 'Booking Update: Your reservation for Lecture Hall 1 has been APPROVED.', userEmail: '' })}>Booking</Button>
              <Button size="small" onClick={() => form.setFieldsValue({ type: 'WARNING', message: 'Ticket Status: Maintenance ticket #TCK-209 has been marked as PENDING from IN_PROGRESS.', userEmail: '' })}>Ticket</Button>
              <Button size="small" onClick={() => form.setFieldsValue({ type: 'INFO', message: 'New Comment: Technician replied: "Replacing the network switch now, should be up shortly."', userEmail: '' })}>Comment</Button>
              <Button size="small" onClick={() => form.setFieldsValue({ type: 'ALERT', message: 'System Broadcast: Server maintenance starts in 10 minutes. Please save your work.', userEmail: '' })}>Alert</Button>
            </div>
          </div>
        )}
        <Form form={form} layout="vertical" style={{ marginTop: editRecord ? 16 : 0 }}>
          <Form.Item
            name="type"
            label="Type"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="INFO">ℹ️ INFO</Select.Option>
              <Select.Option value="WARNING">⚠️ WARNING</Select.Option>
              <Select.Option value="ALERT">🔴 ALERT</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="message"
            label="Message"
            rules={[{ required: true, message: 'Please enter a message' }]}
          >
            <Input.TextArea rows={3} placeholder="Enter notification message…" maxLength={500} showCount />
          </Form.Item>

          {!editRecord && (
            <Form.Item
              name="userEmail"
              label={
                <span>
                  Recipient Email&nbsp;
                  <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: 12 }}>
                    (leave blank to broadcast to <TeamOutlined /> ALL users)
                  </span>
                </span>
              }
            >
              <Input placeholder="user@example.com — blank = broadcast" prefix={<UserOutlined />} />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  )
}
