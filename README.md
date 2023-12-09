# 쇼핑몰 개발
## 소개
이 프로젝트는 Nest.js를 활용하여 구축된 백엔드 서버입니다. 현재는 기능이 미완성 상태이며, 아래는 완성된 기능들에 대한 간략한 설명입니다.

## 완성된 기능
1. 회원가입 기능
프론트엔드에서의 회원가입 요청 시, 입력된 메일의 유효성을 확인하고 가입을 처리합니다.
2. 로그인 기능
프론트엔드에서의 로그인 요청 시, 입력된 ID의 존재 여부 및 비밀번호 일치 여부를 확인하여 로그인을 처리합니다.
3. 로그아웃 기능
프론트엔드에서의 로그아웃 요청 시, 데이터베이스에서 리프레시/액세스 토큰에 있는 isWithdraw 값을 true로 변경하여 블랙리스트로 추가합니다.
4. 만료 토큰 자동삭제 기능
서버 실행시, 또는 일정 주기마다 자동으로 만료된 토큰을 제거


## 사용 기술
Nest.js: 타입스크립트로 작성된 Node.js 앱을 구축하기 위한 프레임 워크입입니다.
ConfigModule: 환경 변수를 관리하고 설정을 로드하기 위해 Nest.js에서 제공하는 모듈입니다.
JwtModule: JWT를 사용하기 위한 Nest.js 모듈입니다. 페이로드에 sub, jti, iat, exp를 암호화하여 넣습니다.
TypeOrmModule: Nest.js에서 제공하는 TypeORM 모듈로, 데이터베이스와의 상호 작용을 위한 모델 및 리포지토리를 설정합니다.
nestjs/schedule: 서버가 실행되거나 정해진 주기마다 예약된 메서드를 실행시키는 라이브러리

## 실행 방법
프로젝트를 클론합니다.
npm install로 필요한 패키지를 설치합니다.
설정 파일을 작성하고 환경 변수를 설정합니다.
npm start로 서버를 실행합니다.

### 환경 변수 참조
```
// .env

ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_EXPIRY=
ENV=
JWT_SECRET_KEY=
DB_TYPE=
DB_HOST=
DB_USERNAME=
DB_PASSWORD=
DB_PORT=
DB_DATABASE=
PORT =
```

```
/src/auth/config/configSchema.ts

import * as Joi from '@hapi/joi';

export const configSchema = Joi.object({
  // ENV
  ENV: Joi.string().valid('local', 'test', 'prod').required(),
  PORT: Joi.number().required(),

  // AUTH
  JWT_SECRET_KEY: Joi.string().required(),

  // DB
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
});

```

##  API 명세서
https://universal-ocarina-169.notion.site/API-afe8b0657f8545549937a866a90b811d

## 기여자
백엔드 : 김민준
