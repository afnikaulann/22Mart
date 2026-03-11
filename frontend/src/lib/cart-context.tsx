'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Cart, CartItem } from '@/types';
import { cartApi } from './api';
import { useAuth } from './auth-context';
import { toast } from 'sonner';

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  itemCount: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refreshCart = useCallback(async () => {
    try {
      setIsLoading(true);
      if (isAuthenticated) {
        const response = await cartApi.get();
        setCart(response.data);
      } else {
        const localItems = localStorage.getItem('guest_cart');
        if (localItems) {
          try { setCart(JSON.parse(localItems)); } catch (e) { setCart(null); }
        } else {
          setCart(null);
        }
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (productId: string, quantity = 1) => {
    if (!isAuthenticated) {
      try {
        const productRes = await (await import('./api')).productsApi.getById(productId);
        const product = productRes.data;

        let currentCart: Cart = cart ? { ...cart } : {
          id: 'guest', userId: 'guest', items: [], totalItems: 0, totalAmount: 0, createdAt: new Date().toISOString()
        };

        const existingIndex = currentCart.items.findIndex(i => i.productId === productId);
        if (existingIndex >= 0) {
          currentCart.items[existingIndex].quantity += quantity;
        } else {
          currentCart.items.push({
            id: Date.now().toString(),
            productId,
            quantity,
            product,
            createdAt: new Date().toISOString()
          });
        }

        currentCart.totalItems = currentCart.items.reduce((sum, item) => sum + item.quantity, 0);
        currentCart.totalAmount = currentCart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

        setCart(currentCart);
        localStorage.setItem('guest_cart', JSON.stringify(currentCart));
      } catch (error) {
        toast.error('Gagal menambahkan produk');
      }
      return;
    }

    try {
      await cartApi.addItem({ productId, quantity });
      await refreshCart();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal menambahkan ke keranjang';
      toast.error(message);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!isAuthenticated && cart) {
      let currentCart = { ...cart };
      const itemIndex = currentCart.items.findIndex(i => i.id === itemId);
      if (itemIndex >= 0) {
        currentCart.items[itemIndex].quantity = quantity;
        currentCart.totalItems = currentCart.items.reduce((sum, item) => sum + item.quantity, 0);
        currentCart.totalAmount = currentCart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        setCart(currentCart);
        localStorage.setItem('guest_cart', JSON.stringify(currentCart));
      }
      return;
    }

    try {
      await cartApi.updateItem(itemId, { quantity });
      await refreshCart();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal mengubah jumlah';
      toast.error(message);
    }
  };

  const removeItem = async (itemId: string) => {
    if (!isAuthenticated && cart) {
      let currentCart = { ...cart };
      currentCart.items = currentCart.items.filter(i => i.id !== itemId);
      currentCart.totalItems = currentCart.items.reduce((sum, item) => sum + item.quantity, 0);
      currentCart.totalAmount = currentCart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      setCart(currentCart);
      localStorage.setItem('guest_cart', JSON.stringify(currentCart));
      toast.success('Produk dihapus dari keranjang');
      return;
    }

    try {
      await cartApi.removeItem(itemId);
      toast.success('Produk dihapus dari keranjang');
      await refreshCart();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal menghapus produk';
      toast.error(message);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      localStorage.removeItem('guest_cart');
      toast.success('Keranjang dikosongkan');
      return;
    }

    try {
      await cartApi.clear();
      setCart(null);
      toast.success('Keranjang dikosongkan');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal mengosongkan keranjang';
      toast.error(message);
    }
  };

  const itemCount = cart?.totalItems || 0;

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        itemCount,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
