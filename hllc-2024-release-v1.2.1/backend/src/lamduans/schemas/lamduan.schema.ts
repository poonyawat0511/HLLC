import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type LamduanDocument = HydratedDocument<Lamduan>;

@Schema()
export class Lamduan {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  })
  user: User | Types.ObjectId;

  @Prop({ type: String,default: "" })
  text: string;

  @Prop({
    required: true,
    type: String,
  })
  lamduanImage: string;
}

export const LamduanSchema = SchemaFactory.createForClass(Lamduan);
LamduanSchema.set('toJSON', { flattenObjectIds: true, versionKey: false });
LamduanSchema.set('toObject', { flattenObjectIds: true, versionKey: false });
