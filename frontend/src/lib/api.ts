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

let MOCK_PRODUCTS: Product[] = parsedProducts.map((p, idx) => {
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
let MOCK_ORDERS: any[] = []; // Menambahkan in-memory state untuk orders

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
    const normalizedEmail = data.email?.trim().toLowerCase();
    
    if (normalizedEmail === 'admin@22mart.id') {
      if (data.password === 'admin') {
        return { data: { message: 'Success', user: { id: 'admin1', name: 'Admin Toko', email: data.email, role: 'ADMIN' as const, createdAt: new Date().toISOString() }, accessToken: 'mock-admin-token' } };
      } else {
        throw { response: { data: { message: 'Password untuk Admin salah!' } } };
      }
    }
    
    return { data: { message: 'Success', user: { id: 'u1', name: 'Demo User', email: data.email, role: 'USER' as const, createdAt: new Date().toISOString() }, accessToken: 'mock-jwt-token' } };
  },
  getProfile: async () => {
    await delay(300);
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (!token) throw new Error('Unauthorized');
    if (token === 'mock-admin-token') {
      return { data: { id: 'admin1', name: 'Admin Toko', email: 'admin@22mart.id', role: 'ADMIN' as const, createdAt: new Date().toISOString() } };
    }
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
      const others = MOCK_PRODUCTS.filter(p => !curatedSlugs.includes(p.slug) && p.category.slug !== 'aksesoris-elektronik');
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
  create: async (data: any) => {
    await delay(300);
    const newProduct = {
      ...data,
      id: `p${MOCK_PRODUCTS.length + 1}`,
      slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      category: MOCK_CATEGORIES.find(c => c.id === data.categoryId) || MOCK_CATEGORIES[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    MOCK_PRODUCTS.unshift(newProduct);
    return { data: newProduct };
  },
  update: async (id: string, data: any) => {
    await delay(300);
    const idx = MOCK_PRODUCTS.findIndex(p => p.id === id);
    if (idx !== -1) {
      MOCK_PRODUCTS[idx] = { ...MOCK_PRODUCTS[idx], ...data, updatedAt: new Date().toISOString() };
      return { data: MOCK_PRODUCTS[idx] };
    }
    throw new Error('Product not found');
  },
  delete: async (id: string) => {
    await delay(200);
    MOCK_PRODUCTS = MOCK_PRODUCTS.filter(p => p.id !== id);
    return { data: { success: true } };
  },
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
  create: async (data: any) => { 
    await delay(500); 
    const newOrder = { 
      ...data,
      id: `o${MOCK_ORDERS.length + 1}`, 
      orderNumber: `ORD-${Math.floor(Math.random() * 10000)}`, 
      status: 'PENDING',
      user: { id: 'u1', name: 'Demo User', email: 'demo@example.com', phone: '08123456789' },
      createdAt: new Date().toISOString(), 
      updatedAt: new Date().toISOString() 
    };
    MOCK_ORDERS.unshift(newOrder);
    return { data: newOrder }; 
  },
  getAll: async (params?: any) => {
    await delay(300);
    const userOrders = MOCK_ORDERS.filter(o => o.userId === 'u1' || !o.userId);
    return { data: { orders: userOrders, pagination: { page: 1, limit: 10, total: userOrders.length, totalPages: 1 } } };
  },
  getOne: async (id: string) => {
    await delay(200);
    const order = MOCK_ORDERS.find(o => o.id === id);
    if (!order) throw new Error('Order not found');
    return { data: order };
  },
  getAllAdmin: async (params?: any) => {
    await delay(300);
    let filtered = [...MOCK_ORDERS];
    if (params?.status) filtered = filtered.filter(o => o.status === params.status);
    if (params?.search) filtered = filtered.filter(o => o.orderNumber.includes(params.search));
    return { data: { orders: filtered, pagination: { page: 1, limit: 10, total: filtered.length, totalPages: 1 } } };
  },
  getOneAdmin: async (id: string) => {
    await delay(200);
    const order = MOCK_ORDERS.find(o => o.id === id);
    if (!order) throw new Error('Order not found');
    return { data: order };
  },
  updateStatus: async (id: string, status: string) => {
    await delay(300);
    const order = MOCK_ORDERS.find(o => o.id === id);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      return { data: order };
    }
    throw new Error('Order not found');
  },
  uploadPaymentProof: async (id: string, formData: FormData) => {
    await delay(500);
    const order = MOCK_ORDERS.find(o => o.id === id);
    if (order) {
      // Simulate file upload by setting a mock URL
      order.paymentProofImage = URL.createObjectURL(formData.get('file') as Blob) || '/images/bca-mock.jpg';
      order.updatedAt = new Date().toISOString();
      return { data: order };
    }
    throw new Error('Order not found');
  },
  getStats: async () => {
    await delay(300);
    return { 
      data: { 
        totalOrders: MOCK_ORDERS.length, 
        pendingOrders: MOCK_ORDERS.filter(o => o.status === 'PENDING').length, 
        processingOrders: MOCK_ORDERS.filter(o => o.status === 'PROCESSING').length, 
        completedOrders: MOCK_ORDERS.filter(o => o.status === 'DELIVERED').length, 
        cancelledOrders: MOCK_ORDERS.filter(o => o.status === 'CANCELLED').length, 
        totalRevenue: MOCK_ORDERS.filter(o => o.status === 'DELIVERED').reduce((acc, o) => acc + o.totalAmount, 0) 
      } 
    };
  },
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
