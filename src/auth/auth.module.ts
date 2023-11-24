import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './controller';
import { UserService, AuthService, TokenBlacklistService } from './service';
import {
  UserRepository,
  AccessTokenRepository,
  RefreshTokenRepository,
  TokenBlacklistRepository,
} from './repositories';
import { User, AccessToken, RefreshToken, TokenBlacklist } from './entities';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
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
      TokenBlacklist,
    ]),
  ],
  controllers: [AuthController],
  providers: [
    UserService,
    AuthService,
    UserRepository,
    AccessTokenRepository,
    RefreshTokenRepository,
    TokenBlacklistService,
    TokenBlacklistRepository,
  ],
  exports: [
    UserService,
    AuthService,
    UserRepository,
    AccessTokenRepository,
    RefreshTokenRepository,
    TokenBlacklistService,
    TokenBlacklistRepository,
  ],
})
export class AuthModule {}
