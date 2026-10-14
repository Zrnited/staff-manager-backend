import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { DataSource } from 'typeorm';

@Controller()
export class AppController {
  constructor(private dataSource: DataSource) {}

  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @Get('health')
  async health() {
    await this.dataSource.query('SELECT 1');
    return { db: 'up' };
  }
}
