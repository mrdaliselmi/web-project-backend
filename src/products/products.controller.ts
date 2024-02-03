import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductSearchParams } from './interfaces/product-search-params.interface';
import { PaginationParams } from 'src/common/pagination-params.interface';
import { User } from 'src/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDtos: CreateProductDto[]) {
    return this.productsService.create(createProductDtos);
  }

  @Get()
  findAll(@Query() paginationParams: PaginationParams) {
    return this.productsService.findAll(paginationParams);
  }

  @Get('brands')
  brands() {
    return this.productsService.getBrands();
  }

  @Get('categories')
  categories() {
    return this.productsService.getCategories();
  }

  @Post('search')
  search(@Body() searchParams: ProductSearchParams) {
    return this.productsService.search(searchParams);
  }

  @Get('advanced-search')
  advSearch(@Query() searchParams: ProductSearchParams) {
    return this.productsService.advancedSearch(searchParams);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch()
  update(@Body() updateProductDtos: UpdateProductDto[]) {
    return this.productsService.update(updateProductDtos);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id')
  rate(
    @Param('id') id: string,
    @Body() rate: { rating: number },
    @User() user: any,
  ) {
    return this.productsService.rateProduct(+id, rate.rating, user);
  }
}
