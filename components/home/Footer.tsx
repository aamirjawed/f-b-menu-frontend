import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-400 text-xs py-12 border-t border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-neutral-800">
          {/* Brand logo & tagline */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-black text-white text-base">
              <span className="w-6 h-6 rounded bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 text-black flex items-center justify-center text-xs">🔥</span>
              <span>Qrush</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30 uppercase tracking-wider">
                Youthful
              </span>
            </div>
            <p className="text-neutral-400 font-mono text-xs">Scan into the rush</p>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-neutral-300">
            <Link href="/menu" className="hover:text-amber-400 transition-colors">
              🍔 Open Food Menu
            </Link>
            <Link href="/bartender" className="hover:text-amber-400 transition-colors">
              📋 Staff POS Portal
            </Link>
            <a href="#features" className="hover:text-amber-400 transition-colors">
              Features
            </a>
            <a href="#workflow" className="hover:text-amber-400 transition-colors">
              Workflow
            </a>
          </div>
        </div>

        {/* System status & copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-neutral-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Event Payment Gateway Engine • Operational</span>
          </div>
          <div>
            © {new Date().getFullYear()} Qrush Event Management. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
