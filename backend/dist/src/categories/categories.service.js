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
exports.CategoriesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CategoriesService = class CategoriesService {
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
        const slug = this.generateSlug(dto.name);
        const existingCategory = await this.prisma.category.findUnique({
            where: { slug },
        });
        if (existingCategory) {
            throw new common_1.BadRequestException('Kategori dengan nama tersebut sudah ada');
        }
        const category = await this.prisma.category.create({
            data: {
                name: dto.name,
                slug,
                description: dto.description,
                icon: dto.icon,
                image: dto.image,
                isActive: dto.isActive ?? true,
            },
        });
        return {
            message: 'Kategori berhasil dibuat',
            category,
        };
    }
    async findAll(includeInactive = false) {
        const where = includeInactive ? {} : { isActive: true };
        const categories = await this.prisma.category.findMany({
            where,
            include: {
                _count: {
                    select: { products: true },
                },
            },
            orderBy: { name: 'asc' },
        });
        return categories;
    }
    async findOne(slug) {
        const category = await this.prisma.category.findUnique({
            where: { slug },
            include: {
                products: {
                    where: { isActive: true },
                    take: 20,
                },
                _count: {
                    select: { products: true },
                },
            },
        });
        if (!category) {
            throw new common_1.NotFoundException('Kategori tidak ditemukan');
        }
        return category;
    }
    async findById(id) {
        const category = await this.prisma.category.findUnique({
            where: { id },
        });
        if (!category) {
            throw new common_1.NotFoundException('Kategori tidak ditemukan');
        }
        return category;
    }
    async update(id, dto) {
        const category = await this.findById(id);
        let slug = category.slug;
        if (dto.name && dto.name !== category.name) {
            slug = this.generateSlug(dto.name);
            const existingCategory = await this.prisma.category.findFirst({
                where: {
                    slug,
                    id: { not: id },
                },
            });
            if (existingCategory) {
                throw new common_1.BadRequestException('Kategori dengan nama tersebut sudah ada');
            }
        }
        const updatedCategory = await this.prisma.category.update({
            where: { id },
            data: {
                name: dto.name,
                slug,
                description: dto.description,
                icon: dto.icon,
                image: dto.image,
                isActive: dto.isActive,
            },
        });
        return {
            message: 'Kategori berhasil diperbarui',
            category: updatedCategory,
        };
    }
    async remove(id) {
        await this.findById(id);
        const productsCount = await this.prisma.product.count({
            where: { categoryId: id },
        });
        if (productsCount > 0) {
            throw new common_1.BadRequestException(`Tidak dapat menghapus kategori karena masih memiliki ${productsCount} produk`);
        }
        await this.prisma.category.delete({
            where: { id },
        });
        return {
            message: 'Kategori berhasil dihapus',
        };
    }
};
exports.CategoriesService = CategoriesService;
exports.CategoriesService = CategoriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CategoriesService);
//# sourceMappingURL=categories.service.js.map