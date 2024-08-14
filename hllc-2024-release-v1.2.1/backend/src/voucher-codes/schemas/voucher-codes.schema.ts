import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Voucher } from 'src/vouchers/schemas/vouchers.schema';
import { VoucherCodeType } from '../interfaces/voucher-codes.interface';

export type VoucherCodeDocument = VoucherCode & Document;

@Schema()
export class VoucherCode {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Voucher',
    required: true,
  })
  voucher: Voucher | Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    default: null,
  })
  user: User | Types.ObjectId;

  @Prop({ type: String, required: true })
  code: string;

  @Prop({
    type: String,
    default: 'UNUSED',
    enum: ['USED', 'UNUSED'],
  })
  type: VoucherCodeType;
}

export const VoucherCodeSchema = SchemaFactory.createForClass(VoucherCode);

VoucherCodeSchema.index({ user: 1, voucher: 1, code: 1 }, { unique: true });
VoucherCodeSchema.set('toJSON', { versionKey: false });
VoucherCodeSchema.set('toObject', { versionKey: false });
