'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
  ShoppingBag,
  Truck,
  Shield,
  Clock,
  Package,
  Apple,
  Coffee,
  Milk,
  Cookie,
  SprayCan,
  Baby,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/product-card';
import { categoriesApi, productsApi } from '@/lib/api';
import { Category, Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const categoryIcons: Record<string, any> = {
  'makanan': Apple,
  'minuman': Coffee,
  'susu': Milk,
  'snack': Cookie,
  'kebersihan': SprayCan,
  'bayi': Baby,
};

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          categoriesApi.getAll(),
          productsApi.getFeatured(8),
        ]);
        setCategories(categoriesRes.data);
        setFeaturedProducts(productsRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-purple-900 py-16 lg:py-24">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        <div className="container relative mx-auto px-4">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-white lg:text-5xl xl:text-6xl">
                Belanja Kebutuhan{' '}
                <span className="text-secondary">Harian</span> Jadi Lebih{' '}
                <span className="text-secondary">Mudah</span>
              </h1>
              <p className="mb-8 text-lg text-white/80 lg:text-xl">
                Dapatkan semua kebutuhan sehari-hari Anda dengan harga terbaik.
                Gratis ongkir untuk pembelian di atas Rp 100.000!
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Button
                  asChild
                  size="lg"
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  <Link href="/products">
                    <ShoppingBag className="mr-2 h-5 w-5" />
                    Mulai Belanja
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary"
                >
                  <Link href="/categories">Lihat Kategori</Link>
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="aspect-square rounded-full bg-secondary/20 p-8">
                <div className="grid grid-cols-2 gap-4 h-full">
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-white p-4 shadow-lg">
                      <Package className="h-8 w-8 text-primary" />
                    </div>
                    <div className="rounded-2xl bg-white p-6 shadow-lg">
                      <p className="text-2xl font-bold text-primary">1000+</p>
                      <p className="text-sm text-muted-foreground">Produk</p>
                    </div>
                  </div>
                  <div className="space-y-4 mt-8">
                    <div className="rounded-2xl bg-white p-6 shadow-lg">
                      <p className="text-2xl font-bold text-primary">24/7</p>
                      <p className="text-sm text-muted-foreground">Layanan</p>
                    </div>
                    <div className="rounded-2xl bg-white p-4 shadow-lg">
                      <Truck className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="flex items-center gap-3 p-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Gratis Ongkir</p>
                <p className="text-sm text-muted-foreground">Min. Rp 100rb</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Pengiriman Cepat</p>
                <p className="text-sm text-muted-foreground">Same day delivery</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Pembayaran Aman</p>
                <p className="text-sm text-muted-foreground">100% secure</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Produk Berkualitas</p>
                <p className="text-sm text-muted-foreground">Terjamin fresh</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold lg:text-3xl">Kategori Produk</h2>
              <p className="text-muted-foreground">Temukan produk berdasarkan kategori</p>
            </div>
            <Button asChild variant="ghost">
              <Link href="/categories" className="gap-2">
                Lihat Semua
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 md:grid-cols-6">
              {categories.slice(0, 6).map((category) => {
                const Icon = categoryIcons[category.slug.toLowerCase()] || Package;
                return (
                  <Link
                    key={category.id}
                    href={`/products?categoryId=${category.id}`}
                    className="group flex flex-col items-center gap-3 rounded-xl border bg-card p-4 transition-all hover:border-primary hover:shadow-md"
                  >
                    <div className="rounded-full bg-primary/10 p-4 transition-colors group-hover:bg-primary/20">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <span className="text-center text-sm font-medium">
                      {category.name}
                    </span>
                    {category._count && (
                      <span className="text-xs text-muted-foreground">
                        {category._count.products} produk
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-muted/50 py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold lg:text-3xl">Produk Terbaru</h2>
              <p className="text-muted-foreground">Produk pilihan untuk Anda</p>
            </div>
            <Button asChild variant="ghost">
              <Link href="/products" className="gap-2">
                Lihat Semua
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-muted-foreground">Belum ada produk tersedia</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4">
          <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-primary to-purple-700 p-8 lg:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-white lg:text-4xl">
                Belum punya akun?
              </h2>
              <p className="mb-8 text-lg text-white/80">
                Daftar sekarang dan nikmati berbagai keuntungan belanja di 22mart.id
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  <Link href="/register">Daftar Gratis</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-primary"
                >
                  <Link href="/login">Sudah punya akun? Masuk</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
