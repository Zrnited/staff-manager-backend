import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { GradeLevel } from '../grade-levels/gradelevel.entity.js';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 100 })
  position!: string;

  @Column({ length: 100 })
  department!: string;

  @Column({ length: 100 })
  country!: string;

  @Column({ length: 100 })
  state!: string;

  @Column({ type: 'text' })
  address!: string;

  @ManyToOne(() => GradeLevel, (gradeLevel) => gradeLevel.employees, {
    nullable: true, //alows an employee to exist before being assigned
    onDelete: 'SET NULL', //deleting a grade level doesn't delete its employees
  })
  gradeLevel!: GradeLevel | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
