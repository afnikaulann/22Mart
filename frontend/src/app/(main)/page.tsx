'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  ArrowRight,
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
  ShoppingBag,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/product-card';
import { categoriesApi, productsApi } from '@/lib/api';
import { Category, Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

const categoryIcons: Record<string, any> = {
  makanan: Apple,
  minuman: Coffee,
  susu: Milk,
  snack: Cookie,
  kebersihan: SprayCan,
  bayi: Baby,
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
          productsApi.getFeatured(12), // fetch more for denser grid
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
    <div className="min-h-screen bg-[#f4f4f4]">
      {/* ── Retail Hero Section (Alfagift/Supermarket Style) ──────────────── */}
      <section className="bg-white border-b overflow-hidden relative">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-[#fffaf0] to-transparent z-0 hidden lg:block" />
        <div className="container mx-auto px-4 py-8 lg:py-16 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-xl text-center lg:text-left">
              <span className="inline-block py-1 px-3 rounded-full bg-secondary/20 text-secondary-foreground text-sm font-bold mb-4 border border-secondary/30 shadow-sm">
                Rekomendasi Minggu Ini
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] mb-4 tracking-tight">
                Belanja Bulanan <br className="hidden md:block" />
                <span className="text-primary italic">Lebih Hemat</span>
              </h1>
              <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-md mx-auto lg:mx-0">
                Penuhi kebutuhan dapur dan keluarga dengan harga grosir. Gratis ongkir khusus member baru!
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <Button size="lg" asChild className="h-12 px-8 rounded-full font-bold text-base shadow-md hover:-translate-y-0.5 transition-transform bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href="/products">Mulai Belanja</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="h-12 px-8 rounded-full font-bold text-base border-primary/20 text-primary hover:bg-primary/5">
                  <Link href="/products?promo=true">Lihat Promo</Link>
                </Button>
              </div>
            </div>

            <div className="relative shrink-0 flex items-center justify-center lg:justify-end xl:pr-12">
              <div className="relative w-64 h-64 md:w-80 md:h-80 bg-secondary/10 rounded-full flex items-center justify-center border-4 border-white shadow-xl">
                {/* Decorative items */}
                <Package className="absolute top-8 left-8 h-12 w-12 text-primary opacity-30 rotate-12" />
                <Apple className="absolute bottom-12 right-12 h-16 w-16 text-secondary opacity-40 -rotate-12" />
                <ShoppingBag className="h-32 w-32 text-primary/80" />

                {/* Big Discount Badge */}
                <div className="absolute -right-4 md:-right-8 top-1/2 -translate-y-1/2 bg-red-600 text-white p-6 rounded-full shadow-2xl rotate-[15deg] hover:rotate-0 transition-transform cursor-pointer border-4 border-white">
                  <div className="flex flex-col items-center justify-center h-full">
                    <span className="text-sm font-bold uppercase tracking-wider mb-[-4px]">Diskon</span>
                    <span className="text-4xl md:text-5xl font-extrabold font-serif italic">-50%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Promo Banner Carousel ────────────────────────────────────────────── */}
      <section className="bg-white pb-6 pt-6">
        <div className="container mx-auto px-4">
          <div className="flex snap-x snap-mandatory overflow-x-auto gap-4 pb-4 scrollbar-hide">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`
                  relative min-w-[280px] md:min-w-[400px] lg:min-w-[500px] h-[140px] md:h-[180px] lg:h-[220px] 
                  shrink-0 snap-center overflow-hidden rounded-2xl shadow-sm
                  ${num === 1 ? 'bg-gradient-to-r from-red-500 to-rose-400' : ''}
                  ${num === 2 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : ''}
                  ${num === 3 ? 'bg-gradient-to-r from-blue-500 to-cyan-400' : ''}
                `}
              >
                <div className="absolute inset-0 flex flex-col justify-center p-6 text-white">
                  <span className="mb-1 text-xs font-bold uppercase tracking-wider bg-white/20 w-fit px-2 py-0.5 rounded-full">
                    Promo Spesial
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold leading-tight mb-2">
                    {num === 1 ? 'Diskon Sembako\nHingga 40%' : ''}
                    {num === 2 ? 'Cashback\nSetiap Hari' : ''}
                    {num === 3 ? 'Kebutuhan Bayi\nEkstra Hemat' : ''}
                  </h3>
                  <Button variant="secondary" size="sm" className="w-fit h-8 rounded-full text-xs font-semibold mt-auto shadow-sm text-primary hover:bg-white/90">
                    Cek Sekarang <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Kategori (Horizontal Scrollable Rak) ────────────────────────────── */}
      <section className="bg-white py-6 mt-2 shadow-sm rounded-t-2xl">
        <div className="container mx-auto px-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Kategori Pilihan</h2>
            <Link href="/categories" className="text-sm font-semibold text-primary hover:underline">
              Lihat Semua
            </Link>
          </div>

          {isLoading ? (
            <div className="flex gap-4 overflow-x-hidden">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex shrink-0 flex-col items-center gap-2">
                  <Skeleton className="h-16 w-16 md:h-20 md:w-20 rounded-2xl" />
                  <Skeleton className="h-3 w-12" />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex snap-x snap-mandatory overflow-x-auto gap-4 pb-4 scrollbar-hide">
              {categories.map((category) => {
                const Icon = categoryIcons[category.slug.toLowerCase()] || Package;
                return (
                  <Link
                    key={category.id}
                    href={`/products?categoryId=${category.id}`}
                    className="group flex min-w-[72px] shrink-0 snap-start flex-col items-center gap-2"
                  >
                    <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl border bg-card transition-all group-hover:border-primary group-hover:bg-primary/5 group-hover:shadow-sm">
                      <Icon className="h-7 w-7 md:h-8 md:w-8 text-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <span className="text-center text-[11px] md:text-xs font-medium leading-tight max-w-[72px] md:max-w-[80px]">
                      {category.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Keunggulan ──────────────────────────────────────────────────────── */}
      <section className="bg-white py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto gap-4 scrollbar-hide snap-x">
            {[
              { icon: Truck, title: 'Gratis Ongkir', sub: 'Min. Rp 100rb' },
              { icon: Clock, title: 'Pengiriman', sub: 'Cepat & Aman' },
              { icon: Shield, title: 'Pembayaran', sub: '100% Aman' },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex min-w-[180px] snap-center items-center gap-3 rounded-xl bg-[#f8f9fa] p-3 border">
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight">{title}</p>
                  <p className="text-[10px] text-muted-foreground">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Produk Terbaru (Grid Padat) ─────────────────────────────────────── */}
      <section className="bg-white py-8 lg:py-10 mt-2">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">Lagi Promo Nih!</h2>
              <p className="text-xs md:text-sm text-muted-foreground">Harga miring khusus hari ini</p>
            </div>
            <Link href="/products" className="text-sm font-semibold text-primary hover:underline">
              Lihat Semua
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-3 rounded-xl border p-3">
                  <Skeleton className="aspect-square rounded-lg" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-8 w-full rounded-md" />
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">Belum ada produk tersedia</p>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA / Daftar (Supermarket feel) ─────────────────────────────────── */}
      <section className="bg-white py-12 lg:py-16 mt-2 border-t">
        <div className="container mx-auto px-4">
          <div className="overflow-hidden rounded-3xl bg-primary p-8 lg:p-12 shadow-lg relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="mx-auto max-w-xl text-center relative z-10">
              <h2 className="mb-3 text-2xl md:text-3xl font-bold text-white leading-tight">
                Belanja Bulanan Jadi<br />Lebih Mudah & Murah
              </h2>
              <p className="mb-8 text-sm md:text-base text-white/90">
                Daftar sekarang dan nikmati gratis ongkir, promo harian, dan cashback menanti!
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-white font-bold rounded-xl shadow-md h-12">
                  <Link href="/register">Daftar Sekarang</Link>
                </Button>
                <Button asChild size="lg" className="bg-white text-primary hover:bg-gray-100 font-bold rounded-xl shadow-sm h-12">
                  <Link href="/login">Masuk ke Akun</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
