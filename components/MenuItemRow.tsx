'use client';

import React from 'react';
import { MenuItem } from '@/types/menu';
import { ItemCounter } from './ItemCounter';

interface MenuItemRowProps {
  item: MenuItem;
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const MenuItemRow: React.FC<MenuItemRowProps> = ({
  item,
  quantity,
  onIncrement,
  onDecrement,
}) => {
  return (
    <div className="py-3 px-4 border-b border-gray-100 bg-white flex items-center justify-between gap-3">
      {/* Left Details */}
      <div className="flex-1 min-w-0 pr-2">
        <h4 className="text-sm font-bold text-black truncate">
          {item.name}
        </h4>

        {item.description && (
          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
            {item.description}
          </p>
        )}

        {/* Price below */}
        <div className="mt-1 font-mono font-bold text-sm text-black">
          ₹{item.price}
        </div>
      </div>

      {/* Right Counter */}
      <div className="shrink-0">
        <ItemCounter
          quantity={quantity}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
        />
      </div>
    </div>
  );
};
