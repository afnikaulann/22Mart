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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const dto_1 = require("./dto");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    generateOrderNumber() {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `22M-${timestamp}${random}`;
    }
    async create(userId, dto) {
        const cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        if (!cart || cart.items.length === 0) {
            throw new common_1.BadRequestException('Keranjang kosong');
        }
        for (const item of cart.items) {
            if (!item.product.isActive) {
                throw new common_1.BadRequestException(`Produk "${item.product.name}" tidak tersedia`);
            }
            if (item.quantity > item.product.stock) {
                throw new common_1.BadRequestException(`Stok "${item.product.name}" tidak mencukupi. Tersedia: ${item.product.stock}`);
            }
        }
        const totalAmount = cart.items.reduce((sum, item) => sum + item.quantity * item.product.price, 0);
        const order = await this.prisma.$transaction(async (tx) => {
            const newOrder = await tx.order.create({
                data: {
                    orderNumber: this.generateOrderNumber(),
                    userId,
                    shippingAddress: dto.shippingAddress,
                    paymentMethod: dto.paymentMethod,
                    notes: dto.notes,
                    totalAmount,
                    items: {
                        create: cart.items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            price: item.product.price,
                        })),
                    },
                },
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    images: true,
                                },
                            },
                        },
                    },
                },
            });
            for (const item of cart.items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                });
            }
            await tx.cartItem.deleteMany({
                where: { cartId: cart.id },
            });
            return newOrder;
        });
        return {
            message: 'Pesanan berhasil dibuat',
            order,
        };
    }
    async findAllByUser(userId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where: { userId },
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    slug: true,
                                    images: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.order.count({ where: { userId } }),
        ]);
        return {
            orders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(userId, orderId) {
        const order = await this.prisma.order.findFirst({
            where: {
                id: orderId,
                userId,
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                images: true,
                            },
                        },
                    },
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Pesanan tidak ditemukan');
        }
        return order;
    }
    async findAllAdmin(page = 1, limit = 10, status, search) {
        const skip = (page - 1) * limit;
        const where = {};
        if (status) {
            where.status = status;
        }
        if (search) {
            where.OR = [
                { orderNumber: { contains: search, mode: 'insensitive' } },
                { user: { name: { contains: search, mode: 'insensitive' } } },
                { user: { email: { contains: search, mode: 'insensitive' } } },
            ];
        }
        const [orders, total] = await Promise.all([
            this.prisma.order.findMany({
                where,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                        },
                    },
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    images: true,
                                },
                            },
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.order.count({ where }),
        ]);
        return {
            orders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOneAdmin(orderId) {
        const order = await this.prisma.order.findUnique({
            where: { id: orderId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        phone: true,
                        address: true,
                    },
                },
                items: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                images: true,
                            },
                        },
                    },
                },
            },
        });
        if (!order) {
            throw new common_1.NotFoundException('Pesanan tidak ditemukan');
        }
        return order;
    }
    async updateStatus(orderId, dto) {
        const order = await this.findOneAdmin(orderId);
        const validTransitions = {
            [dto_1.OrderStatus.PENDING]: [dto_1.OrderStatus.PROCESSING, dto_1.OrderStatus.CANCELLED],
            [dto_1.OrderStatus.PROCESSING]: [dto_1.OrderStatus.SHIPPED, dto_1.OrderStatus.CANCELLED],
            [dto_1.OrderStatus.SHIPPED]: [dto_1.OrderStatus.DELIVERED],
            [dto_1.OrderStatus.DELIVERED]: [],
            [dto_1.OrderStatus.CANCELLED]: [],
        };
        const currentStatus = order.status;
        if (!validTransitions[currentStatus].includes(dto.status)) {
            throw new common_1.BadRequestException(`Tidak dapat mengubah status dari ${order.status} ke ${dto.status}`);
        }
        if (dto.status === dto_1.OrderStatus.CANCELLED) {
            await this.prisma.$transaction(async (tx) => {
                for (const item of order.items) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            stock: {
                                increment: item.quantity,
                            },
                        },
                    });
                }
                await tx.order.update({
                    where: { id: orderId },
                    data: { status: dto.status },
                });
            });
        }
        else {
            await this.prisma.order.update({
                where: { id: orderId },
                data: { status: dto.status },
            });
        }
        return {
            message: 'Status pesanan berhasil diperbarui',
        };
    }
    async getStats() {
        const [totalOrders, pendingOrders, processingOrders, completedOrders, cancelledOrders, totalRevenue,] = await Promise.all([
            this.prisma.order.count(),
            this.prisma.order.count({ where: { status: dto_1.OrderStatus.PENDING } }),
            this.prisma.order.count({ where: { status: dto_1.OrderStatus.PROCESSING } }),
            this.prisma.order.count({ where: { status: dto_1.OrderStatus.DELIVERED } }),
            this.prisma.order.count({ where: { status: dto_1.OrderStatus.CANCELLED } }),
            this.prisma.order.aggregate({
                where: { status: dto_1.OrderStatus.DELIVERED },
                _sum: { totalAmount: true },
            }),
        ]);
        return {
            totalOrders,
            pendingOrders,
            processingOrders,
            completedOrders,
            cancelledOrders,
            totalRevenue: totalRevenue._sum.totalAmount || 0,
        };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map