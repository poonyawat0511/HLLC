import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { Admin } from 'src/admins/schemas/admin.schema';
import { Activity } from 'src/activities/schemas/activities.schema';

@Schema({ id: true })
export class CheckIn {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  user: User | Types.ObjectId | string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Admin', required: true })
  staff: Admin | Types.ObjectId | string;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Activity', required: true })
  activity: Activity | Types.ObjectId | string;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;
}

export type CheckInDocument = CheckIn & Document;

export const CheckInSchema = SchemaFactory.createForClass(CheckIn);

CheckInSchema.index({ user: 1, activity: 1 }, { unique: true });
CheckInSchema.set('toJSON', { flattenObjectIds: true, versionKey: false });
CheckInSchema.set('toObject', { flattenObjectIds: true, versionKey: false });
