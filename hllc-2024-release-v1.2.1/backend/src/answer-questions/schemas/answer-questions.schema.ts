import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Question } from 'src/questions/schemas/question.schema';
import { User } from 'src/users/schemas/user.schema';
export type SponsorDocument = HydratedDocument<AnswerQuestion>;

@Schema({collection : "answer-questions"})
export class AnswerQuestion {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Question', required: true })
  question: Question | Types.ObjectId;

  @Prop({ type: String, required: true })
  value: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  user: User | Types.ObjectId;
}

export const AnswerQuestionSchema =
  SchemaFactory.createForClass(AnswerQuestion);

AnswerQuestionSchema.set('toJSON', {
  flattenObjectIds: true,
  versionKey: false,
});
AnswerQuestionSchema.set('toObject', {
  flattenObjectIds: true,
  versionKey: false,
});
