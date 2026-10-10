import React, { useState } from 'react';
import { loginUser, registerUser } from '../services/api';
import { X, Lock, Mail, User, Shield, RefreshCw } from 'lucide-react';

export function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isRegister) {
        await registerUser(email, password, fullName);
        // Login after register
        const loginRes = await loginUser(email, password);
        localStorage.setItem('scamsense_token', loginRes.data.access_token);
        onAuthSuccess(loginRes.data);
      } else {
        const loginRes = await loginUser(email, password);
        localStorage.setItem('scamsense_token', loginRes.data.access_token);
        onAuthSuccess(loginRes.data);
      }
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="inline-p-3 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-2xl p-3 inline-block shadow-lg shadow-cyan-500/20">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            {isRegister ? 'Create ScamSense Account' : 'Sign In to ScamSense AI'}
          </h2>
          <p className="text-xs text-slate-400">Save scan history and access Firebase Firestore intelligence</p>
        </div>

        {error && (
          <div className="bg-rose-950/60 border border-rose-800/80 text-rose-300 p-3.5 rounded-xl text-xs font-medium text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@scamsense.ai"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-2 text-sm transition-all"
          >
            {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <span>{isRegister ? 'Register Account' : 'Sign In'}</span>}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400">
          {isRegister ? (
            <p>Already have an account? <button onClick={() => setIsRegister(false)} className="text-cyan-400 font-semibold hover:underline">Sign In</button></p>
          ) : (
            <p>Don't have an account? <button onClick={() => setIsRegister(true)} className="text-cyan-400 font-semibold hover:underline">Register</button></p>
          )}
        </div>
      </div>
    </div>
  );
}
