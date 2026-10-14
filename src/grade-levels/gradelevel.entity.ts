import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GradeLevel {
  @PrimaryGeneratedColumn()
  id!: string;
  @Column()
  name!: string;
  @Column()
  description!: string;
}
