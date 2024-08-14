import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Recipient } from '../interfaces/recipient.interface';

export type NotificationDocument = HydratedDocument<Notification>;

class Language {
  @Prop({ type: String, required: true })
  th: string;

  @Prop({ type: String, required: true })
  en: string;
}

class Redirect {
  @Prop({ type: String, required: true })
  url: string;

  @Prop({ type: Language, required: true })
  btnMessage: Language;
}

@Schema()
export class Notification {
  @Prop({ type: Language, required: true })
  title: Language;

  @Prop({ type: Language, required: true })
  subtitle: Language;

  @Prop({ type: Language, required: true })
  detail: Language;

  @Prop({ type: String, required: true })
  icon: string;

  @Prop({ type: String, default: '' })
  image: string;

  @Prop({ type: SchemaTypes.Mixed, refPath: 'recipients.type', required: true })
  recipients: 'everyone' | Recipient[];

  @Prop({ type: Redirect, required: false })
  redirect: Redirect;

  @Prop({
    type: Date,
    default: Date.now,
  })
  timestamp: Date;

  _id: string | Types.ObjectId;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

NotificationSchema.set('toJSON', { flattenObjectIds: true, versionKey: false });
NotificationSchema.set('toObject', {
  flattenObjectIds: true,
  versionKey: false,
});
