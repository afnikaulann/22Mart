import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto';
export declare class CartController {
    private cartService;
    constructor(cartService: CartService);
    getCart(userId: string): Promise<any>;
    getCartItemCount(userId: string): Promise<{
        count: any;
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
