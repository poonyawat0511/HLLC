import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Assessment } from 'src/assessments/schemas/assessments.schema';
import { User } from 'src/users/schemas/user.schema';

export type PosttestDocument = HydratedDocument<Posttest>;

@Schema()
export class Posttest {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  })
  author: User | Types.ObjectId;

  @Prop([
    {
      assessment: {
        type: SchemaTypes.ObjectId,
        ref: 'Assessment',
        required: true,
      },
      value: { type: String, required: true },
    },
  ])
  values: { assessment: Assessment | Types.ObjectId; value: string }[];
}

export const PosttestSchema = SchemaFactory.createForClass(Posttest);

PosttestSchema.set('toJSON', {
  flattenObjectIds: true,
  versionKey: false,
});

PosttestSchema.set('toObject', {
  flattenObjectIds: true,
  versionKey: false,
});
