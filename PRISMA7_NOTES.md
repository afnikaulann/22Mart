# Prisma 7 Configuration Notes

## What Changed in Prisma 7?

Prisma 7 introduces a new configuration approach where database URLs are moved from `schema.prisma` to `prisma.config.ts`.

## Configuration Files

### 1. `prisma/schema.prisma`
```prisma
datasource db {
  provider = "postgresql"
  // ❌ No more url or directUrl here!
}
```

### 2. `prisma.config.ts` (Migration configuration)
```typescript
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  datasource: {
    url: process.env["DIRECT_URL"], // Used for migrations
  },
});
```

### 3. `src/prisma/prisma.service.ts` (Runtime configuration)
```typescript
constructor() {
  super({
    datasourceUrl: process.env.DATABASE_URL, // Used at runtime (pooled)
  });
}
```

## Why Two URLs?

With **Supabase**, you need two different connection strings:

1. **DIRECT_URL**: Direct connection (port 5432)
   - Used for: Migrations, schema pushes
   - Bypasses connection pooling
   - Required for migrations to work

2. **DATABASE_URL**: Pooled connection (port 6543)
   - Used for: Runtime queries
   - Uses PgBouncer connection pooling
   - Better performance for production

## Environment Variables

Your `.env` file should have both:
```env
# For runtime queries (connection pooling)
DATABASE_URL="postgresql://user:pass@host:6543/db?pgbouncer=true"

# For migrations (direct connection)
DIRECT_URL="postgresql://user:pass@host:5432/db"
```

## Commands

All Prisma commands work the same:
```bash
# Generate client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev --name init

# Open Prisma Studio
pnpm prisma studio

# Push schema without migrations
pnpm prisma db push
```

## References

- [Prisma 7 Config Docs](https://pris.ly/d/config-datasource)
- [Prisma Client Config](https://pris.ly/d/prisma7-client-config)
- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)

---

✅ All configuration files have been updated for Prisma 7 compatibility!
