import { UsersService } from './users.service';
import { ChangePasswordDto, UpdateProfileDto } from './dto';
import type { Role } from '../common/decorators';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    updateProfile(userId: string, dto: UpdateProfileDto): Promise<{
        message: string;
        user: {
            email: string;
            name: string;
            phone: string | null;
            id: string;
            address: string | null;
            avatar: string | null;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    findAll(page?: string, limit?: string, search?: string, role?: Role): Promise<{
        users: {
            email: string;
            name: string;
            phone: string | null;
            id: string;
            role: import("@prisma/client").$Enums.Role;
            createdAt: Date;
            _count: {
                orders: number;
            };
        }[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getStats(): Promise<{
        totalUsers: number;
        totalAdmins: number;
        newUsersThisMonth: number;
    }>;
    findOne(id: string): Promise<{
        email: string;
        name: string;
        phone: string | null;
        id: string;
        address: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
        orders: {
            id: string;
            createdAt: Date;
            orderNumber: string;
            status: import("@prisma/client").$Enums.OrderStatus;
            totalAmount: number;
        }[];
        _count: {
            orders: number;
        };
    }>;
    updateRole(id: string, role: Role): Promise<{
        message: string;
    }>;
}
