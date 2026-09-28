'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me', { cache: 'no-store' });
      const data = await response.json();
      setUser(data.user || null);
    } catch (error) {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
    router.refresh();
  };

  return (
    <header className="topbar">
      <div className="container nav-wrap">
        <Link href="/" className="brand">
          State Hostel Portal
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          <Link href="/">Home</Link>

          {!user && (
            <>
              <Link href="/login">Student Login</Link>
              <Link href="/register">Register</Link>
              <Link href="/admin/login">Admin Login</Link>
            </>
          )}

          {user && (
            <>
              {user.role === 'student' ? (
                <Link href="/student/dashboard">Dashboard</Link>
              ) : (
                <Link href="/admin/dashboard">Dashboard</Link>
              )}
              <button type="button" onClick={handleLogout} className="logout-btn">
                Logout ({user.role})
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
