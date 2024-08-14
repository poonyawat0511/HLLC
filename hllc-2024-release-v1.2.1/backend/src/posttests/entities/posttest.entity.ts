import { Types } from 'mongoose';
import { MongoEntity } from 'src/app/common/lib/mongo.entiy';
import { AssessmentEntity } from 'src/assessments/entities/assessment.entity';
import { Assessment } from 'src/assessments/schemas/assessments.schema';
import { UserEntity } from 'src/users/entities/user.entity';
import { User } from 'src/users/schemas/user.schema';
import { TransformId } from 'src/app/decorator/transform-id.decorator';

export class PosttestEntity extends MongoEntity {
  @TransformId((value) => new PosttestEntity(value))
  values: {
    assessment?: Types.ObjectId | Assessment | null;
    value: string;
  }[];

  @TransformId((value) => new AssessmentEntity(value))
  assessment?: Types.ObjectId | Assessment | null;

  @TransformId((value) => new UserEntity(value))
  author?: Types.ObjectId | User | null;

  constructor(partial: Partial<PosttestEntity>) {
    super();
    Object.assign(this, partial);
  }
}
