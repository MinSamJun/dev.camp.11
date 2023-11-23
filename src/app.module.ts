import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './auth/entities';
import { UserRepository } from './auth/repositories';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { configSchema } from './config/configSchema';
import configuration from './config/configuration';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: configSchema,
      load: [configuration.loadYamlConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const dbConfig = await configuration.loadYamlConfig();

        return {
          type: dbConfig.DATABASE.DB_TYPE,
          host: dbConfig.HTTP.DB_HOST,
          port: dbConfig.HTTP.DB_PORT,
          username: dbConfig.DATABASE.DB_USERNAME,
          password: dbConfig.DATABASE.DB_PASSWORD,
          database: dbConfig.DATABASE.DB_DATABASE,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
          logging: true,
        } as TypeOrmModuleOptions;
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AppController],
  providers: [AppService, UserRepository],
  exports: [AppService],
})
export class AppModule {}
