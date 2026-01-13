import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class AddToCartDto {
  @IsString()
  @IsNotEmpty({ message: 'Product ID wajib diisi' })
  productId: string;

  @IsNumber()
  @Min(1, { message: 'Quantity minimal 1' })
  quantity: number;
}
