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
    return await this.tokenBlacklistRepository.addToken(dto);
  }
}
