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
  ChevronDown,
  User,
  MapPin,
  Smartphone,
  Flame,
  Apple,
  Baby,
  MonitorSmartphone,
  Milk
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';

// Mock Mega Menu Categories
const MEGA_CATEGORIES = [
  { label: 'Sembako', icon: Package, href: '/products?category=sembako' },
  { label: 'Minuman & Snack', icon: Milk, href: '/products?category=minuman-snack' },
  { label: 'Bumbu Dapur', icon: Apple, href: '/products?category=bumbu' },
  { label: 'Produk Segar', icon: Apple, href: '/products?category=segar' },
  { label: 'Ibu & Bayi', icon: Baby, href: '/products?category=bayi' },
  { label: 'Elektronik Mini', icon: MonitorSmartphone, href: '/products?category=elektronik' },
  { label: 'Promo Spesial', icon: Flame, href: '/products?promo=true', highlight: true },
];

const BOTTOM_NAV_LINKS = [
  { label: 'Promo Spesial 🔥', href: '/products?promo=true' },
  { label: 'Produk Segar', href: '/products?category=segar' },
  { label: 'Kebutuhan Ibu & Anak', href: '/products?category=bayi' },
  { label: 'Sembako Murah', href: '/products?category=sembako' },
  { label: 'Elektronik Mini', href: '/products?category=elektronik' },
];

