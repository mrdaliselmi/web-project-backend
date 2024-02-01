import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerProduct } from 'src/customer-product/entities/customer-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, CustomerProduct])],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
