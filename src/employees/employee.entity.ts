import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GradeLevel } from '../grade-levels/gradelevel.entity.js';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
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
  @ManyToOne(() => GradeLevel, (gradeLevel) => gradeLevel.employees)
  gradeLevel!: GradeLevel;
}
