import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { SponsorType } from '../interfaces/sponsors.interface';
export type SponsorDocument = HydratedDocument<Sponsor>;

@Schema()
export class Sponsor {
  @Prop(
    raw({
      th: { type: String, required: true, uppercase: true },
      en: { type: String, required: true, uppercase: true },
    }),
  )
  name: { th: string; en: string };

  @Prop({ type: String, required: true })
  logo: string;

  @Prop({ type: Number, required: true, unique: true })
  no: number;

  @Prop({ type: Boolean, default: true })
  show: boolean;

  @Prop({
    type: String,
    default: 'NORMAL',
    enum: ['NORMAL', 'SCAN'],
  })
  type: SponsorType;
}

export const SponsorSchema = SchemaFactory.createForClass(Sponsor);

SponsorSchema.set('toJSON', { flattenObjectIds: true, versionKey: false });
SponsorSchema.set('toObject', { flattenObjectIds: true, versionKey: false });
