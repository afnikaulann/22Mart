import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, QueryProductDto } from './dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    private generateSlug;
    create(dto: CreateProductDto): Promise<{
        message: string;
        product: {
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
        } & {
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
        };
    }>;
    findAll(query: QueryProductDto): Promise<{
        products: ({
            category: {
                name: string;
                id: string;
                slug: string;
            };
        } & {
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
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findAllAdmin(query: QueryProductDto): Promise<{
        products: ({
            category: {
                name: string;
                id: string;
                slug: string;
            };
        } & {
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
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(slug: string): Promise<{
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
    } & {
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
    }>;
    findById(id: string): Promise<{
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
    } & {
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
    }>;
    getRelatedProducts(productId: string, limit?: number): Promise<({
        category: {
            name: string;
            id: string;
            slug: string;
        };
    } & {
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
    })[]>;
    update(id: string, dto: UpdateProductDto): Promise<{
        message: string;
        product: {
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
        } & {
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
        };
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    getFeaturedProducts(limit?: number): Promise<({
        category: {
            name: string;
            id: string;
            slug: string;
        };
    } & {
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
    })[]>;
}
