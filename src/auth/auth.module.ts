import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controller';
import { UserService } from './service';
import { UserRepository } from './repositories';
import { User } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [UserService, UserRepository],
  exports: [UserService],
})
export class AuthModule {}
