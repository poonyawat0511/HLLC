import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SchoolDocument = School & Document;

@Schema()
export class School {
  @Prop(
    raw({
      th: { type: String, required: true, unique: true },
      en: { type: String, required: true, unique: true },
    }),
  )
  name: { th: string; en: string };

  @Prop({ required: true, unique: true })
  acronym: string;

  @Prop(
    raw({
      th: { type: String, required: true },
      en: { type: String, required: true },
    }),
  )
  detail: {
    th: string;
    en: string;
  };

  @Prop(
    raw({
      first: { type: String, required: true },
      second: { type: String, required: true },
      third: { type: String, required: true },
      fourth: { type: String, required: true },
    }),
  )
  photos: {
    first: string;
    second: string;
    third: string;
    fourth: string;
  };

  _id: Types.ObjectId;
}

export const SchoolSchema = SchemaFactory.createForClass(School);

SchoolSchema.set('toJSON', { flattenObjectIds: true, versionKey: false });
SchoolSchema.set('toObject', { flattenObjectIds: true, versionKey: false });
