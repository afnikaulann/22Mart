'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  ShoppingBag,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { cart, isLoading, updateQuantity, removeItem, clearCart } = useCart();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-8 h-8 w-48" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const items = cart?.items || [];
  const isEmpty = items.length === 0;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold lg:text-3xl">Keranjang Belanja</h1>
            <p className="text-muted-foreground">
              {isEmpty ? 'Keranjang Anda kosong' : `${cart?.totalItems} item`}
            </p>
          </div>
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </div>

        {isEmpty ? (
          <div className="py-20 text-center">
            <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground" />
            <h2 className="mt-6 text-xl font-semibold">Keranjang Anda Kosong</h2>
            <p className="mt-2 text-muted-foreground">
              Belum ada produk di keranjang belanja Anda
            </p>
            <Button className="mt-6" asChild>
              <Link href="/products">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Mulai Belanja
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="space-y-4 lg:col-span-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 rounded-xl border bg-card p-4"
                >
                  {/* Image */}
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={item.product.images?.[0] || '/placeholder-product.jpg'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="font-medium hover:text-primary"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {item.product.category?.name}
                      </p>
                    </div>
                    <p className="font-bold text-primary">
                      {formatPrice(item.product.price)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          if (item.quantity > 1) {
                            updateQuantity(item.id, item.quantity - 1);
                          }
                        }}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear cart */}
              <div className="flex justify-end">
                <Button variant="ghost" onClick={clearCart} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Kosongkan Keranjang
                </Button>
              </div>
            </div>

            {/* Summary */}
            <div className="lg:sticky lg:top-24">
              <div className="rounded-xl border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold">Ringkasan Belanja</h2>

                <div className="space-y-3 border-b pb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Total Harga ({cart?.totalItems} barang)
                    </span>
                    <span>{formatPrice(cart?.totalAmount || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ongkos Kirim</span>
                    <span className="text-green-600">Gratis</span>
                  </div>
                </div>

                <div className="flex justify-between py-4">
                  <span className="text-lg font-semibold">Total Tagihan</span>
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(cart?.totalAmount || 0)}
                  </span>
                </div>

                <Button asChild className="w-full" size="lg">
                  <Link href="/checkout">
                    Lanjut ke Checkout
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
