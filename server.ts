import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize GoogleGenAI client
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// POST /api/generate-story
// Turns raw artisan notes into a poetic craft story, provenance narrative, and care guide
app.post('/api/generate-story', async (req, res) => {
  const { title, craftType, materials, hoursSpent, artisanNotes, regionalOrigin } = req.body;

  if (!ai) {
    // Intelligent artisanal fallback when no API key is provided
    return res.json({
      story: `Handcrafted with quiet patience in ${regionalOrigin || 'a sunlit studio'}, this piece embodies the timeless balance between organic ${materials || 'natural materials'} and human intention. Over ${hoursSpent || 6} deliberate hours of shaping, refining, and finishing, the artisan allowed the natural variations of the grain and texture to shine through, ensuring no two pieces will ever be identical.`,
      provenance: `Raw materials sustainably harvested and sourced through ethical artisan partnerships. Every batch is minimally treated to honor the raw integrity of the earth.`,
      careInstructions: `Gently dust with a soft, dry cloth. Avoid prolonged exposure to harsh sunlight or moisture. Condition naturally once a year with organic beeswax or mineral oil to preserve the luster.`,
      tags: ['Handcrafted', craftType || 'Artisan Craft', 'Slow Living', 'Heirloom Quality', 'Sustainable Origin'],
    });
  }

  try {
    const prompt = `You are a museum curator and poetic artisan storyteller for "TerraLoom", a luxury marketplace celebrating authentic handmade crafts.
Write an authentic, evocative product description, material provenance story, care instructions, and 5 search tags for a handmade product with these details:
- Title: ${title || 'Handmade Craft Piece'}
- Discipline/Craft Type: ${craftType || 'Pottery & Ceramics'}
- Materials: ${materials || 'Local stoneware, organic glazes'}
- Hours spent crafting: ${hoursSpent || '4 hours'}
- Regional Origin / Studio: ${regionalOrigin || 'Pacific Northwest, USA'}
- Artisan's Raw Notes: "${artisanNotes || 'Wheel thrown, wood ash glaze fired over 2 days'}"

Respond ONLY with valid JSON in this exact structure without markdown backticks:
{
  "story": "A rich 2-3 paragraph poetic yet honest narrative describing the tactile feel, process, and soul of the piece.",
  "provenance": "1-2 sentences on material sourcing, sustainable origins, and connection to cultural craft traditions.",
  "careInstructions": "Clear, gentle care instructions for longevity.",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating story with Gemini:', error);
    // Graceful fallback
    return res.json({
      story: `Handmade with reverence for traditional craftsmanship in ${regionalOrigin || 'the maker’s studio'}. Each curve and surface reflects ${hoursSpent || 5} hours of tactile dedication using ${materials || 'organic natural elements'}.`,
      provenance: `Traceable local materials honoring sustainable small-batch studio practices.`,
      careInstructions: `Handle with love. Clean with lukewarm water and a soft cloth; avoid abrasive cleansers.`,
      tags: ['Artisan Crafted', craftType || 'Handmade', 'Natural Materials', 'Heirloom'],
    });
  }
});

// POST /api/fair-price-advisor
// Advises on fair artisan compensation to prevent under-pricing
app.post('/api/fair-price-advisor', async (req, res) => {
  const { materialCost, hoursSpent, hourlyWage, overheadPercent, craftCategory } = req.body;

  const matCost = parseFloat(materialCost) || 25;
  const hours = parseFloat(hoursSpent) || 4;
  const wage = parseFloat(hourlyWage) || 35;
  const overhead = parseFloat(overheadPercent) || 15;

  const laborCost = hours * wage;
  const baseCost = matCost + laborCost;
  const studioOverhead = baseCost * (overhead / 100);
  const wholesaleMinimum = baseCost + studioOverhead;
  const fairRetail = Math.round(wholesaleMinimum * 1.85);
  const premiumRetail = Math.round(wholesaleMinimum * 2.2);

  if (!ai) {
    return res.json({
      fairRetail,
      wholesaleMinimum: Math.round(wholesaleMinimum),
      laborCost,
      breakdownAdvice: `For ${craftCategory || 'handmade craft'} requiring ${hours} hours, this ensures an ethical living wage of $${wage}/hr and covers studio overhead. Never compete with mass-market factory goods on price; your competitive moat is the human signature.`,
    });
  }

  try {
    const prompt = `As an artisan economics and fair-trade pricing advisor, provide a 2-sentence rationale for a handmade item priced at $${fairRetail} (taking ${hours} hours, $${matCost} in raw materials, in category ${craftCategory}). Explain why valuing artisan labor protects craft heritage. Return pure JSON: { "fairRetail": ${fairRetail}, "wholesaleMinimum": ${Math.round(wholesaleMinimum)}, "laborCost": ${laborCost}, "breakdownAdvice": "your 2-sentence rationale" }`;
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });
    return res.json(JSON.parse(response.text || '{}'));
  } catch (err) {
    return res.json({
      fairRetail,
      wholesaleMinimum: Math.round(wholesaleMinimum),
      laborCost,
      breakdownAdvice: `Priced to ensure a fair living wage of $${wage}/hr for ${hours} hours of skilled manual work.`,
    });
  }
});

// POST /api/custom-commission-consult
// Generates custom commission specification and feasibility for patron requests
app.post('/api/custom-commission-consult', async (req, res) => {
  const { category, description, budget, desiredTimeline } = req.body;

  if (!ai) {
    return res.json({
      suggestedMaterials: ['Stoneware or porcelain', 'Natural unrefined linseed finish', 'Recycled brass hardware'],
      estimatedLeadWeeks: '3 to 5 weeks',
      artisanQuestions: [
        'Do you have specific dimensional constraints or intended display settings?',
        'Would you like subtle hand-stamped initials or maker touchmarks?',
        'Do you prefer matte tactile finish or satin protective glaze?'
      ],
      artisanFeasibilityNotes: 'This project aligns naturally with small-batch studio timelines. Handcrafting allows for bespoke adjustments.',
    });
  }

  try {
    const prompt = `A patron wants to commission a bespoke handmade craft:
Category: ${category}
Vision Description: "${description}"
Budget: $${budget}
Desired Timeline: ${desiredTimeline}

As an experienced master artisan consultant, analyze the feasibility, suggest ideal materials, realistic lead time, 3 clarifying questions the artisan should ask the patron, and an artisan encouragement note. Return JSON in format:
{
  "suggestedMaterials": ["material 1", "material 2"],
  "estimatedLeadWeeks": "X to Y weeks",
  "artisanQuestions": ["question 1", "question 2", "question 3"],
  "artisanFeasibilityNotes": "1-2 sentences on feasibility and craft execution."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });
    return res.json(JSON.parse(response.text || '{}'));
  } catch (error) {
    return res.json({
      suggestedMaterials: ['Sustainably harvested hardwoods', 'Vegetable-tanned leather', 'High-fire clay'],
      estimatedLeadWeeks: '4 weeks',
      artisanQuestions: ['What are the exact dimensions?', 'What color palette complements your home?'],
      artisanFeasibilityNotes: 'Feasible and well-suited for a dedicated custom commission.',
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TerraLoom server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
