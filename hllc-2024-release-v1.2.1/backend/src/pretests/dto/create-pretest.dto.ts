import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { PretestDto } from './pretest.dto';
import { Type } from 'class-transformer';

export class CreatePretestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PretestDto)
  values: PretestDto[];

  @IsNotEmpty()
  readonly author: string;
}
