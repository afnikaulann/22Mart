import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        // Redirect to login if not already there
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; name: string; phone?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

// Categories API
export const categoriesApi = {
  getAll: (includeInactive = false) =>
    api.get(`/categories${includeInactive ? '?includeInactive=true' : ''}`),
  getOne: (slug: string) => api.get(`/categories/${slug}`),
  create: (data: { name: string; description?: string; icon?: string; image?: string }) =>
    api.post('/categories', data),
  update: (id: string, data: { name?: string; description?: string; icon?: string; image?: string; isActive?: boolean }) =>
    api.patch(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// Products API
export const productsApi = {
  getAll: (params?: {
    search?: string;
    categoryId?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
    minPrice?: number;
    maxPrice?: number;
  }) => api.get('/products', { params }),
  getAllAdmin: (params?: { search?: string; categoryId?: string; page?: number; limit?: number }) =>
    api.get('/products/admin', { params }),
  getFeatured: (limit = 8) => api.get(`/products/featured?limit=${limit}`),
  getOne: (slug: string) => api.get(`/products/${slug}`),
  getRelated: (id: string, limit = 4) => api.get(`/products/${id}/related?limit=${limit}`),
  create: (data: {
    name: string;
    description?: string;
    price: number;
    stock: number;
    images?: string[];
    categoryId: string;
  }) => api.post('/products', data),
  update: (
    id: string,
    data: {
      name?: string;
      description?: string;
      price?: number;
      stock?: number;
      images?: string[];
      categoryId?: string;
      isActive?: boolean;
    }
  ) => api.patch(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// Cart API
export const cartApi = {
  get: () => api.get('/cart'),
  getCount: () => api.get('/cart/count'),
  addItem: (data: { productId: string; quantity: number }) =>
    api.post('/cart/items', data),
  updateItem: (itemId: string, data: { quantity: number }) =>
    api.patch(`/cart/items/${itemId}`, data),
  removeItem: (itemId: string) => api.delete(`/cart/items/${itemId}`),
  clear: () => api.delete('/cart'),
};

// Orders API
export const ordersApi = {
  create: (data: { shippingAddress: string; paymentMethod: string; notes?: string }) =>
    api.post('/orders', data),
  getAll: (params?: { page?: number; limit?: number }) =>
    api.get('/orders', { params }),
  getOne: (id: string) => api.get(`/orders/${id}`),
  // Admin
  getAllAdmin: (params?: { page?: number; limit?: number; status?: string; search?: string }) =>
    api.get('/orders/admin', { params }),
  getOneAdmin: (id: string) => api.get(`/orders/admin/${id}`),
  updateStatus: (id: string, status: string) =>
    api.patch(`/orders/admin/${id}/status`, { status }),
  getStats: () => api.get('/orders/admin/stats'),
};

// Users API
export const usersApi = {
  updateProfile: (data: { name?: string; phone?: string; address?: string; avatar?: string }) =>
    api.patch('/users/profile', data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.patch('/users/change-password', data),
  // Admin
  getAll: (params?: { page?: number; limit?: number; search?: string; role?: string }) =>
    api.get('/users/admin', { params }),
  getOne: (id: string) => api.get(`/users/admin/${id}`),
  updateRole: (id: string, role: string) =>
    api.patch(`/users/admin/${id}/role`, { role }),
  getStats: () => api.get('/users/admin/stats'),
};

export default api;
