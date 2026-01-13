export declare enum PaymentMethod {
    COD = "COD",
    TRANSFER = "TRANSFER",
    EWALLET = "EWALLET"
}
export declare class CreateOrderDto {
    shippingAddress: string;
    paymentMethod: PaymentMethod;
    notes?: string;
}
