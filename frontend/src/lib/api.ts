import axios from 'axios';
import { Category, Product } from '@/types';
import productsData from './data/products.json';

// Mock Data
const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Aksesoris Elektronik', slug: 'aksesoris-elektronik', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), _count: { products: 5 } },
  { id: '2', name: 'Fresh Food', slug: 'fresh-food', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), _count: { products: 8 } },
  { id: '3', name: 'Ice Cream', slug: 'ice-cream', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), _count: { products: 4 } },
  { id: '4', name: 'Kebutuhan Dapur', slug: 'kebutuhan-dapur', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), _count: { products: 10 } },
  { id: '5', name: 'Mie & Makanan Instan', slug: 'mie-makanan-instan', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), _count: { products: 15 } },
  { id: '6', name: 'Minuman', slug: 'minuman', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), _count: { products: 12 } },
  { id: '7', name: 'Snack', slug: 'snack', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), _count: { products: 20 } },
];

const parsedProducts = productsData as any[];

const MOCK_PRODUCTS: Product[] = parsedProducts.map((p, idx) => {
  const categoryId = MOCK_CATEGORIES.findIndex(c => c.slug === p.categorySlug) + 1;
  const category = MOCK_CATEGORIES.find(c => c.slug === p.categorySlug) || MOCK_CATEGORIES[0];
  return {
    id: `p${idx + 1}`,
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    stock: p.stock,
    images: p.images,
    isActive: p.isActive,
    categoryId: categoryId.toString(),
    category: category,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
});

let MOCK_CART_ITEMS: any[] = [];

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Auth API Mock
export const authApi = {
  register: async (data: any) => {
    await delay(500);
    return { data: { message: 'Success', user: { id: 'u1', name: data.name, email: data.email, role: 'USER' as const, createdAt: new Date().toISOString() }, accessToken: 'mock-jwt-token' } };
  },
  login: async (data: any) => {
    await delay(500);
    return { data: { message: 'Success', user: { id: 'u1', name: 'Demo User', email: data.email, role: 'USER' as const, createdAt: new Date().toISOString() }, accessToken: 'mock-jwt-token' } };
  },
  getProfile: async () => {
    await delay(300);
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) throw new Error('Unauthorized');
    return { data: { id: 'u1', name: 'Demo User', email: 'demo@example.com', role: 'USER' as const, createdAt: new Date().toISOString() } };
  },
};

// Categories API Mock
export const categoriesApi = {
  getAll: async (includeInactive = false) => {
    await delay(300);
    return { data: MOCK_CATEGORIES };
  },
  getOne: async (slug: string) => {
    await delay(200);
    return { data: MOCK_CATEGORIES.find(c => c.slug === slug) };
  },
  create: async (data: any) => ({ data: { id: Date.now().toString(), ...data } }),
  update: async (id: string, data: any) => ({ data: { id, ...data } }),
  delete: async (id: string) => ({ data: { success: true } }),
};

// Products API Mock
export const productsApi = {
  getAll: async (params?: any) => {
    await delay(400);
    let filtered = [...MOCK_PRODUCTS];
    if (params?.categoryId) filtered = filtered.filter(p => p.categoryId === params.categoryId);
    if (params?.search) filtered = filtered.filter(p => p.name.toLowerCase().includes(params.search.toLowerCase()));
    return { data: { products: filtered, pagination: { page: 1, limit: 12, total: filtered.length, totalPages: 1 } } };
  },
  getAllAdmin: async (params?: any) => await productsApi.getAll(params),
  getFeatured: async (limit = 12) => {
    await delay(300);
    // Curate visually pleasing and cohesive products for the homepage
    const curatedSlugs = [
      'aice-chocolate-crispy-60gr',
      'aice-mochi-chocolate-45ml',
      'aice-strawberry-crispy',
      'abc-kcp-mns-275ml',
      'belfoods-chicken-nugget-crunchy',
      'bango-kecap-manis-400-ml',
      'abc-sardines-bumbu-serundeng-400gr',
      'aice-durian-cup'
    ];
    let featured = MOCK_PRODUCTS.filter(p => curatedSlugs.includes(p.slug));

    // Fill up the rest with other items if needed, avoiding visually cluttered ones like batteries if possible
    if (featured.length < limit) {
      const others = MOCK_PRODUCTS.filter(p => !curatedSlugs.includes(p.slug) && p.categorySlug !== 'aksesoris-elektronik');
      featured = [...featured, ...others.slice(0, limit - featured.length)];
    }

    return { data: featured.slice(0, limit) };
  },
  getOne: async (slug: string) => {
    await delay(200);
    const product = MOCK_PRODUCTS.find(p => p.slug === slug);
    if (!product) throw new Error('Not found');
    return { data: product };
  },
  getById: async (id: string) => {
    await delay(200);
    const product = MOCK_PRODUCTS.find(p => p.id === id);
    if (!product) throw new Error('Not found');
    return { data: product };
  },
  getRelated: async (id: string, limit = 4) => {
    await delay(200);
    return { data: MOCK_PRODUCTS.filter(p => p.id !== id).slice(0, limit) };
  },
  create: async (data: any) => ({ data: { id: Date.now().toString(), ...data } }),
  update: async (id: string, data: any) => ({ data: { id, ...data } }),
  delete: async (id: string) => ({ data: { success: true } }),
};

