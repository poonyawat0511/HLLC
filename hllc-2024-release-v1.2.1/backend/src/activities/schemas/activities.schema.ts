import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ActivityType } from '../enums/activity-type.enum';

export type ActivityDocument = HydratedDocument<Activity>;

@Schema({ id: true })
export class Activity {
  @Prop(
    raw({
      th: { type: String, required: true, unique: true },
      en: { type: String, required: true, unique: true },
    }),
  )
  name: { th: string; en: string };

  @Prop(
    raw({
      th: { type: String, required: true, unique: true },
      en: { type: String, required: true, unique: true },
    }),
  )
  shortName: { th: string; en: string };

  @Prop({ type: String, required: true, unique: true, uppercase: true })
  code: string;

  @Prop({ type: Number, enum: [0, 1], required: true })
  type: ActivityType;

  @Prop(
    raw({
      th: { type: String, default: '' },
      en: { type: String, default: '' },
    }),
  )
  description: { th: string; en: string };

  @Prop(
    raw({
      th: { type: String, default: '' },
      en: { type: String, default: '' },
    }),
  )
  shortDesc: { th: string; en: string };

  @Prop({ type: String, default: '' })
  banner: string;

  @Prop({ type: String, default: '' })
  icon: string;

  @Prop({ type: Boolean, default: true })
  open: boolean;

  @Prop({ type: Boolean, default: true })
  progress: boolean;

  @Prop({ type: Boolean, default: true })
  show: boolean;

  _id: Types.ObjectId | string;
}

export const ActivitySchema = SchemaFactory.createForClass(Activity);

ActivitySchema.set('toJSON', { flattenObjectIds: true, versionKey: false });
ActivitySchema.set('toObject', { flattenObjectIds: true, versionKey: false });
