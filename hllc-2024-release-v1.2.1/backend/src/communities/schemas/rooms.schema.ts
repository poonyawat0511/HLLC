import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type RoomDocument = HydratedDocument<Room>;

@Schema()
export class Room {
  @Prop(
    raw({
      th: { type: String, required: true, unique: true },
      en: { type: String, required: true, unique: true },
    }),
  )
  name: { th: string; en: string };

  @Prop({ type: String, required: true })
  people: string;

  @Prop({ type: String, required: true })
  roomImage: string;

  @Prop({ type: Boolean, default: false })
  saveHistory: boolean;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
RoomSchema.set('toJSON', {
  flattenObjectIds: true,
  versionKey: false,
});
RoomSchema.set('toObject', {
  flattenObjectIds: true,
  versionKey: false,
});
