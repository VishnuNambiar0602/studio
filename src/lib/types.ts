export type Part = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  inStock: boolean;
  vendorAddress: string;
  isVisibleForSale?: boolean;
  category: 'new' | 'used' | 'oem';
};

export type FontSize = 'sm' | 'md' | 'lg';
export type Language = 'en' | 'ar';
