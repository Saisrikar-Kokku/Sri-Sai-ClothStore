import React from 'react';
import { SareeCategory } from '@/types/product.types';

interface Props {
  activeCategory: SareeCategory;
  onSelectCategory: (cat: SareeCategory) => void;
  categoryCounts: Record<SareeCategory, number>;
}

const CATEGORIES: SareeCategory[] = [
  'All',
  'Kanchi Pattu',
  'Banarasi Silk',
  'Organza',
  'Fancy Sarees',
  'Partywear & Kurtis',
];

export const CategoryTabs: React.FC<Props> = ({
  activeCategory,
  onSelectCategory,
  categoryCounts,
}) => {
  return (
    <div className="relative w-full">
      <div className="w-full overflow-x-auto pb-2 scrollbar-none">
        <div className="flex gap-2 sm:gap-2.5 min-w-max p-1 bg-white rounded-2xl border border-[#e5dfd3] backdrop-blur-md">
          {CATEGORIES.map((label) => {
            const isActive = activeCategory === label;
            const count = categoryCounts[label] || 0;

            return (
              <button
                key={label}
                type="button"
                onClick={() => onSelectCategory(label)}
                className={`group relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-medium tracking-wide transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-dasara-maroon/90 via-dasara-deepCrimson to-dasara-maroon/90 text-white border border-dasara-gold/60 shadow-lg shadow-dasara-gold/15'
                    : 'bg-transparent text-[#8a7a6b] hover:text-[#4c0d17] hover:bg-[#f9f5ec] border border-transparent hover:border-[#e5dfd3]'
                }`}
              >
                <span className="font-sans font-medium transition-colors">
                  {label}
                </span>

                {/* Subtle minimal monospace count */}
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-mono tracking-tight transition-colors ${
                    isActive
                      ? 'bg-dasara-gold/20 text-dasara-goldLight border border-dasara-gold/40'
                      : 'bg-[#f9f5ec] text-[#8a7a6b] border border-[#e5dfd3] group-hover:text-[#4c0d17]'
                  }`}
                >
                  {count}
                </span>

                {/* Sleek Linear/Framer style active gold underline indicator */}
                {isActive && (
                  <span className="absolute -bottom-[1px] inset-x-3 h-[2px] bg-gradient-to-r from-transparent via-dasara-gold to-transparent rounded-full shadow-[0_0_8px_#D4AF37]" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

