import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './auth/entities';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'testPassword ',
      database: 'devcamp11',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
