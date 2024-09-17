export interface ProductFormData {
    id: number;
    name: string;
    description: string;
    price: number;
    isInStore: boolean;
    sku: string;
    category: string;
    stockQuantity: number;
    createdDate: string;
    updatedDate: string;
    // imageUrl: string;
    weight: number;
    dimensions: string;
    manufacturer: string;
    rating: number;
    isFeatured: boolean;
  }