// Calculate layout height constants for parent layout padding
// Topbar = 32px (h-8)
// Main = 72px (h-18)
// Bottom = 40px (h-10)
// Total = 144px -> pt-[144px] needed in layout.tsx
export const HEADER_HEIGHT_CLASS = "h-[144px]";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);

  const userRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  /* Close dropdowns on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node))
        setUserMenuOpen(false);
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node))
        setCategoryMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Close menus on route change */
  useEffect(() => {
    setMobileOpen(false);
    setCategoryMenuOpen(false);
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
      <header className="fixed top-0 left-0 w-full bg-white shadow-md border-b z-50 flex flex-col">
        {/* 1. TOP BAR (Thin) */}
        <div className="bg-muted/40 border-b hidden md:block">
          <div className="container mx-auto px-4 h-8 flex items-center justify-between text-xs text-muted-foreground font-medium">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 hover:text-primary cursor-pointer transition-colors">
                <Smartphone className="h-3.5 w-3.5" />
                Download Aplikasi 22Mart
              </span>
              <span className="flex items-center gap-1 hover:text-primary cursor-pointer transition-colors">
                <Package className="h-3.5 w-3.5" />
                Mulai Berjualan
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                Dikirim ke: <MapPin className="h-3.5 w-3.5 ml-1 text-primary" /> <span className="text-foreground font-semibold cursor-pointer hover:underline">Pilih Lokasi</span>
              </span>
            </div>
          </div>
        </div>

        {/* 2. MAIN HEADER */}
        <div className="container mx-auto px-4 h-[72px] flex items-center gap-4 md:gap-6">
          {/* Logo */}
          <Link href="/" className="font-extrabold text-2xl md:text-3xl tracking-tight text-primary shrink-0">
            22<span className="text-secondary">Mart</span>
          </Link>

          {/* Kategori Button / Dropdown (Desktop) */}
          <div className="hidden md:block relative shrink-0" ref={categoryRef}>
            <button
              onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
              className="flex items-center gap-2 bg-muted/40 hover:bg-primary/5 px-4 py-2.5 rounded-lg border text-sm font-semibold text-foreground transition-colors"
            >
              <Menu className="h-4 w-4" />
              Kategori
              <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${categoryMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Mega Menu Dropdown */}
            {categoryMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-[280px] bg-white rounded-xl shadow-xl border overflow-hidden flex flex-col z-50 py-2">
                {MEGA_CATEGORIES.map((cat, idx) => (
                  <Link
                    key={idx}
                    href={cat.href}
                    className={`flex items-center gap-3 px-4 py-3 text-sm hover:bg-muted/50 transition-colors ${cat.highlight ? 'text-red-500 font-bold' : 'text-foreground font-medium'}`}
                  >
                    <cat.icon className="h-4 w-4 text-muted-foreground" />
                    {cat.label}
                  </Link>
                ))}
                <div className="border-t mt-2 pt-2 px-4 pb-1">
                  <Link href="/categories" className="text-primary text-sm font-bold hover:underline">
                    Lihat Semua Kategori &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Search Bar (Elongated) */}
          <form onSubmit={handleSearch} className="flex-1 flex items-center relative group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari beras, susu, atau jajanan..."
              className="w-full h-11 pl-4 pr-12 rounded-xl border-2 border-primary/20 bg-muted/20 focus:bg-white focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Keranjang"
            >
              <ShoppingCart className="h-6 w-6 text-foreground/80" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow ring-2 ring-white">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* Auth / User */}
            {isAuthenticated ? (
              <div ref={userRef} className="relative hidden md:block">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs text-muted-foreground leading-tight">Halo,</p>
                    <p className="text-sm font-bold leading-tight max-w-[100px] truncate">{user?.name?.split(' ')[0]}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border overflow-hidden z-50">
                    <div className="px-4 py-3 border-b bg-muted/20">
                      <p className="font-bold text-sm">{user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                    </div>
                    <div className="py-2">
                      {user?.role === 'ADMIN' && (
                        <Link href="/admin" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-primary/5 transition-colors">
                          <LayoutDashboard className="h-4 w-4 text-primary" /> Dashboard Admin
                        </Link>
                      )}
                      <Link href="/orders" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-primary/5 transition-colors">
                        <Package className="h-4 w-4 text-primary" /> Pesanan Saya
                      </Link>
                      <Link href="/profile" onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-primary/5 transition-colors">
                        <Settings className="h-4 w-4 text-primary" /> Pengaturan Akun
                      </Link>
                    </div>
                    <div className="border-t p-2">
                      <Button variant="destructive" size="sm" className="w-full gap-2" onClick={handleLogout}>
                        <LogOut className="h-4 w-4" /> Keluar
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button asChild variant="outline" size="sm" className="font-semibold rounded-lg border-primary text-primary hover:bg-primary/5 h-10 px-5">
                  <Link href="/login">Masuk</Link>
                </Button>
                <Button asChild size="sm" className="font-semibold rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/90 h-10 px-5 shadow-sm">
                  <Link href="/register">Daftar</Link>
                </Button>
              </div>
            )}

            {/* Hamburger (Mobile) */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* 3. BOTTOM HEADER (Nav Row) */}
        <div className="hidden md:block bg-white border-t">
          <div className="container mx-auto px-4 h-10 flex items-center gap-6 overflow-x-auto scrollbar-hide text-sm font-medium">
            {BOTTOM_NAV_LINKS.map((link, idx) => (
              <Link
                key={idx}
                href={link.href}
                className={`flex-shrink-0 hover:text-primary transition-colors ${link.label.includes('🔥') ? 'text-red-600 font-bold' : 'text-foreground/80'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* ── Mobile Slide-down Menu ─────────────────────────────────────── */}
      <div
        className={`
          fixed top-[72px] left-0 right-0 z-40
          bg-white shadow-xl border-b
          transition-all duration-300 ease-in-out overflow-y-auto
          md:hidden
          ${mobileOpen ? 'max-h-[80vh] opacity-100 border-t' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="p-4 space-y-4">
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Menu Kategori</h4>
            {MEGA_CATEGORIES.map((cat, idx) => (
              <Link
                key={idx}
                href={cat.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
              >
                <cat.icon className="h-4 w-4 text-muted-foreground" />
                {cat.label}
              </Link>
            ))}
          </div>

          <div className="border-t pt-4 space-y-2">
            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-2">
                <Button asChild variant="outline" className="w-full border-primary text-primary">
                  <Link href="/login">Masuk</Link>
                </Button>
                <Button asChild className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  <Link href="/register">Daftar</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start gap-2">
                  <Link href="/profile"><User className="h-4 w-4" /> Akun Saya</Link>
                </Button>
                <Button variant="destructive" className="w-full justify-start gap-2" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" /> Keluar
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden mt-[72px]"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
