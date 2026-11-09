import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { EmployeesService } from './employees.service.js';
import { UpdateEmployeeDto } from './dtos/update-employee.dto.js';
import { ResponseMessage } from '../common/decorators/response-message.decorator.js';
import { CreateEmployeeDto } from './dtos/create-employee.dto.js';
import { ApiTags, ApiCookieAuth } from '@nestjs/swagger';
import { CurrentUserId } from '../common/decorators/current-user-id.decorator.js';

@ApiTags('Employees')
@ApiCookieAuth()
@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeeService: EmployeesService) {}

  @Post()
  @ResponseMessage('Employee created successfully')
  create(@Body() dto: CreateEmployeeDto, @CurrentUserId() ownerId: string) {
    return this.employeeService.create(dto, ownerId);
  }

  @Get()
  @ResponseMessage('Employees fetched successfully')
  findAll(@CurrentUserId() ownerId: string) {
    return this.employeeService.findAll(ownerId);
  }

  @Get('/stats')
  @ResponseMessage('Overview stats fetched successfully')
  stats(@CurrentUserId() ownerId: string) {
    return this.employeeService.overview(ownerId);
  }

  @Get('/:id')
  @ResponseMessage('Employee fetched successfully')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUserId() ownerId: string,
  ) {
    return this.employeeService.findOne(id, ownerId);
  }

  @Patch('/:id')
  @ResponseMessage('Employee profile updated successfully')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEmployeeDto,
    @CurrentUserId() ownerId: string,
  ) {
    return this.employeeService.update(id, dto, ownerId);
  }

  @Delete('/:id')
  @ResponseMessage('Employee record deleted successfully')
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUserId() ownerId: string,
  ) {
    return this.employeeService.remove(id, ownerId);
  }
}
