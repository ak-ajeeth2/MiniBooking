import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

export default function Slots() {
  const [slots, setSlots] = useState([]);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const res = await api.get('/slots');
      setSlots(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div>
      <h2>Available Slots</h2>
      <div className="slot-grid">
        {slots.map(s => (
          <div key={s.id} className="card">
            <h3>{s.name}</h3>
            <div>{s.date} • {s.startsAt} - {s.endsAt}</div>
            <div style={{ marginTop: 8 }}>Seats: {s.availableSeats} available</div>
            <div style={{ marginTop: 10 }}>
              <Link to={`/book/${s.id}`}><button disabled={s.availableSeats <= 0}>Book</button></Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
