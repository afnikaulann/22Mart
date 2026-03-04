"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pg_1 = require("pg");
const argon2 = __importStar(require("argon2"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    console.log('🌱 Starting database seed...');
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
    const createdCategories = [];
    for (const category of categories) {
        const created = await prisma.category.upsert({
            where: { slug: category.slug },
            update: {},
            create: category,
        });
        createdCategories.push(created);
        console.log(`  ✓ ${created.name}`);
    }
    let productsData = [];
    try {
        const productsFilePath = path.join(__dirname, 'products.json');
        productsData = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));
        console.log(`📦 Loaded ${productsData.length} products from products.json`);
    }
    catch (error) {
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
//# sourceMappingURL=seed.js.map