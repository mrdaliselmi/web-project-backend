import { Injectable } from '@nestjs/common';
import { CreateCustomerProductDto } from './dto/create-customer-product.dto';
import { UpdateCustomerProductDto } from './dto/update-customer-product.dto';

@Injectable()
export class CustomerProductService {
  create(createCustomerProductDto: CreateCustomerProductDto) {
    return 'This action adds a new customerProduct';
  }

  findAll() {
    return `This action returns all customerProduct`;
  }

  findOne(id: number) {
    return `This action returns a #${id} customerProduct`;
  }

  update(id: number, updateCustomerProductDto: UpdateCustomerProductDto) {
    return `This action updates a #${id} customerProduct`;
  }

  remove(id: number) {
    return `This action removes a #${id} customerProduct`;
  }
}
