"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import ApplicationForm from '@/components/ApplicationForm';

export default function StudentApplicationDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApplication = async () => {
      try {
        const response = await fetch(`/api/applications/${params.id}`);
        if (!response.ok) {
          router.push('/student/dashboard');
          return;
        }

        const data = await response.json();
        setApplication(data.application);
      } catch (error) {
        router.push('/student/dashboard');
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      loadApplication();
    }
  }, [params.id, router]);

  if (loading) return <div className="page-shell"><div className="container"><div className="empty-state">Loading application...</div></div></div>;

  if (!application) return null;

  return (
    <main className="page-shell">
      <div className="container">
        <div className="heading-row">
          <h1>Application Details</h1>
        </div>

        {application.status === 'PENDING' ? (
          <ApplicationForm initialData={application} />
        ) : (
          <div className="section-card">
            <div className="detail-grid">
              <div className="detail-card">
                <h4>Application Information</h4>
                <p><strong>Application ID:</strong> {application.applicationId}</p>
                <p><strong>Status:</strong> {application.status}</p>
                <p><strong>Hostel:</strong> {application.hostelDetails?.preferredHostel}</p>
              </div>
              <div className="detail-card">
                <h4>Admin Remarks</h4>
                <p>{application.adminRemarks || 'No remarks added yet.'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
