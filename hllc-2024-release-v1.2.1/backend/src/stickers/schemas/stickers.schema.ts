import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StickerDocument = HydratedDocument<Sticker>;

@Schema()
export class Sticker {
  @Prop(
    raw({
      th: { type: String, required: true, unique: true },
      en: { type: String, required: true, unique: true },
    }),
  )
  name: { th: string; en: string };

  @Prop({ type: String, required: true })
  sticker: string;
}
export const StickerSchema = SchemaFactory.createForClass(Sticker);
StickerSchema.set('toJSON', {
  flattenObjectIds: true,
  versionKey: false,
});
StickerSchema.set('toObject', {
  flattenObjectIds: true,
  versionKey: false,
});
