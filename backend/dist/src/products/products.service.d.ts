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
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                description: string | null;
                icon: string | null;
                image: string | null;
                isActive: boolean;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            isActive: boolean;
            price: number;
            stock: number;
            images: string[];
            categoryId: string;
        };
    }>;
    findAll(query: QueryProductDto): Promise<{
        products: ({
            category: {
                id: string;
                name: string;
                slug: string;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            isActive: boolean;
            price: number;
            stock: number;
            images: string[];
            categoryId: string;
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
                id: string;
                name: string;
                slug: string;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            isActive: boolean;
            price: number;
            stock: number;
            images: string[];
            categoryId: string;
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
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            icon: string | null;
            image: string | null;
            isActive: boolean;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        isActive: boolean;
        price: number;
        stock: number;
        images: string[];
        categoryId: string;
    }>;
    findById(id: string): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            icon: string | null;
            image: string | null;
            isActive: boolean;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        isActive: boolean;
        price: number;
        stock: number;
        images: string[];
        categoryId: string;
    }>;
    getRelatedProducts(productId: string, limit?: number): Promise<({
        category: {
            id: string;
            name: string;
            slug: string;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        isActive: boolean;
        price: number;
        stock: number;
        images: string[];
        categoryId: string;
    })[]>;
    update(id: string, dto: UpdateProductDto): Promise<{
        message: string;
        product: {
            category: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                description: string | null;
                icon: string | null;
                image: string | null;
                isActive: boolean;
            };
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
            isActive: boolean;
            price: number;
            stock: number;
            images: string[];
            categoryId: string;
        };
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    getFeaturedProducts(limit?: number): Promise<({
        category: {
            id: string;
            name: string;
            slug: string;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        isActive: boolean;
        price: number;
        stock: number;
        images: string[];
        categoryId: string;
    })[]>;
}
