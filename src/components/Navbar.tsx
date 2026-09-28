import React from 'react';
import { ShoppingBag, Search, Sparkles, Hammer, Heart, Compass, X, Bot } from 'lucide-react';
import { CraftCategory } from '../types';

interface NavbarProps {
  activeTab: 'shop' | 'makers' | 'commission' | 'portal';
  setActiveTab: (tab: 'shop' | 'makers' | 'commission' | 'portal') => void;
  cartCount: number;
  openCart: () => void;
  openBlueprint: () => void;
  onOpenChat: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: CraftCategory;
  setSelectedCategory: (cat: CraftCategory) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  openCart,
  openBlueprint,
  onOpenChat,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
}) => {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E1D5]">
      {/* Top Heritage Notice Bar */}
      <div className="bg-[#24211D] text-[#EBE6DD] px-4 py-1.5 text-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#E27D60]"></span>
            <span>100% Verified Handmade by Independent Master Guild Artisans</span>
            <span className="hidden sm:inline text-stone-400">·</span>
            <span className="hidden sm:inline text-stone-400">Living Wage Certified</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenChat}
              className="flex items-center gap-1.5 text-[#F3DDD3] hover:text-white transition-colors cursor-pointer text-xs font-medium"
            >
              <Bot className="w-3.5 h-3.5 text-[#E27D60]" />
              <span>Ask Artisan AI (n8n Live)</span>
            </button>
            <span className="text-stone-600 hidden sm:inline">|</span>
            <button
              onClick={openBlueprint}
              className="hidden sm:flex items-center gap-1.5 text-[#F3DDD3] hover:text-white transition-colors cursor-pointer text-xs font-medium"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E27D60]" />
              <span>AI Studio Blueprint</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => {
                setActiveTab('shop');
                setSelectedCategory('all');
              }}
              className="text-left group cursor-pointer focus:outline-none"
            >
              <div className="flex items-baseline gap-2">
                <span className="font-editorial text-3xl sm:text-4xl font-semibold tracking-tight text-[#24211D] group-hover:text-[#A43F1B] transition-colors">
                  TerraLoom
                </span>
                <span className="text-xs uppercase tracking-widest text-[#7A5C4D] font-medium hidden md:inline">
                  Atelier
                </span>
              </div>
              <p className="text-[11px] text-[#7A5C4D] tracking-wider font-light hidden sm:block">
                Handcrafted Artisan Collective & Studio
              </p>
            </button>

            {/* Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-[#4A453E]">
              <button
                onClick={() => {
                  setActiveTab('shop');
                }}
                className={`transition-colors py-1 relative ${
                  activeTab === 'shop'
                    ? 'text-[#A43F1B] font-semibold'
                    : 'hover:text-[#24211D]'
                }`}
              >
                Discover Crafts
                {activeTab === 'shop' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#A43F1B]"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('makers')}
                className={`transition-colors py-1 relative ${
                  activeTab === 'makers'
                    ? 'text-[#A43F1B] font-semibold'
                    : 'hover:text-[#24211D]'
                }`}
              >
                Meet the Makers
                {activeTab === 'makers' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#A43F1B]"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('commission')}
                className={`transition-colors py-1 relative ${
                  activeTab === 'commission'
                    ? 'text-[#A43F1B] font-semibold'
                    : 'hover:text-[#24211D]'
                }`}
              >
                Bespoke Commissions
                {activeTab === 'commission' && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#A43F1B]"></span>
                )}
              </button>
            </nav>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Search Input on Desktop */}
            <div className="relative hidden md:block w-48 lg:w-64">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search clay, loom, wood..."
                className="w-full bg-[#F3EFE6] border border-transparent focus:border-[#C85A32] focus:bg-white text-xs py-2 pl-9 pr-8 rounded-md transition-all outline-none text-[#24211D] placeholder:text-stone-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 text-[#4A453E] hover:text-[#24211D] rounded-md hover:bg-[#F3EFE6]"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Artisan AI Concierge Button */}
            <button
              onClick={onOpenChat}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-md transition-all cursor-pointer border bg-[#F0ECE1] text-[#24211D] border-[#E0D8C8] hover:bg-[#E8E1D2]"
              title="Chat with n8n Artisan Concierge"
            >
              <Bot className="w-3.5 h-3.5 text-[#C85A32]" />
              <span className="hidden xl:inline">AI Concierge</span>
            </button>

            {/* Artisan Studio Mode Button */}
            <button
              onClick={() => setActiveTab(activeTab === 'portal' ? 'shop' : 'portal')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 text-xs font-medium rounded-md transition-all cursor-pointer border ${
                activeTab === 'portal'
                  ? 'bg-[#24211D] text-[#FAF7F2] border-[#24211D] shadow-sm'
                  : 'bg-[#F0ECE1] text-[#24211D] border-[#E0D8C8] hover:bg-[#E8E1D2]'
              }`}
            >
              <Hammer className="w-3.5 h-3.5 text-[#C85A32]" />
              <span className="hidden sm:inline">
                {activeTab === 'portal' ? 'Back to Gallery' : 'Artisan Studio Hub'}
              </span>
              <span className="sm:hidden">Studio</span>
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={openCart}
              className="relative p-2.5 bg-[#FAF7F2] hover:bg-[#F3EFE6] text-[#24211D] border border-[#E0D8C8] rounded-md transition-colors cursor-pointer"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#C85A32] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Expansion */}
        {isSearchOpen && (
          <div className="md:hidden py-3 border-t border-[#E8E1D5]">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pottery, textiles, jewelry, artisans..."
                className="w-full bg-[#F3EFE6] border border-[#E0D8C8] focus:border-[#C85A32] focus:bg-white text-sm py-2 pl-9 pr-8 rounded-md outline-none text-[#24211D]"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Mobile Subnav */}
        <div className="flex lg:hidden items-center justify-between py-2 border-t border-[#E8E1D5] text-xs font-medium text-[#4A453E] overflow-x-auto gap-4">
          <button
            onClick={() => setActiveTab('shop')}
            className={`whitespace-nowrap pb-1 ${
              activeTab === 'shop' ? 'text-[#A43F1B] border-b-2 border-[#A43F1B] font-semibold' : ''
            }`}
          >
            Discover Crafts
          </button>
          <button
            onClick={() => setActiveTab('makers')}
            className={`whitespace-nowrap pb-1 ${
              activeTab === 'makers' ? 'text-[#A43F1B] border-b-2 border-[#A43F1B] font-semibold' : ''
            }`}
          >
            Meet the Makers
          </button>
          <button
            onClick={() => setActiveTab('commission')}
            className={`whitespace-nowrap pb-1 ${
              activeTab === 'commission' ? 'text-[#A43F1B] border-b-2 border-[#A43F1B] font-semibold' : ''
            }`}
          >
            Bespoke Commissions
          </button>
          <button
            onClick={onOpenChat}
            className="whitespace-nowrap pb-1 text-[#C85A32] font-semibold flex items-center gap-1"
          >
            <Bot className="w-3 h-3" />
            AI Chat
          </button>
          <button
            onClick={openBlueprint}
            className="whitespace-nowrap pb-1 text-stone-600 hover:text-[#C85A32] font-medium flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-[#C85A32]" />
            AI Blueprint
          </button>
        </div>
      </div>
    </header>
  );
};
