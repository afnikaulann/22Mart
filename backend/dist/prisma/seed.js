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
            name: 'Makanan',
            slug: 'makanan',
            description: 'Berbagai macam makanan siap saji dan bahan makanan',
            isActive: true,
        },
        {
            name: 'Minuman',
            slug: 'minuman',
            description: 'Minuman segar dan berkualitas untuk setiap hari',
            isActive: true,
        },
        {
            name: 'Susu & Dairy',
            slug: 'susu',
            description: 'Produk susu dan olahan dairy berkualitas',
            isActive: true,
        },
        {
            name: 'Snack',
            slug: 'snack',
            description: 'Camilan dan makanan ringan favorit',
            isActive: true,
        },
        {
            name: 'Kebersihan',
            slug: 'kebersihan',
            description: 'Produk kebersihan dan perawatan rumah',
            isActive: true,
        },
        {
            name: 'Produk Bayi',
            slug: 'bayi',
            description: 'Kebutuhan bayi dan anak',
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
    const products = [
        {
            name: 'Indomie Goreng',
            slug: 'indomie-goreng',
            description: 'Mie instan goreng rasa original. Praktis dan lezat untuk setiap saat.',
            price: 3500,
            stock: 100,
            images: ['https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400'],
            categoryId: createdCategories.find((c) => c.slug === 'makanan').id,
            isActive: true,
        },
        {
            name: 'Beras Premium 5kg',
            slug: 'beras-premium-5kg',
            description: 'Beras putih premium kualitas terbaik, pulen dan harum.',
            price: 75000,
            stock: 50,
            images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'],
            categoryId: createdCategories.find((c) => c.slug === 'makanan').id,
            isActive: true,
        },
        {
            name: 'Telur Ayam Negeri 10 butir',
            slug: 'telur-ayam-10-butir',
            description: 'Telur ayam negeri segar, kaya protein untuk keluarga.',
            price: 28000,
            stock: 75,
            images: ['https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400'],
            categoryId: createdCategories.find((c) => c.slug === 'makanan').id,
            isActive: true,
        },
        {
            name: 'Roti Tawar Gandum',
            slug: 'roti-tawar-gandum',
            description: 'Roti tawar gandum utuh, sehat dan bergizi untuk sarapan.',
            price: 15000,
            stock: 40,
            images: ['https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400'],
            categoryId: createdCategories.find((c) => c.slug === 'makanan').id,
            isActive: true,
        },
        {
            name: 'Aqua Botol 600ml',
            slug: 'aqua-600ml',
            description: 'Air mineral dalam kemasan, segar dan menyehatkan.',
            price: 4000,
            stock: 200,
            images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400'],
            categoryId: createdCategories.find((c) => c.slug === 'minuman').id,
            isActive: true,
        },
        {
            name: 'Teh Botol Sosro 450ml',
            slug: 'teh-botol-sosro',
            description: 'Teh dalam botol dengan rasa asli teh melati yang menyegarkan.',
            price: 5500,
            stock: 150,
            images: ['https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400'],
            categoryId: createdCategories.find((c) => c.slug === 'minuman').id,
            isActive: true,
        },
        {
            name: 'Coca Cola 390ml',
            slug: 'coca-cola-390ml',
            description: 'Minuman bersoda favorit dengan rasa yang menyegarkan.',
            price: 6000,
            stock: 120,
            images: ['https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400'],
            categoryId: createdCategories.find((c) => c.slug === 'minuman').id,
            isActive: true,
        },
        {
            name: 'Jus Jeruk Tropicana 1L',
            slug: 'jus-jeruk-tropicana',
            description: 'Jus jeruk asli 100% tanpa pengawet dan pewarna buatan.',
            price: 18000,
            stock: 60,
            images: ['https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400'],
            categoryId: createdCategories.find((c) => c.slug === 'minuman').id,
            isActive: true,
        },
        {
            name: 'Susu Ultra Milk Full Cream 1L',
            slug: 'ultra-milk-full-cream',
            description: 'Susu segar full cream dengan kandungan nutrisi lengkap.',
            price: 17000,
            stock: 80,
            images: ['https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400'],
            categoryId: createdCategories.find((c) => c.slug === 'susu').id,
            isActive: true,
        },
        {
            name: 'Yogurt Greek Heavenly Blush',
            slug: 'yogurt-greek-heavenly-blush',
            description: 'Yogurt Greek dengan kandungan protein tinggi dan rendah lemak.',
            price: 12000,
            stock: 50,
            images: ['https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400'],
            categoryId: createdCategories.find((c) => c.slug === 'susu').id,
            isActive: true,
        },
        {
            name: 'Keju Cheddar Kraft 165g',
            slug: 'keju-cheddar-kraft',
            description: 'Keju cheddar berkualitas untuk melengkapi hidangan Anda.',
            price: 35000,
            stock: 40,
            images: ['https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400'],
            categoryId: createdCategories.find((c) => c.slug === 'susu').id,
            isActive: true,
        },
        {
            name: 'Chitato Rasa Sapi Panggang',
            slug: 'chitato-sapi-panggang',
            description: 'Keripik kentang renyah dengan rasa sapi panggang yang lezat.',
            price: 11000,
            stock: 90,
            images: ['https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400'],
            categoryId: createdCategories.find((c) => c.slug === 'snack').id,
            isActive: true,
        },
        {
            name: 'Oreo Original 137g',
            slug: 'oreo-original',
            description: 'Biskuit sandwich dengan krim vanilla yang lezat.',
            price: 9500,
            stock: 100,
            images: ['https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=400'],
            categoryId: createdCategories.find((c) => c.slug === 'snack').id,
            isActive: true,
        },
        {
            name: 'Wafer Tango Coklat',
            slug: 'wafer-tango-coklat',
            description: 'Wafer dengan lapisan coklat yang renyah dan manis.',
            price: 5000,
            stock: 120,
            images: ['https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=400'],
            categoryId: createdCategories.find((c) => c.slug === 'snack').id,
            isActive: true,
        },
        {
            name: 'Sabun Mandi Lifebuoy 85g',
            slug: 'sabun-lifebuoy',
            description: 'Sabun mandi dengan perlindungan antibakteri untuk kulit sehat.',
            price: 4500,
            stock: 150,
            images: ['https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?w=400'],
            categoryId: createdCategories.find((c) => c.slug === 'kebersihan').id,
            isActive: true,
        },
        {
            name: 'Shampo Pantene 170ml',
            slug: 'shampo-pantene',
            description: 'Shampo dengan Pro-V formula untuk rambut kuat dan sehat.',
            price: 18000,
            stock: 70,
            images: ['https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?w=400'],
            categoryId: createdCategories.find((c) => c.slug === 'kebersihan').id,
            isActive: true,
        },
        {
            name: 'Deterjen Rinso 800g',
            slug: 'deterjen-rinso',
            description: 'Deterjen dengan daya bersih maksimal dan wangi tahan lama.',
            price: 22000,
            stock: 60,
            images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400'],
            categoryId: createdCategories.find((c) => c.slug === 'kebersihan').id,
            isActive: true,
        },
        {
            name: 'Pampers Premium Care S52',
            slug: 'pampers-premium-s52',
            description: 'Popok bayi dengan penyerapan ekstra untuk kenyamanan maksimal.',
            price: 110000,
            stock: 30,
            images: ['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400'],
            categoryId: createdCategories.find((c) => c.slug === 'bayi').id,
            isActive: true,
        },
        {
            name: 'Baby Oil Johnson 200ml',
            slug: 'baby-oil-johnson',
            description: 'Minyak bayi untuk kulit lembut dan terlindungi.',
            price: 28000,
            stock: 50,
            images: ['https://images.unsplash.com/photo-1598620617358-5295095a518c?w=400'],
            categoryId: createdCategories.find((c) => c.slug === 'bayi').id,
            isActive: true,
        },
        {
            name: 'Susu Formula SGM 0-6 bulan',
            slug: 'susu-formula-sgm',
            description: 'Susu formula dengan nutrisi lengkap untuk tumbuh kembang bayi.',
            price: 85000,
            stock: 40,
            images: ['https://images.unsplash.com/photo-1587318356337-315c52429eff?w=400'],
            categoryId: createdCategories.find((c) => c.slug === 'bayi').id,
            isActive: true,
        },
    ];
    console.log('🛍️  Creating products...');
    for (const product of products) {
        await prisma.product.upsert({
            where: { slug: product.slug },
            update: {},
            create: product,
        });
        console.log(`  ✓ ${product.name}`);
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