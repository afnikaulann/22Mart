import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        message: string;
        user: any;
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
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
}
