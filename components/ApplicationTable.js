import Link from 'next/link';
import StatusBadge from './StatusBadge';

export default function ApplicationTable({ applications = [] }) {
  if (!applications.length) {
    return <div className="empty-state">No applications found.</div>;
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Application ID</th>
            <th>Student</th>
            <th>Hostel</th>
            <th>Status</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application._id}>
              <td>{application.applicationId}</td>
              <td>{application.student?.name || 'N/A'}</td>
              <td>{application.hostelDetails?.preferredHostel || 'N/A'}</td>
              <td>
                <StatusBadge status={application.status} />
              </td>
              <td>{new Date(application.submittedAt).toLocaleDateString()}</td>
              <td>
                <Link href={`/admin/applications/${application._id}`} className="link-btn">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
