// src/exception/BusinessException.ts

import { HttpStatus } from '@nestjs/common';

export type ErrorDomain = 'auth' | 'user';

export class BusinessException extends Error {
  public readonly id: string;
  public readonly timestamp: Date;

  constructor(
    public readonly domain: ErrorDomain,
    public readonly message: string, // loggin message
    public readonly apiMessage: string, // user message
    public readonly status: HttpStatus,
  ) {
    super(apiMessage);
    this.id = BusinessException.genId();
    this.timestamp = new Date();
  }

  private static genId(length = 12): string {
    const p = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM7894561320';
    return [...Array(length)].reduce(
      (a) => a + p[Math.floor(Math.random() * p.length)],
      '',
    );
  }
}
