import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto';
export declare class CartController {
    private cartService;
    constructor(cartService: CartService);
    getCart(userId: string): Promise<{
        totalItems: number;
        totalAmount: number;
        items?: ({
            product: {
                category: {
                    id: string;
                    name: string;
                    slug: string;
                };
            } & {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                description: string | null;
                isActive: boolean;
                price: number;
                stock: number;
                images: string[];
                categoryId: string;
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
    getCartItemCount(userId: string): Promise<{
        count: number;
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
}
