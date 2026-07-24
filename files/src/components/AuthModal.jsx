import React, { useState } from 'react';
import { LogIn, X, AlertCircle } from 'lucide-react';
import { loginUser, registerUser } from '../lib/auth';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    let result;
    if (isRegister) {
      result = await registerUser(email, password, fullName);
    } else {
      result = await loginUser(email, password);
    }

    setLoading(false);
    if (result.success) {
      onAuthSuccess(result.user);
      onClose();
    } else {
      setErrorMessage(result.error || 'Authentication failed.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md rounded-3xl border border-indigo-500/30 p-6 md:p-8 space-y-6 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <LogIn className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold font-display text-white">
              {isRegister ? 'Account Registration' : 'Account Sign In'}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <div>
              <label className="block text-slate-300 font-bold mb-1">Full Name</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter full name"
                className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-slate-200 outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-bold mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@domain.com"
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-slate-200 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-bold mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-slate-200 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold shadow-lg shadow-indigo-600/30 transition"
          >
            {loading ? 'Processing...' : (isRegister ? 'Register Account' : 'Sign In')}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => { setIsRegister(!isRegister); setErrorMessage(''); }}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            {isRegister ? 'Already have an account? Sign In' : 'Need an account? Register'}
          </button>
        </div>
      </div>
    </div>
  );
}
