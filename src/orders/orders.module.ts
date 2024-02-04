import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/products/entities/product.entity';
import { UserModule } from 'src/user/user.module';
import { ProductsModule } from 'src/products/products.module';
import { OrderProduct } from 'src/order-product/entities/order-product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Product, OrderProduct]),
    UserModule,
    ProductsModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
