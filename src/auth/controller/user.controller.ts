import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { UserService } from '../service';
import { CreateUserDto } from '../dto';
import { User } from '../entities';
import { BusinessException } from '../../exception/BusinessException';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.userService.createUser(createUserDto);
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        console.error('Internal Server Error:', error.message);
        throw error;
      } else if (error instanceof BusinessException) {
        throw new HttpException(
          { message: error.apiMessage, statusCode: error.status },
          error.status,
        );
      } else {
        console.error('Unexpected Error:', error);
        throw new InternalServerErrorException(error.message);
      }
    }
  }
}
