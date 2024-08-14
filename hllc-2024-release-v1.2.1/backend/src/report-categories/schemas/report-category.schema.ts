import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ReportCategoryDocument = HydratedDocument<ReportCategory>;

@Schema()
export class ReportCategory {
  @Prop(
    raw({
      th: { type: String, required: true, unique: true },
      en: { type: String, required: true, unique: true },
    }),
  )
  name: { th: string; en: string };
}

export const CategorySchema = SchemaFactory.createForClass(ReportCategory);

CategorySchema.set('toJSON', { flattenObjectIds: true, versionKey: false });
CategorySchema.set('toObject', { flattenObjectIds: true, versionKey: false });
