import React, { useState } from 'react';
import { 
  Hammer, 
  Sparkles, 
  DollarSign, 
  Clock, 
  Package, 
  CheckCircle, 
  Plus, 
  Layers, 
  Info,
  Truck,
  ArrowRight,
  Flame,
  Check,
  AlertCircle
} from 'lucide-react';
import { Artisan, CraftProduct, ArtisanOrder, CustomCommissionRequest, CraftCategory } from '../types';

interface ArtisanPortalProps {
  artisans: Artisan[];
  currentArtisanId: string;
  setCurrentArtisanId: (id: string) => void;
  products: CraftProduct[];
  onAddProduct: (product: CraftProduct) => void;
  orders: ArtisanOrder[];
  onUpdateOrderStatus: (orderId: string, status: ArtisanOrder['status'], notes?: string) => void;
  commissions: CustomCommissionRequest[];
  onUpdateCommissionStatus: (commissionId: string, status: CustomCommissionRequest['status']) => void;
}

export const ArtisanPortal: React.FC<ArtisanPortalProps> = ({
  artisans,
  currentArtisanId,
  setCurrentArtisanId,
  products,
  onAddProduct,
  orders,
  onUpdateOrderStatus,
  commissions,
  onUpdateCommissionStatus,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'create' | 'orders' | 'commissions'>('create');
  
  // Current active artisan
  const currentArtisan = artisans.find((a) => a.id === currentArtisanId) || artisans[0];

  // New Product Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CraftCategory>('pottery');
  const [materials, setMaterials] = useState('');
  const [hoursSpent, setHoursSpent] = useState<number>(6);
  const [materialCost, setMaterialCost] = useState<number>(25);
  const [hourlyWage, setHourlyWage] = useState<number>(35);
  const [rawNotes, setRawNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=900&q=80');
  
  // AI Generation State
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [generatedStory, setGeneratedStory] = useState('');
  const [generatedProvenance, setGeneratedProvenance] = useState('');
  const [generatedCare, setGeneratedCare] = useState('');
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);
  const [priceRecommendation, setPriceRecommendation] = useState<number | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Pricing calculations
  const laborCost = hoursSpent * hourlyWage;
  const overhead = Math.round((materialCost + laborCost) * 0.15);
  const calculatedFairPrice = materialCost + laborCost + overhead;

  // Handle AI Story Generation
  const handleGenerateStory = async () => {
    setIsGeneratingStory(true);
    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title || 'New Handcrafted Work',
          craftType: category,
          materials: materials || 'Local raw elements',
          hoursSpent,
          artisanNotes: rawNotes || 'Hand-thrown on slow wheel, natural glazes fired in studio',
          regionalOrigin: currentArtisan.location,
        }),
      });

      const data = await response.json();
      setGeneratedStory(data.story || '');
      setGeneratedProvenance(data.provenance || '');
      setGeneratedCare(data.careInstructions || '');
      setGeneratedTags(data.tags || []);
      setPriceRecommendation(calculatedFairPrice);
    } catch (err) {
      console.error(err);
      // Fallback
      setGeneratedStory(`Hand-shaped in ${currentArtisan.studioName} with patient focus across ${hoursSpent} hours. The piece highlights the tactile personality of ${materials || 'natural materials'}.`);
      setGeneratedProvenance(`Sourced locally in ${currentArtisan.location}.`);
      setGeneratedCare(`Handle with care. Gentle hand washing recommended.`);
      setGeneratedTags(['Handmade', 'Artisan', 'Studio Direct']);
    } finally {
      setIsGeneratingStory(false);
    }
  };

  // Handle Publishing Product
  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    const newProd: CraftProduct = {
      id: `prod-${Date.now()}`,
      title,
      price: priceRecommendation || calculatedFairPrice,
      category,
      artisanId: currentArtisan.id,
      artisan: currentArtisan,
      images: [
        imageUrl || 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=80',
      ],
      materials: materials || 'Ethical studio materials',
      craftHours: hoursSpent,
      story: generatedStory || `A piece made with devotion at ${currentArtisan.studioName}.`,
      provenance: generatedProvenance || `Locally created in ${currentArtisan.location}.`,
      careGuide: generatedCare || 'Wipe with soft cloth. Avoid harsh chemical cleaners.',
      inventoryCount: 3,
      isCustomizable: true,
      customizationOptions: [
        { label: 'Studio Finish', choices: ['Natural Satin', 'Earthy Matte'] }
      ],
      rating: 5.0,
      reviewCount: 1,
      techniqueTags: generatedTags.length > 0 ? generatedTags : ['Artisan Guild', 'Small Batch'],
      ethicalCertifications: ['Living Wage Verified', 'Handcrafted in Atelier'],
    };

    onAddProduct(newProd);
    setPublishSuccess(true);
    setTimeout(() => {
      setPublishSuccess(false);
      // Reset form
      setTitle('');
      setMaterials('');
      setRawNotes('');
      setGeneratedStory('');
      setGeneratedProvenance('');
    }, 2000);
  };

  // Status mapping colors & labels
  const orderSteps: { status: ArtisanOrder['status']; label: string }[] = [
    { status: 'order_placed', label: '1. Order Logged' },
    { status: 'materials_prepped', label: '2. Materials Prepped' },
    { status: 'in_kiln_loom', label: '3. In Kiln / On Loom' },
    { status: 'quality_hallmarked', label: '4. Hallmarked' },
    { status: 'eco_shipped', label: '5. Eco-Shipped' },
  ];

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-300">
      {/* Studio Header Bar */}
      <div className="bg-[#24211D] text-[#FAF7F2] rounded-xl p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-md">
        <div className="flex items-center gap-4">
          <img
            src={currentArtisan.avatar}
            alt={currentArtisan.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-[#C85A32]"
          />
          <div>
            <div className="flex items-center gap-2 text-xs text-[#E27D60]">
              <Hammer className="w-3.5 h-3.5" />
              <span>Maker Atelier Dashboard</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl font-semibold">
              {currentArtisan.name} · {currentArtisan.studioName}
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              {currentArtisan.location} · {currentArtisan.specialty}
            </p>
          </div>
        </div>

        {/* Switch Artisan Selector (allows testing different makers) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <span className="text-xs text-stone-400">Switch Studio Persona:</span>
          <select
            value={currentArtisanId}
            onChange={(e) => setCurrentArtisanId(e.target.value)}
            className="bg-[#332F2B] border border-stone-600 text-xs text-[#FAF7F2] py-2 px-3 rounded-md outline-none focus:border-[#C85A32]"
          >
            {artisans.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.studioName})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Subnav Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8E1D5] pb-3 text-sm font-medium">
        <button
          onClick={() => setActiveSubTab('create')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors cursor-pointer ${
            activeSubTab === 'create'
              ? 'bg-[#24211D] text-white shadow-xs'
              : 'text-[#4A453E] hover:bg-[#F2ECE1]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#C85A32]" />
          <span>Publish Craft with AI Story Assistant</span>
        </button>

        <button
          onClick={() => setActiveSubTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors cursor-pointer relative ${
            activeSubTab === 'orders'
              ? 'bg-[#24211D] text-white shadow-xs'
              : 'text-[#4A453E] hover:bg-[#F2ECE1]'
          }`}
        >
          <Layers className="w-4 h-4 text-[#C85A32]" />
          <span>Active Studio Orders</span>
          <span className="w-4 h-4 rounded-full bg-[#C85A32] text-white text-[10px] flex items-center justify-center font-bold">
            {orders.length}
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('commissions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors cursor-pointer ${
            activeSubTab === 'commissions'
              ? 'bg-[#24211D] text-white shadow-xs'
              : 'text-[#4A453E] hover:bg-[#F2ECE1]'
          }`}
        >
          <Hammer className="w-4 h-4 text-[#C85A32]" />
          <span>Bespoke Commission Requests</span>
          <span className="w-4 h-4 rounded-full bg-[#7A5C4D] text-white text-[10px] flex items-center justify-center font-bold">
            {commissions.length}
          </span>
        </button>
      </div>

      {/* TAB 1: ADD NEW PRODUCT WITH AI STORY ASSISTANT */}
      {activeSubTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form: Artisan Inputs & Fair Pricing */}
          <div className="lg:col-span-7 bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="font-editorial text-2xl text-[#211E1C] font-semibold">
                Document & List a New Handmade Creation
              </h3>
              <p className="text-xs text-[#574F45] mt-1 font-light">
                Provide basic workbench notes. Our AI assistant transforms raw maker thoughts into poetic gallery storytelling, living wage validation, and provenance records.
              </p>
            </div>

            <form onSubmit={handlePublish} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#211E1C] uppercase tracking-wider mb-1">
                  Craft Piece Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Mountain Mist Faceted Stoneware Teapot"
                  required
                  className="w-full bg-[#F5EFE6] border border-[#DFD6C7] focus:border-[#C85A32] text-sm py-2 px-3 rounded-md outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#211E1C] uppercase tracking-wider mb-1">
                    Craft Discipline
                  </label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full bg-[#F5EFE6] border border-[#DFD6C7] focus:border-[#C85A32] text-xs py-2 px-3 rounded-md outline-none"
                  >
                    <option value="pottery">Pottery & Ceramics</option>
                    <option value="woodcraft">Reclaimed Woodcraft</option>
                    <option value="textiles">Weaving & Crochet</option>
                    <option value="jewelry">Artisan Jewelry</option>
                    <option value="homedecor">Botanical & Home Décor</option>
                    <option value="paintings">Fine & Folk Art</option>
                    <option value="custom">Custom Commission</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#211E1C] uppercase tracking-wider mb-1">
                    Raw Materials Used
                  </label>
                  <input
                    type="text"
                    value={materials}
                    onChange={(e) => setMaterials(e.target.value)}
                    placeholder="e.g. Riverbed clay, eucalyptus ash, brass"
                    className="w-full bg-[#F5EFE6] border border-[#DFD6C7] focus:border-[#C85A32] text-xs py-2 px-3 rounded-md outline-none"
                  />
                </div>
              </div>

              {/* Economic Fairness Inputs */}
              <div className="p-4 bg-[#F5EFE6] border border-[#DFD5C4] rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#211E1C] flex items-center gap-1.5 uppercase tracking-wider">
                    <DollarSign className="w-3.5 h-3.5 text-[#C85A32]" />
                    Fair Wage & Time Calculator
                  </span>
                  <span className="text-[11px] text-[#506B52] font-medium">
                    Prevents Artisan Undervaluation
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-stone-600 mb-1">Hand Hours</label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      value={hoursSpent}
                      onChange={(e) => setHoursSpent(Number(e.target.value))}
                      className="w-full bg-[#FAF7F2] border border-[#DFD6C7] py-1.5 px-2 rounded text-center font-semibold text-[#211E1C]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-1">Living Wage ($/h)</label>
                    <input
                      type="number"
                      step="5"
                      min="20"
                      value={hourlyWage}
                      onChange={(e) => setHourlyWage(Number(e.target.value))}
                      className="w-full bg-[#FAF7F2] border border-[#DFD6C7] py-1.5 px-2 rounded text-center font-semibold text-[#211E1C]"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 mb-1">Materials ($)</label>
                    <input
                      type="number"
                      step="5"
                      min="5"
                      value={materialCost}
                      onChange={(e) => setMaterialCost(Number(e.target.value))}
                      className="w-full bg-[#FAF7F2] border border-[#DFD6C7] py-1.5 px-2 rounded text-center font-semibold text-[#211E1C]"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E5DAC9] flex items-center justify-between text-xs">
                  <span className="text-[#574F45]">Calculated Fair Retail Minimum:</span>
                  <span className="font-editorial text-lg font-bold text-[#A43F1B]">
                    ${calculatedFairPrice}
                  </span>
                </div>
              </div>

              {/* Artisan's raw studio notes */}
              <div>
                <label className="block text-xs font-semibold text-[#211E1C] uppercase tracking-wider mb-1">
                  Artisan Workbench Rambles / Raw Notes
                </label>
                <textarea
                  rows={3}
                  value={rawNotes}
                  onChange={(e) => setRawNotes(e.target.value)}
                  placeholder="e.g., Thrown early morning, trimmed with iron rib, 24-hr eucalyptus ash reduction firing, slightly coarse bottom texture for stable grip..."
                  className="w-full bg-[#F5EFE6] border border-[#DFD6C7] focus:border-[#C85A32] text-xs p-3 rounded-md outline-none"
                />
              </div>

              {/* Visual image URL helper */}
              <div>
                <label className="block text-xs font-semibold text-[#211E1C] uppercase tracking-wider mb-1">
                  Studio Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#F5EFE6] border border-[#DFD6C7] text-xs py-2 px-3 rounded-md outline-none"
                />
              </div>

              {/* Generate AI Story Trigger Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleGenerateStory}
                  disabled={isGeneratingStory}
                  className="w-full py-3 bg-[#FAF7F2] hover:bg-[#F2EADB] text-[#24211D] border border-[#C5BBAA] rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                >
                  <Sparkles className="w-4 h-4 text-[#C85A32]" />
                  <span>
                    {isGeneratingStory
                      ? 'AI Weaving Craft Story & Provenance...'
                      : 'Generate Poetic Story & Provenance with AI'}
                  </span>
                </button>
              </div>

              {/* Publish Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={publishSuccess}
                  className="w-full py-3.5 bg-[#C85A32] hover:bg-[#A43F1B] text-white rounded-md text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  {publishSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Published to Live TerraLoom Gallery!</span>
                    </>
                  ) : (
                    <span>Publish Piece to Storefront · ${priceRecommendation || calculatedFairPrice}</span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: AI Output & Live Preview */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Preview Card */}
            <div className="bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between text-xs text-[#7A5C4D]">
                <span className="font-semibold uppercase tracking-wider">
                  Storefront Live Preview
                </span>
                <span>{currentArtisan.studioName}</span>
              </div>

              <div className="aspect-[4/3] rounded-md overflow-hidden bg-stone-200">
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h4 className="font-editorial text-xl font-semibold text-[#211E1C]">
                  {title || 'Untitled Artisan Vessel'}
                </h4>
                <div className="text-xs text-stone-500 mt-1 flex items-center gap-2">
                  <span>{hoursSpent}h craft time</span>
                  <span aria-hidden="true">·</span>
                  <span>{materials || 'Natural ingredients'}</span>
                </div>
              </div>

              {/* Generated Story Box */}
              <div className="p-4 bg-[#F5EFE6] rounded-lg border border-[#E5DDD0] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#7A5C4D] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#C85A32]" />
                    AI Curator Story
                  </span>
                  {generatedStory && (
                    <span className="text-[10px] text-[#506B52] font-medium">Ready</span>
                  )}
                </div>

                <p className="text-xs text-[#4A453E] leading-relaxed italic">
                  {generatedStory || (
                    <span className="text-stone-400 not-italic">
                      Click "Generate Poetic Story & Provenance with AI" above to transform your raw workbench notes into evocative product prose, materials history, and care instructions.
                    </span>
                  )}
                </p>

                {generatedProvenance && (
                  <div className="pt-2 border-t border-[#E3DAC9] text-xs">
                    <span className="font-semibold text-[#211E1C]">Provenance: </span>
                    <span className="text-[#574F45]">{generatedProvenance}</span>
                  </div>
                )}

                {generatedCare && (
                  <div className="pt-1 text-xs">
                    <span className="font-semibold text-[#211E1C]">Care Guide: </span>
                    <span className="text-[#574F45]">{generatedCare}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: STUDIO ORDERS TRACKER */}
      {activeSubTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-editorial text-2xl text-[#211E1C] font-semibold">
                Studio Workbench & Order Progression
              </h3>
              <p className="text-xs text-[#574F45] mt-0.5 font-light">
                Keep patrons intimately connected with the tactile journey of their handcrafted pieces.
              </p>
            </div>
            <span className="text-xs text-stone-500 font-medium">
              {orders.length} Active Atelier Commissions
            </span>
          </div>

          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl p-6 shadow-xs space-y-5"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E8E1D5] pb-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={order.productImage}
                      alt={order.productTitle}
                      className="w-14 h-14 rounded-md object-cover border border-[#DFD6C7]"
                    />
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#7A5C4D]">
                        <span className="font-mono font-medium text-[#211E1C]">
                          {order.orderNumber}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{order.date}</span>
                      </div>
                      <h4 className="font-editorial text-lg text-[#211E1C] font-semibold">
                        {order.productTitle}
                      </h4>
                      <p className="text-xs text-stone-500">
                        Patron: {order.customerName} ({order.customerEmail})
                      </p>
                    </div>
                  </div>

                  <div className="text-right sm:self-center">
                    <span className="font-editorial text-2xl font-bold text-[#211E1C]">
                      ${order.price}
                    </span>
                    <span className="text-xs text-stone-400 block">Proceeds Escrowed</span>
                  </div>
                </div>

                {/* Stepper Progression */}
                <div>
                  <span className="text-xs font-semibold text-[#7A5C4D] uppercase tracking-wider block mb-2">
                    Current Handcrafted Progression Stage
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {orderSteps.map((step, idx) => {
                      const isCurrent = order.status === step.status;
                      const isCompleted = orderSteps.findIndex(s => s.status === order.status) >= idx;

                      return (
                        <button
                          key={step.status}
                          onClick={() => onUpdateOrderStatus(order.id, step.status)}
                          className={`p-2.5 rounded-md text-xs font-medium text-left border transition-all cursor-pointer flex flex-col justify-between h-18 ${
                            isCurrent
                              ? 'bg-[#24211D] text-white border-[#24211D] shadow-xs'
                              : isCompleted
                              ? 'bg-[#EAE4D7] text-[#24211D] border-[#C85A32]/40'
                              : 'bg-[#F5EFE6] text-stone-400 border-transparent hover:border-[#D5CABE]'
                          }`}
                        >
                          <span className="text-[10px] opacity-75">Step 0{idx + 1}</span>
                          <span className="truncate">{step.label.split('. ')[1]}</span>
                          {isCompleted && (
                            <span className="text-[9px] text-[#C85A32] font-bold">✓ Complete</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Order Details & Customer Note */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2 border-t border-[#EDE5D8]">
                  {order.customNote && (
                    <div className="p-3 bg-[#F5EFE6] rounded border border-[#E3DAC9]">
                      <span className="font-semibold text-[#211E1C] block mb-1">
                        Patron Custom Instructions:
                      </span>
                      <p className="text-stone-700 italic">"{order.customNote}"</p>
                    </div>
                  )}

                  <div className="p-3 bg-[#F5EFE6] rounded border border-[#E3DAC9]">
                    <span className="font-semibold text-[#211E1C] block mb-1">
                      Artisan Log & Dispatch Status:
                    </span>
                    <p className="text-stone-700">{order.artisanNotes || 'Studio crafting on schedule.'}</p>
                    <span className="text-[10px] text-stone-500 block mt-1">
                      Destination: {order.shippingAddress}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BESPOKE COMMISSION REQUESTS */}
      {activeSubTab === 'commissions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-editorial text-2xl text-[#211E1C] font-semibold">
                Patron Bespoke Commission Enquiries
              </h3>
              <p className="text-xs text-[#574F45] mt-0.5 font-light">
                Review tailored proposals, AI feasibility checks, and accept custom commissions.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {commissions.map((comm) => (
              <div
                key={comm.id}
                className="bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl p-6 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-[#7A5C4D]">
                      <span className="font-medium text-[#C85A32]">{comm.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>Received {comm.createdAt}</span>
                    </div>
                    <h4 className="font-editorial text-xl font-semibold text-[#211E1C]">
                      Custom Commission from {comm.customerName}
                    </h4>
                    <p className="text-xs text-stone-500">
                      Contact: {comm.customerEmail} · Target: {comm.desiredTimeline}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-stone-400 block">Proposed Budget</span>
                    <span className="font-editorial text-2xl font-bold text-[#211E1C]">
                      ${comm.budget}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 bg-[#F5EFE6] rounded-lg border border-[#E3DAC9] text-xs">
                  <span className="font-semibold text-[#211E1C] block mb-1">
                    Vision & Design Specifications:
                  </span>
                  <p className="text-[#4A453E] leading-relaxed">
                    {comm.description}
                  </p>
                  <p className="text-[#7A5C4D] mt-2 font-medium">
                    Requested Materials: {comm.materialPreferences}
                  </p>
                </div>

                {/* AI Feasibility Assessment */}
                {comm.aiFeasibility && (
                  <div className="p-3.5 bg-[#F0EBE1] rounded-lg border border-[#DFD5C4] text-xs space-y-2">
                    <div className="flex items-center gap-1.5 text-[#506B52] font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Studio Craft Feasibility Advisor</span>
                    </div>
                    <p className="text-stone-700">
                      {comm.aiFeasibility.artisanFeasibilityNotes}
                    </p>
                    <div className="pt-2 border-t border-[#D5CABE] text-[11px] text-stone-600">
                      <span className="font-medium text-[#211E1C]">Key Questions for Patron: </span>
                      <ul className="list-disc pl-4 space-y-0.5 mt-1">
                        {comm.aiFeasibility.artisanQuestions.map((q, idx) => (
                          <li key={idx}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Status Actions */}
                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-stone-500">Status:</span>
                    <span className={`font-semibold ${
                      comm.status === 'artisan_accepted' ? 'text-[#506B52]' : 'text-[#C85A32]'
                    }`}>
                      {comm.status.toUpperCase().replace('_', ' ')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {comm.status === 'pending_review' ? (
                      <>
                        <button
                          onClick={() => onUpdateCommissionStatus(comm.id, 'artisan_accepted')}
                          className="px-4 py-2 bg-[#24211D] hover:bg-[#C85A32] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
                        >
                          Accept Commission
                        </button>
                      </>
                    ) : (
                      <span className="text-xs font-medium text-[#506B52] flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        Commission Accepted & In Studio Queue
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
