import React from 'react';
import { Clock, Sparkles, MapPin, Plus } from 'lucide-react';
import { CraftProduct } from '../types';

interface ProductCardProps {
  product: CraftProduct;
  onOpenModal: (product: CraftProduct) => void;
  onQuickAdd: (product: CraftProduct) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onOpenModal,
  onQuickAdd,
}) => {
  return (
    <article className="group bg-[#FAF7F2] border border-[#E8E1D5] hover:border-[#C4B7A2] rounded-lg overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-sm">
      {/* Visual Asset Container */}
      <div 
        onClick={() => onOpenModal(product)}
        className="relative aspect-[4/3] overflow-hidden bg-stone-100 cursor-pointer"
      >
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-103"
          loading="lazy"
        />

        {/* Small batch availability indicator (quiet text, not a colored pill) */}
        {product.inventoryCount <= 4 && (
          <div className="absolute top-2.5 left-2.5 bg-[#FAF7F2]/90 backdrop-blur-xs text-[#7A5C4D] text-[10px] font-medium px-2 py-0.5 rounded shadow-2xs">
            Small batch: {product.inventoryCount} remaining
          </div>
        )}

        {/* Quick View Hover Overlay */}
        <div className="absolute inset-0 bg-[#24211D]/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
          <span className="bg-[#FAF7F2] text-[#24211D] text-xs font-medium px-3.5 py-1.5 rounded shadow-md transform translate-y-2 group-hover:translate-y-0 transition-transform">
            Read Artisan Story
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Artisan & Studio Provenance */}
          <div className="flex items-center justify-between text-xs text-[#7A5C4D] mb-1.5">
            <div className="flex items-center gap-1.5 truncate">
              <img
                src={product.artisan.avatar}
                alt={product.artisan.name}
                className="w-4 h-4 rounded-full object-cover shrink-0"
              />
              <span className="truncate">{product.artisan.name}</span>
            </div>
            <span className="text-[11px] text-stone-400 shrink-0">
              {product.artisan.location.split(',')[0]}
            </span>
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onOpenModal(product)}
            className="font-editorial text-lg text-[#211E1C] font-semibold leading-snug hover:text-[#A43F1B] transition-colors cursor-pointer line-clamp-2 mb-2"
          >
            {product.title}
          </h3>

          {/* Clean Unboxed Metadata: Hours · Materials · Customizability */}
          <div className="flex flex-wrap items-center gap-x-2 text-[11px] text-[#6B6155] mb-3">
            <span className="flex items-center gap-1 text-[#C85A32] font-medium">
              <Clock className="w-3 h-3" />
              {product.craftHours}h handwork
            </span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="truncate max-w-[170px]">{product.materials.split(',')[0]}</span>
            {product.isCustomizable && (
              <>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span className="text-[#506B52]">Bespoke Options</span>
              </>
            )}
          </div>
        </div>

        {/* Pricing & Add Action */}
        <div className="pt-3 border-t border-[#EFE9DD] flex items-center justify-between mt-auto">
          <div>
            <span className="text-xs text-stone-400 block -mb-0.5">Patron Price</span>
            <span className="font-editorial text-xl font-bold text-[#211E1C]">
              ${product.price}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenModal(product)}
              className="text-xs text-[#7A5C4D] hover:text-[#211E1C] px-2.5 py-1.5 hover:bg-[#F2ECE1] rounded transition-colors cursor-pointer"
            >
              Details
            </button>
            <button
              onClick={() => onQuickAdd(product)}
              className="p-2 bg-[#F0E9DC] hover:bg-[#C85A32] text-[#24211D] hover:text-white rounded-md transition-colors cursor-pointer"
              title="Add to Basket"
              aria-label="Add to Basket"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
