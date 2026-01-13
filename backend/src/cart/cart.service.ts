import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto, UpdateCartItemDto } from './dto';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  private async getOrCreateCart(userId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: { userId },
      });
    }

    return cart;
  }

  async getCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);

    const cartWithItems = await this.prisma.cart.findUnique({
      where: { id: cart.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    // Calculate totals
    const items = cartWithItems?.items || [];
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * item.product.price,
      0,
    );

    return {
      ...cartWithItems,
      totalItems,
      totalAmount,
    };
  }

  async addToCart(userId: string, dto: AddToCartDto) {
    const cart = await this.getOrCreateCart(userId);

    // Check if product exists and is active
    const product = await this.prisma.product.findUnique({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException('Produk tidak ditemukan');
    }

    if (!product.isActive) {
      throw new BadRequestException('Produk tidak tersedia');
    }

    // Check stock
    if (product.stock < dto.quantity) {
      throw new BadRequestException(
        `Stok tidak mencukupi. Tersedia: ${product.stock}`,
      );
    }

    // Check if product already in cart
    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId: dto.productId,
        },
      },
    });

    if (existingItem) {
      // Update quantity
      const newQuantity = existingItem.quantity + dto.quantity;

      if (newQuantity > product.stock) {
        throw new BadRequestException(
          `Stok tidak mencukupi. Tersedia: ${product.stock}`,
        );
      }

      await this.prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    } else {
      // Create new cart item
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: dto.productId,
          quantity: dto.quantity,
        },
      });
    }

    return {
      message: 'Produk berhasil ditambahkan ke keranjang',
    };
  }

  async updateCartItem(userId: string, itemId: string, dto: UpdateCartItemDto) {
    const cart = await this.getOrCreateCart(userId);

    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
      include: { product: true },
    });

    if (!cartItem) {
      throw new NotFoundException('Item tidak ditemukan di keranjang');
    }

    // Check stock
    if (dto.quantity > cartItem.product.stock) {
      throw new BadRequestException(
        `Stok tidak mencukupi. Tersedia: ${cartItem.product.stock}`,
      );
    }

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity: dto.quantity },
    });

    return {
      message: 'Keranjang berhasil diperbarui',
    };
  }

  async removeCartItem(userId: string, itemId: string) {
    const cart = await this.getOrCreateCart(userId);

    const cartItem = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
    });

    if (!cartItem) {
      throw new NotFoundException('Item tidak ditemukan di keranjang');
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return {
      message: 'Produk berhasil dihapus dari keranjang',
    };
  }

  async clearCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);

    await this.prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return {
      message: 'Keranjang berhasil dikosongkan',
    };
  }

  async getCartItemCount(userId: string) {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: {
        items: true,
      },
    });

    if (!cart) {
      return { count: 0 };
    }

    const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    return { count };
  }
}
