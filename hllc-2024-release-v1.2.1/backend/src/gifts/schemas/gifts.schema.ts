import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { SchemaTypes, Types } from "mongoose";
import { User } from "src/users/schemas/user.schema";

@Schema({ id: true })
export class Gifts {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  })
  sendergift: User | Types.ObjectId | string;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true
  })
  receivergift: User | Types.ObjectId | string;

  @Prop({ type: Boolean, default: true })
  isSended: boolean;

  @Prop({ type: Number, default: 1 })
  point: number;
}
export type GiftDocument = Gifts & Document;
export const GiftSchema = SchemaFactory.createForClass(Gifts);
GiftSchema.index({ receivergift: 1, sendergift: 1 }, { unique: true });
GiftSchema.set('toJSON', { flattenObjectIds: true, versionKey: false });
GiftSchema.set('toObject', { flattenObjectIds: true, versionKey: false });
