export interface MenuItem {
  id: string;
  vendorId?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  subCategory: string;
  isVeg: boolean;
  rating?: number;
  spicyLevel?: number; // 0: None, 1: Mild, 2: Medium, 3: Hot
  popular?: boolean;
  image?: string;
  isAvailable?: boolean;
}

export interface Category {
  id: string;
  vendorId?: string;
  name: string;
  icon?: string;
  subCategories: string[];
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export type PaymentMethod = 'upi' | 'cash' | 'card';

export interface OrderDetails {
  orderId: string;
  vendorId?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: PaymentMethod;
  customerName?: string;
  tableOrTokenNo?: string;
  timestamp: Date;
}
