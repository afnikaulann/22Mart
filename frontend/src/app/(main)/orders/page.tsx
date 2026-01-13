'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Eye, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/auth-context';
import { ordersApi } from '@/lib/api';
import { Order, Pagination } from '@/types';
import {
  formatPrice,
  formatDate,
  getOrderStatusText,
  getOrderStatusColor,
} from '@/lib/utils';

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) return;
      
      setIsLoading(true);
      try {
        const response = await ordersApi.getAll({ page, limit: 10 });
        setOrders(response.data.orders);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, page]);

  if (authLoading || (isLoading && orders.length === 0)) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-8 h-8 w-48" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold lg:text-3xl">Pesanan Saya</h1>
          <p className="text-muted-foreground">Riwayat dan status pesanan Anda</p>
        </div>

        {orders.length === 0 ? (
          <div className="py-20 text-center">
            <Package className="mx-auto h-24 w-24 text-muted-foreground" />
            <h2 className="mt-6 text-xl font-semibold">Belum Ada Pesanan</h2>
            <p className="mt-2 text-muted-foreground">
              Anda belum memiliki riwayat pesanan
            </p>
            <Button className="mt-6" asChild>
              <Link href="/products">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Mulai Belanja
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="rounded-xl border bg-card p-4 md:p-6"
              >
                {/* Order header */}
                <div className="mb-4 flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                  <div>
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <Badge className={getOrderStatusColor(order.status)}>
                    {getOrderStatusText(order.status)}
                  </Badge>
                </div>

                {/* Order items preview */}
                <div className="mb-4 flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div
                        key={item.id}
                        className="relative h-12 w-12 overflow-hidden rounded-lg border bg-white"
                        style={{ zIndex: 3 - index }}
                      >
                        <Image
                          src={item.product.images?.[0] || '/placeholder-product.jpg'}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-muted text-sm font-medium">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} produk
                    </p>
                  </div>
                </div>

                {/* Order footer */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Pembayaran</p>
                    <p className="text-lg font-bold text-primary">
                      {formatPrice(order.totalAmount)}
                    </p>
                  </div>
                  <Button asChild variant="outline">
                    <Link href={`/orders/${order.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Lihat Detail
                    </Link>
                  </Button>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <Button
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Sebelumnya
                </Button>
                <span className="flex items-center px-4 text-sm text-muted-foreground">
                  Halaman {page} dari {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Selanjutnya
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
