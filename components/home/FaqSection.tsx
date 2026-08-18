import React from 'react';

export const FaqSection: React.FC = () => {
  const faqs = [
    {
      q: 'Do event attendees need to download an application to order?',
      a: 'No. Guests simply point their phone camera at the stall QR code. The digital menu opens directly in their default browser (Safari, Chrome) with zero app download or registration required.',
    },
    {
      q: 'How does the counter or stall staff verify that the guest paid?',
      a: 'Once payment is verified via UPI or Card, a verified Order QR Code and unique Token Number appear on the guest’s screen. Staff scan this QR on their web POS scanner to mark the order served.',
    },
    {
      q: 'What payment methods are supported for food and beverages?',
      a: 'All major UPI applications (Google Pay, PhonePe, Paytm, BHIM) via dynamic UPI QR code, as well as Credit Cards, Debit Cards, and NetBanking via Razorpay.',
    },
    {
      q: 'Can multiple stalls and beverage counters operate simultaneously?',
      a: 'Yes! The platform supports unlimited independent stall counters, food trucks, and VIP lounges, each with its own vendor catalog and staff logins.',
    },
  ];

  return (
    <section id="faq" className="py-16 bg-neutral-950 text-white border-b border-neutral-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 font-mono">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Everything You Need to Know
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2"
            >
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span className="text-amber-400 font-mono text-xs font-bold">Q{idx + 1}.</span>
                {faq.q}
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
