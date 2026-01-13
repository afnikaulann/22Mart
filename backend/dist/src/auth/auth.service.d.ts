import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<{
        accessToken: any;
        message: string;
        user: any;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: any;
        message: string;
        user: {
            id: any;
            email: any;
            name: any;
            phone: any;
            role: any;
            avatar: any;
        };
    }>;
    getProfile(userId: string): Promise<any>;
    private generateTokens;
}
