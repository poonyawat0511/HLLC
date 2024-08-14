import {
  IsNotEmpty,
  IsObject,
  ValidateNested,
  IsIn,
  IsBoolean,
  IsString,
  IsOptional,
} from 'class-validator';
import { NameDto } from './name.dto';
import { Type } from 'class-transformer';
import { SponsorType } from '../interfaces/sponsors.interface';
import { TransformType } from 'src/app/decorator/transform-type.decorator';

export class CreateSponsorDto {
  @IsObject()
  @ValidateNested()
  @Type(() => NameDto)
  name: NameDto;

  @IsOptional()
  @IsString()
  logo: string;

  @IsNotEmpty()
  no: number;

  @IsOptional()
  @TransformType(Boolean)
  @IsBoolean()
  show: boolean;

  @IsOptional()
  @IsIn(['NORMAL', 'SCAN'])
  type: SponsorType;
}
