import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
    create(dto: CreateCategoryDto): Promise<{
        message: string;
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
    }>;
    findAll(includeInactive?: string): Promise<({
        _count: {
            products: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        icon: string | null;
        image: string | null;
        isActive: boolean;
    })[]>;
    findOne(slug: string): Promise<{
        products: {
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
        }[];
        _count: {
            products: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
        icon: string | null;
        image: string | null;
        isActive: boolean;
    }>;
    update(id: string, dto: UpdateCategoryDto): Promise<{
        message: string;
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
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
