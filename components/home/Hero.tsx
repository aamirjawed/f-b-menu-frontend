import React from 'react';
import Link from 'next/link';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-neutral-950 text-white pt-12 pb-20 border-b border-neutral-800">
      {/* Background Glow Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-72 h-72 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Information Header */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/40 text-orange-400 text-xs font-bold uppercase tracking-wider">
              <span>🔥</span> Youthful F&B Event Experience • Qrush
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              Scan into the <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">Rush</span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Qrush powers instant contactless food & drink ordering for youthful festival crowds. Scan stall QR codes, pay in seconds via UPI, get auto-verified Order QR tokens, and grab your drinks without missing a beat.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/menu"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-sm uppercase tracking-wider hover:brightness-110 shadow-lg shadow-orange-500/25 transition-all text-center"
              >
                🍔 Explore Food Menu & Order
              </Link>

              <Link
                href="/bartender"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm border border-neutral-700 transition-all text-center flex items-center justify-center gap-2"
              >
                <span>🍸 Bartender / Staff POS</span>
              </Link>
            </div>

            {/* Quick Feature Badges */}
            <div className="pt-6 border-t border-neutral-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-neutral-400 font-mono">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> Instant UPI QR
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> Auto Order Verification
              </div>
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold">✓</span> Staff POS Scanner
              </div>
            </div>
          </div>

          {/* Right Column: Visual Product Preview */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              {/* Decorative Frame */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500 to-orange-600 opacity-30 blur-lg" />

              <div className="relative bg-neutral-900 border border-neutral-800 rounded-3xl p-5 shadow-2xl space-y-4">
                {/* Header Card Mockup */}
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <div>
                    <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Live Festival Stall</h2>
                    <p className="text-sm font-bold text-white">Stall #04 • Craft Brewery & Bites</p>
                  </div>
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-[10px] font-bold rounded border border-emerald-500/30">
                    LIVE NOW
                  </span>
                </div>

                {/* Sample Items Preview */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-800/60 border border-neutral-700/50">
                    <div>
                      <p className="font-bold text-white">Craft Pale Ale (500ml)</p>
                      <p className="text-[10px] text-neutral-400 font-mono">Qty: 2 × ₹250</p>
                    </div>
                    <span className="font-bold text-amber-400 font-mono">₹500</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-800/60 border border-neutral-700/50">
                    <div>
                      <p className="font-bold text-white">Loaded Nachos Supreme</p>
                      <p className="text-[10px] text-neutral-400 font-mono">Qty: 1 × ₹299</p>
                    </div>
                    <span className="font-bold text-amber-400 font-mono">₹299</span>
                  </div>
                </div>

                {/* Digital Token & QR Code Preview */}
                <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 text-center space-y-2">
                  <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                    VERIFIED ORDER QR & TOKEN
                  </div>
                  <div className="text-2xl font-black text-amber-400 font-mono tracking-wider">
                    TOKEN #48
                  </div>

                  {/* QR Code Placeholder Graphic */}
                  <div className="w-28 h-28 mx-auto bg-white rounded-lg p-1.5 flex items-center justify-center shadow-md">
                    <div className="w-full h-full border-2 border-black rounded flex items-center justify-center text-black font-mono text-[9px] font-bold text-center leading-tight">
                      [ORDER QR<br/>VERIFIED]
                    </div>
                  </div>
                  <p className="text-[10px] text-neutral-400 font-mono">Show QR to bartender to claim order</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
