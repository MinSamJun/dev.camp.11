import { User } from '../entities';
import { Injectable, HttpStatus } from '@nestjs/common';
import { UserRepository } from '../repositories';
import { CreateUserDto } from '../dto';
import * as argon2 from 'argon2';
import { BusinessException } from '../../exception';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const user = await this.userRepo.findOneByEmail(dto.email);
    if (user) {
      throw new BusinessException(
        `auth`,
        `${dto.email} 은 이미 가입된 이메일 입니다.`,
        `${dto.email} 은 이미 가입된 이메일 입니다.`,
        HttpStatus.CONFLICT,
      );
    }
    const hashedPassword = await argon2.hash(dto.password);
    return this.userRepo.createUser(dto, hashedPassword);
  }
}
