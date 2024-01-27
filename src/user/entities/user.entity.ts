import { Entity, Column } from 'typeorm';
import { GenericEntity } from 'src/common/generic.entity';

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
}
