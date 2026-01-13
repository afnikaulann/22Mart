'use client';

import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, FolderTree, Loader2 } from 'lucide-react';
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
import { categoriesApi } from '@/lib/api';
import { Category } from '@/types';
import { useForm } from 'react-hook-form';

interface CategoryForm {
  name: string;
  description: string;
  icon: string;
  image: string;
  isActive: boolean;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CategoryForm>();

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const response = await categoriesApi.getAll(true);
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openCreateDialog = () => {
    setEditingCategory(null);
    reset({
      name: '',
      description: '',
      icon: '',
      image: '',
      isActive: true,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    reset({
      name: category.name,
      description: category.description || '',
      icon: category.icon || '',
      image: category.image || '',
      isActive: category.isActive,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = async (data: CategoryForm) => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: data.name,
        description: data.description || undefined,
        icon: data.icon || undefined,
        image: data.image || undefined,
        isActive: data.isActive,
      };

      if (editingCategory) {
        await categoriesApi.update(editingCategory.id, payload);
        toast.success('Kategori berhasil diperbarui');
      } else {
        await categoriesApi.create(payload);
        toast.success('Kategori berhasil ditambahkan');
      }

      setIsDialogOpen(false);
      fetchCategories();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal menyimpan kategori';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await categoriesApi.delete(id);
      toast.success('Kategori berhasil dihapus');
      fetchCategories();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Gagal menghapus kategori';
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manajemen Kategori</h1>
          <p className="text-muted-foreground">Kelola kategori produk</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Kategori
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nama Kategori</label>
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
                <label className="text-sm font-medium">Deskripsi</label>
                <textarea
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  {...register('description')}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Icon (emoji atau URL)</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  {...register('icon')}
                />
              </div>
              <div>
                <label className="text-sm font-medium">URL Gambar</label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  {...register('image')}
                />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="isActive" {...register('isActive')} />
                <label htmlFor="isActive" className="text-sm font-medium">
                  Kategori Aktif
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
                  {editingCategory ? 'Simpan' : 'Tambah'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : categories.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className="rounded-xl border bg-card p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-2xl">
                    {category.icon || <FolderTree className="h-6 w-6 text-primary" />}
                  </div>
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category._count?.products || 0} produk
                    </p>
                  </div>
                </div>
                <Badge variant={category.isActive ? 'default' : 'secondary'}>
                  {category.isActive ? 'Aktif' : 'Nonaktif'}
                </Badge>
              </div>
              {category.description && (
                <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                  {category.description}
                </p>
              )}
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => openEditDialog(category)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus Kategori</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus kategori &quot;{category.name}&quot;?
                        Kategori dengan produk tidak dapat dihapus.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(category.id)}
                        className="bg-destructive text-destructive-foreground"
                      >
                        Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border bg-card p-12 text-center">
          <FolderTree className="mx-auto h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">Belum ada kategori</p>
        </div>
      )}
    </div>
  );
}
