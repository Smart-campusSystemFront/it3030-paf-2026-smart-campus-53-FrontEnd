import { Typography } from 'antd'
import FeaturePlaceholder from '../../components/FeaturePlaceholder.jsx'

export default function AdminTickets() {
  return (
    <div>
      <Typography.Title level={3} style={{ marginTop: 0 }}>
        Tickets (admin)
      </Typography.Title>
      <Typography.Paragraph type="secondary">
        Assign, prioritize, and close tickets across campus. Wire this view to your admin ticket endpoints when available.
      </Typography.Paragraph>
      <FeaturePlaceholder
        title="Ticket queue"
        description="Reserved for admin table, filters, bulk actions, and assignment — same URL pattern as user tickets but scoped to staff workflows."
      />
    </div>
  )
}
