# 22Mart - E-Commerce Platform

A full-stack e-commerce application built with modern web technologies.

## 🚀 Tech Stack

### Backend
- **Framework**: NestJS
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: JWT with Passport
- **Validation**: class-validator, class-transformer
- **API Documentation**: Swagger
- **File Storage**: Supabase Storage

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Styling**: TailwindCSS v4
- **UI Components**: Radix UI (shadcn/ui)
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Query (TanStack Query)
- **API Client**: Axios
- **Animations**: Framer Motion, GSAP, Three.js

## 📦 Features

### User Features
- 🔐 User authentication (Register/Login)
- 🛍️ Browse products with search and filters
- 🛒 Shopping cart management
- 📦 Order tracking
- 👤 User profile management
- 💳 Multiple payment methods (COD, Transfer, E-Wallet)

### Admin Features
- 📊 Dashboard with statistics
- 👥 User management
- 🏷️ Category management
- 📦 Product management
- 📋 Order management and status updates

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- pnpm (recommended) or npm
- PostgreSQL database (or Supabase account)

### 1. Clone the repository
```bash
git clone <repository-url>
cd 22Mart
```

### 2. Backend Setup

#### Install dependencies
```bash
cd backend
pnpm install
```

#### Configure environment variables
The `.env` file is already created with Supabase database credentials. Update if needed:
```env
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."
JWT_SECRET="your-secret-key"
PORT=4000
FRONTEND_URL="http://localhost:3000"
SUPABASE_URL="your-supabase-url"
SUPABASE_KEY="your-supabase-key"
```

#### Generate Prisma Client
```bash
pnpm prisma generate
```

#### Run database migrations
```bash
pnpm prisma migrate dev --name init
```

#### Seed the database (optional)
```bash
# Create sample categories and products
pnpm prisma db seed
```

#### Start the backend server
```bash
# Development mode
pnpm run start:dev

# Production mode
pnpm run build
pnpm run start:prod
```

Backend will run on `http://localhost:4000`
API Documentation: `http://localhost:4000/api/docs`

### 3. Frontend Setup

#### Install dependencies
```bash
cd ../frontend
pnpm install
```

#### Configure environment variables
The `.env.local` file is already created:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

#### Start the frontend development server
```bash
pnpm run dev
```

Frontend will run on `http://localhost:3000`

### 4. Run both servers concurrently (from root)
```bash
cd ..
pnpm install  # Install concurrently
pnpm run dev
```

## 📁 Project Structure

```
22Mart/
├── backend/
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── categories/     # Category management
│   │   ├── products/       # Product management
│   │   ├── cart/           # Shopping cart
│   │   ├── orders/         # Order management
│   │   ├── prisma/         # Prisma service
│   │   └── common/         # Guards, decorators, etc.
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/     # Auth pages
│   │   │   ├── (main)/     # Main pages (products, cart, etc.)
│   │   │   └── admin/      # Admin dashboard
│   │   ├── components/
│   │   │   ├── layout/     # Header, Footer
│   │   │   ├── products/   # Product components
│   │   │   └── ui/         # Reusable UI components
│   │   └── lib/
│   │       ├── api.ts      # API client
│   │       ├── auth-context.tsx
│   │       └── cart-context.tsx
│   └── package.json
│
└── package.json            # Root package.json for concurrent dev
```

## 🗄️ Database Schema

### Models
- **User**: User accounts with roles (USER/ADMIN)
- **Category**: Product categories
- **Product**: Products with images, pricing, and stock
- **Cart**: Shopping carts
- **CartItem**: Items in cart
- **Order**: Customer orders
- **OrderItem**: Items in orders

### Enums
- **Role**: USER, ADMIN
- **OrderStatus**: PENDING, PROCESSING, SHIPPED, DELIVERED, CANCELLED
- **PaymentMethod**: COD, TRANSFER, EWALLET

## 🔑 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get user profile

### Products
- `GET /api/products` - List products (with filters)
- `GET /api/products/:slug` - Get product details
- `POST /api/products` - Create product (Admin)
- `PATCH /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PATCH /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove cart item

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - List user's orders
- `GET /api/orders/:id` - Get order details
- `GET /api/orders/admin` - List all orders (Admin)
- `PATCH /api/orders/admin/:id/status` - Update order status (Admin)

Full API documentation available at: `http://localhost:4000/api/docs`

## 🐛 Troubleshooting

### TypeScript Errors
If you see TypeScript errors about missing modules:
1. Make sure all dependencies are installed: `pnpm install`
2. Generate Prisma client: `pnpm prisma generate`
3. Restart your IDE/editor

### Database Connection Issues
1. Verify your `DATABASE_URL` in `.env` is correct
2. Make sure your database is running (or Supabase is accessible)
3. Run migrations: `pnpm prisma migrate dev`

### Port Already in Use
If ports 3000 or 4000 are already in use:
- Backend: Change `PORT` in `backend/.env`
- Frontend: Run with custom port: `pnpm dev -- -p 3001`

## 📝 Default Admin Account

After seeding (if you create a seed script), you can create an admin user through Prisma Studio:
```bash
cd backend
pnpm prisma studio
```

Or register normally and update the role in the database.

## 🚀 Deployment

### Backend (NestJS)
- Can be deployed to: Heroku, Railway, Render, AWS, DigitalOcean
- Make sure to set environment variables
- Run migrations before starting: `pnpm prisma migrate deploy`

### Frontend (Next.js)
- Can be deployed to: Vercel, Netlify, Railway
- Set `NEXT_PUBLIC_API_URL` to your production API URL
- Next.js will automatically optimize the build

## 📄 License

This project is private and for educational purposes.

## 👥 Contributors

- Your Name

---

Built with ❤️ using NestJS and Next.js
