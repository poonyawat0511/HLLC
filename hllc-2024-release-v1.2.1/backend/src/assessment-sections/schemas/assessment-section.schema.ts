import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AssessmentSectionDocument = HydratedDocument<AssessmentSection>;

@Schema({collection : "assessment-sections"})
export class AssessmentSection {
  @Prop(
    raw({
      th: { type: String, required: true },
      en: { type: String, required: true },
    }),
  )
  title: { th: string; en: string };

  @Prop(
    raw({
      th: { type: String, required: true },
      en: { type: String, required: true },
    }),
  )
  subtitle: { th: string; en: string };

  @Prop({ type: Number, })
  order: number;
}

export const AssessmentSectionSchema =
  SchemaFactory.createForClass(AssessmentSection);

AssessmentSectionSchema.set('toJSON', {
  flattenObjectIds: true,
  versionKey: false,
});
AssessmentSectionSchema.set('toObject', {
  flattenObjectIds: true,
  versionKey: false,
});
