'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import {
  Search,
  ShoppingCart,
  Menu,
  X,
  LogOut,
  Package,
  Settings,
  LayoutDashboard,
  User,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';

export const HEADER_HEIGHT_CLASS = "h-[80px]";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node))
        setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) {
      router.push(`/products?search=${encodeURIComponent(q)}`);
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    router.push('/');
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out border-b ${scrolled
          ? 'bg-primary/95 backdrop-blur-xl border-white/10 py-4 shadow-lg'
          : 'bg-primary border-transparent py-6'
          }`}
      >
        <div className="container mx-auto px-6 h-auto flex items-center justify-between gap-8 max-w-[1400px]">

          {/* Logo - Ultra Clean */}
          <Link href="/" className="font-extrabold text-2xl tracking-tighter text-white shrink-0 group">
            22<span className="text-secondary group-hover:text-white transition-colors">Mart</span>.
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/products" className="text-sm font-semibold tracking-wide text-white/90 hover:text-secondary transition-colors">Semua Kategori</Link>
            <Link href="/products?promo=true" className="text-sm font-semibold tracking-wide text-white/90 hover:text-secondary transition-colors">Promo Terbatas</Link>
            <Link href="/about" className="text-sm font-semibold tracking-wide text-white/90 hover:text-secondary transition-colors">Tentang Kami</Link>
          </nav>

          {/* Search Bar - Invisible Outline */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm items-center relative group">
            <Search className="h-4 w-4 absolute left-4 text-white/70 group-focus-within:text-foreground transition-colors z-10" strokeWidth={2} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari koleksi kami..."
              className="w-full h-11 pl-11 pr-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 focus:border-secondary focus:bg-white focus:text-foreground text-white transition-all text-sm font-medium tracking-wide placeholder:text-white/60 focus:shadow-sm outline-none"
            />
          </form>

          {/* Right Actions - Minimal Icons */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2 rounded-full text-white hover:bg-white/10 transition-all duration-300"
              aria-label="Keranjang"
            >
              <ShoppingCart className="h-5 w-5" strokeWidth={2} />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 transform translate-x-1/4 -translate-y-1/4 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground shadow-sm ring-2 ring-primary">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Auth / User */}
            {isAuthenticated ? (
              <div ref={userRef} className="relative hidden sm:block">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-white/10 transition-colors border border-transparent hover:border-white/20"
                >
                  <div className="h-8 w-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold text-xs uppercase tracking-wider">
                    {user?.name?.charAt(0) || <User className="h-4 w-4" />}
                  </div>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-4 w-60 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-border/40 overflow-hidden z-50 transform origin-top-right transition-all">
                    <div className="px-5 py-4 border-b">
                      <p className="font-semibold text-sm tracking-tight">{user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate font-medium">{user?.email}</p>
                    </div>
                    <div className="py-2">
                      {user?.role === 'ADMIN' && (
                        <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                          <LayoutDashboard className="h-4 w-4" /> Admin Console
                        </Link>
                      )}
                      <Link href="/orders" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                        <Package className="h-4 w-4" /> Riwayat Pesanan
                      </Link>
                      <Link href="/profile" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                        <Settings className="h-4 w-4" /> Pengaturan
                      </Link>
                    </div>
                    <div className="p-2 border-t border-border/40 bg-muted/20">
                      <button className="flex w-full items-center justify-center gap-2 px-4 py-2 text-xs font-semibold tracking-wider uppercase text-foreground bg-white border border-border rounded-xl hover:bg-muted transition-colors" onClick={handleLogout}>
                        Keluar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button asChild variant="ghost" size="sm" className="font-semibold rounded-full hover:bg-white/10 h-10 px-5 text-white hover:text-secondary">
                  <Link href="/login">Masuk</Link>
                </Button>
                <Button asChild size="sm" className="font-semibold rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 h-10 px-6 shadow-sm">
                  <Link href="/register">Buat Akun</Link>
                </Button>
              </div>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2 rounded-full hover:bg-white/10 text-white transition-colors ml-2"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Fullscreen Menu ─────────────────────────────────────── */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[100] bg-white lg:hidden flex flex-col h-[100dvh]">
          <div className="flex items-center justify-between p-6 border-b">
            <span className="font-extrabold text-2xl tracking-tighter text-foreground">
              22<span className="text-muted-foreground">Mart</span>.
            </span>
            <button onClick={() => setMobileOpen(false)} className="p-2 rounded-full bg-muted text-foreground hover:bg-muted/80">
              <X className="h-5 w-5" strokeWidth={2.5} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-start">
            <nav className="flex flex-col gap-6 text-xl font-bold tracking-tight">
              <Link href="/products" className="text-foreground border-b pb-4">Koleksi Lengkap</Link>
              <Link href="/products?promo=true" className="text-foreground border-b pb-4">Promo</Link>
              <Link href="/categories" className="text-foreground border-b pb-4">Telusuri Kategori</Link>
            </nav>

            <div className="mt-8 space-y-4">
              <form onSubmit={handleSearch} className="flex items-center relative">
                <Search className="h-4 w-4 absolute left-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari..."
                  className="w-full h-12 pl-11 pr-4 rounded-xl bg-muted border-none focus:outline-none focus:ring-2 focus:ring-foreground transition-all text-sm font-medium"
                />
              </form>
            </div>

            <div className="mt-auto space-y-3 pt-8 pb-4">
              {!isAuthenticated ? (
                <>
                  <Button asChild className="w-full bg-foreground text-background h-12 rounded-xl text-base font-bold shadow-lg">
                    <Link href="/register">Buat Akun</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full border-border text-foreground h-12 rounded-xl text-base font-bold">
                    <Link href="/login">Masuk</Link>
                  </Button>
                </>
              ) : (
                <>
                  <Button asChild variant="outline" className="w-full border-border text-foreground h-12 rounded-xl text-base font-bold justify-start px-6 gap-3">
                    <Link href="/profile"><User className="h-5 w-5" /> Akun Saya</Link>
                  </Button>
                  <Button variant="ghost" className="w-full text-muted-foreground h-12 rounded-xl text-base font-semibold justify-start px-6 hover:bg-muted" onClick={handleLogout}>
                    Keluar
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
