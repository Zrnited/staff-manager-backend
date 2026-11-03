import { Module } from '@nestjs/common';
import { GradeLevelsController } from './grade-levels.controller.js';
import { GradeLevelsService } from './grade-levels.service.js';
import { GradeLevel } from './gradelevel.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from '../employees/employee.entity.js';

@Module({
  controllers: [GradeLevelsController],
  providers: [GradeLevelsService],
   imports: [TypeOrmModule.forFeature([GradeLevel, Employee])], //creates repo
})
export class GradeLevelsModule {}
