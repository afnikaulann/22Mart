# Rencana Implementasi E-Commerce 22mart.id

## Ringkasan Proyek
Membangun website e-commerce modern **22mart.id** dengan konsep seperti Alfagift untuk minimarket online. Tema warna: **Ungu-Kuning**.

## Tech Stack yang Sudah Ada
- **Frontend**: Next.js 16 + React 19 + TailwindCSS 4 + shadcn/ui + React Query + Axios
- **Backend**: NestJS 11 + Prisma + PostgreSQL + JWT + Argon2

---

## FASE 1: Setup Database & Backend Core

### 1.1 Prisma Schema (Database Models)
```prisma
- User (id, email, password, name, phone, role, avatar, createdAt)
- Category (id, name, slug, icon, description)
- Product (id, name, slug, description, price, stock, images, categoryId, isActive)
- Cart (id, userId)
- CartItem (id, cartId, productId, quantity)
- Order (id, userId, status, totalAmount, shippingAddress, paymentMethod, createdAt)
- OrderItem (id, orderId, productId, quantity, price)
```

### 1.2 Backend Modules
1. **Auth Module**: Register, Login, Logout, JWT Guards
2. **Users Module**: Profile management
3. **Categories Module**: CRUD categories (admin)
4. **Products Module**: CRUD products (admin) + List/Search (public)
5. **Cart Module**: Add/Remove/Update cart items
6. **Orders Module**: Checkout, Order history, Order management (admin)
7. **Upload Module**: Image upload untuk produk

---

## FASE 2: Frontend - Setup & Tema

### 2.1 Konfigurasi Tema Ungu-Kuning
- Primary (Ungu): `#7C3AED` (violet-600)
- Secondary/Accent (Kuning): `#FBBF24` (amber-400)
- Background: `#FAF5FF` (light purple tint)

### 2.2 Layout & Komponen Dasar
1. **Header**: Logo 22mart.id, Search bar, Kategori, Cart icon, User menu
2. **Footer**: Info kontak, links, copyright
3. **Sidebar Mobile**: Navigation menu responsif

---

## FASE 3: Fitur Pengguna (Customer)

### 3.1 Halaman Publik
1. **Homepage** (`/`)
   - Hero banner dengan promo
   - Kategori produk (grid icons)
   - Produk populer/terbaru
   - Produk diskon

2. **Katalog Produk** (`/products`)
   - Filter by kategori
   - Search produk
   - Sorting (harga, terbaru)
   - Pagination
   - Grid produk dengan gambar, nama, harga, stok

3. **Detail Produk** (`/products/[slug]`)
   - Gambar produk (gallery)
   - Info: nama, harga, stok, deskripsi
   - Tombol "Tambah ke Keranjang"
   - Produk terkait

4. **Kategori** (`/categories/[slug]`)
   - Produk berdasarkan kategori

### 3.2 Autentikasi
1. **Login** (`/login`)
2. **Register** (`/register`)
3. **Forgot Password** (`/forgot-password`)

### 3.3 Keranjang & Checkout
1. **Keranjang** (`/cart`)
   - Daftar item
   - Update quantity
   - Hapus item
   - Total harga
   - Tombol checkout

2. **Checkout** (`/checkout`)
   - Form alamat pengiriman
   - Pilih metode pembayaran
   - Ringkasan pesanan
   - Konfirmasi order

3. **Riwayat Pesanan** (`/orders`)
   - Daftar pesanan user
   - Detail pesanan

---

## FASE 4: Fitur Admin

### 4.1 Dashboard Admin (`/admin`)
1. **Overview**
   - Statistik: total produk, pesanan, user
   - Pesanan terbaru

2. **Manajemen Produk** (`/admin/products`)
   - Tabel produk dengan pagination
   - Tambah produk baru
   - Edit produk (gambar, harga, stok, dll)
   - Hapus produk
   - Filter by kategori

3. **Manajemen Kategori** (`/admin/categories`)
   - CRUD kategori

4. **Manajemen Pesanan** (`/admin/orders`)
   - Daftar pesanan
   - Update status pesanan
   - Detail pesanan

5. **Manajemen User** (`/admin/users`)
   - Daftar user
   - Ubah role user

---

## FASE 5: Fitur Tambahan

1. **Image Upload**: Supabase Storage untuk gambar produk
2. **Toast Notifications**: Sonner untuk feedback
3. **Loading States**: Skeleton loaders
4. **Form Validation**: Zod + React Hook Form
5. **Responsive Design**: Mobile-first approach

---

## Struktur Folder

### Frontend
```
frontend/src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (main)/
│   │   ├── layout.tsx (Header + Footer)
│   │   ├── page.tsx (Homepage)
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/page.tsx
│   │   ├── categories/[slug]/page.tsx
│   │   ├── cart/page.tsx
│   │   ├── checkout/page.tsx
│   │   └── orders/page.tsx
│   ├── admin/
│   │   ├── layout.tsx (Admin sidebar)
│   │   ├── page.tsx (Dashboard)
│   │   ├── products/page.tsx
│   │   ├── categories/page.tsx
│   │   ├── orders/page.tsx
│   │   └── users/page.tsx
│   └── layout.tsx
├── components/
│   ├── ui/ (shadcn)
│   ├── layout/ (Header, Footer, Sidebar)
│   ├── products/ (ProductCard, ProductGrid)
│   ├── cart/ (CartItem, CartSummary)
│   └── admin/ (AdminSidebar, DataTable)
├── lib/
│   ├── api.ts (Axios instance)
│   ├── auth.ts (Auth utilities)
│   └── utils.ts
├── hooks/
│   ├── use-auth.ts
│   ├── use-cart.ts
│   └── use-products.ts
├── stores/
│   └── cart-store.ts (Zustand)
└── types/
    └── index.ts
```

### Backend
```
backend/src/
├── auth/
├── users/
├── categories/
├── products/
├── cart/
├── orders/
├── upload/
├── common/
│   ├── guards/
│   ├── decorators/
│   └── dto/
└── prisma/
```

---

## Urutan Implementasi

### Tahap 1: Backend Foundation
1. Setup Prisma schema dengan semua models
2. Buat Auth module (register, login, JWT)
3. Buat Categories module (CRUD)
4. Buat Products module (CRUD + public endpoints)

### Tahap 2: Frontend Foundation
1. Setup tema warna ungu-kuning
2. Buat layout utama (Header, Footer)
3. Buat homepage dengan kategori dan produk
4. Buat halaman katalog produk

### Tahap 3: Autentikasi
1. Halaman login & register
2. Auth context/hooks
3. Protected routes

### Tahap 4: Keranjang & Checkout
1. Cart module (backend)
2. Cart page (frontend)
3. Orders module (backend)
4. Checkout flow (frontend)

### Tahap 5: Admin Panel
1. Admin layout dengan sidebar
2. CRUD produk
3. CRUD kategori
4. Manajemen pesanan

### Tahap 6: Polish
1. Image upload
2. Loading states
3. Error handling
4. Mobile responsiveness
5. Testing

---

## Estimasi File yang Akan Dibuat/Dimodifikasi

**Backend (~25 files)**:
- Prisma schema
- 6 modules (auth, users, categories, products, cart, orders)
- Guards, decorators, DTOs

**Frontend (~40 files)**:
- Theme configuration
- Layout components
- 10+ pages
- Reusable components
- API hooks
- Types

---

## Apakah Anda setuju dengan rencana ini?

Jika ya, saya akan mulai implementasi dari **Tahap 1: Backend Foundation**.
