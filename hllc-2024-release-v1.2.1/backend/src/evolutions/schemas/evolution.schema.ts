import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Activity } from 'src/activities/schemas/activities.schema';

export type EvolutionDocument = HydratedDocument<Evolution>;

@Schema({ id: true })
export class Evolution {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Item', required: true })
  item?: string | Types.ObjectId | Activity | null;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'User', required: true })
  user?: string | Types.ObjectId | Activity | null;

  @Prop({ type: Boolean, default: false })
  isUsed?: boolean;

  @Prop({ type: Date })
  useAt?: Date | null;

  _id: Types.ObjectId | string;
}

export const EvolutionSchema = SchemaFactory.createForClass(Evolution);

EvolutionSchema.index({ user: 1, item: 1 }, { unique: true });
EvolutionSchema.set('toJSON', { flattenObjectIds: true, versionKey: false });
EvolutionSchema.set('toObject', { flattenObjectIds: true, versionKey: false });
