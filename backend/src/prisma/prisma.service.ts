import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private pool: Pool;

  constructor() {
    // Prisma 7: Create a PostgreSQL connection pool
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });

    // Create Prisma adapter with the pool
    const adapter = new PrismaPg(pool);

    // Pass adapter to PrismaClient
    super({
      adapter,
      log: ['error', 'warn'],
    });

    this.pool = pool;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
  }
}
