"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    college: '',
    course: '',
    year: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setSuccess('Registration successful. Please login.');
      setTimeout(() => router.push('/login'), 900);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <div className="container auth-container">
        <div className="card auth-card wide">
          <h1>Student Registration</h1>
          <p className="muted">Create a new account to apply for hostel accommodation.</p>

          <form onSubmit={handleSubmit} className="form-grid two-col">
            <label>
              Full Name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>
              Email
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </label>
            <label>
              Password
              <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} />
            </label>
            <label>
              Phone Number
              <input name="phone" value={form.phone} onChange={handleChange} required />
            </label>
            <label>
              College
              <input name="college" value={form.college} onChange={handleChange} required />
            </label>
            <label>
              Course
              <input name="course" value={form.course} onChange={handleChange} required />
            </label>
            <label className="full-width">
              Year
              <input name="year" value={form.year} onChange={handleChange} required />
            </label>

            {error && <div className="alert alert-error full-width">{error}</div>}
            {success && <div className="alert alert-success full-width">{success}</div>}

            <button type="submit" className="primary-btn full-width" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <p className="form-link">
            Already have an account? <Link href="/login">Login</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
