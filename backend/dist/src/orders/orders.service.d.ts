import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto, OrderStatus } from './dto';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    private generateOrderNumber;
    create(userId: string, dto: CreateOrderDto): Promise<{
        message: string;
        order: {
            items: ({
                product: {
                    name: string;
                    id: string;
                    images: string[];
                };
            } & {
                id: string;
                createdAt: Date;
                price: number;
                productId: string;
                quantity: number;
                orderId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            orderNumber: string;
            status: import("@prisma/client").$Enums.OrderStatus;
            totalAmount: number;
            shippingAddress: string;
            shippingCost: number;
            paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
            notes: string | null;
        };
    }>;
    findAllByUser(userId: string, page?: number, limit?: number): Promise<{
        orders: ({
            items: ({
                product: {
                    name: string;
                    id: string;
                    slug: string;
                    images: string[];
                };
            } & {
                id: string;
                createdAt: Date;
                price: number;
                productId: string;
                quantity: number;
                orderId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            orderNumber: string;
            status: import("@prisma/client").$Enums.OrderStatus;
            totalAmount: number;
            shippingAddress: string;
            shippingCost: number;
            paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
            notes: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOne(userId: string, orderId: string): Promise<{
        user: {
            email: string;
            name: string;
            phone: string | null;
            id: string;
        };
        items: ({
            product: {
                name: string;
                id: string;
                slug: string;
                images: string[];
            };
        } & {
            id: string;
            createdAt: Date;
            price: number;
            productId: string;
            quantity: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        orderNumber: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        shippingAddress: string;
        shippingCost: number;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        notes: string | null;
    }>;
    findAllAdmin(page?: number, limit?: number, status?: OrderStatus, search?: string): Promise<{
        orders: ({
            user: {
                email: string;
                name: string;
                phone: string | null;
                id: string;
            };
            items: ({
                product: {
                    name: string;
                    id: string;
                    images: string[];
                };
            } & {
                id: string;
                createdAt: Date;
                price: number;
                productId: string;
                quantity: number;
                orderId: string;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            orderNumber: string;
            status: import("@prisma/client").$Enums.OrderStatus;
            totalAmount: number;
            shippingAddress: string;
            shippingCost: number;
            paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
            notes: string | null;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findOneAdmin(orderId: string): Promise<{
        user: {
            email: string;
            name: string;
            phone: string | null;
            id: string;
            address: string | null;
        };
        items: ({
            product: {
                name: string;
                id: string;
                slug: string;
                images: string[];
            };
        } & {
            id: string;
            createdAt: Date;
            price: number;
            productId: string;
            quantity: number;
            orderId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        orderNumber: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        totalAmount: number;
        shippingAddress: string;
        shippingCost: number;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        notes: string | null;
    }>;
    updateStatus(orderId: string, dto: UpdateOrderStatusDto): Promise<{
        message: string;
    }>;
    getStats(): Promise<{
        totalOrders: number;
        pendingOrders: number;
        processingOrders: number;
        completedOrders: number;
        cancelledOrders: number;
        totalRevenue: number;
    }>;
}
