import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type NotificationDocument = HydratedDocument<NotificationRead>;

@Schema({ collection: 'notification-reads' })
export class NotificationRead {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: [SchemaTypes.ObjectId], ref: 'Notification', required: true })
  notifications: Types.ObjectId[];
}

export const ReadNotificationSchema =
  SchemaFactory.createForClass(NotificationRead);

ReadNotificationSchema.set('toJSON', {
  flattenObjectIds: true,
  versionKey: false,
});
ReadNotificationSchema.set('toObject', {
  flattenObjectIds: true,
  versionKey: false,
});
