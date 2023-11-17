import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { UserService, AuthService } from '../service';
import { CreateUserDto, LoginReqDto, LoginResDto } from '../dto';
import { User } from '../entities';
import { BusinessException } from '../../exception/BusinessException';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly AuthService: AuthService,
  ) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<User> {
    try {
      return await this.userService.createUser(createUserDto);
    } catch (error) {
      console.error('Error occurred:', error);

      if (error instanceof InternalServerErrorException) {
        throw error;
      }

      if (error instanceof BusinessException) {
        throw new HttpException(
          { message: error.apiMessage, statusCode: error.status },
          error.status,
        );
      }

      throw new InternalServerErrorException(error.message);
    }
  }

  @Post('login')
  async login(@Body() loginReqDto: LoginReqDto): Promise<LoginResDto> {
    return this.AuthService.login(loginReqDto.email, loginReqDto.password);
  }
}
