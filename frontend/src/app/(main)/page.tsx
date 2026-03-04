'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from 'react';
import { ArrowRight, Star, Truck, ShieldCheck, Clock, Package, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import { productsApi } from '@/lib/api';
import { Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsRes = await productsApi.getFeatured(8);
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
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20">

      {/* ── 1. ULTRA-HERO SECTION ────────────────────────────────────────── */}
      <section className="relative px-6 pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden flex flex-col items-center justify-center text-center">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1000px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-0" />

        <div className="relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary mb-8 transition-transform hover:scale-105">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-bold tracking-wide uppercase">Pengalaman Belanja Premium</span>
        </div>

        <h1 className="relative z-10 text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-8 max-w-5xl leading-[1.1] text-foreground">
          Kualitas Terbaik.<br className="hidden md:block" /> Setiap Hari.
        </h1>

        <p className="relative z-10 text-lg md:text-2xl text-muted-foreground font-medium max-w-2xl mb-12">
          Platform e-commerce dengan kurasi tingkat tinggi. Temukan kebutuhan esensial Anda dengan standar layanan tanpa kompromi.
        </p>

        <div className="relative z-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="h-14 px-8 rounded-full bg-primary text-white hover:bg-primary/90 text-base font-bold shadow-xl transition-transform hover:scale-105">
            Mulai Belanja
          </Button>
          <Button size="lg" variant="outline" className="h-14 px-8 rounded-full border-border bg-white text-foreground hover:bg-muted text-base font-bold transition-all">
            Produk Terbaru
          </Button>
        </div>
      </section>

      {/* ── 2. BENTO BOX CATEGORY GRID ───────────────────────────────────── */}
      <section className="px-6 py-16 max-w-[1200px] mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">Eksplorasi</h2>
            <p className="text-xl text-muted-foreground font-medium">Kategori pilihan kami untuk gaya hidup Anda.</p>
          </div>
          <Button asChild variant="link" className="text-foreground text-lg p-0 h-auto font-semibold hover:text-primary group">
            <Link href="/categories">
              Semua Kategori <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[400px]">

          {/* Main Large Box */}
          <Link href="/products?category=segar" className="group relative overflow-hidden rounded-[1.5rem] bg-muted/50 md:col-span-2 md:row-span-2">
            <Image
              src="https://images.unsplash.com/photo-1608686207856-001b95cf60ca?q=80&w=1200&auto=format&fit=crop"
              alt="Produk Segar"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h3 className="text-2xl font-bold tracking-tight mb-1">Produk Segar</h3>
              <p className="text-white/80 text-sm font-medium">Sayuran & Buah Petani Lokal</p>
            </div>
          </Link>

          {/* Top Right Box */}
          <Link href="/products?category=daging" className="group relative overflow-hidden rounded-[1.5rem] bg-muted/50 md:col-span-2 md:row-span-1">
            <Image
              src="https://images.unsplash.com/photo-1603048297172-c92544798d5e?q=80&w=800&auto=format&fit=crop"
              alt="Daging Premium"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h3 className="text-xl font-bold tracking-tight mb-0">Daging Premium</h3>
            </div>
          </Link>

          {/* Bottom Right Box */}
          <Link href="/products?category=kopi" className="group relative overflow-hidden rounded-[1.5rem] bg-primary/5 md:col-span-2 md:row-span-1 flex flex-col justify-end p-6 border border-border/50 hover:border-primary/20 transition-colors">
            <div className="relative z-10">
              <Star className="h-8 w-8 text-primary mb-3 fill-primary/20" />
              <h3 className="text-xl font-bold tracking-tight mb-1">Kurasi Khusus</h3>
              <p className="text-muted-foreground text-sm font-medium">Temukan produk langka berkualitas.</p>
            </div>
          </Link>

        </div>
      </section>

      {/* ── 3. FEATURED PRODUCTS (Invisible Borders) ─────────────────────── */}
      <section className="px-6 py-20 bg-muted/30">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">Pilihan Eksklusif</h2>
            <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">Tingkatkan standar harian Anda dengan koleksi produk terbaik yang kami kurasi khusus untuk Anda.</p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square rounded-3xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground font-medium">Koleksi sedang diperbarui.</p>
            </div>
          )}

          <div className="mt-20 flex justify-center">
            <Button asChild size="lg" variant="outline" className="rounded-full h-14 px-10 text-lg font-semibold border-border hover:bg-foreground hover:text-background transition-all">
              <Link href="/products">Lihat Seluruh Koleksi</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── 4. BRAND PROMISES (Structured Cards) ─────────────────────────── */}
      <section className="px-6 py-24 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center space-y-4 p-8 rounded-3xl bg-white border border-border/60 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center text-secondary-foreground mb-2">
              <Clock className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold tracking-tight">Pengiriman Cepat</h3>
            <p className="text-muted-foreground font-medium text-base">Layanan antar instan dan same-day delivery untuk kenyamanan Anda.</p>
          </div>

          <div className="flex flex-col items-center space-y-4 p-8 rounded-3xl bg-white border border-border/60 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center text-secondary-foreground mb-2">
              <ShieldCheck className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold tracking-tight">Kualitas Terjamin</h3>
            <p className="text-muted-foreground font-medium text-base">Standar QC ketat untuk memastikan hanya yang terbaik yang Anda terima.</p>
          </div>

          <div className="flex flex-col items-center space-y-4 p-8 rounded-3xl bg-white border border-border/60 shadow-sm hover:shadow-md transition-shadow">
            <div className="h-16 w-16 rounded-full bg-secondary/20 flex items-center justify-center text-secondary-foreground mb-2">
              <Truck className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold tracking-tight">Gratis Ongkos Kirim</h3>
            <p className="text-muted-foreground font-medium text-base">Bebas biaya pengiriman untuk semua pesanan di atas Rp 150.000.</p>
          </div>
        </div>
      </section>

      {/* ── 5. EMAIL CAPTURE (Immersive) ─────────────────────────────────── */}
      <section className="px-6 py-24 mb-10 bg-primary text-primary-foreground rounded-3xl mx-4 lg:mx-10 shadow-2xl">
        <div className="max-w-[800px] mx-auto text-center space-y-10">
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Level Baru<br />Gaya Hidup.
          </h2>
          <p className="text-lg md:text-xl text-primary-foreground/90 font-medium max-w-[500px] mx-auto">
            Bergabunglah dengan buletin kami untuk akses awal ke rilisan produk eksklusif dan penawaran khusus.
          </p>
          <form className="flex flex-col sm:flex-row gap-3 max-w-[500px] mx-auto pt-4" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Alamat Email Anda"
              className="flex-1 h-14 px-6 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-secondary text-base transition-all"
            />
            <Button size="lg" className="h-14 px-8 rounded-full bg-secondary text-secondary-foreground hover:bg-white text-base font-bold transition-transform hover:scale-105 shrink-0 shadow-lg">
              Berlangganan
            </Button>
          </form>
        </div>
      </section>

    </div>
  );
}
