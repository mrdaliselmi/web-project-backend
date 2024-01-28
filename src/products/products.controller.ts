import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductSearchParams } from './interfaces/product-search-params.interface';
import { PaginationParams } from 'src/common/pagination-params.interface';
import { User } from 'src/decorators/user.decorator';
import { Response } from 'express';
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll(@Query() paginationParams: PaginationParams) {
    return this.productsService.findAll(paginationParams);
  }

  @Get('advanced-search')
  search(@Body() searchParams: ProductSearchParams) {
    return this.productsService.search(searchParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  @Post(':id')
  rate(
    @Param('id') id: string,
    @Body() rate: { rating: number },
    @User() user: any,
  ) {
    return this.productsService.rateProduct(+id, rate.rating, user);
  }

  @Post(':id')
  wishlist(@Param('id') id: string, @User() user: any, @Res() res: Response) {
    return this.productsService.addToWishList(+id, user, res);
  }
}
