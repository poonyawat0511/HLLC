import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes } from 'mongoose';
import { AdminRoles } from 'src/auth/enums/roles.enum';
import { Major } from 'src/majors/schemas/major.schema';

export type AdminDocument = HydratedDocument<Admin>;

@Schema()
export class Admin {
  @Prop(
    raw({
      first: { type: String, required: true, uppercase: true },
      last: { type: String, required: true, uppercase: true },
    }),
  )
  name: { first: string; last: string };

  @Prop({ type: SchemaTypes.ObjectId, ref: 'Major' })
  major: Major | string;

  @Prop({ type: String, required: true, unique: true })
  username: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(AdminRoles),
  })
  role: AdminRoles;
}

export const AdminSchema = SchemaFactory.createForClass(Admin);

AdminSchema.set('toJSON', { flattenObjectIds: true, versionKey: false });
AdminSchema.set('toObject', { flattenObjectIds: true, versionKey: false });
