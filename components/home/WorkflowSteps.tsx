import React from 'react';

export const WorkflowSteps: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: '📱',
      title: 'Scan Stall QR Code',
      description: 'Guests scan the QR code displayed at any festival stall. The digital menu opens instantly in their mobile browser with zero app installation.',
    },
    {
      num: '02',
      icon: '💳',
      title: 'Select & Pay via UPI / Card',
      description: 'Choose food or beverage items and complete payment using GPay, PhonePe, Paytm, BHIM, or Card with instant automated verification.',
    },
    {
      num: '03',
      icon: '🎟️',
      title: 'Generate Verified Order QR',
      description: 'Upon successful payment verification, an Order QR Code containing the token number and item list is instantly generated on the screen.',
    },
    {
      num: '04',
      icon: '🛍️',
      title: 'Scan & Collect at Counter',
      description: 'The counter staff scans the guest Order QR Code on their staff POS modal to mark the order served and deliver items immediately.',
    },
  ];

  return (
    <section id="workflow" className="py-16 bg-neutral-950 text-white border-b border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 font-mono">
            Seamless Guest & Staff Workflow
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            How Qrush Works at Your Event
          </h2>
          <p className="text-sm text-neutral-400">
            From scanning the QR code at a food counter to walking away with fresh drinks in under 30 seconds.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative p-6 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 transition-colors group flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-3xl">{step.icon}</span>
                  <span className="text-2xl font-black font-mono text-neutral-700 group-hover:text-amber-400 transition-colors">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                  {step.title}
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
