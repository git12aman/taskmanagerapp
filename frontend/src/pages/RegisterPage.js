import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../redux/authSlice';
import { Navigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const { token, loading, error } = useSelector(state => state.auth);
  const [form, setForm] = useState({ email: '', password: '', confirm: '' });
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMsg('');
    if (!/\S+@\S+\.\S+/.test(form.email)) return alert("Invalid email.");
    if (form.password.length < 6) return alert("Password must be at least 6 characters.");
    if (form.password !== form.confirm) return alert("Passwords do not match.");

    dispatch(register({ email: form.email, password: form.password }))
      .unwrap()
      .then(res => {
        setSuccessMsg(res.message || "Registration successful! You can login now.");
      })
      .catch(() => {
        // error shown from redux error state
      });
  };

  if (token) return <Navigate to="/dashboard" />;

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form className="bg-white rounded shadow p-6 w-96" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <input
          className="p-2 mb-3 w-full border"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className="p-2 mb-3 w-full border"
          type="password"
          placeholder="Password"
          minLength={6}
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          required
        />
        <input
          className="p-2 mb-3 w-full border"
          type="password"
          placeholder="Confirm Password"
          value={form.confirm}
          onChange={e => setForm({ ...form, confirm: e.target.value })}
          required
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 w-full"
          type="submit"
          disabled={loading}
        >
          {loading ? "..." : "Register"}
        </button>

        {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
        {successMsg && <div className="mt-2 text-sm text-green-600">{successMsg}</div>}

        <Link to="/login" className="block mt-2 text-sm text-blue-600 underline">
          Login
        </Link>
      </form>
    </div>
  );
};

export default RegisterPage;
