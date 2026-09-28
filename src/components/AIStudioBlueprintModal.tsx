import React, { useState } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  X, 
  Lightbulb, 
  TrendingUp, 
  ShieldAlert, 
  Layers, 
  Terminal,
  Zap,
  DollarSign
} from 'lucide-react';

interface AIStudioBlueprintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIStudioBlueprintModal: React.FC<AIStudioBlueprintModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<'prompt' | 'problem' | 'model' | 'ai' | 'revenue'>('prompt');

  const MASTER_PROMPT_TEXT = `Act as an elite Principal Product Architect, Venture Strategist, and AI Systems Designer.

TASK: Architect and build "TerraLoom / AtelierCraft" — an authentic, high-margin, AI-powered artisan heritage marketplace and studio operating system that rescues independent handmade creators from the mass-production commodification trap.

---
### 1. THE ARTISAN PROBLEM STATEMENT (THE CRISIS IN THE CRAFT ECONOMY)
1. The Commodification Trap: Legacy craft platforms (Etsy, Amazon Handmade) are inundated with factory dropshippers and Alibaba counterfeits claiming to be "handmade," eroding buyer trust and forcing true artisans into impossible price wars.
2. The Living Wage Catastrophe: Master potters, weavers, and woodworkers work 50+ hours a week but under-price their labor, earning sub-minimum wages because existing platforms do not educate patrons on time-to-make value.
3. The Provenance Blindspot: Authentic artisans possess generational talent but struggle with digital marketing, professional photography, museum-grade storytelling, and SEO taxonomy.
4. Extortionate Take-Rates: Monopolistic platforms charge 20% to 40% in hidden listing fees, transaction surcharges, and mandatory offsite ad commissions, draining the maker's livelihood.

---
### 2. UNIQUE BUSINESS MODEL: "PROVENANCE-AS-A-SERVICE & MICRO-GUILDS"
- Direct-to-Patron Heritage Collective: A curated platform where every product carries verifiable material provenance, artisan studio origin, and exact manual craft hours spent.
- Living Wage Certified Commerce: Transparent economic breakdown showing raw material costs + fair labor hours + sustainable packaging.
- Decentralized Material Buying Guilds: Artisans pool collective purchasing power for raw clays, sustainable timber, and organic wool, reducing raw costs by 35%.
- Tamper-Proof Digital Certificates of Authenticity: Every physical creation is registered with an immutable digital provenance certificate verifying handmade authenticity.

---
### 3. CUTTING-EDGE AI FEATURES (GEMINI INTEGRATION)
1. Multimodal Craft Authenticity & Material Provenance Engine:
   - Analyzes macro studio photos to detect authentic hand-thrown clay spirals, adze hewing marks, and hand-spun yarn imperfections versus mass-produced injection molds.
2. Workbench Voice Memoir & Poetic Storyteller:
   - The artisan speaks 30 seconds of conversational thoughts at the workbench; Gemini synthesizes museum-grade provenance chronicles, care instructions, and SEO discovery tags.
3. Dynamic Living Wage Fair-Pricing Algorithm:
   - Micro-economic calculator balancing regional living costs, material expenses, and craft hours to guarantee artisans earn $35–$65+/hr.
4. Bespoke Commission Generative Co-Pilot:
   - Patrons describe custom requests (e.g., "12-piece heirloom dinner set with volcanic slip glaze"); the AI creates technical feasibility assessments, material recommendations, and clarifies dimensions before the artisan touches clay.
5. Virtual Atelier Tactile Experience:
   - Contextual ambient studio soundscapes (kick-wheel spinning, loom clacking, fire crackling) and 3D tactile texture zoom.

---
### 4. MULTI-TIERED SUSTAINABLE REVENUE MODEL
1. Transparent 7% Fair Platform Fee (vs. Etsy's 25-35% effective rate) — 93% goes directly into the artisan's pocket.
2. Atelier Pro Studio OS ($19/mo SaaS):
   - Inventory tracking, automatic shipping labels, provenance certificate printing, and AI story generator.
3. B2B Corporate Bespoke Gifting Pipeline (15% commission):
   - Curating high-ticket artisan batches (100–500 custom pieces) for architectural firms and luxury brands.
4. Patron Guild Memberships ($10/mo):
   - Gives patrons early access to limited kiln drops, exclusive studio live streams, and directly funds young artisan apprenticeships.

---
### 5. SYSTEM ARCHITECTURE & USER EXPERIENCE
- Aesthetic Constitution: Warm linen and terracotta palette (#FAF7F2, #C85A32, #211E1C), editorial serif typography, zero static pill tags, unboxed metadata, and high-fidelity artisan imagery.
- Patron & Maker Dual View: Seamless toggle between customer discovery/checkout and the artisan workbench management portal.`;

  const handleCopy = () => {
    navigator.clipboard.writeText(MASTER_PROMPT_TEXT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1C1917]/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative text-[#211E1C]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-[#24211D] text-[#FAF7F2] flex items-center justify-between border-b border-[#3E3832]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#C85A32] flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs text-[#E27D60] font-medium uppercase tracking-wider">
                <span>Venture Architecture Blueprint</span>
              </div>
              <h2 className="font-editorial text-2xl font-semibold">
                AI Studio Master Prompt & Venture Architecture
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 p-2 bg-[#F2ECE1] border-b border-[#E0D7C6] overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveSection('prompt')}
            className={`px-3 py-2 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === 'prompt'
                ? 'bg-[#24211D] text-white'
                : 'text-[#4A453E] hover:bg-[#EAE2D3]'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-[#C85A32]" />
            <span>Master AI Studio Prompt</span>
          </button>

          <button
            onClick={() => setActiveSection('problem')}
            className={`px-3 py-2 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === 'problem'
                ? 'bg-[#24211D] text-white'
                : 'text-[#4A453E] hover:bg-[#EAE2D3]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#C85A32]" />
            <span>Artisan Problem Statement</span>
          </button>

          <button
            onClick={() => setActiveSection('model')}
            className={`px-3 py-2 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === 'model'
                ? 'bg-[#24211D] text-white'
                : 'text-[#4A453E] hover:bg-[#EAE2D3]'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-[#C85A32]" />
            <span>Unique Business Model</span>
          </button>

          <button
            onClick={() => setActiveSection('ai')}
            className={`px-3 py-2 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === 'ai'
                ? 'bg-[#24211D] text-white'
                : 'text-[#4A453E] hover:bg-[#EAE2D3]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#C85A32]" />
            <span>Next-Gen AI Features</span>
          </button>

          <button
            onClick={() => setActiveSection('revenue')}
            className={`px-3 py-2 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeSection === 'revenue'
                ? 'bg-[#24211D] text-white'
                : 'text-[#4A453E] hover:bg-[#EAE2D3]'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5 text-[#C85A32]" />
            <span>Revenue Model</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* SECTION: MASTER PROMPT */}
          {activeSection === 'prompt' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-editorial text-2xl font-semibold text-[#211E1C]">
                    The Complete AI Studio Master Prompt
                  </h3>
                  <p className="text-xs text-[#6B6155]">
                    Engineered for high-fidelity prompt generation in Google AI Studio or model system prompts.
                  </p>
                </div>

                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-[#C85A32] hover:bg-[#A43F1B] text-white text-xs font-semibold rounded-md flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Prompt Copied!' : 'Copy Master Prompt'}</span>
                </button>
              </div>

              <div className="relative">
                <pre className="p-4 sm:p-5 bg-[#211E1C] text-[#EDE5D8] rounded-lg text-xs leading-relaxed overflow-x-auto font-mono whitespace-pre-wrap max-h-[50vh] border border-stone-800">
                  {MASTER_PROMPT_TEXT}
                </pre>
              </div>

              <div className="p-4 bg-[#F5EFE6] border border-[#E3DAC9] rounded-lg flex items-center justify-between text-xs text-[#574F45]">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C85A32]" />
                  <span>Already running natively in this application! Try our AI Story Assistant in the Artisan Studio Hub.</span>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: PROBLEM STATEMENT */}
          {activeSection === 'problem' && (
            <div className="space-y-6">
              <h3 className="font-editorial text-2xl font-semibold text-[#211E1C]">
                The Deep Crisis in the Craft Economy
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-[#F5EFE6] border border-[#E3DAC9] rounded-lg space-y-2">
                  <span className="font-bold text-[#A43F1B] uppercase tracking-wider block">
                    1. The Dropshipping Contamination
                  </span>
                  <p className="text-[#4A453E] leading-relaxed">
                    Mass-market industrial manufacturers exploit legacy craft platforms by passing off molded resin as "hand-carved wood" and machine-loomed polyester as "hand-woven wool." Patrons are deceived, and genuine handcrafters are buried.
                  </p>
                </div>

                <div className="p-4 bg-[#F5EFE6] border border-[#E3DAC9] rounded-lg space-y-2">
                  <span className="font-bold text-[#A43F1B] uppercase tracking-wider block">
                    2. Chronic Living Wage Deficit
                  </span>
                  <p className="text-[#4A453E] leading-relaxed">
                    Over 82% of handmade creators under-price their labor, failing to account for clay preparation, kiln firing losses, and finish sanding. When platforms compete only on price, artisans are driven into poverty.
                  </p>
                </div>

                <div className="p-4 bg-[#F5EFE6] border border-[#E3DAC9] rounded-lg space-y-2">
                  <span className="font-bold text-[#A43F1B] uppercase tracking-wider block">
                    3. The Storytelling Deficit
                  </span>
                  <p className="text-[#4A453E] leading-relaxed">
                    A woodturner spends 12 hours on a black walnut bowl but lists it with 2 dry bullet points because writing poetic copy feels daunting. The customer never learns about the 90-year-old storm-salvaged tree or the organic food-safe oil dip.
                  </p>
                </div>

                <div className="p-4 bg-[#F5EFE6] border border-[#E3DAC9] rounded-lg space-y-2">
                  <span className="font-bold text-[#A43F1B] uppercase tracking-wider block">
                    4. Punitive Platform Take Rates
                  </span>
                  <p className="text-[#4A453E] leading-relaxed">
                    Between listing charges, 6.5% transaction cuts, mandatory 15% offsite advertising surcharges, and payment processing, dominant marketplaces siphon 25% to 40% of artisan revenue.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: BUSINESS MODEL */}
          {activeSection === 'model' && (
            <div className="space-y-6">
              <h3 className="font-editorial text-2xl font-semibold text-[#211E1C]">
                Unique Business Model: Provenance-as-a-Service & Micro-Guilds
              </h3>

              <div className="space-y-4 text-xs">
                <div className="p-4 bg-[#F5EFE6] border border-[#E3DAC9] rounded-lg space-y-1.5">
                  <span className="font-bold text-[#211E1C] uppercase tracking-wider block text-[11px]">
                    ✦ Radical Time & Provenance Transparency
                  </span>
                  <p className="text-[#574F45] leading-relaxed">
                    Instead of hiding costs, TerraLoom displays the exact hours spent at the wheel or loom, the origin of the raw clays and sheep fleeces, and the fair living wage earned. Patrons buy not just an object, but a piece of human life.
                  </p>
                </div>

                <div className="p-4 bg-[#F5EFE6] border border-[#E3DAC9] rounded-lg space-y-1.5">
                  <span className="font-bold text-[#211E1C] uppercase tracking-wider block text-[11px]">
                    ✦ Micro-Guild Material Cooperatives
                  </span>
                  <p className="text-[#574F45] leading-relaxed">
                    Artisans form regional buying guilds. TerraLoom negotiates direct bulk contracts with organic wool ranches, sustainable timber mills, and mining collectives, lowering raw material overhead by up to 35%.
                  </p>
                </div>

                <div className="p-4 bg-[#F5EFE6] border border-[#E3DAC9] rounded-lg space-y-1.5">
                  <span className="font-bold text-[#211E1C] uppercase tracking-wider block text-[11px]">
                    ✦ Digital Authenticity Touchmark
                  </span>
                  <p className="text-[#574F45] leading-relaxed">
                    Each creation receives an immutable digital touchmark card with maker signature, kiln batch number, and care ledger, elevating the piece from a transient craft to a collectible heirloom.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: NEXT-GEN AI */}
          {activeSection === 'ai' && (
            <div className="space-y-6">
              <h3 className="font-editorial text-2xl font-semibold text-[#211E1C]">
                Cutting-Edge AI Architectures Built for Handmade Craft
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-[#F5EFE6] border border-[#E3DAC9] rounded-lg space-y-2">
                  <span className="font-bold text-[#C85A32] uppercase tracking-wider block">
                    1. Multimodal Authenticity Verification
                  </span>
                  <p className="text-[#574F45] leading-relaxed">
                    Vision models analyze surface micro-textures (hand-pulled ceramic handles, organic lathe chatter, hand-tied fringe knots) to distinguish genuine handwork from uniform factory molds.
                  </p>
                </div>

                <div className="p-4 bg-[#F5EFE6] border border-[#E3DAC9] rounded-lg space-y-2">
                  <span className="font-bold text-[#C85A32] uppercase tracking-wider block">
                    2. Workbench Audio Storyteller
                  </span>
                  <p className="text-[#574F45] leading-relaxed">
                    Gemini transcribes the maker’s raw spoken rambles at the workbench and crafts museum-grade exhibition stories, care guides, and cultural heritage tags in seconds.
                  </p>
                </div>

                <div className="p-4 bg-[#F5EFE6] border border-[#E3DAC9] rounded-lg space-y-2">
                  <span className="font-bold text-[#C85A32] uppercase tracking-wider block">
                    3. Dynamic Living Wage Pricing Engine
                  </span>
                  <p className="text-[#574F45] leading-relaxed">
                    Computes honest retail pricing based on local cost-of-living indices, studio firing overhead, material expenses, and craft hours, protecting artisans from price erosion.
                  </p>
                </div>

                <div className="p-4 bg-[#F5EFE6] border border-[#E3DAC9] rounded-lg space-y-2">
                  <span className="font-bold text-[#C85A32] uppercase tracking-wider block">
                    4. Bespoke Commission Co-Pilot
                  </span>
                  <p className="text-[#574F45] leading-relaxed">
                    Translates patron wishlists into precise technical specifications, identifies potential clay firing shrinkage, and clarifies dimensions before production begins.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION: REVENUE MODEL */}
          {activeSection === 'revenue' && (
            <div className="space-y-6">
              <h3 className="font-editorial text-2xl font-semibold text-[#211E1C]">
                Sustainable, Multi-Stream Revenue Model
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-[#F5EFE6] border border-[#E3DAC9] rounded-lg space-y-2">
                  <span className="font-bold text-[#211E1C] uppercase tracking-wider block">
                    Stream 1: Fair 7% Platform Fee
                  </span>
                  <p className="text-[#574F45] leading-relaxed">
                    A flat, predictable 7% commission on completed retail orders. 93% goes directly to the creator, earning deep artisan loyalty and industry-leading retention.
                  </p>
                </div>

                <div className="p-4 bg-[#F5EFE6] border border-[#E3DAC9] rounded-lg space-y-2">
                  <span className="font-bold text-[#211E1C] uppercase tracking-wider block">
                    Stream 2: Atelier Pro Studio SaaS ($19/mo)
                  </span>
                  <p className="text-[#574F45] leading-relaxed">
                    Comprehensive back-office toolkit: AI story & provenance generator, discounted shipping label printing, inventory synchronization, and digital authenticity seals.
                  </p>
                </div>

                <div className="p-4 bg-[#F5EFE6] border border-[#E3DAC9] rounded-lg space-y-2">
                  <span className="font-bold text-[#211E1C] uppercase tracking-wider block">
                    Stream 3: B2B Corporate Bespoke Gifting
                  </span>
                  <p className="text-[#574F45] leading-relaxed">
                    15% fee on large corporate orders (100–500 units) from architecture firms, luxury hotels, and tech companies seeking personalized, eco-conscious client gifts.
                  </p>
                </div>

                <div className="p-4 bg-[#F5EFE6] border border-[#E3DAC9] rounded-lg space-y-2">
                  <span className="font-bold text-[#211E1C] uppercase tracking-wider block">
                    Stream 4: Patron Heritage Guild Pass ($10/mo)
                  </span>
                  <p className="text-[#574F45] leading-relaxed">
                    Patrons get priority access to rare one-of-a-kind kiln drops, virtual studio visits, and a portion directly funds traditional craft apprenticeships.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#F5EFE6] border-t border-[#E8E1D5] flex items-center justify-between">
          <span className="text-xs text-[#7A5C4D]">
            TerraLoom Architecture Manifesto · Ready for Deployment
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#24211D] hover:bg-[#C85A32] text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
