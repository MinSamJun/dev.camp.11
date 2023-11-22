import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AccessToken, User } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';

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

    return this.repo.save(accessToken);
  }

  async findAccessTokenByUserId(
    userId: string,
  ): Promise<AccessToken | undefined> {
    return this.repo.findOne({ where: { user: { id: userId } } });
  }
}
