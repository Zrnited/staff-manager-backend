import { IsString } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  name: string;
  @IsString()
  role: string;
  @IsString()
  department: string;
  @IsString()
  country: string;
  @IsString()
  state: string;
  @IsString()
  address: string;
  @IsString()
  grade: string;
}
