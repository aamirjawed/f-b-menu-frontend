'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { loginWithPassword, loginWithQr, getBartenderToken } from '@/services/bartenderApi';

function BartenderLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isQrChecking, setIsQrChecking] = useState(false);

  // Check for auto-login QR token in query params or existing active token
  useEffect(() => {
    const pairingToken = searchParams.get('pairingToken') || searchParams.get('pairing') || searchParams.get('token');
    if (pairingToken) {
      setIsQrChecking(true);
      loginWithQr(pairingToken).then((res) => {
        setIsQrChecking(false);
        if (res.success) {
          router.replace('/bartender');
        } else {
          setErrorMessage(res.error || 'QR Pairing token expired or invalid');
        }
      });
    } else if (getBartenderToken()) {
      router.replace('/bartender');
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both Bartender Username and Password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const res = await loginWithPassword(username.trim(), password.trim());
    setIsLoading(false);

    if (res.success) {
      router.replace('/bartender');
    } else {
      setErrorMessage(res.error || 'Invalid bartender username or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Dynamic Background Effects */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Login Container */}
      <div className="relative w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        {/* Header Icon & Title */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-3xl shadow-xl shadow-amber-500/25 mx-auto mb-3 border border-amber-400/30">
            🍸
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Bartender Login
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access your Bar Station & Live Order Queue
          </p>
        </div>

        {/* QR Pairing Spinner */}
        {isQrChecking && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center animate-pulse">
            <div className="text-2xl mb-1">⚡</div>
            <p className="text-xs font-bold text-amber-300">Pairing device via QR Code...</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Authenticating bartender session token</p>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-3.5 bg-red-950/70 border border-red-800/80 rounded-2xl text-red-200 text-xs font-medium text-center flex items-center justify-center gap-2">
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Bartender Credentials Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Bartender Username / Email
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. alex_mixologist or bar_stall_1"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !username.trim() || !password.trim()}
            className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 active:scale-98 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="animate-spin text-base">🍸</span>
                <span>Authenticating...</span>
              </>
            ) : (
              <>
                <span>Sign In to Bar Station</span>
                <span>➔</span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500">
            Bartender credentials are created and managed by the Super Admin.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function BartenderLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white text-xs">Loading Bartender Station...</div>}>
      <BartenderLoginContent />
    </Suspense>
  );
}

