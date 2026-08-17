'use client';

import React from 'react';

interface HeaderProps {
  cartItemCount: number;
  totalAmount: number;
  onOpenCart: () => void;
  eventName?: string;
  stallLocation?: string;
}

export const Header: React.FC<HeaderProps> = ({
  cartItemCount,
  totalAmount,
  onOpenCart,
  eventName = "Grand Food Fest '26",
  stallLocation = 'Stall #A-04 • Left Side',
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        {/* Event & Location Title */}
        <div>
          <h1 className="text-sm font-bold text-black tracking-tight uppercase">
            {eventName}
          </h1>
          <p className="text-xs text-gray-600 font-medium mt-0.5">
            {stallLocation}
          </p>
        </div>

        {/* Cart Button */}
        <button
          type="button"
          onClick={onOpenCart}
          disabled={cartItemCount === 0}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
            cartItemCount > 0
              ? 'bg-black text-white hover:bg-gray-800 active:scale-95'
              : 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
          }`}
        >
          <span>Cart</span>
          {cartItemCount > 0 ? (
            <span className="bg-white text-black font-mono text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {cartItemCount}
            </span>
          ) : null}
          {totalAmount > 0 ? (
            <span className="font-mono">₹{totalAmount.toFixed(0)}</span>
          ) : null}
        </button>
      </div>
    </header>
  );
};
