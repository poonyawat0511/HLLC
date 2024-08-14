import {
  IsNotEmpty,
  IsObject,
  IsArray,
  ValidateNested,
  IsString,
  IsOptional,
  IsIn,
} from 'class-validator';
import { NameDto } from './name.dto';
import { Type } from 'class-transformer';
import { VoucherType } from '../interfaces/vouchers.interface';

export class CreateVoucherDto {
  @IsObject()
  @ValidateNested()
  @Type(() => NameDto)
  discount: NameDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NameDto)
  condition: NameDto[];

  voucherImages: {
    main: string;
    front: string;
    back: string;
  };

  @IsNotEmpty()
  readonly sponsor: string;

  @IsNotEmpty()
  exp: Date;

  @IsString()
  acronym: string;

  @IsOptional()
  @IsIn(['GLOBAL', 'INDIVIDUAL'])
  type: VoucherType;
}
