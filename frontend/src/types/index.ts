// User types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  avatar?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  accessToken: string;
}

// Category types
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

// Product types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  stock: number;
  images: string[];
  isActive: boolean;
  categoryId: string;
  category: Pick<Category, 'id' | 'name' | 'slug'>;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  pagination: Pagination;
}

// Cart types
export interface CartItem {
  id: string;
  quantity: number;
  productId: string;
  product: Product;
  createdAt: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  createdAt: string;
}

// Order types
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentMethod = 'COD' | 'TRANSFER' | 'EWALLET';

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  productId: string;
  product: Pick<Product, 'id' | 'name' | 'slug' | 'images'>;
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: string;
  shippingCost: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  userId: string;
  user?: Pick<User, 'id' | 'name' | 'email' | 'phone'>;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: Pagination;
}

// Common types
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

// Stats types
export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
}

export interface UserStats {
  totalUsers: number;
  totalAdmins: number;
  newUsersThisMonth: number;
}
