import { Module } from '@nestjs/common';
import { OrderProductService } from './order-product.service';
import { OrderProductController } from './order-product.controller';
import { OrderProduct } from './entities/order-product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([OrderProduct])],
  controllers: [OrderProductController],
  providers: [OrderProductService],
})
export class OrderProductModule {}
