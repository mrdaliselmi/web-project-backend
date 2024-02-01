import { GenericEntity } from 'src/common/generic.entity';
import { Order } from 'src/orders/entities/order.entity';
import { Product } from 'src/products/entities/product.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class OrderProduct extends GenericEntity {
  @Column()
  quantity: number;

  @ManyToOne(() => Product, (product) => product.id)
  product: Product;

  @ManyToOne(() => Order, (order) => order.id)
  order: Order;
}
