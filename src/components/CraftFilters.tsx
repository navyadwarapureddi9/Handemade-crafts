import React from 'react';
import { SlidersHorizontal, Check, RefreshCw } from 'lucide-react';
import { CraftCategory } from '../types';

interface CraftFiltersProps {
  selectedCategory: CraftCategory;
  onSelectCategory: (cat: CraftCategory) => void;
  sortBy: 'curated' | 'price-asc' | 'price-desc' | 'hours-desc' | 'rating-desc';
  setSortBy: (sort: 'curated' | 'price-asc' | 'price-desc' | 'hours-desc' | 'rating-desc') => void;
  customizableOnly: boolean;
  setCustomizableOnly: (val: boolean) => void;
  maxPrice: number;
  setMaxPrice: (val: number) => void;
  totalCount: number;
  onResetFilters: () => void;
}

const CATEGORIES: { id: CraftCategory; label: string; iconSymbol: string }[] = [
  { id: 'all', label: 'All Disciplines', iconSymbol: '✦' },
  { id: 'pottery', label: 'Pottery & Ceramics', iconSymbol: '🏺' },
  { id: 'textiles', label: 'Weaving & Crochet', iconSymbol: '🧶' },
  { id: 'jewelry', label: 'Artisan Jewelry', iconSymbol: '💍' },
  { id: 'woodcraft', label: 'Reclaimed Wood', iconSymbol: '🪵' },
  { id: 'homedecor', label: 'Botanical & Home', iconSymbol: '🌿' },
  { id: 'paintings', label: 'Fine & Folk Art', iconSymbol: '🎨' },
  { id: 'custom', label: 'Custom Orders', iconSymbol: '⚒' },
];

export const CraftFilters: React.FC<CraftFiltersProps> = ({
  selectedCategory,
  onSelectCategory,
  sortBy,
  setSortBy,
  customizableOnly,
  setCustomizableOnly,
  maxPrice,
  setMaxPrice,
  totalCount,
  onResetFilters,
}) => {
  const [showDrawer, setShowDrawer] = React.useState(false);

  return (
    <div className="space-y-4">
      {/* Category Segmented Bar - Horizontal Scrolling on Mobile */}
      <div className="flex items-center justify-between gap-4 border-b border-[#E8E1D5] pb-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#24211D] text-[#FAF7F2] shadow-sm'
                    : 'bg-[#F2ECE1] text-[#4A453E] hover:bg-[#E9E2D4] hover:text-[#211E1C]'
                }`}
              >
                <span>{cat.iconSymbol}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Filter Toggle Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowDrawer(!showDrawer)}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-md border transition-colors cursor-pointer ${
              showDrawer || customizableOnly || maxPrice < 400
                ? 'bg-[#EAE1D2] border-[#C4B7A2] text-[#24211D]'
                : 'bg-[#FAF7F2] border-[#E8E1D5] text-[#554E44] hover:bg-[#F2ECE1]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refine & Sort</span>
            {(customizableOnly || maxPrice < 400) && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#C85A32]"></span>
            )}
          </button>
        </div>
      </div>

      {/* Refine / Sort Expandable Panel */}
      {showDrawer && (
        <div className="p-4 bg-[#F5EFE6] border border-[#E0D7C6] rounded-lg grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-[#4A453E] animate-in fade-in duration-200">
          {/* Sort By */}
          <div>
            <label className="block font-semibold text-[#211E1C] mb-2 uppercase tracking-wider text-[11px]">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full bg-[#FAF7F2] border border-[#D5CABE] text-[#211E1C] py-2 px-2.5 rounded outline-none focus:border-[#C85A32]"
            >
              <option value="curated">Curated & Featured</option>
              <option value="hours-desc">Most Craft Hours (Heirloom Time)</option>
              <option value="price-asc">Price: Modest to Investment</option>
              <option value="price-desc">Price: Investment to Modest</option>
              <option value="rating-desc">Highest Patron Rating</option>
            </select>
          </div>

          {/* Price Range Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold text-[#211E1C] uppercase tracking-wider text-[11px]">
                Maximum Investment
              </label>
              <span className="font-medium text-[#C85A32]">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="30"
              max="400"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#C85A32] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-500 mt-1">
              <span>$30 (Studio entry)</span>
              <span>$400+ (Master works)</span>
            </div>
          </div>

          {/* Toggle Customizable & Reset */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="block font-semibold text-[#211E1C] mb-2 uppercase tracking-wider text-[11px]">
                Artisan Specifications
              </span>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={customizableOnly}
                  onChange={(e) => setCustomizableOnly(e.target.checked)}
                  className="rounded border-[#D5CABE] text-[#C85A32] focus:ring-[#C85A32] w-4 h-4 cursor-pointer"
                />
                <span>Custom monogram & finish options only</span>
              </label>
            </div>

            <div className="pt-3 flex justify-between items-center">
              <span className="text-[11px] text-stone-500">
                Displaying {totalCount} authentic pieces
              </span>
              <button
                onClick={onResetFilters}
                className="flex items-center gap-1 text-[11px] text-[#A43F1B] hover:underline cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                Reset filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
