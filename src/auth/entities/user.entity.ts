import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../common/entity';

export enum UserRole {
  Admin = 'admin',
  User = 'user',
}

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

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.User,
  })
  role: UserRole;
}
