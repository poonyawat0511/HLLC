import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { SettingType } from '../types/setting';

export type SettingDocument = HydratedDocument<Setting>;

export const settingTypes: SettingType[] = [
  'boolean',
  'date',
  'image',
  'number',
  'text',
  'time',
  'timestamp',
  'array',
] as const;

@Schema()
export class Setting {
  @Prop({ type: String, required: true, unique: true })
  key: string;

  @Prop({
    type: String,
    enum: settingTypes,
    required: true,
  })
  type: SettingType;

  @Prop({
    type: SchemaTypes.Mixed,
    default: null,
  })
  value: any;

  @Prop({ type: String })
  description?: string;

  @Prop({ type: String })
  group?: string;
}

export const SettingSchema = SchemaFactory.createForClass(Setting);

SettingSchema.index({ group: 1, key: 1 }, { unique: true });
SettingSchema.set('toJSON', { flattenObjectIds: true, versionKey: false });
SettingSchema.set('toObject', { flattenObjectIds: true, versionKey: false });
