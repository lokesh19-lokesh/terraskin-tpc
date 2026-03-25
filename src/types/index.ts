export interface Product {
  id: string;
  name: string;
  description: string;
  fullDescription: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  skinType: string[];
  ingredients: string[];
  benefits: string[];
  isBestSeller: boolean;
  isNew: boolean;
  rating: number;
  reviews: number;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Testimonial {
  id: string;
  name: string;
  image: string;
  rating: number;
  comment: string;
  product: string;
}

export interface FilterState {
  category: string;
  priceRange: [number, number];
  skinType: string;
  bestSellers: boolean;
}