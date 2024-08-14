import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Assessment } from 'src/assessments/schemas/assessments.schema';
import { User } from 'src/users/schemas/user.schema';

export type PretestDocument = HydratedDocument<Pretest>;

@Schema()
export class Pretest {
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

export const PretestSchema = SchemaFactory.createForClass(Pretest);
PretestSchema.set('toJSON', {
  flattenObjectIds: true,
  versionKey: false,
});
PretestSchema.set('toObject', {
  flattenObjectIds: true,
  versionKey: false,
});
