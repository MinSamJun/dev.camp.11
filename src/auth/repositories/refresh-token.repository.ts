import { Injectable } from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { RefreshToken, User } from '../entities';
import { LogoutReqDto, LogoutResDto } from '../dto';

@Injectable()
export class RefreshTokenRepository extends Repository<RefreshToken> {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly repo: Repository<RefreshToken>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  async saveRefreshToken(
    jti: string,
    user: User,
    token: string,
    expiresAt: Date,
  ): Promise<RefreshToken> {
    const refreshToken = new RefreshToken();
    refreshToken.jti = jti;
    refreshToken.user = user;
    refreshToken.token = token;
    refreshToken.expiresAt = expiresAt;
    return this.save(refreshToken);
  }

  async findRefreshTokenByUserId(
    userId: string,
  ): Promise<RefreshToken | undefined> {
    return this.repo.findOne({ where: { user: { id: userId } } });
  }

  async isTokenWithdrawal(jti: string): Promise<RefreshToken> {
    const foundRefreshToken = await this.repo.findOne({ where: { jti } });
    return foundRefreshToken;
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
