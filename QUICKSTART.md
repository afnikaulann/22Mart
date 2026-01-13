# 🚀 Quick Start Guide

## Option 1: Automated Setup (Recommended)

Simply run the setup script:

```bash
setup.bat
```

This will automatically:
- Install all dependencies
- Generate Prisma client
- Run database migrations
- Build and verify the backend
- Set up the frontend

## Option 2: Manual Setup

### Backend Setup (in order)

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
pnpm install

# 3. Generate Prisma client
pnpm prisma generate

# 4. Run database migrations
pnpm prisma migrate dev --name init

# 5. Verify build
pnpm run build
```

### Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
pnpm install
```

## Running the Application

### Start both servers (from root directory)
```bash
pnpm run dev
```
- Backend: http://localhost:4000
- Frontend: http://localhost:3000
- API Docs: http://localhost:4000/api/docs

### Start servers separately

**Backend only:**
```bash
pnpm run dev:api
```

**Frontend only:**
```bash
pnpm run dev:web
```

## 📝 What's Already Configured

✅ Backend `.env` file with Supabase database connection
✅ Frontend `.env.local` file with API URL
✅ Prisma schema configured for connection pooling
✅ All necessary dependencies listed in package.json

## ⚠️ Common Issues

### Issue: "Cannot find module '@nestjs/common'"
**Solution:** Run `pnpm install` in the backend directory

### Issue: "Property 'user' does not exist on type 'PrismaService'"
**Solution:** Run `pnpm prisma generate` in the backend directory

### Issue: Database connection errors
**Solution:** 
1. Check your Supabase database is active
2. Verify DATABASE_URL in `backend/.env`
3. Run migrations: `pnpm prisma migrate dev`

### Issue: TypeScript build errors
**Solution:** 
1. Delete `backend/node_modules` and run `pnpm install`
2. Run `pnpm prisma generate`
3. Restart your editor/IDE

## 🎯 Next Steps After Setup

1. **Create Admin User**: Register a user, then update their role to ADMIN in Prisma Studio
   ```bash
   cd backend
   pnpm prisma studio
   ```

2. **Add Sample Data**: Create categories and products through the admin dashboard

3. **Test the Application**: 
   - Browse products
   - Add items to cart
   - Complete a checkout flow
   - Manage orders in admin panel

## 📚 Need Help?

- Check the full README.md for detailed documentation
- Review API documentation at http://localhost:4000/api/docs
- Check the backend logs for error details

---

Happy coding! 🎉
