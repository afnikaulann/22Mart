import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as argon2 from 'argon2';
import * as fs from 'fs';
import * as path from 'path';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await argon2.hash('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'admin@22mart.id' },
    update: {},
    create: {
      email: 'admin@22mart.id',
      password: adminPassword,
      name: 'Admin 22Mart',
      role: 'ADMIN',
      phone: '081234567890',
      address: 'Jl. Contoh No. 123, Jakarta',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create regular user
  const userPassword = await argon2.hash('user123');
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      name: 'John Doe',
      role: 'USER',
      phone: '081234567891',
      address: 'Jl. Customer No. 456, Bandung',
    },
  });
  console.log('✅ Regular user created:', user.email);

  // Create categories
  const categories = [
    {
      name: 'Aksesoris Elektronik',
      slug: 'aksesoris-elektronik',
      description: 'Berbagai macam aksesoris elektronik',
      isActive: true,
    },
    {
      name: 'Fresh Food',
      slug: 'fresh-food',
      description: 'Berbagai makanan segar pilihan',
      isActive: true,
    },
    {
      name: 'Ice Cream',
      slug: 'ice-cream',
      description: 'Es krim yang lezat dan menyegarkan',
      isActive: true,
    },
    {
      name: 'Kebutuhan Dapur',
      slug: 'kebutuhan-dapur',
      description: 'Kebutuhan dan peralatan dapur sehari-hari',
      isActive: true,
    },
    {
      name: 'Mie & Makanan Instan',
      slug: 'mie-makanan-instan',
      description: 'Aneka mie dan makanan instan',
      isActive: true,
    },
    {
      name: 'Minuman',
      slug: 'minuman',
      description: 'Beragam minuman segar dan menyehatkan',
      isActive: true,
    },
    {
      name: 'Snack',
      slug: 'snack',
      description: 'Cemilan dan makanan ringan untuk bersantai',
      isActive: true,
    },
  ];

  console.log('📦 Creating categories...');
  const createdCategories: Array<{ id: string; slug: string; name: string }> = [];
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
    createdCategories.push(created);
    console.log(`  ✓ ${created.name}`);
  }

  // Check if products.json exists
  let productsData: any[] = [];
  try {
    const productsFilePath = path.join(__dirname, 'products.json');
    productsData = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
    console.log(`📦 Loaded ${productsData.length} products from products.json`);
  } catch (error) {
    console.log('⚠️ Could not load products.json, continuing without seeding dynamic products...');
  }

  console.log('🛍️  Creating products...');
  for (const product of productsData) {
    const category = createdCategories.find((c) => c.slug === product.categorySlug);
    if (!category) {
      console.log(`  ! Category not found for product: ${product.name}`);
      continue;
    }

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        stock: product.stock,
        images: product.images,
        categoryId: category.id,
        isActive: product.isActive,
      },
    });
    // uncomment the below line if you want verbose logs
    // console.log(`  ✓ ${product.name}`);
  }

  console.log('\n✨ Database seeded successfully!');
  console.log('\n📝 Test Accounts:');
  console.log('   Admin: admin@22mart.id / admin123');
  console.log('   User: user@example.com / user123');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await pool.end();
    await prisma.$disconnect();
  });
