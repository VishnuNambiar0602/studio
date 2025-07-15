export type Part = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  inStock: boolean;
  vendorAddress: string;
  isVisibleForSale?: boolean;
};
