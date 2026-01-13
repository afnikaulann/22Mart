import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  async create(dto: CreateCategoryDto) {
    const slug = this.generateSlug(dto.name);

    // Check if slug already exists
    const existingCategory = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      throw new BadRequestException('Kategori dengan nama tersebut sudah ada');
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

  async findOne(slug: string) {
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
      throw new NotFoundException('Kategori tidak ditemukan');
    }

    return category;
  }

  async findById(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Kategori tidak ditemukan');
    }

    return category;
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.findById(id);

    let slug = category.slug;
    if (dto.name && dto.name !== category.name) {
      slug = this.generateSlug(dto.name);

      // Check if new slug already exists
      const existingCategory = await this.prisma.category.findFirst({
        where: {
          slug,
          id: { not: id },
        },
      });

      if (existingCategory) {
        throw new BadRequestException('Kategori dengan nama tersebut sudah ada');
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

  async remove(id: string) {
    await this.findById(id);

    // Check if category has products
    const productsCount = await this.prisma.product.count({
      where: { categoryId: id },
    });

    if (productsCount > 0) {
      throw new BadRequestException(
        `Tidak dapat menghapus kategori karena masih memiliki ${productsCount} produk`,
      );
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return {
      message: 'Kategori berhasil dihapus',
    };
  }
}
