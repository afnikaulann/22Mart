'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Minus,
  Package,
  Plus,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from '@/components/products/product-card';
import { productsApi } from '@/lib/api';
import { useCart } from '@/lib/cart-context';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const response = await productsApi.getOne(slug);
        setProduct(response.data);

        // Fetch related products
        if (response.data.id) {
          const relatedResponse = await productsApi.getRelated(response.data.id, 4);
          setRelatedProducts(relatedResponse.data);
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
        router.push('/products');
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug, router]);

  const handleAddToCart = async () => {
    if (product) {
      await addToCart(product.id, quantity);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const images = product.images.length > 0 ? product.images : ['/placeholder-product.jpg'];
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">
            Produk
          </Link>
          <span>/</span>
          <Link
            href={`/products?categoryId=${product.categoryId}`}
            className="hover:text-primary"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>

        {/* Product details */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-xl border bg-white">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain p-4"
                priority
              />
              {isOutOfStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <span className="rounded-full bg-white px-4 py-2 font-semibold text-destructive">
                    Stok Habis
                  </span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${
                      selectedImage === index
                        ? 'border-primary'
                        : 'border-transparent hover:border-muted-foreground'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <Badge variant="secondary" className="mb-2">
              {product.category.name}
            </Badge>
            <h1 className="mb-2 text-2xl font-bold lg:text-3xl">{product.name}</h1>
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="h-4 w-4" />
              <span>Stok: {product.stock} tersedia</span>
            </div>
            <p className="mb-6 text-3xl font-bold text-primary">
              {formatPrice(product.price)}
            </p>

            {product.description && (
              <div className="mb-6">
                <h3 className="mb-2 font-semibold">Deskripsi</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>
            )}

            {/* Quantity */}
            {!isOutOfStock && (
              <div className="mb-6">
                <h3 className="mb-2 font-semibold">Jumlah</h3>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center text-lg font-semibold">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={incrementQuantity}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Maks. {product.stock}
                  </span>
                </div>
              </div>
            )}

            {/* Total */}
            {!isOutOfStock && (
              <div className="mb-6 rounded-lg bg-muted p-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-xl font-bold text-primary">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mb-6 flex gap-3">
              <Button
                size="lg"
                className="flex-1 gap-2"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5" />
                {isOutOfStock ? 'Stok Habis' : 'Tambah ke Keranjang'}
              </Button>
            </div>

            {/* Features */}
            <div className="space-y-3 rounded-lg border p-4">
              <div className="flex items-center gap-3 text-sm">
                <Truck className="h-5 w-5 text-primary" />
                <span>Gratis ongkir untuk pembelian di atas Rp 100.000</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-5 w-5 text-primary" />
                <span>Garansi produk asli 100%</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RotateCcw className="h-5 w-5 text-primary" />
                <span>Bisa retur dalam 7 hari</span>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="mb-6 text-2xl font-bold">Produk Terkait</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
