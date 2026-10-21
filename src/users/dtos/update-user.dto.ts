import { IsString, IsEmail, MinLength, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsOptional()
  email: string;

//   @IsString()
//   @MinLength(8)
//   @IsOptional()
//   password: string;
}
