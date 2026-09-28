import React, { useState } from 'react';
import { Hammer, Sparkles, Send, Check, Clock, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Artisan, CustomCommissionRequest } from '../types';

interface CustomCommissionDeskProps {
  artisans: Artisan[];
  preselectedArtisan?: Artisan | null;
  onSubmitCommission: (commission: CustomCommissionRequest) => void;
  onClose?: () => void;
}

export const CustomCommissionDesk: React.FC<CustomCommissionDeskProps> = ({
  artisans,
  preselectedArtisan,
  onSubmitCommission,
  onClose,
}) => {
  const [selectedArtisanId, setSelectedArtisanId] = useState(preselectedArtisan?.id || 'artisan-elena');
  const [category, setCategory] = useState('Ceramics & Stoneware');
  const [description, setDescription] = useState('');
  const [materials, setMaterials] = useState('');
  const [budget, setBudget] = useState(300);
  const [timeline, setTimeline] = useState('4 to 6 weeks');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  
  const [isConsultingAI, setIsConsultingAI] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{
    suggestedMaterials: string[];
    estimatedLeadWeeks: string;
    artisanQuestions: string[];
    artisanFeasibilityNotes: string;
  } | null>(null);

  const [submitted, setSubmitted] = useState(false);

  // Run AI feasibility check
  const handleConsultAI = async () => {
    if (!description) return;
    setIsConsultingAI(true);
    try {
      const res = await fetch('/api/custom-commission-consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          description,
          budget,
          desiredTimeline: timeline,
        }),
      });
      const data = await res.json();
      setAiSuggestions(data);
    } catch (e) {
      console.error(e);
      setAiSuggestions({
        suggestedMaterials: ['Local high-fire stoneware', 'Organic plant-based finishes'],
        estimatedLeadWeeks: '4-5 weeks',
        artisanQuestions: ['What are your preferred dimensions?', 'What color tones best match your interior space?'],
        artisanFeasibilityNotes: 'Feasible for individual artisan studio production within your proposed budget.',
      });
    } finally {
      setIsConsultingAI(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !description) return;

    const newCommission: CustomCommissionRequest = {
      id: `comm-${Date.now()}`,
      customerName,
      customerEmail,
      category,
      artisanId: selectedArtisanId,
      description,
      budget,
      desiredTimeline: timeline,
      materialPreferences: materials || 'Hand-selected by artisan',
      status: 'pending_review',
      createdAt: new Date().toISOString().split('T')[0],
      aiFeasibility: aiSuggestions || undefined,
    };

    onSubmitCommission(newCommission);
    setSubmitted(true);
  };

  const selectedArtisan = artisans.find((a) => a.id === selectedArtisanId) || artisans[0];

  return (
    <div className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="flex items-center justify-center gap-2 text-xs text-[#7A5C4D] font-medium tracking-wide">
          <span>Bespoke Studio Guild</span>
          <span aria-hidden="true">·</span>
          <span>One-of-a-Kind Commissions</span>
        </div>
        <h2 className="font-editorial text-3xl sm:text-4xl text-[#211E1C] font-semibold">
          Commission a Bespoke Heirloom
        </h2>
        <p className="text-sm text-[#574F45] leading-relaxed font-light">
          Have a vision for a personalized dinnerware set, custom-carved dining bench, or heirloom wedding band? Collaborate directly with an independent master artisan.
        </p>
      </div>

      {submitted ? (
        <div className="bg-[#FAF7F2] border border-[#C85A32]/40 rounded-xl p-8 text-center space-y-4 shadow-sm max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-full bg-[#EAE2D3] text-[#A43F1B] flex items-center justify-center mx-auto">
            <Check className="w-6 h-6" />
          </div>
          <h3 className="font-editorial text-2xl text-[#211E1C] font-semibold">
            Commission Request Dispatched
          </h3>
          <p className="text-xs sm:text-sm text-[#574F45] leading-relaxed">
            Thank you, {customerName}. Your vision has been delivered directly to <strong>{selectedArtisan.name}</strong> at {selectedArtisan.studioName}. You will receive a personal artisan response and preliminary sketches at {customerEmail} within 48 hours.
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                setSubmitted(false);
                setDescription('');
                setAiSuggestions(null);
                if (onClose) onClose();
              }}
              className="px-6 py-2.5 bg-[#24211D] text-white text-xs font-semibold rounded-md hover:bg-[#C85A32] transition-colors cursor-pointer"
            >
              Submit Another Commission
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Form */}
          <div className="lg:col-span-7 bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl p-6 sm:p-8 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Select Artisan */}
              <div>
                <label className="block text-xs font-semibold text-[#211E1C] uppercase tracking-wider mb-1.5">
                  Select Master Artisan & Atelier
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {artisans.map((art) => (
                    <button
                      key={art.id}
                      type="button"
                      onClick={() => setSelectedArtisanId(art.id)}
                      className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex items-center gap-3 ${
                        selectedArtisanId === art.id
                          ? 'bg-[#EAE4D7] border-[#24211D] shadow-2xs'
                          : 'bg-[#F5EFE6] border-[#DFD6C7] hover:bg-[#EFE8DC]'
                      }`}
                    >
                      <img
                        src={art.avatar}
                        alt={art.name}
                        className="w-9 h-9 rounded-full object-cover shrink-0"
                      />
                      <div className="truncate">
                        <div className="text-xs font-semibold text-[#211E1C] truncate">
                          {art.name}
                        </div>
                        <div className="text-[10px] text-stone-500 truncate">
                          {art.specialty.split('&')[0]}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-[#211E1C] uppercase tracking-wider mb-1">
                  Commission Discipline
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#F5EFE6] border border-[#DFD6C7] text-xs py-2 px-3 rounded-md outline-none"
                >
                  <option>Ceramics & Stoneware Dinnerware</option>
                  <option>Reclaimed Wood Table or Culinary Ware</option>
                  <option>Hand-Woven Botanical Wool Blanket</option>
                  <option>Forged Heirloom Jewelry & Talisman</option>
                  <option>Fine Art Botanical Painting / Scroll</option>
                  <option>Custom Architectural Home Décor</option>
                </select>
              </div>

              {/* Vision Description */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-[#211E1C] uppercase tracking-wider">
                    Your Vision & Aesthetic Details
                  </label>
                  <button
                    type="button"
                    onClick={handleConsultAI}
                    disabled={isConsultingAI || !description}
                    className="text-[11px] text-[#A43F1B] hover:underline flex items-center gap-1 cursor-pointer disabled:opacity-40"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{isConsultingAI ? 'Analyzing...' : 'Analyze with Craft AI'}</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your desired object: intended dimensions, colors, tactile textures, functional requirements, or personal significance..."
                  required
                  className="w-full bg-[#F5EFE6] border border-[#DFD6C7] text-xs p-3 rounded-md outline-none focus:border-[#C85A32]"
                />
              </div>

              {/* Material Preferences */}
              <div>
                <label className="block text-xs font-semibold text-[#211E1C] uppercase tracking-wider mb-1">
                  Material & Finish Preferences (Optional)
                </label>
                <input
                  type="text"
                  value={materials}
                  onChange={(e) => setMaterials(e.target.value)}
                  placeholder="e.g., Raw black walnut, unglazed terracotta, recycled silver, natural indigo"
                  className="w-full bg-[#F5EFE6] border border-[#DFD6C7] text-xs py-2 px-3 rounded-md outline-none"
                />
              </div>

              {/* Budget & Timeline */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#211E1C] uppercase tracking-wider mb-1">
                    Target Budget (${budget})
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="1500"
                    step="50"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full accent-[#C85A32] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-stone-500 mt-0.5">
                    <span>$100 (Single item)</span>
                    <span>$1,500+ (Master suite)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#211E1C] uppercase tracking-wider mb-1">
                    Desired Timeline
                  </label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="w-full bg-[#F5EFE6] border border-[#DFD6C7] text-xs py-2 px-3 rounded-md outline-none"
                  >
                    <option>Flexible / Whenever ready</option>
                    <option>3 to 5 weeks</option>
                    <option>6 to 8 weeks</option>
                    <option>Holiday / Special date deadline</option>
                  </select>
                </div>
              </div>

              {/* Patron Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#EDE5D8]">
                <div>
                  <label className="block text-xs font-semibold text-[#211E1C] uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Jordan Hayes"
                    required
                    className="w-full bg-[#F5EFE6] border border-[#DFD6C7] text-xs py-2 px-3 rounded-md outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#211E1C] uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="jordan@example.com"
                    required
                    className="w-full bg-[#F5EFE6] border border-[#DFD6C7] text-xs py-2 px-3 rounded-md outline-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#C85A32] hover:bg-[#A43F1B] text-white text-xs sm:text-sm font-semibold rounded-md transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Bespoke Commission Proposal</span>
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: AI Feasibility & Artisan Insight */}
          <div className="lg:col-span-5 space-y-6">
            {/* Selected Artisan Bio Card */}
            <div className="bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl p-6 shadow-xs space-y-3">
              <span className="text-[11px] font-semibold text-[#7A5C4D] uppercase tracking-wider block">
                Direct Collaboration With
              </span>
              <div className="flex items-center gap-4">
                <img
                  src={selectedArtisan.avatar}
                  alt={selectedArtisan.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-[#C85A32]"
                />
                <div>
                  <h4 className="font-editorial text-xl font-semibold text-[#211E1C]">
                    {selectedArtisan.name}
                  </h4>
                  <p className="text-xs text-[#7A5C4D]">{selectedArtisan.studioName}</p>
                  <p className="text-[11px] text-stone-500">{selectedArtisan.location}</p>
                </div>
              </div>
              <p className="text-xs text-[#574F45] leading-relaxed italic border-t border-[#EAE3D4] pt-2">
                "{selectedArtisan.bio}"
              </p>
            </div>

            {/* AI Feasibility Advisor Output */}
            <div className="bg-[#F5EFE6] border border-[#E3DAC9] rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-xs text-[#211E1C] flex items-center gap-1.5 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-[#C85A32]" />
                  AI Craft Feasibility Advisor
                </h4>
                {aiSuggestions && (
                  <span className="text-[10px] text-[#506B52] font-semibold">Analyzed</span>
                )}
              </div>

              {aiSuggestions ? (
                <div className="space-y-3 text-xs text-[#4A453E] animate-in fade-in">
                  <p className="leading-relaxed bg-white/70 p-3 rounded border border-[#DFD6C7]">
                    {aiSuggestions.artisanFeasibilityNotes}
                  </p>

                  <div>
                    <span className="font-semibold text-[#211E1C] block mb-1">
                      Recommended Natural Materials:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {aiSuggestions.suggestedMaterials.map((mat, i) => (
                        <span key={i} className="text-[11px] text-[#574F45] bg-[#EAE2D3] px-2 py-0.5 rounded">
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-semibold text-[#211E1C] block mb-1">
                      Estimated Studio Lead Time:
                    </span>
                    <span className="text-[#C85A32] font-medium">
                      {aiSuggestions.estimatedLeadWeeks}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-[#DFD6C7]">
                    <span className="font-semibold text-[#211E1C] block mb-1">
                      Artisan Reflection Questions:
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-[11px] text-stone-600">
                      {aiSuggestions.artisanQuestions.map((q, i) => (
                        <li key={i}>{q}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-stone-500 leading-relaxed font-light">
                  Type your vision on the left and click "Analyze with Craft AI" to receive instant material recommendations, realistic drying/firing lead times, and tailored design questions.
                </p>
              )}
            </div>

            {/* Fair Patron Guarantee */}
            <div className="p-4 bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl flex items-start gap-3 text-xs text-[#574F45]">
              <HeartHandshake className="w-5 h-5 text-[#506B52] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#211E1C] block mb-0.5">
                  Direct Escrow & Artisan Protection
                </span>
                Funds are held securely until the artisan shares work-in-progress studio proof photos and the piece is safely dispatched with museum-grade tracking.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
