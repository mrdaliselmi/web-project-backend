import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserEntity } from './user/entities/user.entity';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { CustomerProductModule } from './customer-product/customer-product.module';
import { Product } from './products/entities/product.entity';
import { CustomerProduct } from './customer-product/entities/customer-product.entity';
import { Order } from './orders/entities/order.entity';
import { OrderProductModule } from './order-product/order-product.module';
import { OrderProduct } from './order-product/entities/order-product.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        database: config.get('DB_DATABASE'),
        host: config.get('DB_HOST'),
        username: config.get('DB_USERNAME'),
        port: config.get('DB_PORT'),
        password: config.get('DB_PASSWORD'),
        entities: [UserEntity, Product, CustomerProduct, Order, OrderProduct],
        synchronize: true,
      }),
    }),
    AuthModule,
    UserModule,
    ProductsModule,
    OrdersModule,
    CustomerProductModule,
    OrderProductModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
