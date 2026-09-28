import React from 'react';
import { ArrowRight, Compass, ShieldCheck, Heart, Sparkles, MapPin, Clock } from 'lucide-react';
import { CraftProduct } from '../types';

interface HeroProps {
  onExplore: () => void;
  onMeetMakers: () => void;
  onCommission: () => void;
  onOpenChat?: () => void;
  onSelectProduct: (product: CraftProduct) => void;
  spotlightProduct: CraftProduct;
}

export const Hero: React.FC<HeroProps> = ({
  onExplore,
  onMeetMakers,
  onCommission,
  onOpenChat,
  onSelectProduct,
  spotlightProduct,
}) => {
  return (
    <section className="relative overflow-hidden bg-[#F5EFE6] border-b border-[#E3DAC9]">
      {/* Decorative subtle texture overlay */}
      <div 
        className="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#C85A32 0.75px, transparent 0.75px), radial-gradient(#7A5C4D 0.75px, #F5EFE6 0.75px)`,
          backgroundSize: '30px 30px',
          backgroundPosition: '0 0, 15px 15px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Mission & Manifesto */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs text-[#7A5C4D] font-medium tracking-wide">
              <span>Living Heritage Guild</span>
              <span aria-hidden="true">·</span>
              <span>Slow Craftsmanship</span>
              <span aria-hidden="true">·</span>
              <span>100% Living Wage Verified</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-[#211E1C] leading-[1.08] font-normal tracking-tight">
              Crafted by human hands.{' '}
              <span className="italic block text-[#A43F1B] mt-1 font-serif">
                Steeped in living tradition.
              </span>
            </h1>

            <p className="text-[#574F45] text-base sm:text-lg max-w-2xl leading-relaxed font-light">
              Connecting discerning patrons directly with independent potters, weavers, 
              woodworkers, and metalsmiths. Every object carries the pulse, 
              material provenance, and irreplaceable fingerprint of its maker.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onExplore}
                className="px-6 py-3.5 bg-[#C85A32] hover:bg-[#A43F1B] text-white text-sm font-medium rounded-md shadow-sm transition-all duration-200 flex items-center gap-2 cursor-pointer"
              >
                <span>Discover Authentic Crafts</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onCommission}
                className="px-5 py-3.5 bg-transparent hover:bg-[#EBE2D3] text-[#24211D] border border-[#C5BBAA] text-sm font-medium rounded-md transition-all cursor-pointer"
              >
                Commission Bespoke Work
              </button>

              {onOpenChat && (
                <button
                  onClick={onOpenChat}
                  className="px-4 py-3.5 bg-[#FAF7F2] hover:bg-[#F2ECE1] text-[#24211D] border border-[#C5BBAA] text-sm font-medium rounded-md transition-all cursor-pointer flex items-center gap-2 shadow-2xs"
                >
                  <Sparkles className="w-4 h-4 text-[#C85A32]" />
                  <span>Chat with Artisan AI</span>
                </button>
              )}

              <button
                onClick={onMeetMakers}
                className="text-xs text-[#7A5C4D] hover:text-[#211E1C] underline underline-offset-4 py-2 transition-colors cursor-pointer"
              >
                Read Maker Chronicles →
              </button>
            </div>

            {/* Quiet Heritage Principles (Anti-Slop, unboxed metadata) */}
            <div className="pt-6 border-t border-[#DFD5C4] grid grid-cols-3 gap-6 text-left">
              <div>
                <span className="block font-editorial text-2xl text-[#211E1C] font-semibold">100%</span>
                <span className="text-xs text-[#7A5C4D]">Direct Artisan Proceeds</span>
              </div>
              <div>
                <span className="block font-editorial text-2xl text-[#211E1C] font-semibold">Zero</span>
                <span className="text-xs text-[#7A5C4D]">Mass Factory Drop-Shipping</span>
              </div>
              <div>
                <span className="block font-editorial text-2xl text-[#211E1C] font-semibold">Traceable</span>
                <span className="text-xs text-[#7A5C4D]">Raw Earth & Fiber Provenance</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Artisan Spotlight Card */}
          <div className="lg:col-span-5">
            <div className="relative group">
              {/* Decorative offset craft frame */}
              <div className="absolute -inset-2 bg-[#E6DAC6] rounded-xl transform rotate-1 transition-transform group-hover:rotate-0 duration-300"></div>

              <div className="relative bg-[#FAF7F2] border border-[#DACFBD] rounded-lg p-5 shadow-lg space-y-4">
                {/* Image showcase */}
                <div className="relative aspect-[4/3] rounded-md overflow-hidden bg-stone-200">
                  <img
                    src={spotlightProduct.images[0]}
                    alt={spotlightProduct.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-[#FAF7F2]/90 backdrop-blur-sm text-[#211E1C] text-[11px] font-medium px-2.5 py-1 rounded shadow-sm">
                    Studio Kiln Spotlight
                  </div>
                  <div className="absolute bottom-3 right-3 bg-[#24211D]/85 text-white text-xs px-2.5 py-1 rounded backdrop-blur-sm">
                    ${spotlightProduct.price}
                  </div>
                </div>

                {/* Artisan Quote & Title */}
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#7A5C4D] mb-1">
                    <span>{spotlightProduct.artisan.name}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#C85A32]" />
                      {spotlightProduct.artisan.location}
                    </span>
                  </div>
                  <h3 className="font-editorial text-xl text-[#211E1C] font-semibold leading-snug">
                    {spotlightProduct.title}
                  </h3>
                  <p className="text-xs text-[#6B6155] mt-1.5 line-clamp-2 leading-relaxed">
                    "{spotlightProduct.story}"
                  </p>
                </div>

                {/* Meta details: time spent & materials */}
                <div className="pt-3 border-t border-[#EAE3D4] flex items-center justify-between text-xs text-[#7A5C4D]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#C85A32]" />
                    <span>{spotlightProduct.craftHours} hours manual craft time</span>
                  </div>
                  <button
                    onClick={() => onSelectProduct(spotlightProduct)}
                    className="text-[#A43F1B] hover:text-[#211E1C] font-medium transition-colors cursor-pointer"
                  >
                    View Studio Story →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
