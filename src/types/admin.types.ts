import { SareeCategory } from './product.types';

export interface ProductFormData {
  sku: string;
  name: string;
  category: Exclude<SareeCategory, 'All'>;
  provenance?: string;
  lot_id?: string | null;
  price: number;
  originalPrice: number;
  fabric?: string;
  zariType?: string;
  blouseDetails?: string;
  stockCount: number;
  isDealerUnique: boolean;
  isSilkMarkCertified: boolean;
  isFeaturedShowstopper: boolean;
  isPublished: boolean;
  images: string[];
  description: string;
  color?: string;
}

export interface DealerLotFormData {
  lot_code: string;
  dealer_name: string;
  origin_hub: string;
  arrival_date: string;
  total_pieces: number;
  notes?: string;
}

export interface InventoryMetrics {
  totalProducts: number;
  inStockPieces: number;
  soldOutPieces: number;
  featuredShowstoppers: number;
  totalInventoryValue: number;
  totalDealerLots: number;
}
