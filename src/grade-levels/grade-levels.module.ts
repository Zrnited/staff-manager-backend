import { Module } from '@nestjs/common';
import { GradeLevelsController } from './grade-levels.controller.js';
import { GradeLevelsService } from './grade-levels.service.js';
import { GradeLevel } from './gradelevel.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [GradeLevelsController],
  providers: [GradeLevelsService],
   imports: [TypeOrmModule.forFeature([GradeLevel])], //creates repo
})
export class GradeLevelsModule {}
