import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { questionnaireType } from '../interfaces/questionnaire.interface';

@Schema()
export class Questionnaire {
  @Prop(
    raw({
      th: { type: String, required: true },
      en: { type: String, required: true },
    }),
  )
  questionnaire: { th: string; en: string };

  @Prop({
    type: String,
    default: 'Ratings',
    enum: ['Ratings', 'Text'],
  })
  type: questionnaireType;
}

export type QuestionnaireDocument = Questionnaire & Document;
export const QuestionnaireSchema = SchemaFactory.createForClass(Questionnaire);

QuestionnaireSchema.set('toJSON', {
  flattenObjectIds: true,
  versionKey: false,
});
QuestionnaireSchema.set('toObject', {
  flattenObjectIds: true,
  versionKey: false,
});

QuestionnaireSchema.index({ 'questionnaire.th': 1, 'questionnaire.en': 1 }, { unique: true });

