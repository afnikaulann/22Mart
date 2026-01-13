import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto, QueryProductDto } from './dto';
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    private generateSlug;
    create(dto: CreateProductDto): Promise<{
        message: string;
        product: any;
    }>;
    findAll(query: QueryProductDto): Promise<{
        products: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    findAllAdmin(query: QueryProductDto): Promise<{
        products: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    findOne(slug: string): Promise<any>;
    findById(id: string): Promise<any>;
    getRelatedProducts(productId: string, limit?: number): Promise<any>;
    update(id: string, dto: UpdateProductDto): Promise<{
        message: string;
        product: any;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    getFeaturedProducts(limit?: number): Promise<any>;
}
