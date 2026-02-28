'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { useCart } from '@/lib/cart-context';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const isOutOfStock = product.stock <= 0;
  const imageUrl = product.images?.[0] || '/placeholder-product.jpg';

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      await addToCart(product.id, 1);
    }
  };

  // Simulate a discount for UI purposes (10-30% off, deterministically based on ID length/chars so it doesn't jump)
  const discountPercent = (product.id.charCodeAt(0) % 3) * 10 + 10; // 10%, 20%, or 30%
  const originalPrice = product.price * (1 + discountPercent / 100);

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="group relative flex h-full flex-col overflow-hidden rounded-xl border bg-white transition-all hover:border-primary hover:shadow-md">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          />
          {/* Discount Badge */}
          {!isOutOfStock && (
            <div className="absolute left-0 top-0 rounded-br-lg bg-red-600 px-2 py-1 text-[10px] font-bold text-white shadow-sm">
              Diskon {discountPercent}%
            </div>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-[1px]">
              <span className="rounded-md bg-destructive/90 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                Stok Habis
              </span>
            </div>
          )}
        </div>

        {/* Content (Dense Padding) */}
        <div className="flex flex-1 flex-col p-3">
          {/* Category */}
          <p className="mb-1 text-[10px] sm:text-xs text-muted-foreground truncate">
            {product.category?.name || 'Kategori'}
          </p>

          {/* Name - strictly 2 lines */}
          <h3 className="mb-1 text-xs sm:text-sm font-medium leading-tight line-clamp-2 min-h-[32px] sm:min-h-[40px]">
            {product.name}
          </h3>

          <div className="mt-auto pt-2">
            {/* Strikethrough Price */}
            <p className="text-[10px] sm:text-xs text-muted-foreground line-through decoration-red-400">
              {formatPrice(originalPrice)}
            </p>
            {/* Final Price (Red) */}
            <p className="mb-2 text-sm sm:text-base font-bold text-red-600">
              {formatPrice(product.price)}
            </p>

            {/* Add to cart button */}
            <Button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`w-full gap-1.5 h-8 sm:h-9 text-xs sm:text-sm font-semibold transition-colors ${isOutOfStock ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              size="sm"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              {isOutOfStock ? 'Habis' : '+ Keranjang'}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
