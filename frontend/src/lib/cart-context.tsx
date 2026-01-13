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
    if (!isAuthenticated) {
      setCart(null);
      return;
    }

    try {
      setIsLoading(true);
      const response = await cartApi.get();
      setCart(response.data);
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
      toast.error('Silakan login terlebih dahulu');
      return;
    }

    try {
      await cartApi.addItem({ productId, quantity });
      toast.success('Produk ditambahkan ke keranjang');
      await refreshCart();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal menambahkan ke keranjang';
      toast.error(message);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      await cartApi.updateItem(itemId, { quantity });
      await refreshCart();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal mengubah jumlah';
      toast.error(message);
    }
  };

  const removeItem = async (itemId: string) => {
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
