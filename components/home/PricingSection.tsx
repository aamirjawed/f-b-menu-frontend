import React from 'react';
import Link from 'next/link';

export const PricingSection: React.FC = () => {
  const plans = [
    {
      name: 'Single Festival Pass',
      badge: 'POPULAR FOR WEEKENDS',
      price: '1.9%',
      subtext: '+ ₹1 per transaction',
      description: 'Perfect for weekend concerts, college fests, food carnivals, and pop-up events.',
      features: [
        'Instant UPI & Card QR Payments',
        'Auto Payment Verification Polling',
        'Counter & Staff Web POS Scanners',
        'Unlimited Stall & Menu Catalogs',
        'Real-time Sales & Token Analytics',
        'Zero Setup or Monthly Fixed Fees',
      ],
      cta: 'Get Started Free',
      highlight: false,
    },
    {
      name: 'Pro Event Partner',
      badge: 'BEST VALUE FOR VENUES',
      price: '1.2%',
      subtext: 'Volume discount pricing',
      description: 'Ideal for weekend venues, food carnivals, food courts, and stall chains.',
      features: [
        'Everything in Single Pass',
        'Priority Webhook & Socket Dispatch',
        'Dedicated Merchant Onboarding Support',
        'Custom Stall Branding & QR Displays',
        'Multi-Staff Role & Pin Permissions',
        'Automated Daily Payout Transfers',
      ],
      cta: 'Partner With Qrush',
      highlight: true,
    },
    {
      name: 'Enterprise & Stadiums',
      badge: 'CUSTOM SCALE',
      price: 'Custom',
      subtext: 'Tailored for 10,000+ crowds',
      description: 'White-label solutions for mega stadiums, multi-stage music festivals, and sports arenas.',
      features: [
        'Dedicated On-Site Network Support',
        'Custom Webhooks & ERP Integration',
        'Custom Domain & Brand White-labeling',
        'SLA Guaranteed 99.99% Uptime',
        'Account Manager & On-site Support',
        'Customized Settlement Schedules',
      ],
      cta: 'Contact Sales',
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="py-16 bg-neutral-900 text-white border-b border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-400 font-mono">
            Transparent Pricing
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Simple Pay-As-You-Earn Plans
          </h2>
          <p className="text-sm text-neutral-400">
            No hidden setup costs or software fees. Scale your event food & drink sales seamlessly with Qrush.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative p-7 rounded-3xl flex flex-col justify-between transition-all ${
                plan.highlight
                  ? 'bg-neutral-950 border-2 border-orange-500 shadow-2xl shadow-orange-500/10'
                  : 'bg-neutral-950/80 border border-neutral-800'
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-black text-[10px] font-black uppercase tracking-wider shadow-md">
                  MOST POPULAR
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <span className="text-[10px] font-bold font-mono tracking-widest text-neutral-400 uppercase">
                    {plan.badge}
                  </span>
                  <h3 className="text-xl font-black text-white mt-0.5">{plan.name}</h3>
                  <p className="text-xs text-neutral-400 mt-2 leading-relaxed">{plan.description}</p>
                </div>

                <div className="py-4 border-y border-neutral-800/80">
                  <div className="text-3xl sm:text-4xl font-black font-mono text-white">
                    {plan.price}
                  </div>
                  <div className="text-xs font-mono text-orange-400 mt-1">{plan.subtext}</div>
                </div>

                <ul className="space-y-2.5 text-xs text-neutral-300">
                  {plan.features.map((feat, featIdx) => (
                    <li key={featIdx} className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold text-sm">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-8">
                <Link
                  href="/menu"
                  className={`block w-full py-3 px-4 rounded-xl text-center font-bold text-xs uppercase tracking-wider transition-all ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-black hover:brightness-110 shadow-lg shadow-orange-500/20'
                      : 'bg-neutral-800 text-white hover:bg-neutral-700 border border-neutral-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
