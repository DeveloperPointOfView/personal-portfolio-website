import React, { useState } from 'react';

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const ok = onLogin(password);
    if (!ok) {
      setError('Invalid password. Please try again.');
    } else {
      setError('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0f1c] via-[#0c1324] to-[#0a1222] text-white px-6">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl">
        <h1 className="text-2xl font-heading font-bold mb-6 text-center">Admin Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/40"
              placeholder="Enter admin password"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full px-4 py-3 bg-white text-black font-semibold rounded-lg shadow hover:-translate-y-1 transition-all duration-300"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
