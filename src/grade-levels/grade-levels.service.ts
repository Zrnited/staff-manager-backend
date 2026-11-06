import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GradeLevel } from './gradelevel.entity.js';
import { Repository } from 'typeorm';
import { Employee } from '../employees/employee.entity.js';
import { CreateGradeLevelDto } from './dtos/create-grade-level.dto.js';

@Injectable()
export class GradeLevelsService {
  constructor(
    @InjectRepository(GradeLevel)
    private readonly repo: Repository<GradeLevel>,
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {
    this.repo = repo;
  }

  //create a gradelevel
  async create(dto: CreateGradeLevelDto) {
    const exists = await this.repo.existsBy({ name: dto.name });
    if (exists) {
      throw new ConflictException(`Grade level "${dto.name}" already exists`);
    }

    const gradeLevel = this.repo.create({
      name: dto.name,
      description: dto.description,
    });

    return this.repo.save(gradeLevel);
  }

  //get all
  async findAll(): Promise<GradeLevel[]> {
    return await this.repo.find({
      order: { createdAt: 'ASC' },
      relations: { employees: true },
      select: { employees: { id: true, name: true } },
    });
  }

  //get one
  async findOne(id: string) {
    const gradeLevel = await this.repo.findOneBy({ id });
    if (!gradeLevel)
      throw new NotFoundException(`grade level with id: "${id}" not found`);
    return gradeLevel;
  }

  //assign employee to grade level
  async assignEmployee(
    gradeLevelId: string,
    employeeId: string,
  ): Promise<GradeLevel> {
    //find grade level
    const gradeLevel = await this.findOne(gradeLevelId);
    if (!gradeLevel) throw new NotFoundException('grade level not found');

    //find employee
    const employee = await this.employeeRepo.findOneBy({ id: employeeId });
    if (!employee) {
      throw new NotFoundException(`Employee ${employeeId} not found`);
    }

    employee.gradeLevel = gradeLevel;
    await this.employeeRepo.save(employee);

    // Return the grade level with its updated employee list
    return this.repo.findOneOrFail({
      where: { id: gradeLevelId },
      relations: { employees: true },
    });
  }

  //delete a gradeLevel
  async remove(id: string) {
    const gradeLevel = await this.findOne(id);
    if (!gradeLevel) throw new NotFoundException('Grade level not found');
    return this.repo.remove(gradeLevel);
  }
}
