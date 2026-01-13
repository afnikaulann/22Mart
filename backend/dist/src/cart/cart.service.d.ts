import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto, UpdateCartItemDto } from './dto';
export declare class CartService {
    private prisma;
    constructor(prisma: PrismaService);
    private getOrCreateCart;
    getCart(userId: string): Promise<{
        totalItems: number;
        totalAmount: number;
        items?: ({
            product: {
                category: {
                    name: string;
                    id: string;
                    slug: string;
                };
            } & {
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
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            productId: string;
            quantity: number;
            cartId: string;
        })[] | undefined;
        id?: string | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
        userId?: string | undefined;
    }>;
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
        count: number;
    }>;
}
