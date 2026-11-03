import { OmitType, PartialType } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { CreateEmployeeDto } from './create-employee.dto.js';

export class UpdateEmployeeDto extends PartialType(
  OmitType(CreateEmployeeDto, ['gradeLevelId'] as const),
) {
  @IsOptional()
  @IsUUID()
  gradeLevelId?: string | null;
}
