import { IsNumber, Min } from 'class-validator';

export class UpdateCartItemDto {
  @IsNumber()
  @Min(1, { message: 'Quantity minimal 1' })
  quantity: number;
}
