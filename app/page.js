import Link from 'next/link';

export default function Home() {
  return (
    <main className="landing-page">
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <p className="eyebrow">Official Housing Portal</p>
            <h1>State Hostel Portal</h1>
            <p className="hero-copy">
              Apply for hostel accommodation, track your application, and manage room allocation in one simple portal.
            </p>
            <div className="action-row">
              <Link href="/register" className="primary-btn">Register</Link>
              <Link href="/login" className="secondary-btn">Student Login</Link>
            </div>
          </div>

          <div className="hero-panel card">
            <h3>Quick Access</h3>
            <ul className="feature-list">
              <li>Student application tracking</li>
              <li>Admin review and approvals</li>
              <li>Room allocation management</li>
              <li>Document upload support</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="container stats-grid">
        <div className="card stat-card">
          <h3>400+</h3>
          <p>Student beds</p>
        </div>
        <div className="card stat-card">
          <h3>2</h3>
          <p>Hostels</p>
        </div>
        <div className="card stat-card">
          <h3>24/7</h3>
          <p>Application support</p>
        </div>
      </section>
    </main>
  );
}
