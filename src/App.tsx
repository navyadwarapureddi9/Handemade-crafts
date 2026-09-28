import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CraftFilters } from './components/CraftFilters';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { ArtisanDirectory } from './components/ArtisanDirectory';
import { ArtisanPortal } from './components/ArtisanPortal';
import { CustomCommissionDesk } from './components/CustomCommissionDesk';
import { CartDrawer } from './components/CartDrawer';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AIStudioBlueprintModal } from './components/AIStudioBlueprintModal';
import { Footer } from './components/Footer';

import {
  INITIAL_PRODUCTS,
  INITIAL_ARTISANS,
  INITIAL_ORDERS,
  INITIAL_COMMISSIONS,
} from './data/craftsData';
import {
  CraftProduct,
  Artisan,
  ArtisanOrder,
  CustomCommissionRequest,
  CartItem,
  CraftCategory,
} from './types';
import { Sparkles, Compass, ShieldCheck } from 'lucide-react';

export default function App() {
  // Navigation & Views
  const [activeTab, setActiveTab] = useState<'shop' | 'makers' | 'commission' | 'portal'>('shop');
  
  // Data states
  const [products, setProducts] = useState<CraftProduct[]>(INITIAL_PRODUCTS);
  const [artisans, setArtisans] = useState<Artisan[]>(INITIAL_ARTISANS);
  const [orders, setOrders] = useState<ArtisanOrder[]>(INITIAL_ORDERS);
  const [commissions, setCommissions] = useState<CustomCommissionRequest[]>(INITIAL_COMMISSIONS);
  const [cart, setCart] = useState<CartItem[]>([]);

  // Filter & Search states
  const [selectedCategory, setSelectedCategory] = useState<CraftCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'curated' | 'price-asc' | 'price-desc' | 'hours-desc' | 'rating-desc'>('curated');
  const [customizableOnly, setCustomizableOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(400);

  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<CraftProduct | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBlueprintOpen, setIsBlueprintOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<ArtisanOrder | null>(null);
  const [currentArtisanId, setCurrentArtisanId] = useState<string>(INITIAL_ARTISANS[0].id);
  const [preselectedCommissionArtisan, setPreselectedCommissionArtisan] = useState<Artisan | null>(null);

  // Filtered & Sorted products computation
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (selectedCategory !== 'all' && p.category !== selectedCategory) {
          return false;
        }
        // Price slider
        if (p.price > maxPrice) {
          return false;
        }
        // Customizable filter
        if (customizableOnly && !p.isCustomizable) {
          return false;
        }
        // Search query
        if (searchQuery.trim() !== '') {
          const q = searchQuery.toLowerCase();
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchMaterials = p.materials.toLowerCase().includes(q);
          const matchArtisan = p.artisan.name.toLowerCase().includes(q);
          const matchLocation = p.artisan.location.toLowerCase().includes(q);
          const matchStory = p.story.toLowerCase().includes(q);
          return matchTitle || matchMaterials || matchArtisan || matchLocation || matchStory;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'hours-desc') return b.craftHours - a.craftHours;
        if (sortBy === 'rating-desc') return b.rating - a.rating;
        // curated: featured first
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, maxPrice, customizableOnly, searchQuery, sortBy]);

  // Cart Handlers
  const handleAddToCart = (
    product: CraftProduct,
    quantity: number,
    customizations: Record<string, string>,
    customMessage: string
  ) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.product.id === product.id);
      if (existingIdx > -1) {
        const next = [...prev];
        next[existingIdx].quantity += quantity;
        next[existingIdx].selectedCustomizations = customizations;
        next[existingIdx].customMessage = customMessage;
        return next;
      }
      return [...prev, { product, quantity, selectedCustomizations: customizations, customMessage }];
    });
  };

  const handleQuickAdd = (product: CraftProduct) => {
    handleAddToCart(product, 1, {}, '');
  };

  const handleUpdateCartQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: qty } : item))
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleCheckout = (giftNote: string, packagingType: string) => {
    if (cart.length === 0) return;

    const firstItem = cart[0];
    const totalOrderAmount = cart.reduce((acc, it) => acc + it.product.price * it.quantity, 0);

    const newOrder: ArtisanOrder = {
      id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
      orderNumber: `TL-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      customerName: 'Patron of the Arts',
      customerEmail: 'patron@terraloom.guild',
      productTitle: cart.length === 1 ? firstItem.product.title : `${firstItem.product.title} + ${cart.length - 1} other pieces`,
      productImage: firstItem.product.images[0],
      price: totalOrderAmount + (packagingType === 'keepsake' ? 14 : 0),
      status: 'order_placed',
      estimatedCompletion: '7 to 10 days in atelier',
      customNote: giftNote || 'Patron requested museum gift wrapping',
      artisanNotes: 'Order logged in master kiln ledger. Preparing materials.',
      shippingAddress: '42 Heritage Lane, San Francisco, CA 94107',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setIsCartOpen(false);
    setCompletedOrder(newOrder);
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('curated');
    setCustomizableOnly(false);
    setMaxPrice(400);
  };

  // Artisan Actions
  const handleAddNewProduct = (newProduct: CraftProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
    setSelectedCategory('all');
  };

  const handleUpdateOrderStatus = (orderId: string, status: ArtisanOrder['status'], notes?: string) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status, artisanNotes: notes || ord.artisanNotes } : ord))
    );
  };

  const handleAddCommission = (comm: CustomCommissionRequest) => {
    setCommissions((prev) => [comm, ...prev]);
  };

  const handleUpdateCommissionStatus = (
    commId: string,
    status: CustomCommissionRequest['status']
  ) => {
    setCommissions((prev) =>
      prev.map((c) => (c.id === commId ? { ...c, status } : c))
    );
  };

  // Cross-navigation helpers
  const handleSelectArtisanProducts = (artisanId: string) => {
    const art = artisans.find((a) => a.id === artisanId);
    if (art) {
      setSearchQuery(art.name);
      setActiveTab('shop');
      window.scrollTo({ top: 400, behavior: 'smooth' });
    }
  };

  const handleOpenCommissionWithArtisan = (artisan: Artisan) => {
    setPreselectedCommissionArtisan(artisan);
    setActiveTab('commission');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const spotlightProduct = products[0] || INITIAL_PRODUCTS[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#211E1C]">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        openCart={() => setIsCartOpen(true)}
        openBlueprint={() => setIsBlueprintOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW 1: SHOP / GALLERY */}
        {activeTab === 'shop' && (
          <div className="space-y-10">
            {/* Hero Section */}
            <Hero
              onExplore={() => {
                const el = document.getElementById('craft-gallery');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onMeetMakers={() => setActiveTab('makers')}
              onCommission={() => setActiveTab('commission')}
              onSelectProduct={(p) => setSelectedProduct(p)}
              spotlightProduct={spotlightProduct}
            />

            {/* Gallery Section */}
            <section id="craft-gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
              {/* Category & Refine Controls */}
              <CraftFilters
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                sortBy={sortBy}
                setSortBy={setSortBy}
                customizableOnly={customizableOnly}
                setCustomizableOnly={setCustomizableOnly}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                totalCount={filteredProducts.length}
                onResetFilters={handleResetFilters}
              />

              {/* Active Search/Filter Notice if applicable */}
              {(searchQuery || customizableOnly || maxPrice < 400 || selectedCategory !== 'all') && (
                <div className="flex items-center justify-between text-xs text-[#7A5C4D] bg-[#F5EFE6] px-4 py-2 rounded-md border border-[#E8E1D5]">
                  <span>
                    Filtering by:{' '}
                    {selectedCategory !== 'all' && <strong>{selectedCategory} · </strong>}
                    {searchQuery && <strong>"{searchQuery}" · </strong>}
                    {customizableOnly && <strong>Customizable · </strong>}
                    <span>Max ${maxPrice}</span>
                  </span>
                  <button
                    onClick={handleResetFilters}
                    className="text-[#C85A32] hover:underline font-medium cursor-pointer"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              {/* Product Grid */}
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onOpenModal={(p) => setSelectedProduct(p)}
                      onQuickAdd={handleQuickAdd}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-[#F5EFE6] rounded-xl border border-[#E3DAC9] space-y-4">
                  <Compass className="w-10 h-10 text-stone-400 mx-auto" />
                  <h3 className="font-editorial text-2xl font-semibold text-[#211E1C]">
                    No handcrafted pieces match your criteria
                  </h3>
                  <p className="text-xs text-stone-500 max-w-md mx-auto">
                    Try loosening your price threshold or search query, or commission a bespoke work directly from an artisan atelier.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="px-5 py-2.5 bg-[#24211D] text-white text-xs font-semibold rounded-md hover:bg-[#C85A32] transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                </div>
              )}
            </section>
          </div>
        )}

        {/* VIEW 2: MEET THE MAKERS */}
        {activeTab === 'makers' && (
          <ArtisanDirectory
            artisans={artisans}
            products={products}
            onSelectArtisanProducts={handleSelectArtisanProducts}
            onOpenCommissionWithArtisan={handleOpenCommissionWithArtisan}
          />
        )}

        {/* VIEW 3: BESPOKE COMMISSION DESK */}
        {activeTab === 'commission' && (
          <CustomCommissionDesk
            artisans={artisans}
            preselectedArtisan={preselectedCommissionArtisan}
            onSubmitCommission={handleAddCommission}
            onClose={() => setActiveTab('shop')}
          />
        )}

        {/* VIEW 4: ARTISAN STUDIO PORTAL (MAKER BACKOFFICE) */}
        {activeTab === 'portal' && (
          <ArtisanPortal
            artisans={artisans}
            currentArtisanId={currentArtisanId}
            setCurrentArtisanId={setCurrentArtisanId}
            products={products}
            onAddProduct={handleAddNewProduct}
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            commissions={commissions}
            onUpdateCommissionStatus={handleUpdateCommissionStatus}
          />
        )}
      </main>

      {/* Product Detail & Story Modal */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onSelectArtisan={(id) => handleSelectArtisanProducts(id)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckout}
      />

      {/* Order Confirmation with Certificate of Authenticity */}
      <OrderSuccessModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
        onViewStudioPortal={() => {
          setActiveTab('portal');
        }}
      />

      {/* Executive AI Studio Prompt Blueprint Modal */}
      <AIStudioBlueprintModal
        isOpen={isBlueprintOpen}
        onClose={() => setIsBlueprintOpen(false)}
      />

      {/* Footer */}
      <Footer
        onOpenBlueprint={() => setIsBlueprintOpen(true)}
        onExplore={() => {
          setActiveTab('shop');
          setSelectedCategory('all');
          window.scrollTo({ top: 500, behavior: 'smooth' });
        }}
        onMeetMakers={() => {
          setActiveTab('makers');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onCommission={() => {
          setActiveTab('commission');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
