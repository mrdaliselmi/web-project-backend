import { GenericEntity } from 'src/common/generic.entity';
import { CustomerProduct } from 'src/customer-product/entities/customer-product.entity';
import { OrderProduct } from 'src/order-product/entities/order-product.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Product extends GenericEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  imageUrl: string;

  @Column()
  stock: number;

  @Column()
  category: string;

  @Column()
  brand: string;

  @Column()
  color: string;

  @OneToMany(() => CustomerProduct, (customerProduct) => customerProduct.id)
  consumerProduct: CustomerProduct[];

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.id)
  orderProduct: OrderProduct[];
}
