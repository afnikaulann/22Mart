import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
export declare class CategoriesService {
    private prisma;
    constructor(prisma: PrismaService);
    private generateSlug;
    create(dto: CreateCategoryDto): Promise<{
        message: string;
        category: any;
    }>;
    findAll(includeInactive?: boolean): Promise<any>;
    findOne(slug: string): Promise<any>;
    findById(id: string): Promise<any>;
    update(id: string, dto: UpdateCategoryDto): Promise<{
        message: string;
        category: any;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
