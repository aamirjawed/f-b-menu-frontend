'use client';

import React, { useState } from 'react';
import { loginWithPassword } from '@/services/bartenderApi';

interface BartenderPasswordLoginProps {
  onSuccess: () => void;
}

export const BartenderPasswordLogin: React.FC<BartenderPasswordLoginProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both username and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const res = await loginWithPassword(username.trim(), password.trim());
    setIsLoading(false);

    if (res.success) {
      onSuccess();
    } else {
      setErrorMessage(res.error || 'Invalid credentials. Please verify your username and password.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
          Bartender Username / Email
        </label>
        <input
          type="text"
          placeholder="e.g. alex_mixologist or staff ID"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-all"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
          Password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-all"
        />
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-950/50 border border-red-800/60 rounded-xl text-red-300 text-xs font-medium text-center">
          ⚠️ {errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !username.trim() || !password.trim()}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all disabled:opacity-40"
      >
        {isLoading ? 'Authenticating...' : 'Sign In to Station'}
      </button>
    </form>
  );
};
