'use client';

import React from 'react';
import { Category } from '@/types/menu';

interface CategoryNavProps {
  categories?: Category[];
  activeCategory: string;
  onSelectCategory: (id: string) => void;
  categoryItemCounts: Record<string, number>;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories = [],
  activeCategory,
  onSelectCategory,
  categoryItemCounts,
}) => {
  return (
    <div className="w-full bg-slate-900/60 border-b border-slate-800 backdrop-blur-sm sticky top-[61px] z-20 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-none no-scrollbar">
        {categories.map((cat) => {

          const isActive = activeCategory === cat.id;
          const count = categoryItemCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 shrink-0 select-none ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 shadow-md shadow-amber-500/10'
                  : 'bg-slate-950/50 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <span className="text-base">{cat.icon}</span>
              <span>{cat.name}</span>
              {count > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                    isActive
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
