import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CustomerProductService } from './customer-product.service';
import { CreateCustomerProductDto } from './dto/create-customer-product.dto';
import { UpdateCustomerProductDto } from './dto/update-customer-product.dto';

@Controller('customer-product')
export class CustomerProductController {
  constructor(private readonly customerProductService: CustomerProductService) {}

  @Post()
  create(@Body() createCustomerProductDto: CreateCustomerProductDto) {
    return this.customerProductService.create(createCustomerProductDto);
  }

  @Get()
  findAll() {
    return this.customerProductService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customerProductService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerProductDto: UpdateCustomerProductDto) {
    return this.customerProductService.update(+id, updateCustomerProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerProductService.remove(+id);
  }
}
