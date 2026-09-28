import React from 'react';
import { MapPin, Award, Leaf, ArrowRight, Hammer } from 'lucide-react';
import { Artisan, CraftProduct } from '../types';

interface ArtisanDirectoryProps {
  artisans: Artisan[];
  products: CraftProduct[];
  onSelectArtisanProducts: (artisanId: string) => void;
  onOpenCommissionWithArtisan: (artisan: Artisan) => void;
}

export const ArtisanDirectory: React.FC<ArtisanDirectoryProps> = ({
  artisans,
  products,
  onSelectArtisanProducts,
  onOpenCommissionWithArtisan,
}) => {
  return (
    <section className="py-12 lg:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="flex items-center justify-center gap-2 text-xs text-[#7A5C4D] font-medium tracking-wide">
          <span>The Guild Roster</span>
          <span aria-hidden="true">·</span>
          <span>Independent Ateliers</span>
        </div>
        <h2 className="font-editorial text-3xl sm:text-4xl text-[#211E1C] font-semibold">
          Meet the Master Makers
        </h2>
        <p className="text-sm text-[#574F45] leading-relaxed font-light">
          Behind every finished vessel, woven blanket, and forged ring is a living human being dedicated to centuries-old craft traditions. Get to know their stories and studios.
        </p>
      </div>

      {/* Artisan Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {artisans.map((artisan) => {
          const artisanProducts = products.filter((p) => p.artisanId === artisan.id);

          return (
            <div
              key={artisan.id}
              className="bg-[#FAF7F2] border border-[#E5DDD0] rounded-xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#C4B7A2] transition-all duration-300 shadow-xs"
            >
              <div className="space-y-6">
                {/* Artisan Header */}
                <div className="flex items-start gap-4">
                  <img
                    src={artisan.avatar}
                    alt={artisan.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#E0D5C3] shadow-xs shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-[#7A5C4D]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#C85A32]" />
                        {artisan.location}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{artisan.heritageYears} yrs mastery</span>
                    </div>

                    <h3 className="font-editorial text-2xl text-[#211E1C] font-semibold">
                      {artisan.name}
                    </h3>
                    <p className="text-xs font-medium text-[#A43F1B]">
                      {artisan.studioName}
                    </p>
                  </div>
                </div>

                {/* Bio & Heritage Philosophy */}
                <p className="text-xs sm:text-sm text-[#4A453E] leading-relaxed">
                  {artisan.bio}
                </p>

                {/* Technique & Sustainable Pledge (Clean unboxed style) */}
                <div className="space-y-2 text-xs pt-3 border-t border-[#EDE5D8]">
                  <div className="flex items-start gap-2">
                    <Award className="w-3.5 h-3.5 text-[#C85A32] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#211E1C]">Discipline & Technique: </span>
                      <span className="text-[#574F45]">{artisan.techniqueTradition}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Leaf className="w-3.5 h-3.5 text-[#506B52] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-[#211E1C]">Eco-Pledge: </span>
                      <span className="text-[#574F45]">{artisan.sustainablePledge}</span>
                    </div>
                  </div>
                </div>

                {/* Mini Preview of their work */}
                {artisanProducts.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[11px] font-semibold text-[#7A5C4D] uppercase tracking-wider block">
                      Recent Pieces from Atelier ({artisanProducts.length})
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {artisanProducts.map((p) => (
                        <div
                          key={p.id}
                          className="w-16 h-16 rounded-md overflow-hidden bg-stone-200 shrink-0 border border-[#E3DAC9]"
                          title={p.title}
                        >
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-6 mt-6 border-t border-[#EDE5D8] flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => onSelectArtisanProducts(artisan.id)}
                  className="text-xs font-semibold text-[#211E1C] hover:text-[#C85A32] flex items-center gap-1.5 cursor-pointer py-1.5"
                >
                  <span>Explore Atelier Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onOpenCommissionWithArtisan(artisan)}
                  className="px-3.5 py-2 text-xs font-medium text-[#FAF7F2] bg-[#24211D] hover:bg-[#C85A32] rounded-md transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Hammer className="w-3 h-3" />
                  <span>Commission {artisan.name.split(' ')[0]}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
