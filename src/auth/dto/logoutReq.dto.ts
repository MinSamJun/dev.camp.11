export type LogoutReqDto = {
  token: string;
  jti: string;
  type: 'access' | 'refresh';
  expiresAt: Date;
};
