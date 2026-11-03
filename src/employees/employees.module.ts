import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller.js';
import { EmployeesService } from './employees.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from './employee.entity.js';
import { GradeLevel } from '../grade-levels/gradelevel.entity.js';

@Module({
  controllers: [EmployeesController],
  providers: [EmployeesService],
   imports: [TypeOrmModule.forFeature([Employee, GradeLevel])], //creates repo
})
export class EmployeesModule {}
