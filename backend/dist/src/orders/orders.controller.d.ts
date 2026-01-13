import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto, OrderStatus } from './dto';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    create(userId: string, dto: CreateOrderDto): Promise<{
        message: string;
        order: any;
    }>;
    findAllByUser(userId: string, page?: string, limit?: string): Promise<{
        orders: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    findAllAdmin(page?: string, limit?: string, status?: OrderStatus, search?: string): Promise<{
        orders: any;
        pagination: {
            page: number;
            limit: number;
            total: any;
            totalPages: number;
        };
    }>;
    getStats(): Promise<{
        totalOrders: any;
        pendingOrders: any;
        processingOrders: any;
        completedOrders: any;
        cancelledOrders: any;
        totalRevenue: any;
    }>;
    findOneAdmin(id: string): Promise<any>;
    updateStatus(id: string, dto: UpdateOrderStatusDto): Promise<{
        message: string;
    }>;
    findOne(userId: string, id: string): Promise<any>;
}