// Cart API Mock
export const cartApi = {
  get: async () => {
    await delay(200);
    return { data: { id: 'c1', userId: 'u1', items: MOCK_CART_ITEMS, totalItems: MOCK_CART_ITEMS.reduce((sum, item) => sum + item.quantity, 0), totalAmount: MOCK_CART_ITEMS.reduce((sum, item) => sum + (item.product.price * item.quantity), 0), createdAt: new Date().toISOString() } };
  },
  getCount: async () => {
    await delay(100);
    return { data: { count: MOCK_CART_ITEMS.reduce((sum, item) => sum + item.quantity, 0) } };
  },
  addItem: async (data: { productId: string; quantity: number }) => {
    await delay(300);
    const product = MOCK_PRODUCTS.find(p => p.id === data.productId);
    if (!product) throw new Error('Product not found');
    const existing = MOCK_CART_ITEMS.find(i => i.productId === data.productId);
    if (existing) {
      existing.quantity += data.quantity;
    } else {
      MOCK_CART_ITEMS.push({ id: Date.now().toString(), productId: data.productId, quantity: data.quantity, product });
    }
    return { data: MOCK_CART_ITEMS };
  },
  updateItem: async (itemId: string, data: { quantity: number }) => {
    await delay(200);
    const item = MOCK_CART_ITEMS.find(i => i.id === itemId);
    if (item) item.quantity = data.quantity;
    return { data: item };
  },
  removeItem: async (itemId: string) => {
    await delay(200);
    MOCK_CART_ITEMS = MOCK_CART_ITEMS.filter(i => i.id !== itemId);
    return { data: { success: true } };
  },
  clear: async () => {
    await delay(300);
    MOCK_CART_ITEMS = [];
    return { data: { success: true } };
  },
};

// Orders API Mock
export const ordersApi = {
  create: async (data: any) => { await delay(500); return { data: { id: 'o1', orderNumber: 'ORD-123', status: 'PENDING' } }; },
  getAll: async (params?: any) => ({ data: { orders: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 1 } } }),
  getOne: async (id: string) => ({ data: { id, orderNumber: 'ORD-123', status: 'PENDING' as const, totalAmount: 0, shippingAddress: '', shippingCost: 0, paymentMethod: 'COD' as const, userId: 'u1', items: [], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() } }),
  getAllAdmin: async (params?: any) => ({ data: { orders: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 1 } } }),
  getOneAdmin: async (id: string) => ({ data: { id, orderNumber: 'ORD-123', items: [] } }),
  updateStatus: async (id: string, status: string) => ({ data: { id, status } }),
  getStats: async () => ({ data: { totalOrders: 0, pendingOrders: 0, processingOrders: 0, completedOrders: 0, cancelledOrders: 0, totalRevenue: 0 } }),
};

// Users API Mock
export const usersApi = {
  updateProfile: async (data: any) => ({ data }),
  changePassword: async (data: any) => ({ data: { success: true } }),
  getAll: async (params?: any) => ({ data: { users: [], pagination: { page: 1, limit: 10, total: 0, totalPages: 1 } } }),
  getOne: async (id: string) => ({ data: { id, name: 'Demo User', email: 'demo@example.com', role: 'USER' as const, createdAt: new Date().toISOString() } }),
  updateRole: async (id: string, role: string) => ({ data: { id, role } }),
  getStats: async () => ({ data: { totalUsers: 1, totalAdmins: 0, newUsersThisMonth: 0 } }),
};

export default {
  ...authApi,
  ...categoriesApi,
  ...productsApi,
  ...cartApi,
  ...ordersApi,
  ...usersApi
};
