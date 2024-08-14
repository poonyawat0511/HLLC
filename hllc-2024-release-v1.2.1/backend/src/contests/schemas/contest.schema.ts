import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ContestDocument = HydratedDocument<Contest>;

@Schema()
export class Contest {
  @Prop({ type: String, required: true, unique: true })
  team: string;

  @Prop(
    raw({
      th: { type: String, required: true },
      en: { type: String, required: true },
    }),
  )
  category: { th: string; en: string };

  @Prop(
    raw({
      th: { type: String, required: true },
      en: { type: String, required: true },
    }),
  )
  title: { th: string; en: string };

  @Prop(
    raw({
      th: { type: String },
      en: { type: String },
    }),
  )
  description: { th: string; en: string; required: true };

  @Prop([
    {
      name: { type: String, required: true },
      studentId: { type: String, required: true },
    },
  ])
  members: { name: string; studentId: string; id: string }[];

  @Prop({
    required: true,
    type: String,
  })
  coverImage: string;

  @Prop({ type: String, required: true })
  url: string;
}

export const ContestSchema = SchemaFactory.createForClass(Contest);
ContestSchema.set('toJSON', { flattenObjectIds: true, versionKey: false });
ContestSchema.set('toObject', { flattenObjectIds: true, versionKey: false });
