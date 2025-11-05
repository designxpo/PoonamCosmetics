export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  stock: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  brand?: {
    _id: string;
    name: string;
    slug: string;
    logo: string;
  };
  images: string[];
  stock: number;
  featured: boolean;
  pdpFeatures?: {
    showColorSelector?: boolean;
    availableColors?: string[];
    showSizeSelector?: boolean;
    availableSizes?: string[];
    showReviews?: boolean;
    showSocialShare?: boolean;
    showAdditionalInfo?: boolean;
    customFeatures?: {
      label: string;
      value: string;
    }[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  _id: string;
  whatsappNumber: string;
  deliveryCharge: number;
  freeDeliveryThreshold: number;
  banners: {
    image: string;
    title?: string;
    subtitle?: string;
    link?: string;
  }[];
}
