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
      toast.success('Berhasil ditambahkan', {
        description: `${product.name} ada di keranjang Anda.`,
      });
    }
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group flex flex-col gap-4 block outline-none"
    >
      {/* ── IMAGE WRAPPER (Square, clean white background, object-contain) ── */}
      <div className="relative aspect-square w-full overflow-hidden rounded-[2rem] bg-white border border-border/40 transition-all duration-500 ease-in-out group-hover:border-primary/30 group-hover:shadow-lg">

        {/* Subtle Labels */}
        {isNew && !isOutOfStock && (
          <div className="absolute top-4 left-4 z-20">
            <span className="bg-foreground text-background text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full shadow-sm">Baru</span>
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute top-4 left-4 z-20">
            <span className="bg-destructive text-destructive-foreground text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full shadow-sm">Habis</span>
          </div>
        )}

        {/* The Image */}
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className={`object-contain object-center p-6 transition-transform duration-700 ease-out group-hover:scale-110 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      {/* ── TYPOGRAPHY & ACTIONS ── */}
      <div className="flex flex-col gap-1 px-2">
        <p className="text-[10px] sm:text-xs text-muted-foreground tracking-widest uppercase">
          {product.category?.name || 'Kategori'}
        </p>
        <h3 className="text-sm font-semibold text-foreground/90 truncate tracking-tight group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-1">
          <p className="text-base sm:text-lg font-bold text-foreground tracking-tight">
            {formatPrice(product.price)}
          </p>
          {!isOutOfStock && (
            <Button
              size="icon"
              className="h-9 w-9 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all shadow-sm"
              onClick={handleAddToCart}
              aria-label="Masukkan Ke Keranjang"
            >
              <ShoppingBag className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </Link>
  );
}
