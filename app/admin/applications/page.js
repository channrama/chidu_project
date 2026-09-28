"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ApplicationTable from '@/components/ApplicationTable';

export default function AdminApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [filters, setFilters] = useState({ status: '', hostel: '', gender: '', course: '', year: '', search: '' });
  const [loading, setLoading] = useState(true);

  const loadApplications = async () => {
    try {
      const query = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) query.append(key, value);
      });

      const response = await fetch(`/api/admin/applications?${query.toString()}`);
      if (!response.ok) {
        router.push('/admin/login');
        return;
      }

      const data = await response.json();
      setApplications(data.applications || []);
    } catch (error) {
      router.push('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, [router]);

  useEffect(() => {
    if (!loading) {
      loadApplications();
    }
  }, [filters]);

  if (loading) return <div className="page-shell"><div className="container"><div className="empty-state">Loading applications...</div></div></div>;

  return (
    <main className="page-shell">
      <div className="container">
        <div className="heading-row">
          <h1>All Hostel Applications</h1>
        </div>

        <div className="section-card">
          <div className="filter-grid">
            <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option value="">Status</option>
              <option value="PENDING">PENDING</option>
              <option value="UNDER_REVIEW">UNDER_REVIEW</option>
              <option value="APPROVED">APPROVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
            <select value={filters.hostel} onChange={(e) => setFilters({ ...filters, hostel: e.target.value })}>
              <option value="">Hostel</option>
              <option value="Hostel A">Hostel A</option>
              <option value="Hostel B">Hostel B</option>
            </select>
            <select value={filters.gender} onChange={(e) => setFilters({ ...filters, gender: e.target.value })}>
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input value={filters.course} placeholder="Course" onChange={(e) => setFilters({ ...filters, course: e.target.value })} />
            <input value={filters.year} placeholder="Year" onChange={(e) => setFilters({ ...filters, year: e.target.value })} />
          </div>

          <input value={filters.search} placeholder="Search by name, application ID or student ID" onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
        </div>

        <div className="section-card">
          <ApplicationTable applications={applications} />
        </div>
      </div>
    </main>
  );
}
