import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import School from 'src/schools/interfaces/school.interface';

export type MajorDocument = Major & Document;

@Schema({ id: true })
export class Major {
  @Prop(
    raw({
      th: { required: true, unique: true, type: String },
      en: { required: true, unique: true, type: String },
    }),
  )
  name: {
    th: string;
    en: string;
  };

  @Prop({ required: true, unique: true })
  acronym: string;

  @Prop(
    raw({
      th: { required: true, type: String },
      en: { required: true, type: String },
    }),
  )
  detail: {
    th: string;
    en: string;
  };

  @Prop({ type: SchemaTypes.ObjectId, ref: 'School', required: true })
  school: Types.ObjectId | School | string;

  _id: Types.ObjectId | string;
}

export const MajorSchema = SchemaFactory.createForClass(Major);

MajorSchema.set('toJSON', { flattenObjectIds: true, versionKey: false });
MajorSchema.set('toObject', { flattenObjectIds: true, versionKey: false });
