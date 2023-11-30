import {
  Controller,
  Post,
  Body,
  InternalServerErrorException,
  HttpException,
} from '@nestjs/common';
import { UserService, AuthService } from '../service';
import {
  CreateUserDto,
  LoginReqDto,
  LoginResDto,
  LogoutReqDto,
  LogoutResDto,
} from '../dto';
import { User } from '../entities';
import { BusinessException } from '../../exception/BusinessException';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
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
    return this.authService.login(loginReqDto.email, loginReqDto.password);
  }

  @Post('logout')
  async logout(@Body() dto: LogoutReqDto): Promise<LogoutResDto> {
    return await this.authService.withdrawalToken(dto);
  }
}
