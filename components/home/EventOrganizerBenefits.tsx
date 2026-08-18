import React from 'react';

export const EventOrganizerBenefits: React.FC = () => {
  return (
    <section id="organizers" className="py-16 bg-neutral-900 text-white border-b border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 font-mono">
              For Event Managers & Vendors
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
              Maximize Beverage & Food Sales at your Festival
            </h2>
            <p className="text-sm text-neutral-300 leading-relaxed">
              Queue friction reduces food & drink sales by up to 35% during concert peaks. Qrush converts physical lines into instant digital orders, increasing counter throughput and eliminating revenue leakages.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                  ✓
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Higher Stall & Food Revenue</h3>
                  <p className="text-xs text-neutral-400">Faster guest ordering means more repeat item purchases per attendee.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                  ✓
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Real-Time Counter POS Sync</h3>
                  <p className="text-xs text-neutral-400">Staff web scanners update order status instantly across all terminals.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                  ✓
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Automated Reconciliation</h3>
                  <p className="text-xs text-neutral-400">Every transaction is digitally recorded with detailed sales reporting per stall.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Card */}
          <div className="p-8 rounded-3xl bg-neutral-950 border border-neutral-800 space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase">
                Event Operational Impact
              </span>
              <span className="text-[10px] font-mono text-neutral-500">Live Analytics Engine</span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between font-mono">
                  <span className="text-neutral-400">Order Serving Velocity:</span>
                  <span className="text-emerald-400 font-bold">3.2x Faster</span>
                </div>
                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-4/5 rounded-full" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-mono">
                  <span className="text-neutral-400">Paper Token Overhead:</span>
                  <span className="text-emerald-400 font-bold">100% Eliminated</span>
                </div>
                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 w-full rounded-full" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-mono">
                  <span className="text-neutral-400">Guest Satisfaction Rating:</span>
                  <span className="text-emerald-400 font-bold">4.9 / 5.0 ★</span>
                </div>
                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 w-11/12 rounded-full" />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-800 text-center">
              <p className="text-[11px] text-neutral-400">
                Ready to deploy Qrush for your upcoming festival, concert, or sports event?
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
