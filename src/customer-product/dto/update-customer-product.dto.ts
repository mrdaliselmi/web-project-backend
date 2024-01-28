import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerProductDto } from './create-customer-product.dto';

export class UpdateCustomerProductDto extends PartialType(CreateCustomerProductDto) {}
