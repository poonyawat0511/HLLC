import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type QuestionDocument = HydratedDocument<Question>;

@Schema()
export class Question {
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
  text: { th: string; en: string };

  @Prop({ type: String, required: true })
  image: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
QuestionSchema.set('toJSON', { flattenObjectIds: true, versionKey: false });
QuestionSchema.set('toObject', { flattenObjectIds: true, versionKey: false });
