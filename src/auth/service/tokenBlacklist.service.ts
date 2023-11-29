import { Injectable } from '@nestjs/common';
import { TokenBlacklistRepository } from '../repositories';
import { TokenBlacklist } from '../entities';
import { LogoutReqDto } from '../dto';

@Injectable()
export class TokenBlacklistService {
  constructor(
    private readonly tokenBlacklistRepository: TokenBlacklistRepository,
  ) {}

  async addToBlacklist(dto: LogoutReqDto): Promise<TokenBlacklist> {
    const foundToken = await this.tokenBlacklistRepository.isTokenBlacklisted(
      dto.jti,
    );
    if (foundToken) {
    } else {
      return await this.tokenBlacklistRepository.addToken(dto);
    }
  }
}
