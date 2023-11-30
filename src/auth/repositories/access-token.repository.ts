import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AccessToken, User, RefreshToken } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';
import { LogoutReqDto, LogoutResDto } from '../dto';

@Injectable()
export class AccessTokenRepository {
  constructor(
    @InjectRepository(AccessToken)
    private readonly repo: Repository<AccessToken>,
  ) {}

  async saveAccessToken(
    jti: string,
    user: User,
    token: string,
    expiresAt: Date,
  ): Promise<AccessToken> {
    const accessToken = new AccessToken();
    accessToken.jti = jti;
    accessToken.user = user;
    accessToken.token = token;
    accessToken.expiresAt = expiresAt;
    accessToken.isWithdrawal = false;

    return this.repo.save(accessToken);
  }

  async findAccessTokenByUserId(
    userId: string,
  ): Promise<AccessToken | undefined> {
    return this.repo.findOne({ where: { user: { id: userId } } });
  }

  async isTokenWithdrawal(jti: string): Promise<AccessToken> {
    const foundAccessToken = await this.repo.findOne({ where: { jti } });
    return foundAccessToken;
  }

  async withdrawalToken(dto: string): Promise<LogoutResDto> {
    const foundTokenAccess = await this.repo.findOne({
      where: { jti: dto },
    });
    foundTokenAccess.isWithdrawal = true;
    await this.repo.save(foundTokenAccess);

    return { message: 'logoutComplete' };
  }
}
