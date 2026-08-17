'use client';

import React from 'react';

interface CheckoutFooterProps {
  totalItems: number;
  total: number;
  onOpenCheckout: () => void;
}

export const CheckoutFooter: React.FC<CheckoutFooterProps> = ({
  totalItems,
  total,
  onOpenCheckout,
}) => {
  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 p-3 bg-white border-t border-gray-200">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        {/* Display only real price */}
        <div>
          <span className="text-xl font-bold font-mono text-black">
            ₹{total.toFixed(0)}
          </span>
        </div>

        {/* Checkout Button */}
        <button
          type="button"
          onClick={onOpenCheckout}
          className="px-5 py-2.5 rounded-md bg-black text-white font-bold text-xs uppercase tracking-wider hover:bg-gray-800 active:scale-95 transition-all"
        >
          Checkout →
        </button>
      </div>
    </div>
  );
};
