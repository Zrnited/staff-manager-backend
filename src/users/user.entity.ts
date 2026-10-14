import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: string;
  @Column()
  email!: string;
  @Column()
  password!: string;
  @Column()
  firstName!: string;
  @Column()
  lastName!: string;
  //   profileImg!: string;
}
