import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { CustomerProduct } from 'src/customer-product/entities/customer-product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, CustomerProduct])],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
