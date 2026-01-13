'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  TrendingUp,
  DollarSign,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ordersApi, usersApi, productsApi, categoriesApi } from '@/lib/api';
import { OrderStats, UserStats, Order } from '@/types';
import {
  formatPrice,
  formatDate,
  getOrderStatusText,
  getOrderStatusColor,
} from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboardPage() {
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderStatsRes, userStatsRes, ordersRes, productsRes, categoriesRes] =
          await Promise.all([
            ordersApi.getStats(),
            usersApi.getStats(),
            ordersApi.getAllAdmin({ limit: 5 }),
            productsApi.getAllAdmin({ limit: 1 }),
            categoriesApi.getAll(true),
          ]);

        setOrderStats(orderStatsRes.data);
        setUserStats(userStatsRes.data);
        setRecentOrders(ordersRes.data.orders);
        setProductCount(productsRes.data.pagination.total);
        setCategoryCount(categoriesRes.data.length);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Produk',
      value: productCount,
      icon: Package,
      color: 'bg-blue-500',
      href: '/admin/products',
    },
    {
      label: 'Total Kategori',
      value: categoryCount,
      icon: FolderTree,
      color: 'bg-green-500',
      href: '/admin/categories',
    },
    {
      label: 'Total Pesanan',
      value: orderStats?.totalOrders || 0,
      icon: ShoppingCart,
      color: 'bg-purple-500',
      href: '/admin/orders',
    },
    {
      label: 'Total Pengguna',
      value: userStats?.totalUsers || 0,
      icon: Users,
      color: 'bg-orange-500',
      href: '/admin/users',
    },
  ];

  const orderSummary = [
    {
      label: 'Menunggu Konfirmasi',
      value: orderStats?.pendingOrders || 0,
      color: 'text-yellow-600',
    },
    {
      label: 'Sedang Diproses',
      value: orderStats?.processingOrders || 0,
      color: 'text-blue-600',
    },
    {
      label: 'Selesai',
      value: orderStats?.completedOrders || 0,
      color: 'text-green-600',
    },
    {
      label: 'Dibatalkan',
      value: orderStats?.cancelledOrders || 0,
      color: 'text-red-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold lg:text-3xl">Dashboard</h1>
        <p className="text-muted-foreground">Selamat datang di Admin Panel 22mart.id</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-1 text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`rounded-full p-3 ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Revenue & Order Summary */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Card */}
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-3">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Pendapatan</p>
              <p className="text-2xl font-bold text-primary">
                {formatPrice(orderStats?.totalRevenue || 0)}
              </p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Dari {orderStats?.completedOrders || 0} pesanan yang selesai
          </p>
        </div>

        {/* Order Summary */}
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 font-semibold">Ringkasan Pesanan</h3>
          <div className="grid grid-cols-2 gap-4">
            {orderSummary.map((item) => (
              <div key={item.label}>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl border bg-card">
        <div className="flex items-center justify-between border-b p-6">
          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Pesanan Terbaru</h3>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/admin/orders">
              Lihat Semua
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="divide-y">
          {recentOrders.length > 0 ? (
            recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4"
              >
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.user?.name} - {formatDate(order.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold">
                    {formatPrice(order.totalAmount)}
                  </span>
                  <Badge className={getOrderStatusColor(order.status)}>
                    {getOrderStatusText(order.status)}
                  </Badge>
                </div>
              </div>
            ))
          ) : (
            <p className="p-6 text-center text-muted-foreground">
              Belum ada pesanan
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
