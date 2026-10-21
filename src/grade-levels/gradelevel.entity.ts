import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Employee } from '../employees/employee.entity.js';

@Entity()
export class GradeLevel {
  @PrimaryGeneratedColumn()
  id!: string;
  @Column()
  name!: string;
  @Column()
  description!: string;
  @OneToMany(() => Employee, (employee) => employee.gradeLevel)
  employees: Employee[];
}
