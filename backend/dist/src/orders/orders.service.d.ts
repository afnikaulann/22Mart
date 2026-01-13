import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto, OrderStatus } from './dto';
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    private generateOrderNumber;
    create(userId: string, dto: CreateOrderDto): Promise<{
        message: string;
        order: any;
    }>;
    findAllByUser(userId: string, page?: number, limit?: number): Promise<{
        orders: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    findOne(userId: string, orderId: string): Promise<any>;
    findAllAdmin(page?: number, limit?: number, status?: OrderStatus, search?: string): Promise<{
        orders: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    findOneAdmin(orderId: string): Promise<any>;
    updateStatus(orderId: string, dto: UpdateOrderStatusDto): Promise<{
        message: string;
    }>;
    getStats(): Promise<{
        totalOrders: any;
        pendingOrders: any;
        processingOrders: any;
        completedOrders: any;
        cancelledOrders: any;
        totalRevenue: any;
    }>;
}
