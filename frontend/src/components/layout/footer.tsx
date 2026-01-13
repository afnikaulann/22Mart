'use client';

import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-1 font-bold text-2xl mb-4">
              <span className="text-white">22</span>
              <span className="text-secondary">mart</span>
              <span className="text-white">.id</span>
            </Link>
            <p className="text-sm text-primary-foreground/80 mb-4">
              Platform belanja online untuk kebutuhan sehari-hari. Mudah, cepat, dan terpercaya.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="rounded-full bg-white/10 p-2 transition-colors hover:bg-white/20"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="mb-4 font-semibold text-lg">Belanja</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <Link href="/products" className="hover:text-white transition-colors">
                  Semua Produk
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-white transition-colors">
                  Kategori
                </Link>
              </li>
              <li>
                <Link href="/products?sortBy=newest" className="hover:text-white transition-colors">
                  Produk Terbaru
                </Link>
              </li>
              <li>
                <Link href="/products?sortBy=price_low" className="hover:text-white transition-colors">
                  Promo
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="mb-4 font-semibold text-lg">Akun</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Masuk
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">
                  Daftar
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-white transition-colors">
                  Pesanan Saya
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Keranjang
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-semibold text-lg">Hubungi Kami</h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 flex-shrink-0" />
                <span>Jl. Contoh No. 123, Kota, Indonesia</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <span>+62 812 3456 7890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <span>info@22mart.id</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col items-center justify-between gap-4 text-center text-sm text-primary-foreground/60 md:flex-row">
            <p>&copy; {new Date().getFullYear()} 22mart.id. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="/terms" className="hover:text-white transition-colors">
                Syarat & Ketentuan
              </Link>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Kebijakan Privasi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
