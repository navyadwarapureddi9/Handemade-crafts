import React, { useState } from 'react';
import { X, Clock, MapPin, ShieldCheck, Heart, Sparkles, Check, Info } from 'lucide-react';
import { CraftProduct } from '../types';

interface ProductModalProps {
  product: CraftProduct | null;
  onClose: () => void;
  onAddToCart: (
    product: CraftProduct,
    quantity: number,
    customizations: Record<string, string>,
    customMessage: string
  ) => void;
  onSelectArtisan?: (artisanId: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onSelectArtisan,
}) => {
  if (!product) return null;

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    product.customizationOptions?.forEach((opt) => {
      init[opt.label] = opt.choices[0];
    });
    return init;
  });
  const [customText, setCustomText] = useState('');
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [showWageDetails, setShowWageDetails] = useState(false);

  const handleCustomizationChange = (label: string, choice: string) => {
    setSelectedCustomizations((prev) => ({
      ...prev,
      [label]: choice,
    }));
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity, selectedCustomizations, customText);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 1200);
  };

  // Fair living wage calculation demonstration
  const rawMaterialEst = Math.round(product.price * 0.22);
  const laborEst = Math.round(product.craftHours * 32);
  const studioOverheadEst = Math.round(product.price * 0.15);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1C1917]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl max-w-4xl w-full overflow-hidden shadow-2xl my-auto text-[#211E1C]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-[#FAF7F2]/90 hover:bg-[#EBE2D3] rounded-full text-[#4A453E] transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Image Showcase */}
          <div className="md:col-span-6 p-6 bg-[#F5EFE6] flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#E8E1D5]">
            <div className="space-y-4">
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-stone-200 shadow-xs">
                <img
                  src={product.images[selectedImage] || product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover transition-all duration-300"
                />
              </div>

              {/* Thumbnail Gallery if multiple images */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-16 h-16 rounded overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                        selectedImage === idx
                          ? 'border-[#C85A32] opacity-100'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Maker Snippet under image */}
            <div className="pt-6 mt-6 border-t border-[#E0D7C6]">
              <div className="flex items-center gap-3">
                <img
                  src={product.artisan.avatar}
                  alt={product.artisan.name}
                  className="w-12 h-12 rounded-full object-cover border border-[#C85A32]/30"
                />
                <div>
                  <h4 className="font-editorial text-base font-semibold text-[#211E1C]">
                    {product.artisan.name}
                  </h4>
                  <p className="text-xs text-[#7A5C4D]">
                    {product.artisan.studioName} · {product.artisan.location}
                  </p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {product.artisan.heritageYears} years mastering {product.artisan.specialty}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Deep Product Story & Options */}
          <div className="md:col-span-6 p-6 sm:p-8 space-y-6">
            <div>
              {/* Provenance & Time Info */}
              <div className="flex items-center gap-2 text-xs text-[#7A5C4D] mb-1.5">
                <span>{product.category.toUpperCase()}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 font-medium text-[#C85A32]">
                  <Clock className="w-3.5 h-3.5" />
                  {product.craftHours} Hours of Hand Craftsmanship
                </span>
              </div>

              <h2 className="font-editorial text-2xl sm:text-3xl text-[#211E1C] font-semibold leading-snug">
                {product.title}
              </h2>

              <div className="mt-2 flex items-baseline gap-3">
                <span className="font-editorial text-3xl font-bold text-[#211E1C]">
                  ${product.price}
                </span>
                <span className="text-xs text-stone-500">
                  Fair Artisan Living Wage Certified
                </span>
              </div>
            </div>

            {/* The Maker's Story Narrative */}
            <div className="space-y-2">
              <h4 className="text-xs uppercase tracking-wider font-semibold text-[#7A5C4D]">
                The Craft Chronicle
              </h4>
              <p className="text-xs sm:text-sm text-[#4A453E] leading-relaxed">
                {product.story}
              </p>
            </div>

            {/* Materials & Provenance */}
            <div className="p-3.5 bg-[#F5EFE6] rounded-lg border border-[#E3DAC9] space-y-2 text-xs">
              <div>
                <span className="font-semibold text-[#211E1C]">Materials & Composition: </span>
                <span className="text-[#574F45]">{product.materials}</span>
              </div>
              <div>
                <span className="font-semibold text-[#211E1C]">Origin Provenance: </span>
                <span className="text-[#574F45]">{product.provenance}</span>
              </div>
              {product.dimensions && (
                <div>
                  <span className="font-semibold text-[#211E1C]">Dimensions: </span>
                  <span className="text-[#574F45]">{product.dimensions}</span>
                </div>
              )}
            </div>

            {/* Living Wage Breakdown Accordion */}
            <div className="border border-[#E0D7C6] rounded-lg p-3 text-xs">
              <button
                onClick={() => setShowWageDetails(!showWageDetails)}
                className="w-full flex items-center justify-between text-left font-medium text-[#211E1C] hover:text-[#C85A32] cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#506B52]" />
                  Ethical Living Wage & Material Transparency
                </span>
                <span className="text-stone-400">{showWageDetails ? '▲' : '▼'}</span>
              </button>

              {showWageDetails && (
                <div className="mt-3 pt-3 border-t border-[#E8E1D5] space-y-2 text-[#574F45] animate-in fade-in">
                  <p className="text-[11px] leading-relaxed">
                    TerraLoom mandates honest fair-trade accounting. Here is how your ${product.price} investment directly empowers the artisan:
                  </p>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span>Artisan Labor ({product.craftHours} hrs @ living wage):</span>
                      <span className="font-medium text-[#211E1C]">${laborEst}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ethical Raw Materials & Glazes:</span>
                      <span className="font-medium text-[#211E1C]">${rawMaterialEst}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Kiln Firing & Studio Maintenance:</span>
                      <span className="font-medium text-[#211E1C]">${studioOverheadEst}</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-stone-500 pt-1 border-t border-dashed border-[#DFD6C7]">
                    Zero corporate middleman markups. Over 90% goes directly to {product.artisan.name}'s studio.
                  </div>
                </div>
              )}
            </div>

            {/* Customization Options if Available */}
            {product.isCustomizable && product.customizationOptions && (
              <div className="space-y-3 pt-2">
                <h4 className="text-xs uppercase tracking-wider font-semibold text-[#7A5C4D]">
                  Bespoke Studio Options
                </h4>

                {product.customizationOptions.map((opt) => (
                  <div key={opt.label} className="space-y-1.5">
                    <label className="text-xs font-medium text-[#211E1C]">
                      {opt.label}:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {opt.choices.map((choice) => {
                        const isSelected = selectedCustomizations[opt.label] === choice;
                        return (
                          <button
                            key={choice}
                            onClick={() => handleCustomizationChange(opt.label, choice)}
                            className={`px-3 py-1.5 text-xs rounded-md border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#24211D] text-[#FAF7F2] border-[#24211D]'
                                : 'bg-[#FAF7F2] text-[#4A453E] border-[#D5CABE] hover:bg-[#F2ECE1]'
                            }`}
                          >
                            {choice}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {product.customTextPrompt && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-[#211E1C]">
                      {product.customTextPrompt}
                    </label>
                    <input
                      type="text"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder="e.g. 'E.V. 2026' or personal initials"
                      className="w-full bg-[#FAF7F2] border border-[#D5CABE] focus:border-[#C85A32] text-xs py-2 px-3 rounded-md outline-none"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Care Guide */}
            <div className="text-xs text-[#6B6155] border-t border-[#E8E1D5] pt-3">
              <span className="font-semibold text-[#211E1C]">Care & Longevity: </span>
              {product.careGuide}
            </div>

            {/* Add to Basket Action */}
            <div className="pt-4 border-t border-[#E8E1D5] flex items-center gap-4">
              <div className="flex items-center border border-[#D5CABE] rounded-md bg-[#FAF7F2]">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-stone-600 hover:text-[#211E1C] cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 text-xs font-semibold text-[#211E1C]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.inventoryCount, quantity + 1))}
                  className="px-3 py-2 text-stone-600 hover:text-[#211E1C] cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={addedAnimation}
                className="flex-1 py-3 px-6 bg-[#C85A32] hover:bg-[#A43F1B] text-white text-xs sm:text-sm font-semibold rounded-md shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:bg-[#506B52]"
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Basket</span>
                  </>
                ) : (
                  <span>
                    Acquire Handcrafted Piece · ${product.price * quantity}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
