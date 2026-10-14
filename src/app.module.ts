import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { GradeLevelsModule } from './grade-levels/grade-levels.module.js';
import { EmployeesModule } from './employees/employees.module.js';
import { UsersModule } from './users/users.module.js';
import { dataSourceOptions } from './data-source.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    // TypeOrmModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => ({
    //     type: 'postgres',
    //     url: config.getOrThrow<string>('DATABASE_URL'),
    //     autoLoadEntities: true,
    //     synchronize: true, // change to false later on,
    //     ssl:
    //       config.get('DATABASE_SSL') === 'true'
    //         ? { rejectUnauthorized: false }
    //         : false,
    //   }),
    // }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
    }),
    GradeLevelsModule,
    EmployeesModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
