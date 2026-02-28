import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto, OrderStatus } from './dto';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    create(userId: string, dto: CreateOrderDto): Promise<{
        message: string;
        order: {
            items: ({
                product: {
                    id: string;
                    name: string;
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
    findAllByUser(userId: string, page?: string, limit?: string): Promise<{
        orders: ({
            items: ({
                product: {
                    id: string;
                    name: string;
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
    findAllAdmin(page?: string, limit?: string, status?: OrderStatus, search?: string): Promise<{
        orders: ({
            user: {
                id: string;
                email: string;
                name: string;
                phone: string | null;
            };
            items: ({
                product: {
                    id: string;
                    name: string;
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
    getStats(): Promise<{
        totalOrders: number;
        pendingOrders: number;
        processingOrders: number;
        completedOrders: number;
        cancelledOrders: number;
        totalRevenue: number;
    }>;
    findOneAdmin(id: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            phone: string | null;
            address: string | null;
        };
        items: ({
            product: {
                id: string;
                name: string;
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
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<{
        message: string;
    }>;
    findOne(userId: string, id: string): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            phone: string | null;
        };
        items: ({
            product: {
                id: string;
                name: string;
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
}
