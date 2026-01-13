import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
export declare class CategoriesController {
    private categoriesService;
    constructor(categoriesService: CategoriesService);
    create(dto: CreateCategoryDto): Promise<{
        message: string;
        category: any;
    }>;
    findAll(includeInactive?: string): Promise<any>;
    findOne(slug: string): Promise<any>;
    update(id: string, dto: UpdateCategoryDto): Promise<{
        message: string;
        category: any;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
