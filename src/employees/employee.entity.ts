import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  @Column()
  grade!: string;
}
