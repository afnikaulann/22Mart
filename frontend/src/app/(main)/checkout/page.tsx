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
  UploadCloud,
  QrCode,
  Building,
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
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingOrderData, setPendingOrderData] = useState<CheckoutForm | null>(null);

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

    if (data.paymentMethod !== 'COD') {
      // Don't submit yet, show the payment modal first
      setPendingOrderData(data);
      setShowPaymentModal(true);
      return;
    }

    // If COD, submit immediately
    await processOrder(data);
  };

  const processOrder = async (data: CheckoutForm) => {
    setIsSubmitting(true);
    try {
      const response = await ordersApi.create({
        shippingAddress: data.shippingAddress,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
      });

      toast.success('Pesanan berhasil dibuat!');
      await refreshCart();
      setShowPaymentModal(false);
      router.push(`/orders/${response.data.id}`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal membuat pesanan';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmPayment = async () => {
    if (!receiptFile) {
      toast.error('Harap unggah bukti pembayaran Anda');
      return;
    }
    if (pendingOrderData) {
      await processOrder(pendingOrderData);
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
                      className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-colors ${selectedPaymentMethod === method.value
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
                        className={`flex h-10 w-10 items-center justify-center rounded-full ${selectedPaymentMethod === method.value
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

        {/* ── PAYMENT MODAL (Water Bubble Effect) ── */}
        {showPaymentModal && pendingOrderData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-background w-full max-w-[400px] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-50 duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]">
              <div className="p-4 border-b border-border flex items-center bg-muted/30">
                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 mr-3 hover:bg-muted" onClick={() => setShowPaymentModal(false)}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-bold">
                  {selectedPaymentMethod === 'TRANSFER' ? 'Transfer Bank' : 'Pembayaran E-Wallet'}
                </h2>
              </div>

              <div className="p-5 space-y-5">
                {selectedPaymentMethod === 'TRANSFER' && (
                  <div className="p-4 rounded-2xl border border-border bg-card shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Building className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base">Bank BCA</h3>
                        <p className="text-xs text-muted-foreground">a.n 22Mart Official</p>
                      </div>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-xl border flex items-center justify-between font-mono text-lg font-black text-primary tracking-wider">
                      <span>8273 1928 338</span>
                      <Button type="button" variant="outline" size="sm" className="h-7 text-xs px-3 rounded-full" onClick={() => toast.success('Nomor rekening disalin!')}>Salin</Button>
                    </div>
                    <div className="mt-3 flex justify-between items-center text-sm">
                      <span className="text-muted-foreground font-medium">Total Tagihan</span>
                      <span className="font-bold text-foreground">{formatPrice(cart?.totalAmount || 0)}</span>
                    </div>
                  </div>
                )}

                {selectedPaymentMethod === 'EWALLET' && (
                  <div className="p-4 rounded-2xl border border-border bg-card shadow-sm flex flex-col items-center justify-center text-center">
                    <p className="font-medium mb-3 text-xs text-muted-foreground">Scan QRIS Berikut untuk Pembayaran E-Wallet</p>
                    <div className="bg-white p-3 rounded-2xl border shadow-sm flex flex-col items-center">
                      <QrCode className="h-32 w-32 text-foreground" strokeWidth={1} />
                      <p className="mt-3 text-[10px] font-bold font-mono tracking-widest px-3 py-1 bg-muted rounded-full">NMID: ID2024000123</p>
                    </div>
                    <div className="mt-4 w-full flex justify-between items-center text-sm px-2">
                      <span className="text-muted-foreground font-medium">Total Tagihan</span>
                      <span className="font-bold text-foreground">{formatPrice(cart?.totalAmount || 0)}</span>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-bold mb-2 text-sm">Konfirmasi Pembayaran</h3>
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-border rounded-xl cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors group">
                    <div className="flex flex-col items-center justify-center pt-4 pb-4">
                      <UploadCloud className="w-6 h-6 mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                      <p className="mb-1 text-xs text-muted-foreground">
                        <span className="font-semibold text-primary">Klik unggah</span> bukti
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium truncate max-w-[200px]">{receiptFile ? receiptFile.name : "PNG, JPG/PDF (<5MB)"}</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/png, image/jpeg, application/pdf"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setReceiptFile(e.target.files[0]);
                          toast.success('Bukti pembayaran dilampirkan');
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="p-5 border-t border-border bg-card">
                <Button
                  className="w-full rounded-xl h-11 font-bold bg-primary text-white"
                  onClick={confirmPayment}
                  disabled={isSubmitting || !receiptFile}
                >
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Konfirmasi Pesanan'}
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
