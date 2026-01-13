'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import {
  ArrowLeft,
  Check,
  CreditCard,
  Loader2,
  MapPin,
  ShoppingCart,
  Truck,
  Wallet,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { ordersApi } from '@/lib/api';
import { formatPrice, getPaymentMethodText } from '@/lib/utils';

interface CheckoutForm {
  shippingAddress: string;
  paymentMethod: 'COD' | 'TRANSFER' | 'EWALLET';
  notes?: string;
}

const paymentMethods = [
  {
    value: 'COD',
    label: 'Bayar di Tempat (COD)',
    description: 'Bayar saat barang sampai',
    icon: Truck,
  },
  {
    value: 'TRANSFER',
    label: 'Transfer Bank',
    description: 'Transfer ke rekening kami',
    icon: CreditCard,
  },
  {
    value: 'EWALLET',
    label: 'E-Wallet',
    description: 'GoPay, OVO, DANA, dll',
    icon: Wallet,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { cart, isLoading: cartLoading, refreshCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutForm>({
    defaultValues: {
      paymentMethod: 'COD',
    },
  });

  const selectedPaymentMethod = watch('paymentMethod');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (user?.address) {
      setValue('shippingAddress', user.address);
    }
  }, [user, setValue]);

  const onSubmit = async (data: CheckoutForm) => {
    if (!cart || cart.items.length === 0) {
      toast.error('Keranjang kosong');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await ordersApi.create({
        shippingAddress: data.shippingAddress,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
      });

      toast.success('Pesanan berhasil dibuat!');
      await refreshCart();
      router.push(`/orders/${response.data.order.id}`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal membuat pesanan';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || cartLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="mb-8 h-8 w-48" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-48 rounded-xl" />
          </div>
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const items = cart?.items || [];
  const isEmpty = items.length === 0;

  if (isEmpty) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground" />
        <h2 className="mt-6 text-xl font-semibold">Keranjang Kosong</h2>
        <p className="mt-2 text-muted-foreground">
          Tidak ada produk untuk checkout
        </p>
        <Button className="mt-6" asChild>
          <Link href="/products">Mulai Belanja</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold lg:text-3xl">Checkout</h1>
            <p className="text-muted-foreground">Lengkapi pesanan Anda</p>
          </div>
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form */}
            <div className="space-y-6 lg:col-span-2">
              {/* Shipping Address */}
              <div className="rounded-xl border bg-card p-6">
                <div className="mb-4 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Alamat Pengiriman</h2>
                </div>
                <textarea
                  placeholder="Masukkan alamat lengkap pengiriman..."
                  rows={4}
                  className="w-full rounded-lg border border-input bg-background p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  {...register('shippingAddress', {
                    required: 'Alamat pengiriman wajib diisi',
                    minLength: {
                      value: 20,
                      message: 'Alamat minimal 20 karakter',
                    },
                  })}
                />
                {errors.shippingAddress && (
                  <p className="mt-2 text-sm text-destructive">
                    {errors.shippingAddress.message}
                  </p>
                )}
              </div>

              {/* Payment Method */}
              <div className="rounded-xl border bg-card p-6">
                <div className="mb-4 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Metode Pembayaran</h2>
                </div>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.value}
                      className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors ${
                        selectedPaymentMethod === method.value
                          ? 'border-primary bg-primary/5'
                          : 'hover:border-muted-foreground'
                      }`}
                    >
                      <input
                        type="radio"
                        value={method.value}
                        className="sr-only"
                        {...register('paymentMethod')}
                      />
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${
                          selectedPaymentMethod === method.value
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <method.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{method.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {method.description}
                        </p>
                      </div>
                      {selectedPaymentMethod === method.value && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="rounded-xl border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold">
                  Catatan <span className="font-normal text-muted-foreground">(opsional)</span>
                </h2>
                <textarea
                  placeholder="Tambahkan catatan untuk pesanan Anda..."
                  rows={3}
                  className="w-full rounded-lg border border-input bg-background p-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  {...register('notes')}
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-24">
              <div className="rounded-xl border bg-card p-6">
                <h2 className="mb-4 text-lg font-semibold">Ringkasan Pesanan</h2>

                {/* Items */}
                <div className="max-h-64 space-y-3 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                        <Image
                          src={item.product.images?.[0] || '/placeholder-product.jpg'}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} x {formatPrice(item.product.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 space-y-3 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatPrice(cart?.totalAmount || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ongkos Kirim</span>
                    <span className="text-green-600">Gratis</span>
                  </div>
                </div>

                <div className="flex justify-between border-t py-4">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(cart?.totalAmount || 0)}
                  </span>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    'Buat Pesanan'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
