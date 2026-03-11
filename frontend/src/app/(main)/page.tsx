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
          <Button asChild size="lg" className="h-14 px-8 rounded-full bg-primary text-white hover:bg-primary/90 text-base font-bold shadow-xl transition-transform hover:scale-105">
            <Link href="/products">Mulai Belanja</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="h-14 px-8 rounded-full border-border bg-white text-foreground hover:bg-muted text-base font-bold transition-all">
            <Link href="/products?sortBy=newest">Produk Terbaru</Link>
          </Button>
        </div>
      </section>

      {/* ── 2. IMMERSIVE BRAND STORY (Editorial Layout) ────────────────────── */}
      <section className="px-6 py-20 lg:py-32 bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left: Authentic Store Imagery */}
            <div className="relative aspect-[4/5] lg:aspect-square rounded-[2rem] overflow-hidden group shadow-2xl border border-border/50">
              <Image
                src="/images/foto toko/gambar toko.jpg"
                alt="Gerai Fisik 22Mart"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              {/* Elegant overlay badge */}
              <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Star className="h-6 w-6 text-primary fill-primary/20" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-foreground">Gerai Fisik Terpadu</h4>
                    <p className="text-sm font-medium text-muted-foreground">Kunjungi langsung toko kami untuk pengalaman berbelanja maksimal.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Editorial Typography */}
            <div className="flex flex-col justify-center space-y-8 lg:pr-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted/50 w-fit">
                <Sparkles className="h-4 w-4 text-primary fill-primary" />
                <span className="text-sm font-bold tracking-wide">Lebih Dekat Dengan Anda</span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
                Pusat Belanja<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Premium.</span>
              </h2>

              <p className="text-xl text-muted-foreground font-medium leading-relaxed">
                Kami tidak hanya melayani secara virtual. Berkunjunglah ke gerai fisik 22Mart untuk menyaksikan langsung bagaimana kami menjaga standar kualitas tinggi di setiap etalase yang ada.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-border/50">
                <div className="space-y-3">
                  <h3 className="text-xl font-bold">Layanan Personal</h3>
                  <p className="text-muted-foreground font-medium">Pramuniaga ahli kami siap membantu mencarikan setiap kebutuhan Anda.</p>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold">Fasilitas Modern</h3>
                  <p className="text-muted-foreground font-medium">Ruang ber-AC yang nyaman dengan infrastruktur pendingin terbaik di kelasnya.</p>
                </div>
              </div>

              <div className="pt-6">
                <Button asChild variant="link" className="p-0 h-auto text-lg font-bold hover:text-primary group">
                  <Link href="/about" className="flex items-center">
                    Lihat Lokasi & Jam Buka <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>

          </div>
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
