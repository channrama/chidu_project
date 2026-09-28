export default function StatusBadge({ status }) {
  const normalized = status || 'PENDING';

  const className = {
    PENDING: 'status-badge pending',
    UNDER_REVIEW: 'status-badge under-review',
    APPROVED: 'status-badge approved',
    REJECTED: 'status-badge rejected',
  }[normalized] || 'status-badge pending';

  return <span className={className}>{normalized}</span>;
}
