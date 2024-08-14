import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Sponsor } from 'src/sponsors/schemas/sponsors.schema';
import { VoucherType } from '../interfaces/vouchers.interface';

export type VoucherDocument = HydratedDocument<Voucher>;

@Schema()
export class Voucher {
  @Prop(
    raw({
      th: { type: String, required: true },
      en: { type: String, required: true },
    }),
  )
  discount: { th: string; en: string };

  @Prop(
    raw([
      {
        th: { type: String, required: true },
        en: { type: String, required: true },
      },
    ]),
  )
  condition: { th: string; en: string; id: string }[];

  @Prop(raw({
    main: { type: String, required: true },
    front: { type: String, required: true },
    back: { type: String, required: true },
  }))
  voucherImages: {
    main : string,
    front : string,
    back : string
  }

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Sponsor',
    required: true,
  })
  sponsor: Sponsor | Types.ObjectId;

  @Prop({ type: Date, required: true })
  exp: Date;

  @Prop({ type: String, required: true, uppercase: true })
  acronym: string;

  @Prop({
    type: String,
    default: 'GLOBAL',
    enum: ['GLOBAL', 'INDIVIDUAL'],
  })
  type: VoucherType;
}

export const VoucherSchema = SchemaFactory.createForClass(Voucher);

VoucherSchema.set('toJSON', { flattenObjectIds: true, versionKey: false });
VoucherSchema.set('toObject', { flattenObjectIds: true, versionKey: false });
