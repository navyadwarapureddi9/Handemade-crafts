export type CraftCategory = 
  | 'all'
  | 'pottery'
  | 'textiles'
  | 'jewelry'
  | 'woodcraft'
  | 'homedecor'
  | 'paintings'
  | 'custom';

export interface Artisan {
  id: string;
  name: string;
  studioName: string;
  location: string;
  avatar: string;
  heritageYears: number;
  specialty: string;
  bio: string;
  techniqueTradition: string;
  sustainablePledge: string;
}

export interface CraftProduct {
  id: string;
  title: string;
  price: number;
  category: CraftCategory;
  artisanId: string;
  artisan: Artisan;
  images: string[];
  materials: string;
  craftHours: number;
  story: string;
  provenance: string;
  careGuide: string;
  dimensions?: string;
  inventoryCount: number;
  isCustomizable: boolean;
  customizationOptions?: {
    label: string;
    choices: string[];
  }[];
  customTextPrompt?: string;
  rating: number;
  reviewCount: number;
  techniqueTags: string[];
  ethicalCertifications: string[];
  isFeatured?: boolean;
}

export interface CartItem {
  product: CraftProduct;
  quantity: number;
  selectedCustomizations?: Record<string, string>;
  customMessage?: string;
}

export type OrderStatus = 
  | 'order_placed'
  | 'materials_prepped'
  | 'in_kiln_loom'
  | 'quality_hallmarked'
  | 'eco_shipped'
  | 'delivered';

export interface ArtisanOrder {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  customerEmail: string;
  productTitle: string;
  productImage: string;
  price: number;
  status: OrderStatus;
  estimatedCompletion: string;
  customNote?: string;
  artisanNotes?: string;
  shippingAddress: string;
  isCustomCommission?: boolean;
}

export interface CustomCommissionRequest {
  id: string;
  customerName: string;
  customerEmail: string;
  category: string;
  artisanId?: string;
  description: string;
  budget: number;
  desiredTimeline: string;
  materialPreferences: string;
  status: 'pending_review' | 'artisan_accepted' | 'in_progress' | 'completed';
  createdAt: string;
  aiFeasibility?: {
    suggestedMaterials: string[];
    estimatedLeadWeeks: string;
    artisanQuestions: string[];
    artisanFeasibilityNotes: string;
  };
}
