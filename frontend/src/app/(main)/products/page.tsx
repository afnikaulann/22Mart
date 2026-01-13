'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Filter, Package, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductCard } from '@/components/products/product-card';
import { Skeleton } from '@/components/ui/skeleton';
import { categoriesApi, productsApi } from '@/lib/api';
import { Category, Product, Pagination } from '@/types';

const sortOptions = [
  { value: 'newest', label: 'Terbaru' },
  { value: 'oldest', label: 'Terlama' },
  { value: 'price_low', label: 'Harga Terendah' },
  { value: 'price_high', label: 'Harga Tertinggi' },
  { value: 'name_asc', label: 'Nama A-Z' },
  { value: 'name_desc', label: 'Nama Z-A' },
];

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Get query params
  const search = searchParams.get('search') || '';
  const categoryId = searchParams.get('categoryId') || '';
  const sortBy = searchParams.get('sortBy') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesApi.getAll();
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await productsApi.getAll({
          search: search || undefined,
          categoryId: categoryId || undefined,
          sortBy,
          page,
          limit: 12,
        });
        setProducts(response.data.products);
        setPagination(response.data.pagination);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [search, categoryId, sortBy, page]);

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== 'page') {
      params.delete('page'); // Reset page when filters change
    }
    router.push(`/products?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push('/products');
  };

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const hasFilters = search || categoryId;

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {selectedCategory ? selectedCategory.name : 'Semua Produk'}
          </h1>
          {search && (
            <p className="mt-2 text-muted-foreground">
              Hasil pencarian untuk &quot;{search}&quot;
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {/* Mobile filter toggle */}
            <Button
              variant="outline"
              className="lg:hidden"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>

            {/* Category filter - Desktop */}
            <div className="hidden lg:block">
              <Select value={categoryId} onValueChange={(value) => updateParams('categoryId', value)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Semua Kategori</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Active filters */}
            {hasFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-destructive hover:text-destructive"
              >
                <X className="mr-1 h-4 w-4" />
                Hapus Filter
              </Button>
            )}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Urutkan:</span>
            <Select value={sortBy} onValueChange={(value) => updateParams('sortBy', value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Mobile filters panel */}
        {showFilters && (
          <div className="mb-6 rounded-lg border bg-card p-4 lg:hidden">
            <h3 className="mb-4 font-semibold">Filter</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Kategori</label>
                <Select value={categoryId} onValueChange={(value) => updateParams('categoryId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Semua Kategori</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {/* Products grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square rounded-xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                <Button
                  variant="outline"
                  disabled={page <= 1}
                  onClick={() => updateParams('page', String(page - 1))}
                >
                  Sebelumnya
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? 'default' : 'outline'}
                        size="icon"
                        onClick={() => updateParams('page', String(pageNum))}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  disabled={page >= pagination.totalPages}
                  onClick={() => updateParams('page', String(page + 1))}
                >
                  Selanjutnya
                </Button>
              </div>
            )}

            {/* Results info */}
            {pagination && (
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Menampilkan {products.length} dari {pagination.total} produk
              </p>
            )}
          </>
        ) : (
          <div className="py-20 text-center">
            <Package className="mx-auto h-16 w-16 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">Tidak ada produk ditemukan</h3>
            <p className="mt-2 text-muted-foreground">
              {search
                ? 'Coba ubah kata kunci pencarian Anda'
                : 'Belum ada produk tersedia untuk kategori ini'}
            </p>
            {hasFilters && (
              <Button className="mt-4" onClick={clearFilters}>
                Hapus Filter
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
