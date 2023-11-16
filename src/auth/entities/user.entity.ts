import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entity';

export type UserRole = 'admin' | 'user';

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: string;
}
