# 쇼핑몰 개발
## 소개
이 프로젝트는 Nest.js를 활용하여 구축된 백엔드 서버입니다. 현재는 기능이 미완성 상태이며, 아래는 완성된 기능들에 대한 간략한 설명입니다.

## 완성된 기능
1. 회원가입 기능 : 프론트엔드에서의 회원가입 요청 시, 입력된 메일의 유효성을 확인하고 가입을 처리합니다.
2. 로그인 기능 : 프론트엔드에서의 로그인 요청 시, 입력된 ID의 존재 여부 및 비밀번호 일치 여부를 확인하여 로그인을 처리합니다.
3. 로그아웃 기능 : 프론트엔드에서의 로그아웃 요청 시, 데이터베이스에서 리프레시/액세스 토큰에 있는 isWithdraw 값을 true로 변경하여 블랙리스트로 추가합니다.
4. 만료 토큰 자동삭제 기능 : 서버 실행시, 또는 일정 주기마다 자동으로 만료된 토큰을 제거


## 사용 기술
1. Nest.js: 타입스크립트로 작성된 Node.js 앱을 구축하기 위한 프레임 워크입입니다.
1. ConfigModule: 환경 변수를 관리하고 설정을 로드하기 위해 Nest.js에서 제공하는 모듈입니다.
1. JwtModule: JWT를 사용하기 위한 Nest.js 모듈입니다. 페이로드에 sub, jti, iat, exp를 암호화하여 넣습니다.
1. TypeOrmModule: Nest.js에서 제공하는 TypeORM 모듈로, 데이터베이스와의 상호 작용을 위한 모델 및 리포지토리를 설정합니다.
1. nestjs/schedule: 서버가 실행되거나 정해진 주기 또는 시간마다 예약된 메서드를 실행시키는 라이브러리

## 실행 방법
1. 프로젝트를 클론합니다.
1. npm install로 필요한 패키지를 설치합니다.
1. 설정 파일을 작성하고 환경 변수를 설정합니다.
1. npm start로 서버를 실행합니다.

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

```
// src/config/configuration.ts

import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { ConfigFactory } from '@nestjs/config';

const env = process.env.ENV || 'local';
const CONFIG_YAML = `${env}.yaml`;

const loadYamlConfig: ConfigFactory<Record<string, any>> = () => {
  try {
    const rootPath = process.cwd(); // 프로젝트 루트 경로
    const yamlFile = readFileSync(
      join(rootPath, 'src', 'config', CONFIG_YAML),
      'utf8',
    );
    return yaml.load(yamlFile) as Record<string, any>;
  } catch (error) {
    console.error('Error loading YAML config:', error);
    return {};
  }
};

const configuration = {
  loadYamlConfig,
};

export default configuration;
```

```
/src/auth/config/local.yaml
env: local

HTTP:
  HOST: 'localhost'
  PORT: 6666

DATABASE:
  DB_TYPE: 'mariadb'
  DB_HOST: 'localhost'
  DB_USERNAME: 'root'
  DB_PASSWORD: 
  DB_PORT: 
  DB_DATABASE: 
```
##  API 명세서
https://universal-ocarina-169.notion.site/API-afe8b0657f8545549937a866a90b811d

## 추가할 예정
0. TypeORM 에서 Prisma 로 변경 : 타입체크, DB와의 관계명시적으로 할 필없음 등으로 prisma로 전환하는 것이 더 이득이라고 판단함
1. OAuth : 카카오, 구글, 네이버, 그리고 해당 클라이언트에서 마지막으로 로그인했던 서비스가 어디인지 알려주는 기능
2. 테스트 코드 : 로그인을 할 때마다 다른 iat가 생기므로 고정된 값이 나오도록 조절하거나, 생성된 값을 입력값에 바로 넣는 등의 처리가 필요할 것 같다. 

## 기여자
백엔드 : 김민준
