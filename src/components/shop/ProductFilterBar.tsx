import React from 'react';
import { CatalogFilterState, SortOption } from '@/types/product.types';
import { Search, X, Sparkles, ChevronDown, Check } from 'lucide-react';

interface Props {
  filters: CatalogFilterState;
  onFilterChange: (newFilters: CatalogFilterState) => void;
  originHubs: string[];
  totalResults: number;
}

const COLOR_SWATCHES = [
  { name: 'Crimson', hex: '#9B111E', label: 'Crimson' },
  { name: 'Peacock', hex: '#0D5C75', label: 'Peacock' },
  { name: 'Haldi', hex: '#E5A93C', label: 'Haldi' },
  { name: 'Emerald', hex: '#0B4D3C', label: 'Emerald' },
  { name: 'Wine', hex: '#58112C', label: 'Wine' },
  { name: 'Pastel', hex: '#F7C8D0', label: 'Pastel' },
  { name: 'Ivory', hex: '#F5F2EB', label: 'Ivory' },
  { name: 'Black', hex: '#1C1A1D', label: 'Black' },
] as const;

export const ProductFilterBar: React.FC<Props> = ({
  filters,
  onFilterChange,
  originHubs,
  totalResults,
}) => {
  const activeColor = filters.selectedColor && filters.selectedColor !== 'All' ? filters.selectedColor : null;

  const handleColorClick = (colorName: string) => {
    if (activeColor === colorName) {
      onFilterChange({ ...filters, selectedColor: 'All' });
    } else {
      onFilterChange({ ...filters, selectedColor: colorName });
    }
  };

  return (
    <div className="festive-glass rounded-2xl p-4 sm:p-5 border border-dasara-gold/20 shadow-2xl space-y-4">
      {/* Top Row: Glassmorphic Search & Refined Dropdowns */}
      <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
        
        {/* 1. Sleek Glassmorphic Search Input with Backdrop Blur */}
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-dasara-gold/70 group-focus-within:text-dasara-gold transition-colors pointer-events-none" />
          <input
            id="saree-catalog-search"
            name="saree-catalog-search"
            aria-label="Search sarees by silk, color, or SKU"
            type="text"
            value={filters.searchQuery}
            onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
            placeholder="Search by silk, color, or SKU (e.g. Kanchipuram, Crimson, SSC-KP-101)..."
            className="w-full rounded-xl border border-dasara-gold/25 bg-zinc-950/70 backdrop-blur-xl pl-11 pr-10 py-3 text-xs sm:text-sm text-white placeholder-zinc-400 focus:border-dasara-gold focus:ring-1 focus:ring-dasara-gold/50 focus:outline-none transition-all shadow-inner hover:border-dasara-gold/45"
          />
          {filters.searchQuery && (
            <button
              onClick={() => onFilterChange({ ...filters, searchQuery: '' })}
              aria-label="Clear search input"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8a7a6b] hover:text-white transition p-1 rounded-md hover:bg-zinc-800"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* 2. Custom Styled Controls with Refined Gold Chevron Indicators */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          
          {/* Custom Origin Hub Dropdown */}
          <div className="relative flex items-center group">
            <select
              id="saree-origin-hub"
              name="saree-origin-hub"
              aria-label="Filter by weaving hub origin"
              value={filters.originHub}
              onChange={(e) => onFilterChange({ ...filters, originHub: e.target.value })}
              className="appearance-none rounded-xl border border-zinc-800 bg-zinc-900/90 pl-3.5 pr-9 py-2.5 text-xs font-semibold text-dasara-champagne focus:border-dasara-gold focus:outline-none cursor-pointer transition-all hover:border-dasara-gold/50 hover:bg-zinc-800/90 shadow-sm"
            >
              <option value="All" className="bg-white text-[#4c0d17]">All Weaving Hubs</option>
              {originHubs.map((hub) => (
                <option key={hub} value={hub} className="bg-white text-[#4c0d17]">
                  📍 {hub}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-dasara-gold transition-transform duration-200 group-hover:scale-110" />
          </div>

          {/* Custom Sort Dropdown */}
          <div className="relative flex items-center group">
            <select
              id="saree-sort-option"
              name="saree-sort-option"
              aria-label="Sort sarees catalog"
              value={filters.sortBy}
              onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as SortOption })}
              className="appearance-none rounded-xl border border-zinc-800 bg-zinc-900/90 pl-3.5 pr-9 py-2.5 text-xs font-semibold text-dasara-champagne focus:border-dasara-gold focus:outline-none cursor-pointer transition-all hover:border-dasara-gold/50 hover:bg-zinc-800/90 shadow-sm"
            >
              <option value="featured" className="bg-white text-[#4c0d17]">Featured First</option>
              <option value="price-low" className="bg-white text-[#4c0d17]">Price: Low to High</option>
              <option value="price-high" className="bg-white text-[#4c0d17]">Price: High to Low</option>
              <option value="discount" className="bg-white text-[#4c0d17]">Highest Discount</option>
              <option value="newest" className="bg-white text-[#4c0d17]">Newly Unpacked Lots</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 h-3.5 w-3.5 text-dasara-gold transition-transform duration-200 group-hover:scale-110" />
          </div>

          {/* 1-of-1 Exclusive Dealer Toggle with Subtle Gold Glow */}
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, onlyUniquePieces: !filters.onlyUniquePieces })}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-300 cursor-pointer border ${
              filters.onlyUniquePieces
                ? 'bg-gradient-to-r from-dasara-maroon to-dasara-gold/90 border-dasara-gold text-white shadow-[0_0_18px_rgba(212,175,55,0.35)] ring-1 ring-dasara-gold/40'
                : 'border-[#e5dfd3] bg-white text-[#8a7a6b] hover:text-[#4c0d17] hover:border-[#b08a47]/40 hover:bg-[#f9f5ec]'
            }`}
          >
            <Sparkles className={`h-3.5 w-3.5 ${filters.onlyUniquePieces ? 'text-dasara-goldLight animate-pulse' : 'text-[#8a7a6b]'}`} />
            <span>1-of-1 Dealer Exclusive</span>
          </button>

          {/* Total Results Count */}
          <span className="text-xs text-[#8a7a6b] font-mono hidden xl:inline-block pl-1">
            ({totalResults} items)
          </span>
        </div>
      </div>

      {/* Bottom Row: Color Swatch Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800/70">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#8a7a6b]">
            Saree Palette:
          </span>

          {/* All Colors Reset Button */}
          <button
            type="button"
            onClick={() => onFilterChange({ ...filters, selectedColor: 'All' })}
            className={`text-xs px-2.5 py-1 rounded-full transition-all duration-200 cursor-pointer ${
              !activeColor
                ? 'bg-dasara-gold/20 text-dasara-goldLight border border-dasara-gold/60 font-semibold shadow-[0_0_10px_rgba(212,175,55,0.2)]'
                : 'text-[#8a7a6b] hover:text-white bg-zinc-900/60 border border-zinc-800'
            }`}
          >
            All Colors
          </button>

          {/* Circular Color Swatches */}
          <div className="flex items-center gap-2">
            {COLOR_SWATCHES.map((swatch) => {
              const isSelected = activeColor === swatch.name;

              return (
                <button
                  key={swatch.name}
                  type="button"
                  title={`Filter by ${swatch.label}`}
                  onClick={() => handleColorClick(swatch.name)}
                  className={`group relative flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'scale-110 ring-2 ring-dasara-gold ring-offset-2 ring-offset-[#0E0C0F] shadow-[0_0_12px_rgba(212,175,55,0.45)]'
                      : 'hover:scale-110 hover:ring-1 hover:ring-zinc-500 ring-1 ring-white/10 opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: swatch.hex }}
                >
                  {isSelected && (
                    <Check
                      className={`h-3.5 w-3.5 stroke-[3] ${
                        swatch.name === 'Ivory' || swatch.name === 'Pastel'
                          ? 'text-zinc-900'
                          : 'text-white'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {activeColor && (
            <div className="flex items-center gap-1.5 ml-1">
              <span className="text-xs text-dasara-gold font-medium">
                Showing: {activeColor}
              </span>
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, selectedColor: 'All' })}
                className="text-[#8a7a6b] hover:text-white p-0.5"
                title="Clear color filter"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>

        <span className="text-[11px] text-[#8a7a6b] font-mono hidden sm:inline-block">
          Click swatch to filter instantaneously
        </span>
      </div>
    </div>
  );
};

