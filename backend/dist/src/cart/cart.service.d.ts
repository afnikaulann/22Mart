import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto, UpdateCartItemDto } from './dto';
export declare class CartService {
    private prisma;
    constructor(prisma: PrismaService);
    private getOrCreateCart;
    getCart(userId: string): Promise<any>;
    addToCart(userId: string, dto: AddToCartDto): Promise<{
        message: string;
    }>;
    updateCartItem(userId: string, itemId: string, dto: UpdateCartItemDto): Promise<{
        message: string;
    }>;
    removeCartItem(userId: string, itemId: string): Promise<{
        message: string;
    }>;
    clearCart(userId: string): Promise<{
        message: string;
    }>;
    getCartItemCount(userId: string): Promise<{
        count: any;
    }>;
}
