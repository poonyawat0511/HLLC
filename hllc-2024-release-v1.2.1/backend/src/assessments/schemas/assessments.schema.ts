import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Activity } from 'src/activities/schemas/activities.schema';
import { AssessmentSection } from 'src/assessment-sections/schemas/assessment-section.schema';
import {
  AssessmentStatus,
  AssessmentType,
} from '../enums/assessment-status.enum';
export type AssessmentDocument = HydratedDocument<Assessment>;

@Schema()
export class Assessment {
  @Prop(
    raw({
      th: { type: String, required: true },
      en: { type: String, required: true },
    }),
  )
  question: { th: string; en: string };

  @Prop({ type: String, enum: AssessmentStatus, required: true })
  status: AssessmentStatus;

  @Prop({ type: String, enum: ['RATINGS', 'TEXT'], required: true })
  type: AssessmentType;

  @Prop({ type: Boolean, required: true })
  required: boolean;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: AssessmentSection.name,
    default: null,
  })
  section: AssessmentSection | Types.ObjectId | null;

  @Prop({ type: SchemaTypes.ObjectId, ref: 'activity', default: null })
  activity: Activity | Types.ObjectId | null;
}

export const AssessmentSchema = SchemaFactory.createForClass(Assessment);
AssessmentSchema.set('toJSON', { flattenObjectIds: true, versionKey: false });
AssessmentSchema.set('toObject', { flattenObjectIds: true, versionKey: false });
