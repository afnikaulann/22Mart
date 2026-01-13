import { PrismaService } from '../prisma/prisma.service';
import { ChangePasswordDto, UpdateProfileDto } from './dto';
import { Role } from '../common/decorators';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        message: string;
        user: any;
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    findAll(page?: number, limit?: number, search?: string, role?: Role): Promise<{
        users: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<any>;
    updateRole(id: string, role: Role): Promise<{
        message: string;
    }>;
    getStats(): Promise<{
        totalUsers: any;
        totalAdmins: any;
        newUsersThisMonth: any;
    }>;
}
