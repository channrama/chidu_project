import Sidebar from '@/components/Sidebar';

export default function StudentLayout({ children }) {
  return (
    <div className="dashboard-shell">
      <Sidebar role="student" />
      <div className="dashboard-main">{children}</div>
    </div>
  );
}
