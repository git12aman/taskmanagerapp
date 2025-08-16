import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/authSlice';
import { Navigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const dispatch = useDispatch();
  const { token, loading, error } = useSelector(state => state.auth);
  const [form, setForm] = useState({ email: '', password: '' });

  if (token) return <Navigate to="/dashboard" />;

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form
        className="bg-white rounded shadow p-6 w-96"
        onSubmit={e => {
          e.preventDefault();
          dispatch(login(form));
        }}
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input
          className="p-2 mb-3 w-full border"
          placeholder="Email"
          type="email"
          required
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="p-2 mb-3 w-full border"
          placeholder="Password"
          type="password"
          required
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 w-full" disabled={loading}>
          {loading ? '...' : 'Login'}
        </button>
        {error && <div className="text-red-500 mt-2">{error}</div>}
        <Link to="/register" className="block mt-2 text-sm text-blue-600 underline">Register</Link>
      </form>
    </div>
  );
};

export default LoginPage;
