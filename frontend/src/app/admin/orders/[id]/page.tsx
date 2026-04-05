'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ordersApi } from '@/lib/api';
import { Order } from '@/types';
import {
  formatPrice,
  formatDateTime,
  getOrderStatusText,
  getOrderStatusColor,
  getPaymentMethodText,
} from '@/lib/utils';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const orderId = params.id as string;

  const fetchOrder = async () => {
    setIsLoading(true);
    try {
      const response = await ordersApi.getOneAdmin(orderId);
      setOrder(response.data);
    } catch (error) {
      toast.error('Pesanan tidak ditemukan');
      router.push('/admin/orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const handleApprovePayment = async () => {
    if (!order) return;
    try {
      await ordersApi.updateStatus(order.id, 'PROCESSING');
      toast.success('Pembayaran disetujui, pesanan diproses!');
      fetchOrder();
    } catch (error) {
      toast.error('Gagal menyetujui pembayaran');
    }
  };

  if (isLoading) {
    return <div className="p-8"><Skeleton className="h-64 w-full" /></div>;
  }

  if (!order) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
        <h1 className="text-2xl font-bold">Detail Pesanan {order.orderNumber}</h1>
        <Badge className={getOrderStatusColor(order.status)}>
          {getOrderStatusText(order.status)}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold">Informasi Pelanggan</h2>
          <p><b>Nama:</b> {order.user?.name || '-'}</p>
          <p><b>Email:</b> {order.user?.email || '-'}</p>
          <p><b>Alamat Pengiriman:</b> {order.shippingAddress || '-'}</p>
          <p><b>Metode Pembayaran:</b> {getPaymentMethodText(order.paymentMethod)}</p>
          <p><b>Total Bayar:</b> {formatPrice(order.totalAmount)}</p>
          <p><b>Tanggal:</b> {order.createdAt ? formatDateTime(order.createdAt) : '-'}</p>
          <p><b>Catatan:</b> {order.notes || '-'}</p>
        </div>

        <div className="rounded-xl border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold">Bukti Pembayaran</h2>
          {order.paymentMethod === 'TRANSFER' ? (
            order.paymentProofImage ? (
              <div className="space-y-4">
                <div className="relative h-64 w-full rounded-lg border overflow-hidden bg-muted">
                  <Image src={order.paymentProofImage} alt="Bukti Transfer" fill className="object-contain" />
                </div>
                {order.status === 'PENDING' && (
                  <Button onClick={handleApprovePayment} className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <CheckCircle className="mr-2 h-4 w-4" /> Setujui Pembayaran & Proses
                  </Button>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground italic">Pelanggan belum mengunggah bukti pembayaran transfer.</p>
            )
          ) : (
            <p className="text-muted-foreground">Pembayaran menggunakan {getPaymentMethodText(order.paymentMethod)}, tidak memerlukan bukti transfer pembayaran.</p>
          )}
        </div>

        <div className="md:col-span-2 rounded-xl border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Item Pesanan</h2>
          <div className="space-y-4">
            {order.items?.length > 0 ? order.items.map((item: any) => (
              <div key={item.id || item.productId} className="flex gap-4 items-center border-b pb-4 last:border-0 last:pb-0">
                <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                  <Image src={item.product?.images?.[0] || '/placeholder-product.jpg'} alt="Product" fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">{item.product?.name || 'Produk'}</p>
                  <p className="text-sm text-muted-foreground">{item.quantity} x {formatPrice(item.price)}</p>
                </div>
                <p className="font-bold">{formatPrice(item.quantity * item.price)}</p>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">Detail item pesanan tidak tersedia.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
