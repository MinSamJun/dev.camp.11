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
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: configService.get<string>('ACCESS_TOKEN_EXPIRY'),
        },
      }),
    }),
    TypeOrmModule.forFeature([User, AccessToken, RefreshToken]),
  ],
  controllers: [AuthController],
  providers: [
    UserService,
    AuthService,
    UserRepository,
    AccessTokenRepository,
    RefreshTokenRepository,
  ],
  exports: [
    UserService,
    AuthService,
    UserRepository,
    AccessTokenRepository,
    RefreshTokenRepository,
  ],
})
export class AuthModule {}
