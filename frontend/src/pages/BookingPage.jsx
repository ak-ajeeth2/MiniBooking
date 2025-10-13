import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import SeatPicker from '../components/SeatPicker';

export default function BookingPage() {
  const { slotId } = useParams();
  const navigate = useNavigate();
  const [slot, setSlot] = useState(null);
  const [takenSeats, setTakenSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [err, setErr] = useState(null);

  useEffect(() => { load(); }, []);

  async function load() {
    try {
      const res = await api.get(`/slots/${slotId}`);
      setSlot(res.data);
      setTakenSeats(res.data.takenSeats || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function submit(e) {
    e.preventDefault();
    setErr(null);
    if (!selectedSeats.length) return setErr('Select at least one seat');
    if (!name || !email) return setErr('Enter name and email');
    try {
      await api.post('/bookings', {
        slotId: Number(slotId),
        seats: selectedSeats,
        customerName: name,
        customerEmail: email
      });
      navigate('/my-bookings');
    } catch (err) {
      setErr(err?.response?.data?.error || 'Booking failed');
    }
  }

  if (!slot) return <div>Loading...</div>;

  return (
    <div className="card" style={{ maxWidth: 1000 }}>
      <h2>Book: {slot.name}</h2>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <SeatPicker rows={slot.rows} cols={slot.cols} takenSeats={takenSeats} onChange={setSelectedSeats} />
        </div>
        <div style={{ flex: 1 }}>
          <form onSubmit={submit}>
            <div className="form-row"><input className="input" placeholder="Name" value={name} onChange={e => setName(e.target.value)} /></div>
            <div className="form-row"><input className="input" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} /></div>
            <div style={{ marginBottom: 10 }}>Selected seats: <strong>{selectedSeats.join(', ') || 'None'}</strong></div>
            {err && <div style={{ color: 'red' }}>{err}</div>}
            <button type="submit">Confirm Booking</button>
          </form>
        </div>
      </div>
    </div>
  );
}
