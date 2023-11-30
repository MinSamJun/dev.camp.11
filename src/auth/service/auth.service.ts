import { HttpStatus, Injectable } from '@nestjs/common';
import { LoginResDto, LogoutReqDto, LogoutResDto } from '../dto';
import { BusinessException } from 'src/exception';
import * as argon2 from 'argon2';
import { User } from '../entities';
import { UserRepository } from '../repositories';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AccessTokenRepository, RefreshTokenRepository } from '../repositories';
import { v4 as uuidv4 } from 'uuid';

export type tokenPayload = {
  sub: string;
  iat: number;
  jti: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly accessTokenRepository: AccessTokenRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async login(email: string, plainPassword: string): Promise<LoginResDto> {
    const user = await this.validateUser(email, plainPassword);
    const payload: tokenPayload = this.createTokenPayload(user.id);

    let accessToken: Promise<string> = Promise.resolve('');
    let refreshToken: Promise<string> = Promise.resolve('');

    const existingAccessToken =
      await this.accessTokenRepository.findAccessTokenByUserId(user.id);
    const existingRefreshToken =
      await this.refreshTokenRepository.findRefreshTokenByUserId(user.id);

    if (existingAccessToken && existingRefreshToken) {
      accessToken = Promise.resolve(existingAccessToken.token);
      refreshToken = Promise.resolve(existingRefreshToken.token);
    } else {
      accessToken = this.createAccessToken(user, payload);
      refreshToken = this.createRefreshToken(user, payload);
    }

    return {
      accessToken: await accessToken,
      refreshToken: await refreshToken,
    };
  }

  private async validateUser(
    email: string,
    plainPassword: string,
  ): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await argon2.verify(user.password, plainPassword))) {
      return user;
    }
    throw new BusinessException(
      'auth',
      'invalid-credentials',
      'Invalide credentials',
      HttpStatus.UNAUTHORIZED,
    );
  }

  private async createAccessToken(
    user: User,
    payload: tokenPayload,
  ): Promise<string> {
    const expiresIn = this.configService.get<string>('ACCESS_TOKEN_EXPIRY');
    const token = this.jwtService.sign(payload, { expiresIn });
    const expiresAt = this.calculateExpiry(expiresIn);

    await this.accessTokenRepository.saveAccessToken(
      payload.jti,
      user,
      token,
      expiresAt,
    );

    return token;
  }

  // private calculateExpiry(expiry: string): Date {
  //   let expireInMilliseconds = 0;

  //   if (expiry.endsWith('d')) {
  //     const days = parseInt(expiry.slice(0, -1), 10);
  //     expireInMilliseconds = days * 24 * 60 * 60 * 1000;
  //   } else if (expiry.endsWith('h')) {
  //     const hours = parseInt(expiry.slice(0, -1), 10);
  //     expireInMilliseconds = hours * 60 * 60 * 1000;
  //   } else if (expiry.endsWith('m')) {
  //     const minutes = parseInt(expiry.slice(0, -1), 10);
  //     expireInMilliseconds = minutes * 60 * 1000;
  //   } else if (expiry.endsWith('s')) {
  //     const seconds = parseInt(expiry.slice(0, -1), 10);
  //     expireInMilliseconds = seconds * 1000;
  //   } else {
  //     throw new BusinessException(
  //       'auth',
  //       'invalid-expiry',
  //       'Invalid expiry time',
  //       HttpStatus.BAD_GATEWAY,
  //     );
  //   }
  //   return new Date(Date.now() + expireInMilliseconds);
  // }

  private calculateExpiry(expiry: string): Date {
    const timeUnits: Record<string, number> = {
      d: 24 * 60 * 60 * 1000, // days
      h: 60 * 60 * 1000, // hours
      m: 60 * 1000, // minutes
      s: 1000, // seconds
    };

    const unit = expiry.slice(-1);
    const value = parseInt(expiry.slice(0, -1), 10);

    if (!(unit in timeUnits)) {
      throw new BusinessException(
        'auth',
        'invalid-expiry',
        'Invalid expiry time',
        HttpStatus.BAD_GATEWAY,
      );
    }

    const expireInMilliseconds = timeUnits[unit] * value;
    return new Date(Date.now() + expireInMilliseconds);
  }

  private async createRefreshToken(
    user: User,
    payload: tokenPayload,
  ): Promise<string> {
    const expiresIn = this.configService.get<string>('REFRESH_TOKEN_EXPIRY');
    const token = this.jwtService.sign(payload, { expiresIn });
    const expiresAt = this.calculateExpiry(expiresIn);

    await this.refreshTokenRepository.saveRefreshToken(
      payload.jti,
      user,
      token,
      expiresAt,
    );
    return token;
  }

  private createTokenPayload(userId: string): tokenPayload {
    return {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      jti: uuidv4(),
    };
  }

  async withdrawalToken(dto: LogoutReqDto): Promise<LogoutResDto> {
    if (!dto.jti) {
      return { message: 'nonjti' };
    }

    const foundAccessToken = await this.accessTokenRepository.isTokenWithdrawal(
      dto.jti,
    );
    const foundRefreshToken =
      await this.refreshTokenRepository.isTokenWithdrawal(dto.jti);

    if (!foundAccessToken && !foundRefreshToken) {
      return { message: 'nonExistToken' };
    } else if (
      (foundAccessToken && foundAccessToken.isWithdrawal) ||
      (foundRefreshToken && foundRefreshToken.isWithdrawal)
    ) {
      return { message: 'alreadyLogoutedToken' };
    } else {
      await this.accessTokenRepository.withdrawalToken(dto.jti);
      await this.refreshTokenRepository.withdrawalToken(dto.jti);
      return { message: 'logoutComplete' };
    }
  }
}
