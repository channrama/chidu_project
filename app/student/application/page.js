"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ApplicationForm from '@/components/ApplicationForm';

export default function StudentApplicationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const response = await fetch('/api/student/profile');
        if (!response.ok) {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [router]);

  if (loading) {
    return <div className="page-shell"><div className="container"><div className="empty-state">Loading form...</div></div></div>;
  }

  return (
    <main className="page-shell">
      <div className="container">
        <div className="heading-row">
          <h1>Hostel Application Form</h1>
        </div>

        <ApplicationForm />
      </div>
    </main>
  );
}
