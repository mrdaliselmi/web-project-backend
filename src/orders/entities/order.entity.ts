import { GenericEntity } from 'src/common/generic.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { OrderStatus } from '../enums/order-status.enum';
import { UserEntity } from 'src/user/entities/user.entity';
import { OrderProduct } from 'src/order-product/entities/order-product.entity';

@Entity()
export class Order extends GenericEntity {
  @Column()
  deliveryAddress: string;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Column({ nullable: true })
  total: number;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user: UserEntity;

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.id, {
    cascade: true,
  })
  orderProduct: OrderProduct[];
}
