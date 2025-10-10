import React, { useEffect, useState } from 'react';
import api from '../api';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const res = await api.get('/bookings/mine');
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load bookings');
    }
  }

  async function handleCancel(id) {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await api.delete(`/bookings/${id}`);
      alert('Booking cancelled successfully');
      setBookings(bookings.filter((b) => b.id !== id)); // remove from state
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Failed to cancel booking');
    }
  }

  return (
    <div>
      <h2>My Bookings</h2>
      <div>
        {bookings.length === 0 && <div className="card">No bookings yet</div>}
        {bookings.map((b) => (
          <div key={b.id} className="card" style={{ marginBottom: 8, padding: 8, border: '1px solid #ccc' }}>
            <div>
              <strong>{b.slot_name}</strong> • {b.date}
            </div>
            <div>Seat: {b.seat}</div>
            <div>Booked at: {new Date(b.created_at).toLocaleString()}</div>
            <button
              style={{ marginTop: 4, backgroundColor: '#ff4d4f', color: 'white', border: 'none', padding: '4px 8px', cursor: 'pointer' }}
              onClick={() => handleCancel(b.id)}
            >
              Cancel Booking
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
