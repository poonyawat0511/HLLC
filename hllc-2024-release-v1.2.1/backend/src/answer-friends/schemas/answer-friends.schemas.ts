import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types, Document } from 'mongoose';

@Schema()
export class AnswerQues {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  sender: Types.ObjectId;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  receiver: Types.ObjectId;

  @Prop({
    type: [{
      questionnaire: { type: SchemaTypes.ObjectId, ref: 'Questionnaire', required: true },
      answer: { type: String, required: true },
    }],
  })
  questions: {
    questionnaire: Types.ObjectId;
    answer: string;
  }[];
}

export type AnswerQuesDocument = AnswerQues & Document;
export const AnswerQuesSchema = SchemaFactory.createForClass(AnswerQues);

// Ensure that each sender-receiver pair is unique
AnswerQuesSchema.index({ sender: 1, receiver: 1 }, { unique: true });

// Custom validation middleware to check sender and receiver equality
AnswerQuesSchema.pre('validate', function (next) {
  if (this.sender instanceof Types.ObjectId && this.receiver instanceof Types.ObjectId) {
    if (this.sender.equals(this.receiver)) {
      return next(new Error('Sender and receiver cannot be the same person.'));
    }
  }
  next();
});

AnswerQuesSchema.set('toJSON', { flattenObjectIds: true, versionKey: false });
AnswerQuesSchema.set('toObject', { flattenObjectIds: true, versionKey: false });
