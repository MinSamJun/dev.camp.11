import { UserRole } from '../entities';

export type CreateUserDto = {
  name: string;
  phone: string;
  email: string;
  password: string;
  role: UserRole;
};
