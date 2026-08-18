import React from 'react';

export const FeatureGrid: React.FC = () => {
  const features = [
    {
      icon: '⚡',
      title: 'Instant Dynamic UPI QR',
      description: 'Generates instant dynamic UPI strings & QR images for GPay, PhonePe, Paytm, and BHIM with preset exact order amounts.',
    },
    {
      icon: '🔄',
      title: 'Auto Payment Verification',
      description: 'Backend payment status polling automatically verifies transaction status without forcing manual confirmation clicks.',
    },
    {
      icon: '🎟️',
      title: 'Verified Digital Order QR',
      description: 'Once payment is confirmed, an encrypted Order QR code and token receipt are generated for counter pickup.',
    },
    {
      icon: '🍸',
      title: 'Bartender & Staff POS Scanner',
      description: 'Bartenders can scan customer Order QR codes directly using camera or token lookup to mark orders served in real-time.',
    },
    {
      icon: '🎪',
      title: 'Multi-Stall & Vendor Routing',
      description: 'Supports multiple independent stalls, bars, and food trucks within a single festival or venue with custom menus.',
    },
    {
      icon: '📊',
      title: 'Zero Revenue Leakage',
      description: 'Eliminates paper tokens, manual accounting mistakes, and unverified cash handling with 100% digital audit trail.',
    },
  ];

  return (
    <section id="features" className="py-16 bg-neutral-900 text-white border-b border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 font-mono">
            Designed For High-Volume Events
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Built for Festivals, Clubs, Stadiums & Nightlife
          </h2>
          <p className="text-sm text-neutral-400">
            Purpose-built technology stack to handle peak food & beverage rush hour traffic smoothly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-neutral-950 border border-neutral-800 hover:border-neutral-700 transition-all space-y-3"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl">
                {feat.icon}
              </div>
              <h3 className="text-base font-bold text-white">{feat.title}</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
