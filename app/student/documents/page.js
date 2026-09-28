"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const docFields = [
  { name: 'studentId', label: 'Student ID' },
  { name: 'aadhaar', label: 'Aadhaar / Identity Document' },
  { name: 'collegeId', label: 'College ID' },
  { name: 'incomeCertificate', label: 'Income Certificate' },
  { name: 'marksCard', label: 'Previous Semester Marks Card' },
];

export default function StudentDocumentsPage() {
  const router = useRouter();
  const [files, setFiles] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const response = await fetch('/api/student/profile');
        if (!response.ok) {
          router.push('/login');
          return;
        }
      } catch (err) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAccess();
  }, [router]);

  const handleChange = (event) => {
    setFiles((prev) => ({ ...prev, [event.target.name]: event.target.files[0] }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setError('');

    const formData = new FormData();
    Object.entries(files).forEach(([key, file]) => {
      if (file) formData.append(key, file);
    });

    try {
      const response = await fetch('/api/student/documents', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Document upload failed');
      setMessage('Documents uploaded successfully.');
      setFiles({});
      event.target.reset();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="page-shell"><div className="container"><div className="empty-state">Loading documents section...</div></div></div>;

  return (
    <main className="page-shell">
      <div className="container">
        <div className="heading-row">
          <h1>Upload Documents</h1>
        </div>

        <form onSubmit={handleSubmit} className="section-card form-grid">
          {docFields.map((field) => (
            <label key={field.name}>
              {field.label}
              <input type="file" name={field.name} accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} />
            </label>
          ))}

          {error && <div className="alert alert-error full-width">{error}</div>}
          {message && <div className="alert alert-success full-width">{message}</div>}

          <button type="submit" className="primary-btn full-width">Upload Documents</button>
        </form>
      </div>
    </main>
  );
}
