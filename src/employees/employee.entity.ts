import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { GradeLevel } from '../grade-levels/gradelevel.entity.js';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  role!: string;

  @Column()
  department!: string;

  @Column()
  country!: string;

  @Column()
  state!: string;

  @Column()
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
