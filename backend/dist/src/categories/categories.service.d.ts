import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    private generateSlug;
    create(dto: CreateCategoryDto): Promise<{
        message: string;
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            icon: string | null;
            image: string | null;
            isActive: boolean;
            slug: string;
        };
    }>;
    findAll(includeInactive?: boolean): Promise<({
        _count: {
            products: number;
        };
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        icon: string | null;
        image: string | null;
        isActive: boolean;
        slug: string;
    })[]>;
    findOne(slug: string): Promise<{
        _count: {
            products: number;
        };
        products: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            isActive: boolean;
            slug: string;
            categoryId: string;
            price: number;
            stock: number;
            images: string[];
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        icon: string | null;
        image: string | null;
        isActive: boolean;
        slug: string;
    }>;
    findById(id: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        icon: string | null;
        image: string | null;
        isActive: boolean;
        slug: string;
    }>;
    update(id: string, dto: UpdateCategoryDto): Promise<{
        message: string;
        category: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            icon: string | null;
            image: string | null;
            isActive: boolean;
            slug: string;
        };
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
