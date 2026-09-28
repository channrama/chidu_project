"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: 'admin' }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Admin login failed');
      }

      if (data.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        setError('This account is not authorized for admin access');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <div className="container auth-container">
        <div className="card auth-card">
          <h1>Admin Login</h1>
          <p className="muted">Manage student applications and room allocation.</p>

          <form onSubmit={handleSubmit} className="form-grid">
            <label>
              Email
              <input type="email" name="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </label>
            <label>
              Password
              <input type="password" name="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            </label>

            {error && <div className="alert alert-error">{error}</div>}

            <button type="submit" className="primary-btn" disabled={loading}>
              {loading ? 'Signing in...' : 'Login as Admin'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
