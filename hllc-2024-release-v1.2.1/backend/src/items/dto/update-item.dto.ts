import { Type } from 'class-transformer';
import {
  IsObject,
  ValidateNested,
  IsOptional,
  IsString,
} from 'class-validator';
import { OptionalLocalesDto } from 'src/app/common/dto/locales-dto';
import { CreateItemDto } from './create-item.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateItemDto extends PartialType(CreateItemDto) {
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => OptionalLocalesDto)
  name: { th: string; en: string };

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => OptionalLocalesDto)
  description: { th: string; en: string };

  @IsOptional()
  @IsString()
  image: string;
}
