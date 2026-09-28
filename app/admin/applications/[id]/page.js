"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function AdminApplicationReviewPage() {
  const router = useRouter();
  const params = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remarks, setRemarks] = useState('');
  const [room, setRoom] = useState({ hostelId: '', block: '', floor: '', roomNumber: '' });
  const [hostels, setHostels] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const getApplication = async () => {
    try {
      const response = await fetch(`/api/admin/applications/${params.id}`);
      if (!response.ok) {
        router.push('/admin/applications');
        return;
      }

      const data = await response.json();
      setApplication(data.application);
      setRemarks(data.application.adminRemarks || '');
      setStatus(data.application.status || 'PENDING');
    } catch (error) {
      router.push('/admin/applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadHostels = async () => {
      try {
        const response = await fetch('/api/hostels');
        const data = await response.json();
        setHostels(data.hostels || []);
      } catch (error) {
        console.error('Hostel fetch failed', error);
      }
    };

    loadHostels();
    if (params.id) {
      getApplication();
    }
  }, [params.id, router]);

  const handleDecision = async (nextStatus) => {
    try {
      const response = await fetch(`/api/admin/applications/${params.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, adminRemarks: remarks }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Review failed');
      setMessage(`${nextStatus} action saved.`);
      getApplication();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAllocateRoom = async () => {
    try {
      const response = await fetch('/api/admin/rooms/allocate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          applicationId: params.id,
          hostelId: room.hostelId,
          block: room.block,
          floor: Number(room.floor),
          roomNumber: room.roomNumber,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Room allocation failed');
      setMessage('Room allocated successfully.');
      getApplication();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="page-shell"><div className="container"><div className="empty-state">Loading application review...</div></div></div>;
  if (!application) return null;

  return (
    <main className="page-shell">
      <div className="container">
        <div className="heading-row">
          <h1>Application Review</h1>
        </div>

        <div className="section-card">
          <div className="detail-grid">
            <div className="detail-card">
              <h4>Student Details</h4>
              <p><strong>Name:</strong> {application.student?.name}</p>
              <p><strong>Email:</strong> {application.student?.email}</p>
              <p><strong>Course:</strong> {application.academicDetails?.course}</p>
              <p><strong>Year:</strong> {application.academicDetails?.year}</p>
            </div>
            <div className="detail-card">
              <h4>Application Details</h4>
              <p><strong>Application ID:</strong> {application.applicationId}</p>
              <p><strong>Status:</strong> {application.status}</p>
              <p><strong>Preferred Hostel:</strong> {application.hostelDetails?.preferredHostel}</p>
              <p><strong>Previous Score:</strong> {application.academicDetails?.previousScore}</p>
            </div>
          </div>

          <div className="detail-card" style={{ marginTop: '18px' }}>
            <h4>Review & Decision</h4>
            <label>
              Admin Remarks
              <textarea rows={4} value={remarks} onChange={(e) => setRemarks(e.target.value)} />
            </label>

            <div className="action-row" style={{ marginTop: '16px' }}>
              <button type="button" className="primary-btn" onClick={() => handleDecision('APPROVED')}>Approve</button>
              <button type="button" className="secondary-btn" onClick={() => handleDecision('REJECTED')}>Reject</button>
            </div>
          </div>

          <div className="detail-card" style={{ marginTop: '18px' }}>
            <h4>Room Allocation</h4>
            <div className="detail-grid">
              <label>
                Hostel
                <select value={room.hostelId} onChange={(e) => setRoom({ ...room, hostelId: e.target.value })}>
                  <option value="">Select hostel</option>
                  {hostels.map((hostel) => (
                    <option key={hostel._id} value={hostel._id}>{hostel.name}</option>
                  ))}
                </select>
              </label>
              <label>
                Block
                <input value={room.block} onChange={(e) => setRoom({ ...room, block: e.target.value })} />
              </label>
              <label>
                Floor
                <input value={room.floor} onChange={(e) => setRoom({ ...room, floor: e.target.value })} />
              </label>
              <label>
                Room Number
                <input value={room.roomNumber} onChange={(e) => setRoom({ ...room, roomNumber: e.target.value })} />
              </label>
            </div>
            <div style={{ marginTop: '16px' }}>
              <button type="button" className="primary-btn" onClick={handleAllocateRoom}>Allocate Room</button>
            </div>
          </div>

          {error && <div className="alert alert-error" style={{ marginTop: '16px' }}>{error}</div>}
          {message && <div className="alert alert-success" style={{ marginTop: '16px' }}>{message}</div>}
        </div>
      </div>
    </main>
  );
}
