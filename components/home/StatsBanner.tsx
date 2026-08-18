import React from 'react';

export const StatsBanner: React.FC = () => {
  const stats = [
    { label: 'Average Pickup Time', value: '< 30 Seconds', subtext: 'No token queues' },
    { label: 'UPI Success Verification', value: '100% Instant', subtext: 'Auto-verification polling' },
    { label: 'Guest App Downloads', value: '0 Required', subtext: 'Pure web QR experience' },
    { label: 'Cash Reconciliation Errors', value: '0%', subtext: 'Automated digital records' },
  ];

  return (
    <section className="bg-neutral-900 border-b border-neutral-800 py-10 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800/80">
              <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono mb-1">
                {stat.value}
              </div>
              <div className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
                {stat.label}
              </div>
              <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                {stat.subtext}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
