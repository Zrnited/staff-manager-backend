import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { DataSource } from 'typeorm';
import { Public } from './common/decorators/public.decorator.js';

@Controller()
export class AppController {
  constructor(private dataSource: DataSource) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @Public()
  @Get('health')
  async health() {
    await this.dataSource.query('SELECT 1');
    // return { db: 'up' };
    return { status: 'ok' };
  }
}
