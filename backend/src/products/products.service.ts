import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, QueryProductDto, SortBy } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  async create(dto: CreateProductDto) {
    // Verify category exists
    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new BadRequestException('Kategori tidak ditemukan');
    }

    // Generate unique slug
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

  async findAll(query: QueryProductDto) {
    const {
      search,
      categoryId,
      sortBy = SortBy.NEWEST,
      page = 1,
      limit = 12,
      minPrice,
      maxPrice,
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ProductWhereInput = {
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
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    // Build orderBy clause
    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };
    switch (sortBy) {
      case SortBy.OLDEST:
        orderBy = { createdAt: 'asc' };
        break;
      case SortBy.PRICE_LOW:
        orderBy = { price: 'asc' };
        break;
      case SortBy.PRICE_HIGH:
        orderBy = { price: 'desc' };
        break;
      case SortBy.NAME_ASC:
        orderBy = { name: 'asc' };
        break;
      case SortBy.NAME_DESC:
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

  async findAllAdmin(query: QueryProductDto) {
    const { search, categoryId, page = 1, limit = 12 } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {};

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

  async findOne(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Produk tidak ditemukan');
    }

    return product;
  }

  async findById(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Produk tidak ditemukan');
    }

    return product;
  }

  async getRelatedProducts(productId: string, limit = 4) {
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

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.findById(id);

    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });

      if (!category) {
        throw new BadRequestException('Kategori tidak ditemukan');
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

  async remove(id: string) {
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
}
