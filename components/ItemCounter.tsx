'use client';

import React from 'react';

interface ItemCounterProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
  compact?: boolean;
}

export const ItemCounter: React.FC<ItemCounterProps> = ({
  quantity,
  onIncrement,
  onDecrement,
  compact = false,
}) => {
  return (
    <div className="inline-flex items-center">
      {quantity === 0 ? (
        <button
          type="button"
          onClick={onIncrement}
          className={`font-semibold rounded-md bg-black text-white hover:bg-gray-800 active:scale-95 transition-all text-xs ${
            compact ? 'px-2.5 py-1' : 'px-3 py-1.5'
          }`}
        >
          + ADD
        </button>
      ) : (
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white">
          <button
            type="button"
            onClick={onDecrement}
            className="w-7 h-7 bg-gray-50 hover:bg-gray-100 active:scale-95 text-black font-bold flex items-center justify-center transition-all border-r border-gray-200"
            title="Decrease quantity"
          >
            −
          </button>

          <span className="w-7 text-center font-mono font-bold text-black text-xs select-none">
            {quantity}
          </span>

          <button
            type="button"
            onClick={onIncrement}
            className="w-7 h-7 bg-black text-white hover:bg-gray-800 active:scale-95 flex items-center justify-center font-bold transition-all"
            title="Increase quantity"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};
