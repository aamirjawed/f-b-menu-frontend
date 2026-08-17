'use client';

import React from 'react';
import { MenuItem } from '@/types/menu';
import { ItemCounter } from './ItemCounter';
import { Star, Flame, Sparkles } from 'lucide-react';

interface MenuItemCardProps {
  item: MenuItem;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  quantity,
  onIncrement,
  onDecrement,
}) => {
  return (
    <div
      className={`group relative bg-slate-900/80 border rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 hover:shadow-xl ${
        quantity > 0
          ? 'border-amber-500/50 bg-slate-900 shadow-amber-500/5'
          : 'border-slate-800/80 hover:border-slate-700'
      }`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            {/* Veg Symbol */}
            <span
              className="w-4 h-4 rounded border border-emerald-500 flex items-center justify-center p-0.5"
              title="100% Pure Veg"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </span>

            {/* Popular Badge */}
            {item.popular && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <Sparkles className="w-2.5 h-2.5" /> Bestseller
              </span>
            )}
          </div>

          {/* Rating & Spicy level */}
          <div className="flex items-center gap-2 text-xs">
            {item.spicyLevel && item.spicyLevel > 0 ? (
              <span
                className="flex items-center text-orange-400 font-mono text-[10px]"
                title={`Spicy Level: ${item.spicyLevel}`}
              >
                {Array.from({ length: item.spicyLevel }).map((_, i) => (
                  <Flame key={i} className="w-3 h-3 fill-orange-500 text-orange-500" />
                ))}
              </span>
            ) : null}

            {item.rating && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-slate-800/70 px-1.5 py-0.5 rounded-md">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {item.rating}
              </span>
            )}
          </div>
        </div>

        {/* Item Title & Subcategory tag */}
        <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
          {item.name}
        </h3>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {item.description}
        </p>
      </div>

      {/* Footer / Price & Counter controls */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
            Price
          </span>
          <span className="text-lg font-bold font-mono text-amber-400">
            ₹{item.price}
          </span>
        </div>

        <ItemCounter
          quantity={quantity}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
        />
      </div>
    </div>
  );
};
