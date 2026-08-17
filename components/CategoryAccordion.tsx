'use client';

import React, { useState } from 'react';
import { Category, MenuItem } from '@/types/menu';
import { MenuItemRow } from './MenuItemRow';

interface CategoryAccordionProps {
  category: Category;
  items: MenuItem[];
  cartQuantities: Record<string, number>;
  onIncrement: (itemId: string) => void;
  onDecrement: (itemId: string) => void;
}

export const CategoryAccordion: React.FC<CategoryAccordionProps> = ({
  category,
  items,
  cartQuantities,
  onIncrement,
  onDecrement,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  // Group items by subcategory
  const subCategoryGroups = React.useMemo(() => {
    const groups: Record<string, MenuItem[]> = {};
    items.forEach((item) => {
      const subCat = item.subCategory || 'General';
      if (!groups[subCat]) {
        groups[subCat] = [];
      }
      groups[subCat].push(item);
    });
    return groups;
  }, [items]);

  // Total item count in category
  const categoryCartCount = React.useMemo(() => {
    return items.reduce((sum, item) => sum + (cartQuantities[item.id] || 0), 0);
  }, [items, cartQuantities]);

  return (
    <div className="mb-4 bg-white border border-gray-200 rounded-lg overflow-hidden">
      {/* Category Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between transition-colors select-none text-left"
      >
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-black uppercase tracking-wide">
            {category.name}
          </h3>
          {categoryCartCount > 0 ? (
            <span className="bg-black text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded-full">
              {categoryCartCount}
            </span>
          ) : null}
        </div>

        <span className="text-xs text-gray-500 font-mono">
          {isOpen ? '▲' : '▼'}
        </span>
      </button>

      {/* Sub-menus & Items */}
      <div className={isOpen ? 'divide-y divide-gray-100' : 'hidden'}>
        {Object.entries(subCategoryGroups).map(([subCategory, subItems]) => (
          <div key={subCategory}>
            {/* Sub-menu section header */}
            <div className="px-4 py-2 bg-gray-100/60 border-b border-gray-200 text-xs font-bold text-gray-700 uppercase tracking-wider">
              {subCategory}
            </div>

            {/* Dish List */}
            <div className="divide-y divide-gray-100">
              {subItems.map((item) => (
                <MenuItemRow
                  key={item.id}
                  item={item}
                  quantity={cartQuantities[item.id] || 0}
                  onIncrement={() => onIncrement(item.id)}
                  onDecrement={() => onDecrement(item.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
