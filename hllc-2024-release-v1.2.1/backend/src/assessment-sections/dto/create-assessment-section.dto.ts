import { Type } from 'class-transformer';
import { IsNumber, ValidateNested, IsObject } from 'class-validator';
import { LocalesDto } from 'src/app/common/dto/locales-dto';
import { NameDto } from './name.dto';

export class CreateAssessmentSectionDto {
  @IsObject()
  @ValidateNested()
  @Type(() => NameDto)
  title: NameDto;

  @IsObject()
  @ValidateNested()
  @Type(() => NameDto)
  subtitle: NameDto; 

  @IsNumber()
  order: string;
}
