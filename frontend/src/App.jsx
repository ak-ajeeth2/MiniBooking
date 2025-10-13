import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Slots from './pages/Slots';
import BookingPage from './pages/BookingPage';
import MyBookings from './pages/MyBookings';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <>
      <Header />
      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/slots" element={<ProtectedRoute><Slots /></ProtectedRoute>} />
          <Route path="/book/:slotId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
          <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />

          <Route path="/" element={<Navigate to="/slots" />} />
        </Routes>
      </div>
    </>
  );
}
