'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Package,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { productsApi, categoriesApi } from '@/lib/api';
import { Product, Category, Pagination } from '@/types';
import { formatPrice } from '@/lib/utils';
import { useForm } from 'react-hook-form';

interface ProductForm {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  images: string;
  isActive: boolean;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProductForm>();

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await productsApi.getAllAdmin({
        search: search || undefined,
        categoryId: categoryFilter || undefined,
        page,
        limit: 10,
      });
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesApi.getAll(true);
        setCategories(response.data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [search, categoryFilter, page]);

  const openCreateDialog = () => {
    setEditingProduct(null);
    reset({
      name: '',
      description: '',
      price: 0,
      stock: 0,
      categoryId: '',
      images: '',
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    reset({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
      images: product.images.join(', '),
      isActive: product.isActive,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: ProductForm) => {
    setIsSubmitting(true);
    try {
      const images = data.images
        .split(',')
        .map((url) => url.trim())
        .filter((url) => url);

      const payload = {
        name: data.name,
        description: data.description || undefined,
        price: Number(data.price),
        stock: Number(data.stock),
        categoryId: data.categoryId,
        images,
        isActive: data.isActive,
      };

      if (editingProduct) {
        await productsApi.update(editingProduct.id, payload);
        toast.success('Produk berhasil diperbarui');
      } else {
        await productsApi.create(payload);
        toast.success('Produk berhasil ditambahkan');
      }

      setIsDialogOpen(false);
      fetchProducts();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal menyimpan produk';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await productsApi.delete(id);
      toast.success('Produk berhasil dihapus');
      fetchProducts();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal menghapus produk';
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Produk</h1>
          <p className="text-muted-foreground">
            Kelola produk toko Anda
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Produk
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nama Produk</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  {...register('name', { required: 'Nama wajib diisi' })}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium">Kategori</label>
                <select
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  {...register('categoryId', { required: 'Kategori wajib dipilih' })}
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="mt-1 text-sm text-destructive">{errors.categoryId.message}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Harga (Rp)</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    {...register('price', { required: 'Harga wajib diisi', min: 0 })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Stok</label>
                  <input
                    type="number"
                    className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                    {...register('stock', { required: 'Stok wajib diisi', min: 0 })}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Deskripsi</label>
                <textarea
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  {...register('description')}
                />
              </div>
              <div>
                <label className="text-sm font-medium">URL Gambar</label>
                <input
                  type="text"
                  placeholder="Pisahkan dengan koma untuk multiple gambar"
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  {...register('images')}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  {...register('isActive')}
                />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Produk Aktif
                </label>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Batal
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingProduct ? 'Simpan' : 'Tambah'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari produk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Semua Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Semua Kategori</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Products Table */}
      <div className="rounded-xl border bg-card">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Produk</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Kategori</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Harga</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Stok</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted">
                          <Image
                            src={product.images?.[0] || '/placeholder-product.jpg'}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">{product.category?.name}</td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-4 py-3 text-sm">{product.stock}</td>
                    <td className="px-4 py-3">
                      <Badge variant={product.isActive ? 'default' : 'secondary'}>
                        {product.isActive ? 'Aktif' : 'Nonaktif'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditDialog(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus Produk</AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus produk &quot;{product.name}&quot;? Tindakan ini tidak dapat dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(product.id)}
                                className="bg-destructive text-destructive-foreground"
                              >
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Package className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Tidak ada produk ditemukan</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Sebelumnya
          </Button>
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            Halaman {page} dari {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Selanjutnya
          </Button>
        </div>
      )}
    </div>
  );
}
