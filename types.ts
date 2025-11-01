export type Role = 'buyer' | 'retailer' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
  lat?: number;
  lon?: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  originalPrice: number;
  discountedPrice: number;
  expiryDate: string; // ISO string format
  category: string;
  retailerId: number;
  stock: number;
  lat?: number;
  lon?: number;
  distance?: number; // in km
}

export interface CartItem extends Product {
  quantity: number;
}

export enum View {
  HOME,
  LOGIN,
  PRODUCT_DETAIL,
  CART,
  RETAILER_DASHBOARD,
  ADMIN_DASHBOARD,
}

export interface SalesData {
    month: string;
    sales: number;
}

export interface CategoryData {
    name: string;
    value: number;
}

export interface TopRetailer {
    name: string;
    sales: number;
}

export type NotificationType = 'info' | 'warning' | 'error' | 'success';

export interface Notification {
    id: number;
    message: string;
    type: NotificationType;
    read: boolean;
}
