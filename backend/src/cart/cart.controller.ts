import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  getCart(@CurrentUser('id') userId: string) {
    return this.cartService.getCart(userId);
  }

  @Get('count')
  getCartItemCount(@CurrentUser('id') userId: string) {
    return this.cartService.getCartItemCount(userId);
  }

  @Post('items')
  addToCart(@CurrentUser('id') userId: string, @Body() dto: AddToCartDto) {
    return this.cartService.addToCart(userId, dto);
  }

  @Patch('items/:id')
  updateCartItem(
    @CurrentUser('id') userId: string,
    @Param('id') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(userId, itemId, dto);
  }

  @Delete('items/:id')
  removeCartItem(
    @CurrentUser('id') userId: string,
    @Param('id') itemId: string,
  ) {
    return this.cartService.removeCartItem(userId, itemId);
  }

  @Delete()
  clearCart(@CurrentUser('id') userId: string) {
    return this.cartService.clearCart(userId);
  }
}
