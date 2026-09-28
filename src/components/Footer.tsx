import React from 'react';
import { Sparkles, Heart, ShieldCheck, Mail, ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenBlueprint: () => void;
  onExplore: () => void;
  onMeetMakers: () => void;
  onCommission: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenBlueprint,
  onExplore,
  onMeetMakers,
  onCommission,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#211E1C] text-[#FAF7F2] border-t border-[#38332E]">
      {/* Slow Craft Newsletter Bar */}
      <div className="border-b border-[#38332E] py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-2">
            <span className="text-xs font-semibold text-[#E27D60] uppercase tracking-wider block">
              The Atelier Gazette
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl font-semibold">
              Stories from the workbench, wood kiln, and floor loom.
            </h3>
            <p className="text-xs text-stone-400 font-light max-w-xl">
              Receive quiet bi-weekly chronicles detailing newly fired ceramics, hand-dyed botanical textiles, and private artisan studio drops. No mass spam.
            </p>
          </div>

          <div className="md:col-span-5">
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your patron email..."
                className="bg-[#2D2926] border border-[#443E3A] text-xs py-3 px-4 rounded-md outline-none text-[#FAF7F2] placeholder:text-stone-500 flex-1 focus:border-[#C85A32]"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-[#C85A32] hover:bg-[#A43F1B] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer shrink-0"
              >
                Join Patron Guild
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <span className="font-editorial text-2xl font-bold tracking-tight block">
              TerraLoom
            </span>
            <p className="text-xs text-stone-400 leading-relaxed font-light">
              An authentic collective of independent master artisans. Dedicated to the preservation of traditional craft disciplines and fair-wage handmade commerce.
            </p>
            <div className="text-[11px] text-[#E27D60] flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Living Wage Verified</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold text-stone-200 uppercase tracking-wider text-[11px]">
              Artisan Ateliers
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button onClick={onExplore} className="hover:text-white transition-colors cursor-pointer">
                  Wheel-Thrown Ceramics
                </button>
              </li>
              <li>
                <button onClick={onExplore} className="hover:text-white transition-colors cursor-pointer">
                  Hand-Woven Botanical Textiles
                </button>
              </li>
              <li>
                <button onClick={onExplore} className="hover:text-white transition-colors cursor-pointer">
                  Reclaimed Timber Woodcraft
                </button>
              </li>
              <li>
                <button onClick={onExplore} className="hover:text-white transition-colors cursor-pointer">
                  Lost-Wax Cast Jewelry
                </button>
              </li>
              <li>
                <button onClick={onExplore} className="hover:text-white transition-colors cursor-pointer">
                  Pressed Botanical Art
                </button>
              </li>
            </ul>
          </div>

          {/* Patronage & Commission */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold text-stone-200 uppercase tracking-wider text-[11px]">
              Patron Services
            </h4>
            <ul className="space-y-2 text-stone-400">
              <li>
                <button onClick={onCommission} className="hover:text-white transition-colors cursor-pointer">
                  Commission Bespoke Work
                </button>
              </li>
              <li>
                <button onClick={onMeetMakers} className="hover:text-white transition-colors cursor-pointer">
                  Meet the Master Guild
                </button>
              </li>
              <li>
                <span className="text-stone-400">Handmade Care & Longevity</span>
              </li>
              <li>
                <span className="text-stone-400">Museum-Grade Eco Packaging</span>
              </li>
              <li>
                <span className="text-stone-400">Corporate Custom Gifting</span>
              </li>
            </ul>
          </div>

          {/* Innovation & AI Blueprint */}
          <div className="space-y-3 text-xs">
            <h4 className="font-semibold text-stone-200 uppercase tracking-wider text-[11px]">
              Platform Architecture
            </h4>
            <p className="text-stone-400 leading-relaxed font-light">
              Explore the strategic blueprint for building the future of the handmade economy with Google AI Studio.
            </p>
            <button
              onClick={onOpenBlueprint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#332E2A] hover:bg-[#C85A32] text-xs text-[#FAF7F2] rounded transition-colors cursor-pointer border border-[#443E3A]"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E27D60]" />
              <span>View AI Studio Blueprint</span>
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-[#38332E] flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} TerraLoom Artisan Collective. Handcrafted with reverence for human touch.</p>
          <div className="flex items-center gap-6">
            <span>Zero Mass Production</span>
            <span aria-hidden="true">·</span>
            <span>Plastic-Free Studios</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
