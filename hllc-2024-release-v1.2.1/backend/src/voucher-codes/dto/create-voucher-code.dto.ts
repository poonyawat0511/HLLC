import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsNumber,
    IsIn
  } from 'class-validator';
  import { VoucherCodeType } from '../interfaces/voucher-codes.interface'
export class CreateVoucherCodeDto {

  @IsString()
  @IsNotEmpty()
  acronym: string

  @IsNumber()
  @IsNotEmpty()
  count: number

  @IsNotEmpty()
  readonly voucher: string;

  @IsOptional()
  readonly user: string;

  @IsOptional()
  code : string

  @IsOptional()
  @IsIn(['USED', 'UNUSED'])
  type : VoucherCodeType
}
