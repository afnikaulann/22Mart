'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, MapPin, CreditCard, FileText, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import { ordersApi } from '@/lib/api';
import { Order } from '@/types';
import {
  formatPrice,
  formatDateTime,
  getOrderStatusText,
  getOrderStatusColor,
  getPaymentMethodText,
} from '@/lib/utils';

const orderSteps = [
  { status: 'PENDING', label: 'Pesanan Dibuat' },
  { status: 'PROCESSING', label: 'Diproses' },
  { status: 'SHIPPED', label: 'Dikirim' },
  { status: 'DELIVERED', label: 'Selesai' },
];

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const orderId = params.id as string;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!isAuthenticated || !orderId) return;

      setIsLoading(true);
      try {
        const response = await ordersApi.getOne(orderId);
        setOrder(response.data);
      } catch (error) {
        console.error('Failed to fetch order:', error);
        router.push('/orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [isAuthenticated, orderId, router]);

  const handleUploadProof = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!order) return;
    
    const formData = new FormData(e.currentTarget);
    const file = formData.get('paymentProof');
    if (!file || (file as File).size === 0) return;

    setIsUploading(true);
    try {
      // Use our new upload mock API
      await (ordersApi as any).uploadPaymentProof(order.id, formData);
      toast.success('Bukti transfer berhasil diunggah!');
      
      // Refresh order to show the image
      const response = await ordersApi.getOne(order.id);
      setOrder(response.data);
    } catch (error) {
      toast.error('Gagal mengunggah bukti pembayaran');
    } finally {
      setIsUploading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-8 h-8 w-48" />
        <div className="space-y-4">
          <Skeleton className="h-24 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !order) {
    return null;
  }

  const currentStepIndex = orderSteps.findIndex(
    (step) => step.status === order.status
  );
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold lg:text-3xl">
                {order.orderNumber}
              </h1>
              <p className="text-muted-foreground">
                {formatDateTime(order.createdAt)}
              </p>
            </div>
            <Badge className={getOrderStatusColor(order.status)}>
              {getOrderStatusText(order.status)}
            </Badge>
          </div>
        </div>

        {/* Order Progress */}
        {!isCancelled && (
          <div className="mb-8 rounded-xl border bg-card p-6">
            <h2 className="mb-6 text-lg font-semibold">Status Pesanan</h2>
            <div className="relative">
              <div className="absolute left-0 top-4 h-1 w-full bg-muted">
                <div
                  className="h-full bg-primary transition-all"
                  style={{
                    width: `${Math.max(0, (currentStepIndex / (orderSteps.length - 1)) * 100)}%`,
                  }}
                />
              </div>
              <div className="relative flex justify-between">
                {orderSteps.map((step, index) => {
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;
                  return (
                    <div
                      key={step.status}
                      className="flex flex-col items-center"
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                          isCompleted
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-muted bg-background'
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <span className="text-xs">{index + 1}</span>
                        )}
                      </div>
                      <span
                        className={`mt-2 text-center text-xs ${
                          isCurrent
                            ? 'font-semibold text-primary'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Order Items */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">Produk Pesanan</h2>
              <div className="space-y-4">
                {(order.items || []).map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={item.product.images?.[0] || '/placeholder-product.jpg'}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <Link
                          href={`/products/${item.product.slug}`}
                          className="font-medium hover:text-primary"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} x {formatPrice(item.price)}
                        </p>
                      </div>
                      <p className="font-semibold text-primary">
                        {formatPrice(item.quantity * item.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="rounded-xl border bg-card p-6">
              <div className="mb-3 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Alamat Pengiriman</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {order.shippingAddress}
              </p>
            </div>

            {/* Payment Method */}
            <div className="rounded-xl border bg-card p-6">
              <div className="mb-3 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Metode Pembayaran</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {getPaymentMethodText(order.paymentMethod)}
              </p>
            </div>

            {/* Upload Bukti Pembayaran (Jika Manual Transfer & PENDING) */}
            {order.paymentMethod === 'TRANSFER' && order.status === 'PENDING' && (
              <div className="rounded-xl border border-primary/50 bg-primary/5 p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-primary">Upload Bukti Transfer</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Silakan transfer senilai <b>{formatPrice(order.totalAmount)}</b> ke rekening BCA 123456789 a.n 22Mart dan upload bukti pembayaran di sini.
                </p>
                {order.paymentProofImage ? (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-emerald-600 mb-2 flex items-center gap-1">
                      <Check className="h-4 w-4" /> Bukti telah diupload, menunggu konfirmasi toko
                    </p>
                    <div className="relative h-40 w-32 overflow-hidden rounded-lg border bg-muted">
                      <Image src={order.paymentProofImage} alt="Bukti Pembayaran" fill className="object-cover" />
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleUploadProof} className="space-y-3 pt-2">
                    <input 
                      type="file" 
                      accept="image/*"
                      name="paymentProof"
                      required
                      className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" 
                    />
                    <Button type="submit" className="w-full" disabled={isUploading}>
                      {isUploading ? 'Mengunggah...' : 'Unggah Bukti Transaksi'}
                    </Button>
                  </form>
                )}
              </div>
            )}

            {/* Notes */}
            {order.notes && (
              <div className="rounded-xl border bg-card p-6">
                <div className="mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Catatan</h3>
                </div>
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </div>
            )}

            {/* Summary */}
            <div className="rounded-xl border bg-card p-6">
              <h3 className="mb-4 font-semibold">Ringkasan Pembayaran</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal Produk</span>
                  <span>{formatPrice(order.totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ongkos Kirim</span>
                  <span className="text-green-600">Gratis</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-semibold">Total Pembayaran</span>
                  <span className="text-lg font-bold text-primary">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
