import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Activity } from 'src/activities/schemas/activities.schema';

export type ItemDocument = HydratedDocument<Item>;

@Schema({ id: true })
export class Item {
  @Prop(
    raw({
      th: { type: String, required: true, unique: true },
      en: { type: String, required: true, unique: true },
    }),
  )
  name: { th: string; en: string };

  @Prop(
    raw({
      th: { type: String, default: '' },
      en: { type: String, default: '' },
    }),
  )
  description: { th: string; en: string };

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Activity', required: true })
  activity?: string | Types.ObjectId | Activity | null;

  @Prop({ type: String, required: true, unique: true })
  image: string;

  _id: Types.ObjectId | string;
}

export const ItemSchema = SchemaFactory.createForClass(Item);

ItemSchema.set('toJSON', { flattenObjectIds: true, versionKey: false });
ItemSchema.set('toObject', { flattenObjectIds: true, versionKey: false });
