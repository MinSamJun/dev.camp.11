import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from '../service';
import { CreateUserDto } from '../dto';
import { User } from '../entities';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }
}
