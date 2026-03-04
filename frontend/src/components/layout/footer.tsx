'use client';

import Link from 'next/link';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-6 pt-32 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-8 mb-32">

          <div className="lg:col-span-2">
            <Link href="/" className="inline-block text-4xl font-extrabold tracking-tighter mb-8">
              22Mart.
            </Link>
            <p className="text-background/60 text-lg max-w-sm mb-10 leading-relaxed font-medium tracking-tight">
              Eksklusivitas dalam setiap kebutuhan harian Anda. Kurasi premium, layanan tanpa kompromi.
            </p>
            <div className="flex gap-4">
              <a href="#" className="h-12 w-12 rounded-full border border-background/20 flex items-center justify-center hover:bg-background hover:text-foreground transition-all duration-300">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="h-12 w-12 rounded-full border border-background/20 flex items-center justify-center hover:bg-background hover:text-foreground transition-all duration-300">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="h-12 w-12 rounded-full border border-background/20 flex items-center justify-center hover:bg-background hover:text-foreground transition-all duration-300">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-8 tracking-tight">Eksplorasi</h3>
            <ul className="space-y-5 text-background/60 font-medium">
              <li><Link href="/products" className="hover:text-background transition-colors">Koleksi Terbaru</Link></li>
              <li><Link href="/categories" className="hover:text-background transition-colors">Kategori Premium</Link></li>
              <li><Link href="/products?promo=true" className="hover:text-background transition-colors">Penawaran Eksklusif</Link></li>
              <li><Link href="/about" className="hover:text-background transition-colors">Tentang Kami</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-8 tracking-tight">Akun</h3>
            <ul className="space-y-5 text-background/60 font-medium">
              <li><Link href="/login" className="hover:text-background transition-colors">Masuk</Link></li>
              <li><Link href="/register" className="hover:text-background transition-colors">Daftar Keanggotaan</Link></li>
              <li><Link href="/orders" className="hover:text-background transition-colors">Pesanan Saya</Link></li>
              <li><Link href="/cart" className="hover:text-background transition-colors">Keranjang</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-8 tracking-tight">Layanan</h3>
            <ul className="space-y-5 text-background/60 font-medium">
              <li><button className="hover:text-background transition-colors">Hubungi Kami</button></li>
              <li><Link href="/faq" className="hover:text-background transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-background transition-colors">Pengiriman & Pengembalian</Link></li>
              <li><Link href="/privacy" className="hover:text-background transition-colors">Kebijakan Privasi</Link></li>
            </ul>
          </div>

        </div>

        <div className="border-t border-background/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-background/40 text-sm font-medium">
          <p>&copy; {new Date().getFullYear()} 22Mart. Hak cipta dilindungi.</p>
          <div className="flex gap-8">
            <Link href="/terms" className="hover:text-background transition-colors">Syarat & Ketentuan</Link>
            <Link href="/privacy" className="hover:text-background transition-colors">Privasi</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
