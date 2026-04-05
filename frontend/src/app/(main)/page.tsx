'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from 'react';
import { ArrowRight, Star, Truck, ShieldCheck, Clock, Package, Sparkles, ChevronRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import { productsApi } from '@/lib/api';
import { Product } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as any } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

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
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 overflow-hidden space-y-16 pb-16">
      
      {/* ── 1. ULTRA-HERO SECTION (Animated & Parallax) ───────────────── */}
      <section ref={heroRef} className="relative w-full pt-28 pb-16 flex items-center justify-center overflow-hidden bg-grid-black/[0.02]">
        {/* Animated Background Gradients */}
        <div className="absolute top-[0%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full pointer-events-none animate-pulse-slow" />
        <div className="absolute bottom-[0%] right-[-10%] w-[40%] h-[40%] bg-secondary/20 blur-[100px] rounded-full pointer-events-none animate-pulse-slow delay-1000" />
        
        <motion.div 
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 w-full max-w-7xl mx-auto px-6 flex flex-col items-center text-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeUpVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary mb-6 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs md:text-sm font-bold tracking-widest uppercase">Evolusi Belanja Premium</span>
          </motion.div>

          <motion.h1 variants={fadeUpVariants} className="text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight mb-4 max-w-4xl leading-tight text-foreground">
            Kualitas Tanpa{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Kompromi</span>
          </motion.h1>

          <motion.p variants={fadeUpVariants} className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mb-8 leading-relaxed">
            Kurasi esensial harian dengan standar tertinggi. Lebih dari sekadar e-commerce, ini adalah pengalaman belanja paripurna.
          </motion.p>

          <motion.div variants={fadeUpVariants} className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
            <Button asChild size="lg" className="h-12 px-8 rounded-full bg-primary text-white hover:bg-primary/90 text-sm md:text-base font-bold shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(var(--primary-rgb),0.3)] transition-all hover:-translate-y-1">
              <Link href="/products">Jelajahi Koleksi</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 px-8 rounded-full border-border bg-white/50 backdrop-blur-md text-foreground hover:bg-muted text-sm md:text-base font-bold transition-all hover:-translate-y-1">
              <Link href="/products?sortBy=newest">Rilisan Terbaru <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* ── 2. MODULAR CATEGORIES (Simplified & Minimalist) ─────────────────────── */}
      <section className="px-6 max-w-[1400px] mx-auto pt-8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUpVariants}
          className="text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">Departemen Utama</h2>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto">Jelajahi kategori eksklusif kami yang disusun rapi untuk memenuhi kebutuhan sehari-hari Anda dengan mudah dan nyaman.</p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <motion.div variants={fadeUpVariants}>
            <Link 
              href="/categories/fresh-food" 
              className="group flex flex-col items-center text-center p-8 rounded-[2rem] bg-card border-2 border-border shadow-sm hover:border-emerald-500 hover:shadow-[0_8px_30px_rgb(16,185,129,0.15)] hover:-translate-y-1 transition-all duration-300 h-full"
            >
              <div className="h-16 w-16 rounded-2xl bg-emerald-50/80 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <Sparkles className="text-emerald-500 h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Fresh Food</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Bahan masakan segar & berkualitas yang dikurasi setiap harinya.</p>
            </Link>
          </motion.div>

          <motion.div variants={fadeUpVariants}>
            <Link 
              href="/categories/minuman" 
              className="group flex flex-col items-center text-center p-8 rounded-[2rem] bg-card border-2 border-border shadow-sm hover:border-blue-500 hover:shadow-[0_8px_30px_rgb(59,130,246,0.15)] hover:-translate-y-1 transition-all duration-300 h-full"
            >
              <div className="h-16 w-16 rounded-2xl bg-blue-50/80 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <Zap className="text-blue-500 h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Minuman</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Aneka minuman menyegarkan untuk berbagai suasana.</p>
            </Link>
          </motion.div>

          <motion.div variants={fadeUpVariants}>
            <Link 
              href="/categories/snack" 
              className="group flex flex-col items-center text-center p-8 rounded-[2rem] bg-card border-2 border-border shadow-sm hover:border-orange-500 hover:shadow-[0_8px_30px_rgb(249,115,22,0.15)] hover:-translate-y-1 transition-all duration-300 h-full"
            >
              <div className="h-16 w-16 rounded-2xl bg-orange-50/80 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <Star className="text-orange-500 h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Cemilan</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Pilihan snack lezat pendamping waktu santai Anda.</p>
            </Link>
          </motion.div>

          <motion.div variants={fadeUpVariants}>
            <Link 
              href="/categories/mie-makanan-instan" 
              className="group flex flex-col items-center text-center p-8 rounded-[2rem] bg-card border-2 border-border shadow-sm hover:border-rose-500 hover:shadow-[0_8px_30px_rgb(244,63,94,0.15)] hover:-translate-y-1 transition-all duration-300 h-full"
            >
              <div className="h-16 w-16 rounded-2xl bg-rose-50/80 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <Clock className="text-rose-500 h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Makanan Instan</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">Solusi cepat dan praktis kapanpun Anda membutuhkan.</p>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── 3. IMMERSIVE BRAND STORY (Editorial Layout) ────────────────────── */}
      <div className="w-full bg-slate-50/50 py-16 border-y border-border/40 pb-20">
        <section className="px-6 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            
            {/* Left: Authentic Store Imagery with Parallax */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/3] lg:aspect-square rounded-[2rem] overflow-hidden group shadow-2xl border border-border/50"
            >
              <Image
                src="/images/foto toko/gambar toko.jpg"
                alt="Gerai Fisik 22Mart"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-6 rounded-2xl shadow-2xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hidden sm:block">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Star className="h-6 w-6 text-primary fill-primary/20" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-lg text-foreground">Gerai Fisik Terpadu</h4>
                    <p className="text-sm font-medium text-muted-foreground mt-1">Kunjungi langsung toko kami untuk pengalaman maksimal.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: Editorial Typography */}
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={staggerContainer}
              className="flex flex-col justify-center space-y-8 lg:pr-8"
            >
              <motion.div variants={fadeUpVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted/50 w-fit">
                <Sparkles className="h-4 w-4 text-primary fill-primary" />
                <span className="text-xs font-bold tracking-widest uppercase">Eksistensi Nyata</span>
              </motion.div>

              <motion.h2 variants={fadeUpVariants} className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] lowercase">
                Toko fisik dengan<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">jiwa digital.</span>
              </motion.h2>

              <motion.p variants={fadeUpVariants} className="text-lg md:text-xl text-muted-foreground font-medium leading-relaxed">
                Selain melayani secara virtual, 22Mart hadir merangkul Anda melalui gerai fisik eksklusif. Rasakan atmosfir berbelanja yang disempurnakan.
              </motion.p>

              <motion.div variants={fadeUpVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-border/50">
                <div className="space-y-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Layanan Personal</h3>
                  <p className="text-muted-foreground font-medium text-sm">Pramuniaga ahli untuk setiap kebutuhan spesifik Anda.</p>
                </div>
                <div className="space-y-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold">Fasilitas Modern</h3>
                  <p className="text-muted-foreground font-medium text-sm">Sistem pendingin premium yang menambah kenyamanan.</p>
                </div>
              </motion.div>

              <motion.div variants={fadeUpVariants} className="pt-4">
                <Button asChild variant="link" className="p-0 h-auto text-lg font-bold hover:text-primary group text-foreground">
                  <Link href="/about" className="flex items-center">
                    Lokasi & Jam Operasional <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

          </div>
        </div>
        </section>
      </div>

      {/* ── 4. FEATURED PRODUCTS (Enhanced Grid) ───────────────────────── */}
      <section className="px-6 py-12 bg-muted/40 rounded-[2rem] mx-4 lg:mx-10 relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 blur-[150px] rounded-full pointer-events-none" />
        <div className="max-w-[1400px] mx-auto relative z-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariants}
            className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10"
          >
            <div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-3">Kurasi Eksklusif</h2>
              <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl">Penyeleksian ketat dari ratusan produk, hanya menghadirkan yang terbaik.</p>
            </div>
            <Button asChild variant="ghost" className="hidden md:flex font-bold hover:bg-white text-base rounded-full px-6 h-12 border border-transparent hover:border-border transition-all bg-white/50">
              <Link href="/products">Katalog Lengkap <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </motion.div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-square rounded-[1.5rem]" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-5 w-1/2" />
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-10"
            >
              {featuredProducts.map((product) => (
                <motion.div key={product.id} variants={fadeUpVariants}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="py-16 text-center bg-white rounded-[2rem] border border-border/50">
              <Package className="mx-auto h-16 w-16 text-muted-foreground/30 mb-6" />
              <p className="text-xl text-muted-foreground font-bold">Koleksi sedang dipersiapkan untuk Anda.</p>
            </div>
          )}

          <div className="mt-10 flex justify-center md:hidden">
            <Button asChild size="lg" variant="outline" className="rounded-full h-12 w-full text-base font-bold border-border bg-white shadow-sm">
              <Link href="/products">Katalog Lengkap</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── 5. BRAND PROMISES (Floating Glass Cards) ────────────────────── */}
      <div className="w-full bg-slate-50/50 py-16 my-12 border-y border-border/40">
        <section className="px-6 max-w-[1400px] mx-auto relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0" />
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10"
        >
          {[
            { icon: Clock, title: "Pengiriman Ekspres", desc: "Pesanan sampai dalam hitungan jam. Kebutuhan mendesak terpenuhi seketika." },
            { icon: ShieldCheck, title: "Garansi Kualitas", desc: "Kurasi ketat 3 tahap untuk memastikan produk senantiasa prima." },
            { icon: Truck, title: "Bebas Biaya Kirim", desc: "Belanja tanpa beban pengiriman untuk pesanan berbelanja esensial Anda." }
          ].map((feature, i) => (
            <motion.div 
              key={i}
              variants={fadeUpVariants}
              whileHover={{ y: -5, scale: 1.01 }}
              className="flex flex-col items-start p-8 rounded-[2.5rem] bg-card border-2 border-border shadow-sm hover:border-primary/50 hover:shadow-[0_8px_30px_rgb(var(--primary-rgb),0.1)] transition-all duration-300"
            >
              <div className="h-16 w-16 rounded-[1rem] bg-secondary/10 flex items-center justify-center text-secondary-foreground mb-6">
                <feature.icon className="h-8 w-8" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-black mb-3">{feature.title}</h3>
              <p className="text-muted-foreground font-medium text-base leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
        </section>
      </div>

      {/* ── 6. EMAIL CAPTURE (Immersive Parallax Container) ─────────────── */}
      <section className="px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-[1400px] mx-auto bg-primary text-primary-foreground rounded-[3rem] overflow-hidden relative shadow-[0_20px_60px_rgb(var(--primary-rgb),0.3)] p-10 md:p-16 lg:p-20 flex flex-col lg:flex-row items-center justify-between gap-10"
        >
          {/* Decorative rings for depth */}
          <div className="absolute -top-[50%] -right-[15%] w-[80%] h-[200%] border-[1px] border-white/20 rounded-full rounded-tr-none rotate-12 pointer-events-none Mix-blend-overlay" />
          <div className="absolute -bottom-[50%] -left-[15%] w-[60%] h-[150%] border-[2px] border-white/5 rounded-full rotate-45 pointer-events-none" />

          <div className="relative z-10 max-w-2xl text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] mb-4 lowercase">
              Akses level baru <br className="hidden lg:block" /> gaya hidup.
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/80 font-medium leading-relaxed">
              Newsletter eksklusif. Jadilah yang pertama mengetahui rilisan produk dan hak istimewa khusus member.
            </p>
          </div>
          
          <form className="relative z-10 w-full max-w-lg flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Alamat Email Anda"
              className="flex-1 h-14 px-6 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-secondary text-base"
            />
            <Button size="lg" className="h-14 px-8 rounded-full bg-secondary text-secondary-foreground hover:bg-white shrink-0 text-base font-bold transition-transform hover:scale-105 shadow-xl">
              Daftar
            </Button>
          </form>
        </motion.div>
      </section>

    </div>
  );
}
