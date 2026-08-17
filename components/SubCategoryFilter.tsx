'use client';

import React from 'react';

interface SubCategoryFilterProps {
  subCategories: string[];
  activeSubCategory: string;
  onSelectSubCategory: (subCat: string) => void;
}

export const SubCategoryFilter: React.FC<SubCategoryFilterProps> = ({
  subCategories,
  activeSubCategory,
  onSelectSubCategory,
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
      {subCategories.map((subCat) => {
        const isActive = activeSubCategory === subCat;
        return (
          <button
            key={subCat}
            onClick={() => onSelectSubCategory(subCat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              isActive
                ? 'bg-amber-500/15 border border-amber-500/30 text-amber-400 font-semibold'
                : 'bg-slate-900/60 border border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {subCat}
          </button>
        );
      })}
    </div>
  );
};
