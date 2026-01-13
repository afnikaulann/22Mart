import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, QueryProductDto } from './dto';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
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
    getFeaturedProducts(limit?: string): Promise<any>;
    findOne(slug: string): Promise<any>;
    getRelatedProducts(id: string, limit?: string): Promise<any>;
    update(id: string, dto: UpdateProductDto): Promise<{
        message: string;
        product: any;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
