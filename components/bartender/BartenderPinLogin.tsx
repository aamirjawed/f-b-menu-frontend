'use client';

import React, { useState } from 'react';
import { loginWithPin } from '@/services/bartenderApi';

interface BartenderPinLoginProps {
  onSuccess: () => void;
}

export const BartenderPinLogin: React.FC<BartenderPinLoginProps> = ({ onSuccess }) => {
  const [staffId, setStaffId] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      if (nextPin.length === 4 && staffId.trim()) {
        submitLogin(staffId.trim(), nextPin);
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
  };

  const submitLogin = async (sId: string, pCode: string) => {
    if (!sId) {
      setErrorMessage('Please enter your Staff ID first.');
      return;
    }
    if (pCode.length < 4) {
      setErrorMessage('Please enter your 4-digit PIN.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const res = await loginWithPin(sId, pCode);
    setIsLoading(false);

    if (res.success) {
      onSuccess();
    } else {
      setErrorMessage(res.error || 'Authentication failed. Please check your Staff ID and PIN.');
      setPin('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Staff ID Input */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
          Staff ID / Bartender ID
        </label>
        <input
          type="text"
          placeholder="e.g. staff-alex-1234 or bt-1"
          value={staffId}
          onChange={(e) => setStaffId(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-all"
        />
      </div>

      {/* 4-Digit PIN Indicator */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 text-center">
          4-Digit Quick PIN
        </label>
        <div className="flex justify-center items-center gap-3 mb-4">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${
                pin.length > index
                  ? 'bg-amber-400 border-amber-400 scale-110 shadow-md shadow-amber-400/40'
                  : 'bg-slate-800 border-slate-600'
              }`}
            />
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-950/50 border border-red-800/60 rounded-xl text-red-300 text-xs font-medium text-center">
          ⚠️ {errorMessage}
        </div>
      )}

      {/* Numeric Keypad */}
      <div className="grid grid-cols-3 gap-2.5 max-w-xs mx-auto pt-2">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => handleKeyPress(num)}
            disabled={isLoading}
            className="h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 text-white font-bold text-lg font-mono border border-slate-700 transition-all disabled:opacity-50"
          >
            {num}
          </button>
        ))}
        <button
          type="button"
          onClick={handleClear}
          disabled={isLoading || pin.length === 0}
          className="h-12 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 text-xs font-bold border border-slate-700/60 transition-all disabled:opacity-30"
        >
          CLEAR
        </button>
        <button
          type="button"
          onClick={() => handleKeyPress('0')}
          disabled={isLoading}
          className="h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-amber-500 active:text-slate-950 text-white font-bold text-lg font-mono border border-slate-700 transition-all disabled:opacity-50"
        >
          0
        </button>
        <button
          type="button"
          onClick={handleBackspace}
          disabled={isLoading || pin.length === 0}
          className="h-12 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-400 text-xs font-bold border border-slate-700/60 transition-all disabled:opacity-30 flex items-center justify-center"
        >
          ⌫
        </button>
      </div>

      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={() => submitLogin(staffId.trim(), pin)}
          disabled={isLoading || !staffId.trim() || pin.length !== 4}
          className="w-full max-w-xs py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all disabled:opacity-40"
        >
          {isLoading ? 'Verifying PIN...' : 'Login with PIN'}
        </button>
      </div>
    </div>
  );
};
