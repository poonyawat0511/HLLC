import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Activity } from 'src/activities/schemas/activities.schema';
import { User } from 'src/users/schemas/user.schema';

export type EvaluationDocument = HydratedDocument<Evaluation>;

@Schema({ _id: true })
export class Evaluation {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  })
  author?: User | Types.ObjectId | null;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Activity',
    required: true,
  })
  activity?: Activity | Types.ObjectId | null;

  @Prop({
    type: Date,
    default: Date.now,
  })
  timestamp?: Date;

  @Prop([
    {
      question: {
        type: SchemaTypes.ObjectId,
        ref: 'Question',
        required: true,
      },
      value: { type: String, required: true },
    },
  ])
  values: EvaluationValue[];
}

export const EvaluationSchema = SchemaFactory.createForClass(Evaluation);

EvaluationSchema.index({ author: 1, activity: 1 }, { unique: true });

EvaluationSchema.set('toJSON', {
  flattenObjectIds: true,
  versionKey: false,
});
EvaluationSchema.set('toObject', {
  flattenObjectIds: true,
  versionKey: false,
});
