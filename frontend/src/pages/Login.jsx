import React, { useState } from 'react';
import api, { setAuthToken } from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setErr(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      setAuthToken(res.data.token);
      navigate('/slots');
    } catch (err) {
      setErr(err?.response?.data?.error || 'Login failed');
    }
  }

  return (
    <div className="container" style={{ maxWidth: 420 }}>
      <div className="card">
        <h2>Login</h2>
        {err && <div style={{ color: 'red' }}>{err}</div>}
        <form onSubmit={submit}>
          <div className="form-row">
            <input className="input" placeholder="Email" required value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div className="form-row">
            <input className="input" type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <div className="form-row">
            <button type="submit">Login</button>
          </div>
        </form>
        <div>Don't have account? <Link to="/register">Register</Link></div>
      </div>
    </div>
  );
}
