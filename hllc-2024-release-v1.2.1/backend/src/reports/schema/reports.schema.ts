import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { ReportStatus } from '../enums/report-status.enum';
import { ReportCategory } from 'src/report-categories/schemas/report-category.schema';

@Schema()
export class Report {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  reporter: User | Types.ObjectId;

  @Prop({ type: String, required: true })
  message: string;

  @Prop({
    type: String,
    default: ReportStatus.IN_PROCESS,
    enum: Object.values(ReportStatus),
  })
  status: ReportStatus;

  @Prop({ type: Types.ObjectId, ref: 'ReportCategory', default: () => null })
  category: ReportCategory | Types.ObjectId;
}

export type ReportDocument = Report & Document;

export const ReportSchema = SchemaFactory.createForClass(Report);

ReportSchema.set('toJSON', { flattenObjectIds: true, versionKey: false });
ReportSchema.set('toObject', { flattenObjectIds: true, versionKey: false });
