import { GenericEntity } from 'src/common/generic.entity';
import { CustomerProduct } from 'src/customer-product/entities/customer-product.entity';
import { OrderProduct } from 'src/order-product/entities/order-product.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Product extends GenericEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  price: number;

  @Column({ nullable: true })
  originalPrice: number;

  @Column({ nullable: true, default: '[]' })
  images: string;

  @Column({ nullable: true })
  stock: number;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true, default: '[]' })
  colors: string;

  @Column({ nullable: true })
  rating: number;

  @Column({ nullable: true, default: false })
  wishlist: boolean;

  @Column('simple-json', { nullable: true })
  specs: {
    type: string | null;
    numberOfKeys: number;
    keyCaps: string;
    illumination: string;
    buttons: number;
    resolution: string;
    headSupport: string;
    size: string;
    upholstery: string;
    material: string;
    connectivity: string;
  };

  @OneToMany(() => CustomerProduct, (customerProduct) => customerProduct.id)
  consumerProduct: CustomerProduct[];

  @OneToMany(() => OrderProduct, (orderProduct) => orderProduct.id)
  orderProduct: OrderProduct[];
}
