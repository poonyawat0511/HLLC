import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Major } from 'src/majors/schemas/major.schema';
import { UserRound, UserType } from '../interfaces/user.interface';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop(
    raw({
      first: { type: String, required: true, uppercase: true },
      last: { type: String, uppercase: true, default: '' },
    }),
  )
  name: { first: string; last: string };

  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, default: '' })
  password: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Major', required: true })
  major: Major | Types.ObjectId;

  @Prop({ type: String, default: '' })
  secret: string;

  @Prop({
    type: String,
    default: 'NORMAL',
    enum: ['NORMAL', 'OTHER', 'TESTER'],
  })
  type: UserType;

  @Prop({ type: String, default: 'NORMAL', enum: ['NORMAL', 'OTHER'] })
  round: UserRound;

  _id: Types.ObjectId | string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', { flattenObjectIds: true, versionKey: false });
UserSchema.set('toObject', { flattenObjectIds: true, versionKey: false });
