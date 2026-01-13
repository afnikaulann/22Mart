import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, QueryProductDto } from './dto';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
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
    getFeaturedProducts(limit?: string): Promise<({
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
    getRelatedProducts(id: string, limit?: string): Promise<({
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
}
