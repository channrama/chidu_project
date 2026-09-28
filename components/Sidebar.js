'use client';

import Link from 'next/link';

export default function Sidebar({ role = 'student' }) {
  const studentLinks = [
    { href: '/student/dashboard', label: 'Dashboard' },
    { href: '/student/application', label: 'Apply' },
    { href: '/student/documents', label: 'Documents' },
  ];

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard' },
    { href: '/admin/applications', label: 'Applications' },
    { href: '/admin/rooms', label: 'Room Management' },
  ];

  const links = role === 'admin' ? adminLinks : studentLinks;

  return (
    <aside className="sidebar">
      <div className="sidebar-header">Portal Menu</div>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="sidebar-link">
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
