import { GenericEntity } from 'src/common/generic.entity';
import { Product } from 'src/products/entities/product.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class CustomerProduct extends GenericEntity {
  @Column({ nullable: true })
  rating: number;

  @Column({ default: false })
  wishlisted: boolean;

  @ManyToOne(() => Product, (product) => product.id)
  product: Product;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user: UserEntity;
}
