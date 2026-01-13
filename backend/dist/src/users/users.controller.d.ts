import { UsersService } from './users.service';
import { ChangePasswordDto, UpdateProfileDto } from './dto';
import type { Role } from '../common/decorators';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        message: string;
        user: any;
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    findAll(page?: string, limit?: string, search?: string, role?: Role): Promise<{
        users: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    getStats(): Promise<{
        totalUsers: any;
        totalAdmins: any;
        newUsersThisMonth: any;
    }>;
    findOne(id: string): Promise<any>;
    updateRole(id: string, role: Role): Promise<{
        message: string;
    }>;
}
