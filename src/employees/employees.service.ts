import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './employee.entity.js';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from './dtos/create-employee.dto.js';
import { GradeLevel } from '../grade-levels/gradelevel.entity.js';
import { UpdateEmployeeDto } from './dtos/update-employee.dto.js';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee) private readonly repo: Repository<Employee>,
    @InjectRepository(GradeLevel)
    private readonly gradeLevelRepo: Repository<GradeLevel>,
  ) {
    this.repo = repo;
  }

  //create an employee
  async create(dto: CreateEmployeeDto): Promise<Employee> {
    const { gradeLevelId, ...fields } = dto;
    let gradeLevel: GradeLevel | null = null;

    if (gradeLevelId) {
      gradeLevel = await this.gradeLevelRepo.findOneBy({ id: gradeLevelId });
      if (!gradeLevel) {
        throw new NotFoundException(
          `Grade level with id: ${gradeLevelId} not found`,
        );
      }
    }

    const employee = this.repo.create({ ...fields, gradeLevel });
    return this.repo.save(employee);
  }

  //find all employees
  async findAll(): Promise<Employee[]> {
    return await this.repo.find({
      order: { createdAt: 'DESC' },
      relations: { gradeLevel: true },
      select: { gradeLevel: { name: true, id: true } },
    });
  }

  //find one employee
  async findOne(id: string) {
    // const employee = await this.repo.findOneBy({ id });
    const employee = await this.repo.findOne({
      where: { id },
      relations: { gradeLevel: true },
      select: { gradeLevel: { name: true, id: true } },
    });
    if (!employee)
      throw new NotFoundException(`Employee with id: "${id}" not found`);
    return employee;
  }

  //update one
  async update(id: string, dto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);
    if (!employee) throw new NotFoundException(`Employee ${id} not found`);

    const { gradeLevelId, ...fields } = dto;

    if (gradeLevelId !== undefined) {
      if (gradeLevelId === null) {
        employee.gradeLevel = null;
      } else {
        const gradeLevel = await this.gradeLevelRepo.findOneBy({ id: gradeLevelId });
        if (!gradeLevel) {
          throw new NotFoundException(`Grade level ${id} not found`);
        }
        employee.gradeLevel = gradeLevel;
      }
    }

    Object.assign(employee, fields);
    return this.repo.save(employee);
  }

  //delete an employee
  async remove(id: string) {
    const employee = await this.findOne(id);
    if (!employee) throw new NotFoundException('Employee not found');
    return this.repo.remove(employee);
  }
}
