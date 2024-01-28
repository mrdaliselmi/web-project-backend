import { Module } from '@nestjs/common';
import { CustomerProductService } from './customer-product.service';
import { CustomerProductController } from './customer-product.controller';
import { CustomerProduct } from './entities/customer-product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerProduct])],
  controllers: [CustomerProductController],
  providers: [CustomerProductService],
})
export class CustomerProductModule {}
