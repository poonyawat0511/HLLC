import { PartialType } from '@nestjs/mapped-types';
import { CreateActivityDto } from './create-activity.dto';
import { IsObject, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OptionalLocalesDto } from 'src/app/common/dto/locales-dto';

export class UpdateActivityDto extends PartialType(CreateActivityDto) {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => OptionalLocalesDto)
  name: { th: string; en: string };

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => OptionalLocalesDto)
  shortName: { th: string; en: string };
}
