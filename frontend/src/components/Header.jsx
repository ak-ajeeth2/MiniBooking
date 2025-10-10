import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setAuthToken } from '../api';

export default function Header() {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  function logout() {
    setAuthToken(null);
    navigate('/login');
  }

  return (
    <div className="header">
      <div className="brand">Mini Booking</div>
      <nav>
        <Link to="/slots">Slots</Link>
        <Link to="/my-bookings">My Bookings</Link>
        {token ? (
          <button onClick={logout} style={{ marginLeft: 10 }}>Logout</button>
        ) : (
          <>
            <Link to="/login" style={{ marginLeft: 12, color: 'white' }}>Login</Link>
          </>
        )}
      </nav>
    </div>
  );
}
