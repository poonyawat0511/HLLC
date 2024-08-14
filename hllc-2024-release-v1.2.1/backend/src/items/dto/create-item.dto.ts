import { Type } from 'class-transformer';
import {
  IsMongoId,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { LocalesDto, OptionalLocalesDto } from 'src/app/common/dto/locales-dto';

export class CreateItemDto {
  @IsObject()
  @ValidateNested()
  @Type(() => LocalesDto)
  name: { th: string; en: string };

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => OptionalLocalesDto)
  description: { th: string; en: string };

  @IsMongoId()
  activity: string;

  @IsOptional()
  @IsString()
  image: string;
}
