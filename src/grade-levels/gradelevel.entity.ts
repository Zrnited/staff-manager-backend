import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Employee } from '../employees/employee.entity.js';

@Entity()
export class GradeLevel {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({type: 'text'})
  description!: string;

  @OneToMany(() => Employee, (employee) => employee.gradeLevel)
  employees: Employee[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;
}
