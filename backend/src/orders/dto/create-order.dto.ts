import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum PaymentMethod {
  COD = 'COD',
  TRANSFER = 'TRANSFER',
  EWALLET = 'EWALLET',
}

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty({ message: 'Alamat pengiriman wajib diisi' })
  shippingAddress: string;

  @IsEnum(PaymentMethod, { message: 'Metode pembayaran tidak valid' })
  paymentMethod: PaymentMethod;

  @IsString()
  @IsOptional()
  notes?: string;
}
