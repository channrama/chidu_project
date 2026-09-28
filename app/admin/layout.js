import Sidebar from '@/components/Sidebar';

export default function AdminLayout({ children }) {
  return (
    <div className="dashboard-shell">
      <Sidebar role="admin" />
      <div className="dashboard-main">{children}</div>
    </div>
  );
}
