import { Typography } from 'antd'
import FeaturePlaceholder from '../../components/FeaturePlaceholder.jsx'

export default function UserTickets() {
  return (
    <div>
      <Typography.Title level={3} style={{ marginTop: 0 }}>
        Tickets
      </Typography.Title>
      <Typography.Paragraph type="secondary">
        Student and staff support requests will appear here once the tickets API is connected.
      </Typography.Paragraph>
      <FeaturePlaceholder
        title="My tickets"
        description="This panel is reserved for list/detail views, filters, and actions wired to /api/tickets (or your chosen routes)."
      />
    </div>
  )
}
