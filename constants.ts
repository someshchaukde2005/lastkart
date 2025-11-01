import { Product, User, SalesData, CategoryData, TopRetailer, Role } from './types';

export const MOCK_USERS: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@lastkart.com', role: 'admin' },
  { id: 2, name: 'Alice Buyer', email: 'alice@buyer.com', role: 'buyer' },
  { id: 3, name: 'Bob Retailer', email: 'bob@retailer.com', role: 'retailer', lat: 34.0522, lon: -118.2437 }, // Los Angeles
  { id: 4, name: 'FreshMart', email: 'contact@freshmart.com', role: 'retailer', lat: 40.7128, lon: -74.0060 }, // New York
  { id: 5, name: 'Charlie Consumer', email: 'charlie@consumer.com', role: 'buyer' },
];

const today = new Date();
const getDateInFuture = (days: number) => {
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + days);
  return futureDate.toISOString().split('T')[0];
};

const RAW_MOCK_PRODUCTS: Omit<Product, 'lat' | 'lon'>[] = [
  {
    id: 1,
    name: 'Organic Milk (1L)',
    description: 'Fresh organic whole milk from grass-fed cows. Perfect for your morning cereal or coffee.',
    imageUrl: 'https://picsum.photos/seed/milk/400/300',
    originalPrice: 4.50,
    discountedPrice: 2.25,
    expiryDate: getDateInFuture(3),
    category: 'Dairy',
    retailerId: 3,
    stock: 20,
  },
  {
    id: 2,
    name: 'Artisan Sourdough Bread',
    description: 'A crusty loaf of naturally leavened sourdough bread, baked fresh daily.',
    imageUrl: 'https://picsum.photos/seed/bread/400/300',
    originalPrice: 6.00,
    discountedPrice: 3.00,
    expiryDate: getDateInFuture(2),
    category: 'Bakery',
    retailerId: 3,
    stock: 15,
  },
  {
    id: 3,
    name: 'Ready-to-Eat Salad Bowl',
    description: 'A healthy and convenient salad bowl with mixed greens, grilled chicken, and vinaigrette.',
    imageUrl: 'https://picsum.photos/seed/salad/400/300',
    originalPrice: 8.99,
    discountedPrice: 4.49,
    expiryDate: getDateInFuture(1),
    category: 'Prepared Meals',
    retailerId: 4,
    stock: 30,
  },
  {
    id: 4,
    name: 'Greek Yogurt (500g)',
    description: 'Thick and creamy Greek yogurt, high in protein. Great with fruits and honey.',
    imageUrl: 'https://picsum.photos/seed/yogurt/400/300',
    originalPrice: 5.20,
    discountedPrice: 3.90,
    expiryDate: getDateInFuture(7),
    category: 'Dairy',
    retailerId: 4,
    stock: 50,
  },
   {
    id: 5,
    name: 'Fresh Orange Juice (1.5L)',
    description: 'Not from concentrate. Pure, refreshing orange juice packed with Vitamin C.',
    imageUrl: 'https://picsum.photos/seed/juice/400/300',
    originalPrice: 5.50,
    discountedPrice: 2.75,
    expiryDate: getDateInFuture(5),
    category: 'Beverages',
    retailerId: 3,
    stock: 25,
  },
  {
    id: 6,
    name: 'Gourmet Cheese Selection',
    description: 'A fine selection of cheddar, brie, and blue cheese. Perfect for any cheese board.',
    imageUrl: 'https://picsum.photos/seed/cheese/400/300',
    originalPrice: 15.00,
    discountedPrice: 9.00,
    expiryDate: getDateInFuture(10),
    category: 'Dairy',
    retailerId: 4,
    stock: 10,
  },
];

// Enrich products with retailer location
export const MOCK_PRODUCTS: Product[] = RAW_MOCK_PRODUCTS.map(product => {
    const retailer = MOCK_USERS.find(u => u.id === product.retailerId);
    return {
        ...product,
        lat: retailer?.lat,
        lon: retailer?.lon,
    };
});


export const MOCK_SALES_DATA: SalesData[] = [
    { month: 'Jan', sales: 4000 },
    { month: 'Feb', sales: 3000 },
    { month: 'Mar', sales: 5000 },
    { month: 'Apr', sales: 4500 },
    { month: 'May', sales: 6000 },
    { month: 'Jun', sales: 5500 },
];

export const MOCK_CATEGORY_DATA: CategoryData[] = [
    { name: 'Dairy', value: 400 },
    { name: 'Bakery', value: 300 },
    { name: 'Prepared Meals', value: 250 },
    { name: 'Beverages', value: 150 },
];

export const MOCK_TOP_RETAILERS: TopRetailer[] = [
    { name: 'Bob Retailer', sales: 12500 },
    { name: 'FreshMart', sales: 18700 },
];