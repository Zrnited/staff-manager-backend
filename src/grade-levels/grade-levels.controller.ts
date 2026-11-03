import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { GradeLevelsService } from './grade-levels.service.js';
import { CreateGradeLevelDto } from './dtos/create-grade-level.dto.js';
import { ResponseMessage } from '../common/decorators/response-message.decorator.js';

@Controller('grade-levels')
export class GradeLevelsController {
  constructor(private readonly gradeLevelService: GradeLevelsService) {}

  @Post()
  @ResponseMessage('Grade Level created successfully')
  create(@Body() dto: CreateGradeLevelDto) {
    return this.gradeLevelService.create(dto);
  }

  @Get()
  @ResponseMessage('Grade Levels fetched successfully')
  findAll() {
    return this.gradeLevelService.findAll();
  }

  @Get('/:id')
  @ResponseMessage('Grade Level fetched successfully')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    if (!id) return new BadRequestException('id not found');
    return this.gradeLevelService.findOne(id);
  }

  @Patch(':gradeLevelId/employees/:employeeId')
  @ResponseMessage('Employee assigned to grade level successfully')
  assign(
    @Param('gradeLevelId', ParseUUIDPipe) gradeLevelId: string,
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
  ) {
    return this.gradeLevelService.assignEmployee(gradeLevelId, employeeId);
  }

  @Delete('/:id')
  @ResponseMessage('Grade Level deleted successfully')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    if (!id) return new BadRequestException('id not found');
    return this.gradeLevelService.remove(id);
  }
}
