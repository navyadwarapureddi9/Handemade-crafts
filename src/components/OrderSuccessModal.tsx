import React from 'react';
import { Check, ShieldCheck, Download, ExternalLink, X, Sparkles } from 'lucide-react';
import { ArtisanOrder } from '../types';

interface OrderSuccessModalProps {
  order: ArtisanOrder | null;
  onClose: () => void;
  onViewStudioPortal: () => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onViewStudioPortal,
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1C1917]/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-[#211E1C]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-[#EFE8DC] text-stone-500 hover:text-[#211E1C] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#EAE2D3] text-[#A43F1B] flex items-center justify-center mx-auto mb-3">
            <Check className="w-6 h-6" />
          </div>
          <span className="text-xs text-[#7A5C4D] font-medium tracking-wide uppercase">
            Order Confirmed & Escrowed
          </span>
          <h2 className="font-editorial text-3xl font-semibold text-[#211E1C]">
            Thank You for Supporting Authentic Craftsmanship
          </h2>
          <p className="text-xs text-[#574F45] max-w-md mx-auto">
            Order <strong>{order.orderNumber}</strong> has been transmitted directly to the artisan's workbench. You will receive studio progress updates as your piece is prepared.
          </p>
        </div>

        {/* Certificate of Authenticity Preview */}
        <div className="p-5 bg-[#F5EFE6] border border-[#DFD6C7] rounded-lg space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-[#E3DAC9] pb-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#211E1C] tracking-wide uppercase">
              <ShieldCheck className="w-4 h-4 text-[#C85A32]" />
              <span>Digital Certificate of Handcrafting</span>
            </div>
            <span className="text-[10px] font-mono text-stone-500">ID: {order.id}</span>
          </div>

          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-stone-500">Creation:</span>
              <span className="font-semibold text-[#211E1C]">{order.productTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Patron Name:</span>
              <span className="font-medium text-[#211E1C]">{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Living Wage Guarantee:</span>
              <span className="text-[#506B52] font-semibold">100% Certified Direct</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Estimated Dispatch:</span>
              <span className="font-medium text-[#211E1C]">{order.estimatedCompletion}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E3DAC9] flex items-center justify-between text-[11px] text-stone-500">
            <span>Signed with Artisan Touchmark Seal</span>
            <span className="text-[#C85A32] font-serif italic text-sm">TerraLoom Guild</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <button
            onClick={() => {
              onClose();
              onViewStudioPortal();
            }}
            className="w-full py-3 bg-[#24211D] hover:bg-[#C85A32] text-white text-xs sm:text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>View this in Artisan Studio Tracker</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 bg-transparent hover:bg-[#EFE8DC] text-[#4A453E] text-xs font-medium rounded-md transition-colors cursor-pointer"
          >
            Return to Gallery
          </button>
        </div>
      </div>
    </div>
  );
};
