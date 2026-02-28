import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        message: string;
        user: {
            id: string;
            email: string;
            name: string;
            phone: string | null;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        message: string;
        user: {
            id: string;
            email: string;
            name: string;
            phone: string | null;
            role: import("@prisma/client").$Enums.Role;
            avatar: string | null;
        };
    }>;
    getProfile(userId: string): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string | null;
        address: string | null;
        avatar: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
    }>;
    private generateTokens;
}
