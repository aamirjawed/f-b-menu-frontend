import React from 'react';
import Link from 'next/link';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform">
            🔥
          </div>
          <div>
            <div className="font-black text-lg tracking-tight flex items-center gap-1.5">
              <span>Qrush</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30 uppercase tracking-wider">
                Youthful
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 -mt-1 font-mono">Scan into the rush</p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-neutral-300">
          <a href="#features" className="hover:text-amber-400 transition-colors">Features</a>
          <a href="#workflow" className="hover:text-amber-400 transition-colors">How It Works</a>
          <a href="#stalls" className="hover:text-amber-400 transition-colors">Stalls & Menus</a>
          <a href="#organizers" className="hover:text-amber-400 transition-colors">Event Organizers</a>
          <a href="#faq" className="hover:text-amber-400 transition-colors">FAQ</a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/bartender"
            className="hidden sm:inline-flex px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs font-bold transition-all"
          >
            🍸 Bartender POS
          </Link>
          <Link
            href="/menu"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-md shadow-orange-500/20 transition-all active:scale-95"
          >
            🍔 Open Menu
          </Link>
        </div>
      </div>
    </header>
  );
};
