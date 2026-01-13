"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CartService = class CartService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOrCreateCart(userId) {
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
    async getCart(userId) {
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
        const items = cartWithItems?.items || [];
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
        return {
            ...cartWithItems,
            totalItems,
            totalAmount,
        };
    }
    async addToCart(userId, dto) {
        const cart = await this.getOrCreateCart(userId);
        const product = await this.prisma.product.findUnique({
            where: { id: dto.productId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Produk tidak ditemukan');
        }
        if (!product.isActive) {
            throw new common_1.BadRequestException('Produk tidak tersedia');
        }
        if (product.stock < dto.quantity) {
            throw new common_1.BadRequestException(`Stok tidak mencukupi. Tersedia: ${product.stock}`);
        }
        const existingItem = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: dto.productId,
                },
            },
        });
        if (existingItem) {
            const newQuantity = existingItem.quantity + dto.quantity;
            if (newQuantity > product.stock) {
                throw new common_1.BadRequestException(`Stok tidak mencukupi. Tersedia: ${product.stock}`);
            }
            await this.prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: newQuantity },
            });
        }
        else {
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
    async updateCartItem(userId, itemId, dto) {
        const cart = await this.getOrCreateCart(userId);
        const cartItem = await this.prisma.cartItem.findFirst({
            where: {
                id: itemId,
                cartId: cart.id,
            },
            include: { product: true },
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Item tidak ditemukan di keranjang');
        }
        if (dto.quantity > cartItem.product.stock) {
            throw new common_1.BadRequestException(`Stok tidak mencukupi. Tersedia: ${cartItem.product.stock}`);
        }
        await this.prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity: dto.quantity },
        });
        return {
            message: 'Keranjang berhasil diperbarui',
        };
    }
    async removeCartItem(userId, itemId) {
        const cart = await this.getOrCreateCart(userId);
        const cartItem = await this.prisma.cartItem.findFirst({
            where: {
                id: itemId,
                cartId: cart.id,
            },
        });
        if (!cartItem) {
            throw new common_1.NotFoundException('Item tidak ditemukan di keranjang');
        }
        await this.prisma.cartItem.delete({
            where: { id: itemId },
        });
        return {
            message: 'Produk berhasil dihapus dari keranjang',
        };
    }
    async clearCart(userId) {
        const cart = await this.getOrCreateCart(userId);
        await this.prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        });
        return {
            message: 'Keranjang berhasil dikosongkan',
        };
    }
    async getCartItemCount(userId) {
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
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map