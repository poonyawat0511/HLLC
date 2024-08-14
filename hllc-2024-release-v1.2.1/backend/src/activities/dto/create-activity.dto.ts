import {
  IsBoolean,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ActivityType } from '../enums/activity-type.enum';
import { TransformType } from 'src/app/decorator/transform-type.decorator';
import { LocalesDto, OptionalLocalesDto } from 'src/app/common/dto/locales-dto';

export class CreateActivityDto {
  @IsObject()
  @ValidateNested()
  @Type(() => LocalesDto)
  name: { th: string; en: string };

  @IsObject()
  @ValidateNested()
  @Type(() => LocalesDto)
  shortName: { th: string; en: string };

  @IsString()
  code: string;

  @TransformType(Number)
  @IsIn([0, 1])
  type: ActivityType;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => OptionalLocalesDto)
  description: { th: string; en: string };

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => OptionalLocalesDto)
  shortDesc: { th: string; en: string };

  @IsOptional()
  @TransformType(Boolean)
  @IsBoolean()
  open: boolean;

  @IsOptional()
  @TransformType(Boolean)
  @IsBoolean()
  progress: boolean;

  @IsOptional()
  @TransformType(Boolean)
  @IsBoolean()
  show: boolean;

  @IsOptional()
  @IsString()
  icon?: string;

  @IsOptional()
  @IsString()
  banner?: string;
}
