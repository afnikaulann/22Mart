'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const isOutOfStock = product.stock <= 0;
  const imageUrl = product.images?.[0] || '/placeholder-product.jpg';

  // High-end e-commerce often uses subtle tags instead of massive discount badges
  const isNew = typeof product.id === 'string' && product.id.charCodeAt(0) % 2 === 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      await addToCart(product.id, 1);
      toast.success('Di Keranjang', {
        description: `${product.name} siap di-checkout.`,
        duration: 2000,
        position: 'bottom-center'
      });
    }
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col gap-5 block outline-none"
    >
      {/* ── IMAGE WRAPPER (No borders, just a beautiful muted expanse) ── */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-muted/40 transition-all duration-700 ease-in-out group-hover:bg-muted/60">

        {/* Subtle Labels */}
        {isNew && !isOutOfStock && (
          <div className="absolute top-4 left-4 z-20">
            <span className="bg-foreground text-background text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">Baru</span>
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute top-4 left-4 z-20">
            <span className="bg-destructive text-destructive-foreground text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">Habis</span>
          </div>
        )}

        {/* The Image */}
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className={`object-cover object-center p-4 transition-transform duration-1000 ease-out group-hover:scale-[1.03] group-hover:p-0 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* ── FADE-IN HOVER ACTION ── */}
        {!isOutOfStock && (
          <div className="absolute inset-0 bg-background/5 backdrop-blur-[2px] opacity-0 transition-opacity duration-500 flex items-end justify-center pb-6 group-hover:opacity-100">
            <Button
              onClick={handleAddToCart}
              className="w-[85%] rounded-full h-12 bg-white/95 text-black hover:bg-white hover:scale-105 shadow-xl transition-all duration-300 font-semibold"
            >
              <ShoppingBag className="mr-2 h-4 w-4" /> Masukkan Keranjang
            </Button>
          </div>
        )}
      </div>

      {/* ── TYPOGRAPHY (Clean, tracking-tight, minimalist) ── */}
      <div className="flex flex-col gap-1 px-1">
        <p className="text-[10px] sm:text-xs text-muted-foreground tracking-widest uppercase">
          {product.category?.name || 'Kategori'}
        </p>
        <h3 className="text-sm font-semibold text-foreground/80 truncate tracking-tight group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="text-base font-bold text-foreground tracking-tight">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
