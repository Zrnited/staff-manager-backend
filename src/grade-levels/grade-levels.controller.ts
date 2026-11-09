import {
  //   BadRequestException,
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
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUserId } from '../common/decorators/current-user-id.decorator.js';

@ApiTags('Grade Levels')
@ApiCookieAuth()
@Controller('grade-levels')
export class GradeLevelsController {
  constructor(private readonly gradeLevelService: GradeLevelsService) {}

  @Post()
  @ResponseMessage('Grade Level created successfully')
  create(@Body() dto: CreateGradeLevelDto, @CurrentUserId() ownerId: string) {
    return this.gradeLevelService.create(dto, ownerId);
  }

  @Get()
  @ResponseMessage('Grade Levels fetched successfully')
  findAll(@CurrentUserId() ownerId: string) {
    return this.gradeLevelService.findAll(ownerId);
  }

  @Get('/:id')
  @ResponseMessage('Grade Level fetched successfully')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUserId() ownerId: string,
  ) {
    // if (!id) return new BadRequestException('id not found');
    return this.gradeLevelService.findOne(id, ownerId);
  }

  @Patch('/:gradeLevelId/employees/:employeeId')
  @ResponseMessage('Employee assigned to grade level successfully')
  assign(
    @Param('gradeLevelId', ParseUUIDPipe) gradeLevelId: string,
    @Param('employeeId', ParseUUIDPipe) employeeId: string,
    @CurrentUserId() ownerId: string,
  ) {
    return this.gradeLevelService.assignEmployee(
      gradeLevelId,
      employeeId,
      ownerId,
    );
  }

  @Delete('/:id')
  @ResponseMessage('Grade Level deleted successfully')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUserId() ownerId: string,
  ) {
    // if (!id) return new BadRequestException('id not found');
    return this.gradeLevelService.remove(id, ownerId);
  }
}
