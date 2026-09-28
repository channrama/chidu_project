"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StatusBadge from '@/components/StatusBadge';

export default function StudentDashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const profileResponse = await fetch('/api/student/profile');
        if (!profileResponse.ok) {
          router.push('/login');
          return;
        }

        const profileData = await profileResponse.json();
        setProfile(profileData.user);

        const appResponse = await fetch('/api/applications/my');
        const appData = await appResponse.json();
        setApplication(appData.applications?.[0] || null);
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [router]);

  if (loading) return <div className="page-shell"><div className="container"><div className="empty-state">Loading dashboard...</div></div></div>;

  return (
    <main className="page-shell">
      <div className="container">
        <div className="heading-row">
          <h1>Student Dashboard</h1>
          <Link href="/student/application" className="primary-btn">Apply for Hostel</Link>
        </div>

        <div className="summary-grid">
          <div className="card summary-card">
            <h3>{profile?.name || 'Student'}</h3>
            <p>Student name</p>
          </div>
          <div className="card summary-card">
            <h3>{application ? <StatusBadge status={application.status} /> : 'No application'}</h3>
            <p>Application status</p>
          </div>
          <div className="card summary-card">
            <h3>{application?.roomAllocation?.roomNumber || 'Not assigned'}</h3>
            <p>Room number</p>
          </div>
        </div>

        <div className="section-card">
          <h3 className="section-title">Application Summary</h3>
          {application ? (
            <div className="detail-grid">
              <div className="detail-card">
                <p><strong>Application ID:</strong> {application.applicationId}</p>
                <p><strong>Hostel:</strong> {application.hostelDetails?.preferredHostel}</p>
                <p><strong>Application date:</strong> {new Date(application.submittedAt).toLocaleDateString()}</p>
              </div>
              <div className="detail-card">
                <p><strong>Room:</strong> {application.roomAllocation?.roomNumber || 'Pending allocation'}</p>
                <p><strong>Hostel Name:</strong> {application.roomAllocation?.hostelName || application.hostelDetails?.preferredHostel}</p>
                <p><strong>Admin remarks:</strong> {application.adminRemarks || 'No remarks yet'}</p>
              </div>
            </div>
          ) : (
            <div className="empty-state">No hostel application has been submitted yet.</div>
          )}
        </div>
      </div>
    </main>
  );
}
