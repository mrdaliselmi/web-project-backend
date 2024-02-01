import { Entity, Column, OneToMany } from 'typeorm';
import { GenericEntity } from 'src/common/generic.entity';
import { CustomerProduct } from 'src/customer-product/entities/customer-product.entity';
import { Order } from 'src/orders/entities/order.entity';

@Entity()
export class UserEntity extends GenericEntity {
  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column()
  password: string;

  @Column()
  salt: string;

  @OneToMany(() => CustomerProduct, (customerProduct) => customerProduct.id)
  customerProduct: CustomerProduct[];

  @OneToMany(() => Order, (order) => order.id)
  order: Order[];
}
