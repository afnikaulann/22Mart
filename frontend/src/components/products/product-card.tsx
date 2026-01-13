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

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="group relative overflow-hidden rounded-xl border bg-card transition-all hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60">
              <span className="rounded-full bg-white px-3 py-1 text-sm font-medium text-destructive">
                Stok Habis
              </span>
            </div>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <div className="absolute left-2 top-2">
              <span className="rounded-full bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
                Sisa {product.stock}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          <p className="mb-1 text-xs text-muted-foreground">
            {product.category?.name}
          </p>

          {/* Name */}
          <h3 className="mb-2 line-clamp-2 text-sm font-medium leading-tight">
            {product.name}
          </h3>

          {/* Price */}
          <p className="mb-3 text-lg font-bold text-primary">
            {formatPrice(product.price)}
          </p>

          {/* Stock info */}
          <div className="mb-3 flex items-center gap-1 text-xs text-muted-foreground">
            <Package className="h-3 w-3" />
            <span>Stok: {product.stock}</span>
          </div>

          {/* Add to cart button */}
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="w-full gap-2"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4" />
            {isOutOfStock ? 'Stok Habis' : 'Tambah'}
          </Button>
        </div>
      </div>
    </Link>
  );
}
