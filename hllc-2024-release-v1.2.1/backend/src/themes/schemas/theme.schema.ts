import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { School } from 'src/schools/schemas/school.schema';

export type ThemeDocument = HydratedDocument<Theme>;

@Schema()
export class Theme {
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'School',
    required: true,
    unique: true,
  })
  school: School | Types.ObjectId;

  @Prop({ type: Object, default: () => {} })
  colors: Record<string, string>;

  @Prop({ type: Object, default: () => {} })
  assets: Record<string, string>;
}

export const ThemeSchema = SchemaFactory.createForClass(Theme);

ThemeSchema.set('toJSON', { flattenObjectIds: true, versionKey: false });
ThemeSchema.set('toObject', { flattenObjectIds: true, versionKey: false });
