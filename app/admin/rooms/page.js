"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RoomCard from '@/components/RoomCard';

export default function AdminRoomsPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const response = await fetch('/api/rooms');
        if (!response.ok) {
          router.push('/admin/login');
          return;
        }

        const data = await response.json();
        setRooms(data.rooms || []);
      } catch (error) {
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    loadRooms();
  }, [router]);

  if (loading) return <div className="page-shell"><div className="container"><div className="empty-state">Loading rooms...</div></div></div>;

  return (
    <main className="page-shell">
      <div className="container">
        <div className="heading-row">
          <h1>Room Management</h1>
        </div>

        <div className="section-card">
          <div className="room-grid">
            {rooms.length ? rooms.map((room) => <RoomCard key={room._id} room={room} />) : <div className="empty-state">No rooms available.</div>}
          </div>
        </div>
      </div>
    </main>
  );
}
