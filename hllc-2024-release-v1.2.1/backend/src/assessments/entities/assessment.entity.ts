import { Types } from 'mongoose';
import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { TransformId } from 'src/app/decorator/transform-id.decorator';
import { Activity } from 'src/activities/schemas/activities.schema';
import { ActivityEntity } from 'src/activities/entities/activity.entity';
import { AssessmentSectionEntity } from 'src/assessment-sections/entities/assessment-section.entity';
import { AssessmentSection } from 'src/assessment-sections/schemas/assessment-section.schema';
export class AssessmentEntity extends MongoEntity {
  question: {
    th: string;
    en: string;
  };

  status: string;

  type: string;

  required: boolean;

  @TransformId((v) => new AssessmentSectionEntity(v))
  section?: Types.ObjectId | AssessmentSection | null;

  @TransformId((v) => new ActivityEntity(v))
  activity?: Types.ObjectId | Activity | null;

  constructor(partial: Partial<AssessmentEntity>) {
    super();
    Object.assign(this, partial);
  }
}
