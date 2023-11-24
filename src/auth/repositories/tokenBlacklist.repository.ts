import { Injectable } from '@nestjs/common';
import { Repository, EntityManager } from 'typeorm';
import { InjectRepository, InjectEntityManager } from '@nestjs/typeorm';
import { TokenBlacklist } from '../entities';
import { LogoutReqDto } from '../dto';

@Injectable()
export class TokenBlacklistRepository extends Repository<TokenBlacklist> {
  constructor(
    @InjectRepository(TokenBlacklist)
    private readonly repo: Repository<TokenBlacklist>,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {
    super(repo.target, repo.manager, repo.queryRunner);
  }

  async addToken(dto: LogoutReqDto): Promise<TokenBlacklist> {
    const blacklistedToken = new TokenBlacklist();
    blacklistedToken.token = dto.token;
    blacklistedToken.jti = dto.jti;
    blacklistedToken.tokenType = dto.type;
    blacklistedToken.expiresAt = dto.expiresAt;
    return await this.save(blacklistedToken);
  }
}
