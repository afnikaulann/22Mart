// Prisma 7 Configuration
// This configures both migration and runtime database connections
import { config } from "dotenv";
import { resolve } from "path";
import { defineConfig } from "prisma/config";

config({ path: resolve(__dirname, ".env") });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use DIRECT_URL for migrations (direct connection, not pooled)
    // Runtime uses DATABASE_URL (pooled connection) - passed to PrismaClient
    url: process.env["DIRECT_URL"] || process.env["DATABASE_URL"],
  },
});
