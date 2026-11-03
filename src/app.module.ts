import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { GradeLevelsModule } from './grade-levels/grade-levels.module.js';
import { EmployeesModule } from './employees/employees.module.js';
import { UsersModule } from './users/users.module.js';
import { dataSourceOptions } from './data-source.js';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor.js';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter.js';
import { AuthGuard } from './guards/auth.guard.js';

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
  providers: [
    AppService,
    { provide: APP_INTERCEPTOR, useClass: ResponseInterceptor },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AppModule {}
