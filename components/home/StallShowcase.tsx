import React from 'react';
import Link from 'next/link';

export const StallShowcase: React.FC = () => {
  const stalls = [
    {
      name: 'Stall #01 • Fresh Juice & Smoothie Bar',
      badge: 'BEVERAGES',
      items: ['Fresh Berry Smoothie', 'Tropical Mango Sparkler', 'Iced Lemon Mint Tea'],
      speed: '~20s pickup',
    },
    {
      name: 'Stall #02 • Artisan Burgers & Fries',
      badge: 'FOOD',
      items: ['Truffle Cheese Smashburger', 'Crispy Chicken Sliders', 'Peri-Peri Loaded Fries'],
      speed: '~45s pickup',
    },
    {
      name: 'Stall #03 • Woodfired Pizza Oven',
      badge: 'FOOD',
      items: ['Neapolitan Margherita', 'Spicy Pepperoni Feast', 'Garlic Butter Knots'],
      speed: '~60s pickup',
    },
    {
      name: 'Stall #04 • Specialty Drinks & Desserts',
      badge: 'BEVERAGES & DESSERTS',
      items: ['Nitro Cold Brew Coffee', 'Churros with Belgian Chocolate', 'Mango Gelato'],
      speed: '~15s pickup',
    },
  ];

  return (
    <section id="stalls" className="py-16 bg-neutral-950 text-white border-b border-neutral-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 font-mono">
              Live Festival Counters
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white mt-1">
              Explore Active Food & Drink Stalls
            </h2>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-all self-start md:self-auto"
          >
            View Full Digital Menu →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stalls.map((stall, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 hover:border-amber-500/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded bg-neutral-800 text-neutral-300 text-[10px] font-bold font-mono uppercase tracking-wider">
                  {stall.badge}
                </span>
                <span className="text-xs font-mono font-semibold text-amber-400">
                  ⚡ {stall.speed}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white">{stall.name}</h3>

              <div className="space-y-1.5 pt-2 border-t border-neutral-800 text-xs text-neutral-400">
                <p className="font-semibold text-neutral-300">Popular Menu Preview:</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {stall.items.map((item, itemIdx) => (
                    <span
                      key={itemIdx}
                      className="px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-300"
                    >
                      • {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <Link
                  href="/menu"
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1"
                >
                  Order from this stall ➔
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
