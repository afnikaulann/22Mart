"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const dto_1 = require("./dto");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    generateSlug(name) {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }
    async create(dto) {
        const category = await this.prisma.category.findUnique({
            where: { id: dto.categoryId },
        });
        if (!category) {
            throw new common_1.BadRequestException('Kategori tidak ditemukan');
        }
        let slug = this.generateSlug(dto.name);
        const existingProduct = await this.prisma.product.findUnique({
            where: { slug },
        });
        if (existingProduct) {
            slug = `${slug}-${Date.now()}`;
        }
        const product = await this.prisma.product.create({
            data: {
                name: dto.name,
                slug,
                description: dto.description,
                price: dto.price,
                stock: dto.stock,
                images: dto.images || [],
                categoryId: dto.categoryId,
                isActive: dto.isActive ?? true,
            },
            include: {
                category: true,
            },
        });
        return {
            message: 'Produk berhasil dibuat',
            product,
        };
    }
    async findAll(query) {
        const { search, categoryId, sortBy = dto_1.SortBy.NEWEST, page = 1, limit = 12, minPrice, maxPrice, } = query;
        const skip = (page - 1) * limit;
        const where = {
            isActive: true,
        };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (categoryId) {
            where.categoryId = categoryId;
        }
        if (minPrice !== undefined || maxPrice !== undefined) {
            where.price = {};
            if (minPrice !== undefined)
                where.price.gte = minPrice;
            if (maxPrice !== undefined)
                where.price.lte = maxPrice;
        }
        let orderBy = { createdAt: 'desc' };
        switch (sortBy) {
            case dto_1.SortBy.OLDEST:
                orderBy = { createdAt: 'asc' };
                break;
            case dto_1.SortBy.PRICE_LOW:
                orderBy = { price: 'asc' };
                break;
            case dto_1.SortBy.PRICE_HIGH:
                orderBy = { price: 'desc' };
                break;
            case dto_1.SortBy.NAME_ASC:
                orderBy = { name: 'asc' };
                break;
            case dto_1.SortBy.NAME_DESC:
                orderBy = { name: 'desc' };
                break;
        }
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                },
                orderBy,
                skip,
                take: limit,
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findAllAdmin(query) {
        const { search, categoryId, page = 1, limit = 12 } = query;
        const skip = (page - 1) * limit;
        const where = {};
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
            ];
        }
        if (categoryId) {
            where.categoryId = categoryId;
        }
        const [products, total] = await Promise.all([
            this.prisma.product.findMany({
                where,
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.product.count({ where }),
        ]);
        return {
            products,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(slug) {
        const product = await this.prisma.product.findUnique({
            where: { slug },
            include: {
                category: true,
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Produk tidak ditemukan');
        }
        return product;
    }
    async findById(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
            },
        });
        if (!product) {
            throw new common_1.NotFoundException('Produk tidak ditemukan');
        }
        return product;
    }
    async getRelatedProducts(productId, limit = 4) {
        const product = await this.findById(productId);
        const relatedProducts = await this.prisma.product.findMany({
            where: {
                categoryId: product.categoryId,
                id: { not: productId },
                isActive: true,
            },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
            take: limit,
        });
        return relatedProducts;
    }
    async update(id, dto) {
        const product = await this.findById(id);
        if (dto.categoryId) {
            const category = await this.prisma.category.findUnique({
                where: { id: dto.categoryId },
            });
            if (!category) {
                throw new common_1.BadRequestException('Kategori tidak ditemukan');
            }
        }
        let slug = product.slug;
        if (dto.name && dto.name !== product.name) {
            slug = this.generateSlug(dto.name);
            const existingProduct = await this.prisma.product.findFirst({
                where: {
                    slug,
                    id: { not: id },
                },
            });
            if (existingProduct) {
                slug = `${slug}-${Date.now()}`;
            }
        }
        const updatedProduct = await this.prisma.product.update({
            where: { id },
            data: {
                name: dto.name,
                slug,
                description: dto.description,
                price: dto.price,
                stock: dto.stock,
                images: dto.images,
                categoryId: dto.categoryId,
                isActive: dto.isActive,
            },
            include: {
                category: true,
            },
        });
        return {
            message: 'Produk berhasil diperbarui',
            product: updatedProduct,
        };
    }
    async remove(id) {
        await this.findById(id);
        await this.prisma.product.delete({
            where: { id },
        });
        return {
            message: 'Produk berhasil dihapus',
        };
    }
    async getFeaturedProducts(limit = 8) {
        const products = await this.prisma.product.findMany({
            where: { isActive: true },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
        return products;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map