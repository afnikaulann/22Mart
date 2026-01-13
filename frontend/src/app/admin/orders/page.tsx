'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Eye, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ordersApi } from '@/lib/api';
import { Order, Pagination, OrderStatus } from '@/types';
import {
  formatPrice,
  formatDate,
  getOrderStatusText,
  getOrderStatusColor,
} from '@/lib/utils';

const statusOptions = [
  { value: '', label: 'Semua Status' },
  { value: 'PENDING', label: 'Menunggu Konfirmasi' },
  { value: 'PROCESSING', label: 'Diproses' },
  { value: 'SHIPPED', label: 'Dikirim' },
  { value: 'DELIVERED', label: 'Selesai' },
  { value: 'CANCELLED', label: 'Dibatalkan' },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await ordersApi.getAllAdmin({
        search: search || undefined,
        status: statusFilter || undefined,
        page,
        limit: 10,
      });
      setOrders(response.data.orders);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter, page]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await ordersApi.updateStatus(orderId, newStatus);
      toast.success('Status pesanan berhasil diperbarui');
      fetchOrders();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal mengubah status';
      toast.error(message);
    }
  };

  const getNextStatuses = (currentStatus: OrderStatus): string[] => {
    const transitions: Record<OrderStatus, string[]> = {
      PENDING: ['PROCESSING', 'CANCELLED'],
      PROCESSING: ['SHIPPED', 'CANCELLED'],
      SHIPPED: ['DELIVERED'],
      DELIVERED: [],
      CANCELLED: [],
    };
    return transitions[currentStatus] || [];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Manajemen Pesanan</h1>
        <p className="text-muted-foreground">Kelola pesanan pelanggan</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari pesanan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Semua Status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border bg-card">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">No. Pesanan</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Pelanggan</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Tanggal</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Total</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => {
                  const nextStatuses = getNextStatuses(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium">{order.user?.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {order.user?.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm">{formatDate(order.createdAt)}</td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {formatPrice(order.totalAmount)}
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={getOrderStatusColor(order.status)}>
                          {getOrderStatusText(order.status)}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/orders/${order.id}`}>
                              <Eye className="mr-1 h-4 w-4" />
                              Detail
                            </Link>
                          </Button>
                          {nextStatuses.length > 0 && (
                            <Select
                              onValueChange={(value) => handleStatusChange(order.id, value)}
                            >
                              <SelectTrigger className="h-8 w-[140px]">
                                <SelectValue placeholder="Ubah Status" />
                              </SelectTrigger>
                              <SelectContent>
                                {nextStatuses.map((status) => (
                                  <SelectItem key={status} value={status}>
                                    {getOrderStatusText(status)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Tidak ada pesanan ditemukan</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
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
  );
}
