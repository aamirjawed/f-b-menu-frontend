'use client';

import React from 'react';
import { BartenderSession } from '@/services/bartenderApi';

interface BartenderHeaderProps {
  bartender: BartenderSession | null;
  activeFilter: 'active' | 'completed' | 'all';
  onSelectFilter: (filter: 'active' | 'completed' | 'all') => void;
  activeCount: number;
  completedCount: number;
  onOpenScanner: () => void;
  onRefresh: () => void;
  onLogout: () => void;
}

export const BartenderHeader: React.FC<BartenderHeaderProps> = ({
  bartender,
  activeFilter,
  onSelectFilter,
  activeCount,
  completedCount,
  onOpenScanner,
  onRefresh,
  onLogout,
}) => {
  return (
    <header className="bg-black text-white border-b-2 border-black sticky top-0 z-30 shadow-sm">
      {/* Top Main Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white text-black font-bold flex items-center justify-center text-xl border border-black">
            🍸
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold uppercase tracking-wider text-white">
                {bartender?.stall?.name || 'Bar Counter KDS'}
              </h1>
              {bartender?.stall?.stallNumber && (
                <span className="bg-white text-black font-mono text-[10px] px-2 py-0.5 rounded-md font-bold uppercase">
                  {bartender.stall.stallNumber}
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400 font-mono">
              Station: <span className="text-white">{bartender?.station || 'Main Bar'}</span> • Staff:{' '}
              <span className="text-white font-bold">{bartender?.name || 'Bartender'}</span>
            </p>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Scan QR Code Button */}
          <button
            onClick={onOpenScanner}
            className="px-3 py-1.5 rounded-md bg-white text-black hover:bg-neutral-200 text-xs font-bold uppercase flex items-center gap-1.5 transition-all border border-black"
          >
            <span>📷</span> Scan QR
          </button>

          <button
            onClick={onRefresh}
            className="px-3 py-1.5 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase flex items-center gap-1 transition-all border border-neutral-700"
          >
            <span>🔄</span> Refresh
          </button>

          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-md bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 text-xs font-bold uppercase transition-all"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2 border-t border-neutral-800 flex items-center gap-2 bg-neutral-950">
        <button
          onClick={() => onSelectFilter('active')}
          className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
            activeFilter === 'active'
              ? 'bg-white text-black font-extrabold'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <span>Active Orders</span>
          <span className={`px-1.5 py-0.2 rounded-full font-mono text-[10px] ${activeFilter === 'active' ? 'bg-black text-white' : 'bg-neutral-800 text-white'}`}>
            {activeCount}
          </span>
        </button>

        <button
          onClick={() => onSelectFilter('completed')}
          className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
            activeFilter === 'completed'
              ? 'bg-white text-black font-extrabold'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          <span>Completed</span>
          <span className={`px-1.5 py-0.2 rounded-full font-mono text-[10px] ${activeFilter === 'completed' ? 'bg-black text-white' : 'bg-neutral-800 text-white'}`}>
            {completedCount}
          </span>
        </button>

        <button
          onClick={() => onSelectFilter('all')}
          className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${
            activeFilter === 'all'
              ? 'bg-white text-black font-extrabold'
              : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
          }`}
        >
          All
        </button>
      </div>
    </header>
  );
};

