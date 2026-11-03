import {
  // BadRequestException,
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

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeeService: EmployeesService) {}

  @Post()
  @ResponseMessage('Employee created successfully')
  create(@Body() dto: CreateEmployeeDto) {
    return this.employeeService.create(dto);
  }

  @Get()
  @ResponseMessage('Employees fetched successfully')
  findAll() {
    return this.employeeService.findAll();
  }

  @Get('/:id')
  @ResponseMessage('Employee fetched successfully')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    // if (!id) return new BadRequestException('id not found');
    return this.employeeService.findOne(id);
  }

  @Patch('/:id')
  @ResponseMessage('Employee profile updated successfully')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEmployeeDto,
  ) {
    return this.employeeService.update(id, dto);
  }

  @Delete('/:id')
  @ResponseMessage('Employee records deleted successfully')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    // if (!id) return new BadRequestException('id not found');
    return this.employeeService.remove(id);
  }
}
