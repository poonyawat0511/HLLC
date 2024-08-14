import { IsOptional, IsString, IsIn } from 'class-validator';
import { VoucherCodeType } from '../interfaces/voucher-codes.interface';

export class UpdateVoucherCodeDto {
  @IsOptional()
  @IsString()
  readonly code?: string;

  @IsOptional()
  @IsString()
  readonly voucher?: string;

  @IsOptional()
  @IsString()
  readonly user?: string | null;

  @IsOptional()
  @IsIn(['USED', 'UNUSED'])
  readonly type?: VoucherCodeType;
}
