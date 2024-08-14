import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Activity } from 'src/activities/schemas/activities.schema';
import { AdminRoles } from 'src/auth/enums/roles.enum';
import { Major } from 'src/majors/schemas/major.schema';

export type ActivitySettingDocument = HydratedDocument<ActivitySetting>;

@Schema({ collection: 'activity-settings', id: true })
export class ActivitySetting {
  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: 'Activity' })
  activity: Types.ObjectId | Activity | string;

  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: 'Major' })
  major: Types.ObjectId | Major | string;

  @Prop(
    raw({
      th: { type: String, required: true },
      en: { type: String, required: true },
    }),
  )
  location: { th: string; en: string };

  @Prop(
    raw({
      start: { type: Date, required: true },
      end: { type: Date, required: true },
    }),
  )
  dateTime: { start: Date; end: Date };

  @Prop({ type: [String], enum: Object.values(AdminRoles), required: true })
  scopes: AdminRoles[];

  _id: Types.ObjectId | string;
}

export const ActivitySettingSchema =
  SchemaFactory.createForClass(ActivitySetting);

ActivitySettingSchema.index({ activity: 1, major: 1 }, { unique: true });
ActivitySettingSchema.set('toJSON', {
  flattenObjectIds: true,
  versionKey: false,
});
ActivitySettingSchema.set('toObject', {
  flattenObjectIds: true,
  versionKey: false,
});

ActivitySettingSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate() as any;
  if (update.dateTime) {
    if (update.dateTime.start) {
      update.dateTime.start = new Date(update.dateTime.start);
    }
    if (update.dateTime.end) {
      update.dateTime.end = new Date(update.dateTime.end);
    }
  }
  next();
});