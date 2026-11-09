import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from './employee.entity.js';
import { IsNull, Not, Repository } from 'typeorm';
import { CreateEmployeeDto } from './dtos/create-employee.dto.js';
import { GradeLevel } from '../grade-levels/gradelevel.entity.js';
import { UpdateEmployeeDto } from './dtos/update-employee.dto.js';
import { StatisticsDto } from './dtos/statistics.dto.js';

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
  async create(dto: CreateEmployeeDto, ownerId: string): Promise<Employee> {
    const { gradeLevelId, name, ...fields } = dto;
    let gradeLevel: GradeLevel | null = null;

    if (gradeLevelId) {
      gradeLevel = await this.gradeLevelRepo.findOneBy({
        id: gradeLevelId,
        ownerId,
      });
      if (!gradeLevel) {
        throw new NotFoundException(
          `Grade level with id: ${gradeLevelId} not found`,
        );
      }
    }

    const existingName = await this.repo.existsBy({ name, ownerId });
    if (existingName) {
      throw new ConflictException(
        'Employee name already exists. If necessary, add special tag or number to name.',
      );
    }

    const employee = this.repo.create({ ...fields, name, gradeLevel, ownerId });
    return this.repo.save(employee);
  }

  //find all employees
  async findAll(ownerId: string): Promise<Employee[]> {
    return await this.repo.find({
      where: { ownerId },
      order: { createdAt: 'DESC' },
      relations: { gradeLevel: true },
      select: { gradeLevel: { name: true, id: true } },
    });
  }

  //find one employee
  async findOne(id: string, ownerId: string) {
    // const employee = await this.repo.findOneBy({ id });
    const employee = await this.repo.findOne({
      where: { id, ownerId },
      relations: { gradeLevel: true },
      select: { gradeLevel: { name: true, id: true } },
    });
    if (!employee)
      throw new NotFoundException(`Employee with id: "${id}" not found`);
    return employee;
  }

  //update one
  async update(
    id: string,
    dto: UpdateEmployeeDto,
    ownerId: string,
  ): Promise<Employee> {
    const employee = await this.findOne(id, ownerId);
    if (!employee) throw new NotFoundException(`Employee ${id} not found`);

    const { gradeLevelId, ...fields } = dto;

    if (gradeLevelId !== undefined) {
      if (gradeLevelId === null) {
        employee.gradeLevel = null;
      } else {
        const gradeLevel = await this.gradeLevelRepo.findOneBy({
          id: gradeLevelId,
          ownerId,
        });
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
  async remove(id: string, ownerId: string) {
    const employee = await this.findOne(id, ownerId);
    if (!employee) throw new NotFoundException('Employee not found');
    return this.repo.remove(employee);
  }

  //stats
  async overview(ownerId: string) {
    //get all employees
    const employees = await this.findAll(ownerId);
    //get all gradelevels
    const gradeLevels = await this.gradeLevelRepo.find({ where: { ownerId } });

    const departments = await this.repo
      .createQueryBuilder('employee')
      .where('employee.ownerId = :ownerId', { ownerId })
      .select('COUNT(DISTINCT LOWER(TRIM(employee.department)))', 'count')
      .getRawOne<{ count: string }>();

    const [total, assigned] = await Promise.all([
      this.repo.count({ where: { ownerId } }),
      this.repo.count({
        where: { ownerId, gradeLevel: { id: Not(IsNull()) } },
      }),
    ]);

    //define resonse structure
    const statistics: StatisticsDto = {
      numOfEmployees: employees.length,
      numOfGradeLevels: gradeLevels.length ? gradeLevels.length : 0,
      deptCount: Number(departments?.count ?? 0),
      assignedEmployees: assigned,
      totalEmployees: total,
      unassignedEmployees: total - assigned,
    };

    return statistics;
  }
}
