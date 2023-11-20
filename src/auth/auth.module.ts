import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controller';
import { UserService, AuthService } from './service';
import {
  UserRepository,
  AccessTokenRepository,
  RefreshTokenRepository,
} from './repositories';
import { User, AccessToken, RefreshToken } from './entities';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('ACCESS_TOKEN_EXPIRY'),
        },
      }),
    }),
    TypeOrmModule.forFeature([
      User,
      UserRepository,
      AccessToken,
      RefreshToken,
      AccessTokenRepository,
    ]),
  ],
  controllers: [AuthController],
  providers: [
    UserService,
    AuthService,
    UserRepository,
    AccessTokenRepository,
    RefreshTokenRepository,
  ],
  exports: [UserService, AuthService, UserRepository],
})
export class AuthModule {}
