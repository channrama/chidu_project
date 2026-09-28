"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({ totalStudents: 0, totalApplications: 0, pending: 0, approved: 0, rejected: 0, availableRooms: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch('/api/admin/dashboard');
        if (!response.ok) {
          router.push('/admin/login');
          return;
        }

        const data = await response.json();
        setStats(data.stats || stats);
      } catch (error) {
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [router]);

  if (loading) {
    return <div className="page-shell"><div className="container"><div className="empty-state">Loading dashboard...</div></div></div>;
  }

  return (
    <main className="page-shell">
      <div className="container">
        <div className="heading-row">
          <h1>Admin Dashboard</h1>
          <Link href="/admin/applications" className="primary-btn">View Applications</Link>
        </div>

        <div className="summary-grid">
          <div className="card summary-card"><h3>{stats.totalStudents}</h3><p>Total students</p></div>
          <div className="card summary-card"><h3>{stats.totalApplications}</h3><p>Total applications</p></div>
          <div className="card summary-card"><h3>{stats.pending}</h3><p>Pending applications</p></div>
          <div className="card summary-card"><h3>{stats.approved}</h3><p>Approved applications</p></div>
          <div className="card summary-card"><h3>{stats.rejected}</h3><p>Rejected applications</p></div>
          <div className="card summary-card"><h3>{stats.availableRooms}</h3><p>Available rooms</p></div>
        </div>
      </div>
    </main>
  );
}
