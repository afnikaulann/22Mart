import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama produk wajib diisi' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: 'Harga harus berupa angka' })
  @Min(0, { message: 'Harga tidak boleh negatif' })
  price: number;

  @IsNumber({}, { message: 'Stok harus berupa angka' })
  @Min(0, { message: 'Stok tidak boleh negatif' })
  stock: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @IsString()
  @IsNotEmpty({ message: 'Kategori wajib dipilih' })
  categoryId: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
