import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, QueryProductDto } from './dto';
import { Public, Roles } from '../common/decorators';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Public()
  @Get()
  findAll(@Query() query: QueryProductDto) {
    return this.productsService.findAll(query);
  }

  @Get('admin')
  @Roles('ADMIN')
  findAllAdmin(@Query() query: QueryProductDto) {
    return this.productsService.findAllAdmin(query);
  }

  @Public()
  @Get('featured')
  getFeaturedProducts(@Query('limit') limit?: string) {
    return this.productsService.getFeaturedProducts(
      limit ? parseInt(limit, 10) : 8,
    );
  }

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.productsService.findOne(slug);
  }

  @Public()
  @Get(':id/related')
  getRelatedProducts(
    @Param('id') id: string,
    @Query('limit') limit?: string,
  ) {
    return this.productsService.getRelatedProducts(
      id,
      limit ? parseInt(limit, 10) : 4,
    );
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
