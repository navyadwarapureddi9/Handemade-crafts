import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Gift, Package, Check } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: (giftNote: string, packagingType: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const [giftNote, setGiftNote] = useState('');
  const [includeGiftNote, setIncludeGiftNote] = useState(false);
  const [packagingType, setPackagingType] = useState<'standard' | 'keepsake'>('standard');

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const keepsakeFee = packagingType === 'keepsake' ? 14 : 0;
  const shipping = subtotal > 150 ? 0 : 12;
  const total = subtotal + keepsakeFee + shipping;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#1C1917]/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#FAF7F2] h-full shadow-2xl flex flex-col justify-between border-l border-[#E8E1D5] text-[#211E1C]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#E8E1D5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-editorial text-2xl font-semibold">Your Basket</span>
            <span className="text-xs text-[#7A5C4D]">
              ({items.reduce((acc, item) => acc + item.quantity, 0)} {items.length === 1 ? 'creation' : 'creations'})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-[#EFE8DC] rounded-full text-stone-500 hover:text-[#211E1C] cursor-pointer"
            aria-label="Close Basket"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <Package className="w-12 h-12 text-stone-300 mx-auto" />
              <h4 className="font-editorial text-xl font-semibold text-[#211E1C]">
                Your basket is empty
              </h4>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                Explore the gallery to discover authentic creations crafted by our master guild artisans.
              </p>
              <button
                onClick={onClose}
                className="mt-2 text-xs font-semibold text-[#C85A32] underline underline-offset-4 cursor-pointer"
              >
                Browse Handmade Works →
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 p-3 bg-[#F5EFE6] rounded-lg border border-[#E3DAC9]"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.title}
                  className="w-20 h-20 rounded object-cover shrink-0 bg-stone-200"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-editorial text-base font-semibold leading-tight line-clamp-1">
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-stone-400 hover:text-[#C85A32] p-0.5 cursor-pointer"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[11px] text-[#7A5C4D]">
                      By {item.product.artisan.name} · {item.product.artisan.studioName}
                    </p>

                    {item.selectedCustomizations && Object.keys(item.selectedCustomizations).length > 0 && (
                      <div className="text-[10px] text-stone-600 mt-1">
                        {Object.entries(item.selectedCustomizations).map(([k, v]) => (
                          <span key={k} className="mr-2">
                            {k}: <strong>{v}</strong>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2 mt-2 border-t border-[#DFD6C7]">
                    <div className="flex items-center border border-[#D5CABE] rounded bg-[#FAF7F2] text-xs">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2 py-0.5 text-stone-600 hover:text-black cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2 py-0.5 text-stone-600 hover:text-black cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <span className="font-editorial text-base font-bold text-[#211E1C]">
                      ${item.product.price * item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Artisan Gift Note Option */}
          {items.length > 0 && (
            <div className="border border-[#E0D7C6] rounded-lg p-3.5 bg-[#FAF7F2] space-y-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-[#211E1C]">
                <input
                  type="checkbox"
                  checked={includeGiftNote}
                  onChange={(e) => setIncludeGiftNote(e.target.checked)}
                  className="rounded text-[#C85A32] focus:ring-[#C85A32]"
                />
                <Gift className="w-3.5 h-3.5 text-[#C85A32]" />
                <span>Include handwritten ink note from the maker (Free)</span>
              </label>

              {includeGiftNote && (
                <textarea
                  rows={2}
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  placeholder="Type your gift message here. The artisan will hand-write this with dip pen on seeded cotton paper..."
                  className="w-full bg-[#F5EFE6] border border-[#DFD6C7] p-2 rounded text-xs outline-none"
                />
              )}
            </div>
          )}

          {/* Packaging Style */}
          {items.length > 0 && (
            <div className="space-y-1.5 text-xs">
              <label className="font-semibold text-[#211E1C] uppercase tracking-wider text-[11px] block">
                Artisan Packaging Selection
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPackagingType('standard')}
                  className={`p-2 rounded border text-left cursor-pointer transition-all ${
                    packagingType === 'standard'
                      ? 'bg-[#EAE4D7] border-[#24211D] font-medium'
                      : 'bg-[#F5EFE6] border-[#DFD6C7] text-stone-600'
                  }`}
                >
                  <div className="text-[11px]">Recycled Kraft + Pressed Flower</div>
                  <div className="text-[10px] text-stone-500">Included</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPackagingType('keepsake')}
                  className={`p-2 rounded border text-left cursor-pointer transition-all ${
                    packagingType === 'keepsake'
                      ? 'bg-[#EAE4D7] border-[#24211D] font-medium'
                      : 'bg-[#F5EFE6] border-[#DFD6C7] text-stone-600'
                  }`}
                >
                  <div className="text-[11px]">Keepsake Pine Box + Wax Seal</div>
                  <div className="text-[10px] text-[#A43F1B]">+$14</div>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer & Checkout Summary */}
        {items.length > 0 && (
          <div className="p-5 border-t border-[#E8E1D5] bg-[#F5EFE6] space-y-3">
            <div className="space-y-1.5 text-xs text-[#574F45]">
              <div className="flex justify-between">
                <span>Handmade Crafts Subtotal:</span>
                <span className="font-medium text-[#211E1C]">${subtotal}</span>
              </div>
              {packagingType === 'keepsake' && (
                <div className="flex justify-between">
                  <span>Keepsake Wooden Box with Wax Seal:</span>
                  <span className="font-medium text-[#211E1C]">$14</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Direct Studio Insured Shipping:</span>
                <span className="font-medium text-[#211E1C]">
                  {shipping === 0 ? <span className="text-[#506B52]">Complimentary</span> : `$${shipping}`}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#DFD6C7] font-semibold text-sm text-[#211E1C]">
                <span>Total Investment:</span>
                <span className="font-editorial text-xl font-bold text-[#A43F1B]">${total}</span>
              </div>
            </div>

            <button
              onClick={() => onCheckout(giftNote, packagingType)}
              className="w-full py-3.5 bg-[#C85A32] hover:bg-[#A43F1B] text-white text-xs sm:text-sm font-semibold rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Complete Artisan Patronage · ${total}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500">
              <ShieldCheck className="w-3.5 h-3.5 text-[#506B52]" />
              <span>Direct-to-Maker Escrow · Carbon-Neutral Shipping</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
