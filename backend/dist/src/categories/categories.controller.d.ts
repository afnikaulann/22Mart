import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
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
    findAll(includeInactive?: string): Promise<({
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
