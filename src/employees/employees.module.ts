import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller.js';
import { EmployeesService } from './employees.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './employee.entity.js';

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService],
   imports: [TypeOrmModule.forFeature([Employee])], //creates repo
})
export class EmployeesModule {}
