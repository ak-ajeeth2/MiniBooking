import React, { useState, useEffect } from 'react';

function makeRows(n) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  return letters.split('').slice(0, n);
}

export default function SeatPicker({ rows = 6, cols = 8, takenSeats = [], onChange }) {
  const rowLabels = makeRows(rows);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    onChange && onChange(selected);
  }, [selected]);

  function toggle(seat) {
    if (takenSeats.includes(seat)) return;
    setSelected(prev => prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]);
  }

  return (
    <div>
      <div className="legend card" style={{ display: 'flex', gap: 12 }}>
        <div><span style={{ background: 'white', display: 'inline-block', width:14, height:14 }}></span> Available</div>
        <div><span style={{ background: '#0b5cff', display: 'inline-block', width:14, height:14 }}></span> Selected</div>
        <div><span style={{ background: '#999', display: 'inline-block', width:14, height:14 }}></span> Taken</div>
      </div>

      <div className="seat-map">
        {rowLabels.map(r => (
          <div key={r} className="seat-row">
            <div className="seat-label">{r}</div>
            {Array.from({ length: cols }).map((_, i) => {
              const seat = `${r}${i + 1}`;
              const isTaken = takenSeats.includes(seat);
              const isSelected = selected.includes(seat);
              return (
                <div
                  key={seat}
                  className={`seat ${isTaken ? 'taken' : ''} ${isSelected ? 'selected' : ''}`}
                  onClick={() => toggle(seat)}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
